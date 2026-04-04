package edu.ut.todocloud.controller;

import edu.ut.todocloud.dto.request.LoginRequest;
import edu.ut.todocloud.dto.request.SignupRequest;
import edu.ut.todocloud.dto.response.JwtResponse;
import edu.ut.todocloud.dto.response.MessageResponse;
import edu.ut.todocloud.dto.response.UserReponse;
import edu.ut.todocloud.mapper.UserMapper;
import edu.ut.todocloud.security.jwt.JwtUtils;
import edu.ut.todocloud.security.services.UserDetailsImpl;
import edu.ut.todocloud.service.IUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager; // Bộ máy xác thực của Spring

    @Autowired
    IUserService userService; // Tầng xử lý logic User

    @Autowired
    JwtUtils jwtUtils; // Máy tạo Token

    @Autowired
    UserMapper userMapper;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Kiểm tra xem username hoặc email đã tồn tại chưa
        if (userService.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: Username đã tồn tại!"));
        }

        if (userService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: Email đã được sử dụng!"));
        }

        // Gọi Service để tạo User mới
        userService.registerUser(signUpRequest);

        return ResponseEntity.ok(new MessageResponse("Đăng ký thành viên thành công!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        // 2. Lấy UserDetailsImpl
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // 3. DÙNG MAPPER THAY CHO VIẾT TAY
        UserReponse userResponse = userMapper.toResponse(userDetails);

        return ResponseEntity.ok(new JwtResponse(jwt, "Bearer", userResponse));
    }
}