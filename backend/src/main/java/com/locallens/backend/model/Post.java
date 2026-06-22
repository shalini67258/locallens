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

    @Column(name = "posted_by")
    private String postedBy;

    @Column(name = "credibility")
    private String credibility = "Unverified";

    @Column(name = "confirmed_count")
    private int confirmedCount = 0;

    @Column(name = "denied_count")
    private int deniedCount = 0;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(columnDefinition = "integer default 0")
    private Integer upvotes = 0;

    
      @Column(name = "severity")
private String severity = "Medium";


   @Column(name = "created_at")
private LocalDateTime createdAt;

@jakarta.persistence.Transient
private int similarCount = 0;

@PrePersist
public void prePersist() {
    this.createdAt = LocalDateTime.now();
}
      
    }
