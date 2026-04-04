package edu.ut.todocloud.service;

import edu.ut.todocloud.dto.request.SignupRequest;
import edu.ut.todocloud.model.User;

public interface IUserService {
    // Hàm đăng ký người dùng mới
    User registerUser(SignupRequest signUpRequest);

    // Các hàm kiểm tra trùng lặp
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
