package com.locallens.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.locallens.backend.model.Post;
import com.locallens.backend.repository.PostRepository;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getPostsByArea(String area) {
        return postRepository.findByAreaIgnoreCase(area);
    }

    public Post createPost(Post post) {
        post.setEmoji(getEmoji(post.getCategory()));
        post.setColor(getColor(post.getCategory()));
        return postRepository.save(post);
    }

    public Post upvotePost(Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setUpvotes(post.getUpvotes() + 1);
        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    // REAL STATS from database
    public Long getTotalPosts() {
        return postRepository.count();
    }

    public Long getEmergencyCount() {
        return postRepository.countByCategory("Emergency");
    }

    public Long getUniqueAreasCount() {
        return postRepository.countDistinctAreas();
    }

    private String getEmoji(String category) {
        return switch (category) {
            case "Emergency" -> "🚨";
            case "Traffic" -> "🚧";
            case "Water" -> "💧";
            case "Event" -> "🎉";
            case "Power Cut" -> "⚡";
            case "Road Issue" -> "🏗️";
            case "Flood" -> "🌊";
            default -> "ℹ️";
        };
    }

    private String getColor(String category) {
        return switch (category) {
            case "Emergency", "Flood" -> "red";
            case "Traffic", "Road Issue" -> "yellow";
            case "Event" -> "green";
            default -> "blue";
        };
    }
}