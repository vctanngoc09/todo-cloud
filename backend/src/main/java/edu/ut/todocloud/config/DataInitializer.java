package edu.ut.todocloud.config;

import edu.ut.todocloud.model.ERole;
import edu.ut.todocloud.model.Role;
import edu.ut.todocloud.repository.IRoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRoles(IRoleRepository roleRepository) {
        return args -> {
            // Kiểm tra và thêm ROLE_USER nếu chưa tồn tại
            if (!roleRepository.findByName(ERole.ROLE_USER).isPresent()) {
                Role userRole = new Role();
                userRole.setName(ERole.ROLE_USER);
                roleRepository.save(userRole);
                System.out.println("Đã khởi tạo: ROLE_USER");
            }

            // Kiểm tra và thêm ROLE_ADMIN nếu chưa tồn tại
            if (!roleRepository.findByName(ERole.ROLE_ADMIN).isPresent()) {
                Role adminRole = new Role();
                adminRole.setName(ERole.ROLE_ADMIN);
                roleRepository.save(adminRole);
                System.out.println("Đã khởi tạo: ROLE_ADMIN");
            }
        };
    }
}