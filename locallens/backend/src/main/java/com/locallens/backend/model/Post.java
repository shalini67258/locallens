package com.locallens.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String area;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, length = 500)
    private String content;

    private String emoji;
    private String color;

    // WHO POSTED THIS - stores email of poster
    @Column(name = "posted_by")
    private String postedBy;

    @Column(columnDefinition = "integer default 0")
    private Integer upvotes = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}