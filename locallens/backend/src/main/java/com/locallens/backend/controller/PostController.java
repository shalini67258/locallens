package com.locallens.backend.controller;

import com.locallens.backend.model.Post;
import com.locallens.backend.security.JwtUtil;
import com.locallens.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private JwtUtil jwtUtil;

    // GET ALL POSTS
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // GET POSTS BY AREA
    @GetMapping("/area/{area}")
    public ResponseEntity<List<Post>> getPostsByArea(@PathVariable String area) {
        return ResponseEntity.ok(postService.getPostsByArea(area));
    }

    // GET REAL STATS
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalPosts", postService.getTotalPosts());
        stats.put("emergencies", postService.getEmergencyCount());
        stats.put("areasActive", postService.getUniqueAreasCount());
        return ResponseEntity.ok(stats);
    }

    // CREATE POST - saves who posted it!
    @PostMapping
    public ResponseEntity<Post> createPost(
        @RequestBody Post post,
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        // If user is logged in, save their email
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            post.setPostedBy(email);
        }
        return ResponseEntity.ok(postService.createPost(post));
    }

    // UPVOTE POST
    @PutMapping("/{id}/upvote")
    public ResponseEntity<Post> upvotePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.upvotePost(id));
    }

    // DELETE POST
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }
}