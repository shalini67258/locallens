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
    // Get all posts by a specific user
List<Post> findByPostedBy(String postedBy);
@org.springframework.data.jpa.repository.Query(
    "SELECT p FROM Post p WHERE LOWER(p.area) LIKE LOWER(CONCAT('%', :areaKeyword, '%')) " +
    "AND p.category = :category AND p.createdAt > :after"
)
List<Post> findSimilarPosts(
    @org.springframework.data.repository.query.Param("areaKeyword") String areaKeyword,
    @org.springframework.data.repository.query.Param("category") String category,
    @org.springframework.data.repository.query.Param("after") java.time.LocalDateTime after
);

    // Count unique areas
    @Query("SELECT COUNT(DISTINCT p.area) FROM Post p")
    Long countDistinctAreas();
}