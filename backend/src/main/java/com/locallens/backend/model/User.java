package com.locallens.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

// User table in database
@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Full name
    @Column(nullable = false)
    private String name;

    // Email - must be unique, used for login
    @Column(nullable = false, unique = true)
    private String email;

    // Password - will be encrypted, never stored as plain text!
    @Column(nullable = false)
    private String password;

    // User's city/area
    private String city;

    // Account created time
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}