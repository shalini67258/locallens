package com.locallens.backend.model;

// These imports are from Spring/Java libraries
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

// @Entity = this class is a database TABLE
// @Data = Lombok auto generates getters, setters, constructors
@Entity
@Data
@Table(name = "posts")
public class Post {

    // @Id = this is the primary key
    // @GeneratedValue = auto increment (1, 2, 3...)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Each field = one column in database table
    // @Column = defines column properties
    
    // Area where the update is from
    @Column(nullable = false)
    private String area;

    // Category - Emergency, Traffic, Water etc
    @Column(nullable = false)
    private String category;

    // The actual update text
    @Column(nullable = false, length = 500)
    private String content;

    // Emoji for category
    private String emoji;

    // Color for card styling
    private String color;

    // Number of upvotes
    @Column(columnDefinition = "integer default 0")
    private Integer upvotes = 0;

    // When post was created - auto set!
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // @PrePersist = runs automatically before saving to DB
    // Sets createdAt to current time!
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}