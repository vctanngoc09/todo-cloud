package edu.ut.todocloud.security.jwt;

import edu.ut.todocloud.security.services.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    // Lấy chuỗi bí mật từ file application.properties
    @Value("${app.jwtSecret}")
    private String jwtSecret;

    // Lấy thời gian hết hạn (ví dụ 24h) từ application.properties
    @Value("${app.jwtExpirationMs}")
    private int jwtExpirationMs;

    // 1. Hàm TẠO Token (Sau khi đăng nhập thành công)
    public String generateJwtToken(Authentication authentication) {
        // Lấy thông tin User hiện tại (chính là cái thẻ UserDetailsImpl mình đã build)
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername())) // Lưu username vào Token
                .setIssuedAt(new Date()) // Thời điểm tạo
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs)) // Thời điểm hết hạn
                .signWith(key(), SignatureAlgorithm.HS256) // Ký tên bằng thuật toán HS256 và chuỗi bí mật
                .compact(); // Nén lại thành chuỗi String dài loằng ngoằng
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    // 2. Hàm ĐỌC Username từ Token (Để biết Token này của ai)
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    // 3. Hàm KIỂM TRA Token (Xem có bị giả mạo hay hết hạn không)
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Token không hợp lệ: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("Token đã hết hạn: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("Token không được hỗ trợ: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("Chuỗi Claims bị trống: {}", e.getMessage());
        }
        return false;
    }
}