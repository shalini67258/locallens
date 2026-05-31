package com.locallens.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.locallens.backend.model.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByAreaIgnoreCase(String area);

    List<Post> findByCategoryIgnoreCase(String category);

    List<Post> findAllByOrderByCreatedAtDesc();

    // Count emergency posts
    Long countByCategory(String category);

    // Count unique areas
    @Query("SELECT COUNT(DISTINCT p.area) FROM Post p")
    Long countDistinctAreas();
}