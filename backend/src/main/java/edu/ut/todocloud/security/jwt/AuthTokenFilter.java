package edu.ut.todocloud.security.jwt;

import edu.ut.todocloud.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // 1. Lấy chuỗi JWT từ Header của Request
            String jwt = parseJwt(request);

            // 2. Nếu có JWT và nó hợp lệ (đúng chữ ký, chưa hết hạn)
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                // 3. Đọc Username từ trong cái Token đó
                String username = jwtUtils.getUserNameFromJwtToken(jwt);

                // 4. Dùng "Người đưa thư" tìm thông tin User đầy đủ từ DB
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // 5. Tạo một đối tượng Xác thực (Authentication) của Spring Security
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. "Ghi danh" User này vào hệ thống để các Controller biết ai đang gọi API
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Không thể xác thực người dùng: {}", e.getMessage());
        }

        // Cho phép Request đi tiếp đến Controller hoặc Filter tiếp theo
        filterChain.doFilter(request, response);
    }

    // Hàm phụ để tách chữ "Bearer " ra khỏi chuỗi Token
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}