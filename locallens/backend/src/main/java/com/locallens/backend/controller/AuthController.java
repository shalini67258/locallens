package com.locallens.backend.controller;

import com.locallens.backend.model.User;
import com.locallens.backend.repository.UserRepository;
import com.locallens.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();

        if (userRepository.existsByEmail(user.getEmail())) {
            response.put("error", "Email already exists!");
            return ResponseEntity.badRequest().body(response);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        response.put("token", token);
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("message", "Registration successful!");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        Map<String, String> response = new HashMap<>();

        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            response.put("error", "Email not found!");
            return ResponseEntity.badRequest().body(response);
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            response.put("error", "Wrong password!");
            return ResponseEntity.badRequest().body(response);
        }

        String token = jwtUtil.generateToken(email);
        response.put("token", token);
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("message", "Login successful!");

        return ResponseEntity.ok(response);
    }
}