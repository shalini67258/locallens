package com.locallens.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.locallens.backend.model.Post;
import com.locallens.backend.repository.PostRepository;

// @Service = this class contains business logic
// It sits between Controller and Repository
@Service
public class PostService {

    // @Autowired = Spring automatically creates and injects this
    // We don't need to write "new PostRepository()"
    @Autowired
    private PostRepository postRepository;

    // GET ALL POSTS - newest first
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    // GET POSTS BY AREA
    public List<Post> getPostsByArea(String area) {
        return postRepository.findByAreaIgnoreCase(area);
    }

    // CREATE NEW POST
    public Post createPost(Post post) {
        // Auto assign emoji based on category
        post.setEmoji(getEmoji(post.getCategory()));
        // Auto assign color based on category
        post.setColor(getColor(post.getCategory()));
        // Save to database!
        return postRepository.save(post);
    }

    // UPVOTE POST
    public Post upvotePost(Long id) {
        // Find post by id
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        // Increase upvotes by 1
        post.setUpvotes(post.getUpvotes() + 1);
        // Save updated post
        return postRepository.save(post);
    }

    // DELETE POST
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    // Helper - get emoji for category
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

    // Helper - get color for category
    private String getColor(String category) {
        return switch (category) {
            case "Emergency", "Flood" -> "red";
            case "Traffic", "Road Issue" -> "yellow";
            case "Event" -> "green";
            default -> "blue";
        };
    }
}
