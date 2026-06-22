package com.locallens.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.locallens.backend.model.Post;
import com.locallens.backend.repository.PostRepository;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
private AiService aiService;

    public List<Post> getAllPosts() {
    List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
    for (Post post : posts) {
        int count = getSimilarReportsCount(post);
        post.setSimilarCount(count > 1 ? count - 1 : 0); // exclude itself
    }
    return posts;
}

    public List<Post> getPostsByArea(String area) {
        return postRepository.findByAreaIgnoreCase(area);
    }

    public Post createPost(Post post) {
    post.setEmoji(getEmoji(post.getCategory()));
    post.setColor(getColor(post.getCategory()));
    post.setCredibility(aiService.checkCredibility(post.getContent(), post.getCategory()));
    post.setSeverity(aiService.getSeverity(post.getContent(), post.getCategory()));
    return postRepository.save(post);
}
public int getSimilarReportsCount(Post post) {
    java.time.LocalDateTime oneHourAgo = java.time.LocalDateTime.now().minusHours(24);
    String areaKeyword = post.getArea().split(",")[0].trim();
    System.out.println("=== DEBUG START ===");
    System.out.println("Post ID: " + post.getId());
    System.out.println("Full area: [" + post.getArea() + "]");
    System.out.println("Area keyword: [" + areaKeyword + "]");
    System.out.println("Category: [" + post.getCategory() + "]");
    System.out.println("Searching after: " + oneHourAgo);
    System.out.println("Post createdAt: " + post.getCreatedAt());
    List<Post> similar = postRepository.findSimilarPosts(areaKeyword, post.getCategory(), oneHourAgo);
    System.out.println("Found: " + similar.size() + " posts");
    for (Post p : similar) {
        System.out.println("  -> Match: id=" + p.getId() + " area=[" + p.getArea() + "] category=[" + p.getCategory() + "]");
    }
    System.out.println("=== DEBUG END ===");
    return similar.size();
}
public Post editPost(Long id, Post updatedPost, String email) {
    Post post = postRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Post not found"));

    // Only owner (or anonymous posts) can edit
    if (!post.getPostedBy().equals(email) && !"anonymous".equals(post.getPostedBy())) {
        throw new RuntimeException("Not authorized to edit this post");
    }

    post.setContent(updatedPost.getContent());
    post.setCategory(updatedPost.getCategory());
    post.setArea(updatedPost.getArea());
    post.setEmoji(getEmoji(updatedPost.getCategory()));
    post.setColor(getColor(updatedPost.getCategory()));
    post.setCredibility(aiService.checkCredibility(updatedPost.getContent(), updatedPost.getCategory()));

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
    // Merge posts that are duplicates of each other into grouped entries
public List<Map<String, Object>> mergeSimilarPosts(List<Post> posts) {
    List<Map<String, Object>> result = new java.util.ArrayList<>();
    java.util.Set<Long> processed = new java.util.HashSet<>();

    for (Post post : posts) {
        if (processed.contains(post.getId())) continue;

        String areaKeyword = post.getArea().split(",")[0].trim();
        java.time.LocalDateTime oneDayAgo = java.time.LocalDateTime.now().minusHours(24);
        List<Post> group = postRepository.findSimilarPosts(areaKeyword, post.getCategory(), oneDayAgo);

        // Also filter by similar content (same suggestion text) for tighter grouping
        List<Post> sameGroup = group.stream()
            .filter(p -> p.getContent().equalsIgnoreCase(post.getContent()))
            .sorted((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt())) // oldest first
            .toList();

        if (sameGroup.isEmpty()) sameGroup = List.of(post);

        Post original = sameGroup.get(0); // earliest report

        List<String> reporters = sameGroup.stream().map(Post::getPostedBy).distinct().toList();
        int totalUpvotes = sameGroup.stream().mapToInt(Post::getUpvotes).sum();
        int totalConfirmed = sameGroup.stream().mapToInt(Post::getConfirmedCount).sum();
        int totalDenied = sameGroup.stream().mapToInt(Post::getDeniedCount).sum();

        Map<String, Object> entry = new HashMap<>();
        entry.put("id", original.getId());
        entry.put("area", original.getArea());
        entry.put("category", original.getCategory());
        entry.put("content", original.getContent());
        entry.put("emoji", original.getEmoji());
        entry.put("color", original.getColor());
        entry.put("credibility", original.getCredibility());
        entry.put("severity", original.getSeverity());
        entry.put("imageUrl", original.getImageUrl());
        entry.put("createdAt", original.getCreatedAt());
        entry.put("reportedBy", reporters);
        entry.put("reportCount", sameGroup.size());
        entry.put("upvotes", totalUpvotes);
        entry.put("confirmedCount", totalConfirmed);
        entry.put("deniedCount", totalDenied);
        entry.put("allIds", sameGroup.stream().map(Post::getId).toList());

        result.add(entry);

        for (Post p : sameGroup) processed.add(p.getId());
    }

    return result;
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
    // Calculate trust score based on real activity
public Map<String, Object> getTrustScore(String email) {
    List<Post> userPosts = postRepository.findByPostedBy(email);

    int totalPosts = userPosts.size();
    int totalUpvotes = userPosts.stream()
        .mapToInt(Post::getUpvotes)
        .sum();

    // Formula: posts contribute 5 points each, upvotes contribute 2 points each
    // Capped at 100
    int score = Math.min(100, (totalPosts * 5) + (totalUpvotes * 2));

    // Badge based on score
    String badge;
    if (score >= 80) badge = "🏆 Trusted Reporter";
    else if (score >= 50) badge = "⭐ Active Contributor";
    else if (score >= 20) badge = "🌱 Growing Member";
    else badge = "🆕 New Member";

    Map<String, Object> result = new HashMap<>();
    result.put("score", score);
    result.put("badge", badge);
    result.put("totalPosts", totalPosts);
    result.put("totalUpvotes", totalUpvotes);

    return result;
}
}