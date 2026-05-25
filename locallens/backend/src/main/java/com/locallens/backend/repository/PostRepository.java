package com.locallens.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.locallens.backend.model.Post;

// @Repository = this is a database access class
// JpaRepository gives us free CRUD methods!
// JpaRepository<Post, Long> = works with Post table, id is Long type
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Custom query - find posts by area
    // Spring automatically writes SQL for this!
    // SQL = SELECT * FROM posts WHERE area = ?
    List<Post> findByAreaIgnoreCase(String area);

    // Find posts by category
    // SQL = SELECT * FROM posts WHERE category = ?
    List<Post> findByCategoryIgnoreCase(String category);

    // Find all posts ordered by newest first
    // SQL = SELECT * FROM posts ORDER BY created_at DESC
    List<Post> findAllByOrderByCreatedAtDesc();
}