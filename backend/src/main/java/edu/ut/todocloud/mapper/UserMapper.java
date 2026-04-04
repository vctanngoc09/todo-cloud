package edu.ut.todocloud.mapper;

import edu.ut.todocloud.dto.request.SignupRequest;
import edu.ut.todocloud.dto.response.UserReponse;
import edu.ut.todocloud.model.User;
import edu.ut.todocloud.security.services.UserDetailsImpl;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    // 1. Chuyển từ DTO (Request) sang Entity (để lưu vào DB)
    public User toEntity(SignupRequest request) {
        if (request == null) return null;

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        // Lưu ý: Password sẽ được mã hóa ở Service trước khi set vào đây
        // hoặc gọi encoder ngay tại đây nếu bạn inject PasswordEncoder vào Mapper.
        return user;
    }

    // 2. Chuyển từ Entity (DB) sang DTO (Response) để trả về cho Frontend
    public UserReponse toResponse(UserDetailsImpl userDetails) {
        if (userDetails == null) return null;

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return new UserReponse(
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles
        );
    }
}