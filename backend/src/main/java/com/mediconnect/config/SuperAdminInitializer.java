package com.mediconnect.config;

import com.mediconnect.model.Role;
import com.mediconnect.model.User;
import com.mediconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class SuperAdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.superadmin.email:admin}")
    private String superAdminEmail;

    @Value("${app.superadmin.password:pass123}")
    private String superAdminPassword;

    public SuperAdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // If a user with the configured email exists, update to SUPER_ADMIN and reset password.
        var existing = userRepository.findByEmail(superAdminEmail).orElse(null);
        if (existing != null) {
            // use ADMIN to remain compatible with existing DB CHECK constraint
            existing.setRole(Role.ADMIN);
            existing.setPassword(passwordEncoder.encode(superAdminPassword));
            existing.setEmailVerified(true);
            existing.setOnboardingComplete(true);
            existing.setEnabled(true);
            userRepository.save(existing);
            System.out.println("[SuperAdminInitializer] Updated super admin credentials for: " + superAdminEmail);
            return;
        }

        User sa = User.builder()
            .name("Super Admin")
            .email(superAdminEmail)
            .password(passwordEncoder.encode(superAdminPassword))
            // create as ADMIN for DB compatibility; you can migrate DB checks later
            .role(Role.ADMIN)
            .emailVerified(true)
            .onboardingComplete(true)
            .enabled(true)
            .build();

        userRepository.save(sa);
        System.out.println("[SuperAdminInitializer] Created super admin: " + superAdminEmail);
    }
}
