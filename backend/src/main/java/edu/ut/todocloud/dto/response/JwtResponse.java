package edu.ut.todocloud.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor // Tạo Constructor chứa tất cả các tham số (Sửa lỗi bạn gặp)
@NoArgsConstructor  // Tạo Constructor trống
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private UserReponse user;

    // Constructor tùy chỉnh (vì mình không muốn truyền chữ "Bearer" mỗi lần khởi tạo)
    public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles) {
        this.token = accessToken;
        this.type = "Bearer";
        // Tự động tạo gói UserReponse từ các tham số truyền vào
        this.user = new UserReponse(id, username, email, roles);
    }
}