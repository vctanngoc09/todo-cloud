package edu.ut.todocloud.service.impl;

import edu.ut.todocloud.dto.request.SignupRequest;
import edu.ut.todocloud.mapper.UserMapper;
import edu.ut.todocloud.model.ERole;
import edu.ut.todocloud.model.Role;
import edu.ut.todocloud.model.User;
import edu.ut.todocloud.repository.IRoleRepository;
import edu.ut.todocloud.repository.IUserRepository;
import edu.ut.todocloud.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IRoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private UserMapper userMapper;


    @Override
    public User registerUser(SignupRequest signUpRequest) {
        // Dùng Mapper để biến Request thành Entity "xác thô"
        User user = userMapper.toEntity(signUpRequest);

        // 2. MÃ HÓA MẬT KHẨU (Bước cực kỳ quan trọng)
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        // 3. Gán quyền mặc định là USER cho người mới đăng ký
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy quyền USER trong DB."));
        roles.add(userRole);

        user.setRoles(roles);

        return userRepository.save(user);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
