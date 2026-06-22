package com.locallens.backend.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.locallens.backend.model.Post;
import com.locallens.backend.model.PostVerification;
import com.locallens.backend.repository.PostRepository;
import com.locallens.backend.repository.PostVerificationRepository;
import com.locallens.backend.security.JwtUtil;
import com.locallens.backend.service.AiService;
import com.locallens.backend.service.PostService;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PostVerificationRepository verificationRepository;

    @Autowired
    private AiService aiService;

    @Autowired
    private PostRepository postRepository;

    // GET ALL POSTS
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // GET MERGED POSTS - groups duplicate reports together
    @GetMapping("/merged")
    public ResponseEntity<List<Map<String, Object>>> getMergedPosts() {
        List<Post> allPosts = postService.getAllPosts();
        List<Map<String, Object>> merged = postService.mergeSimilarPosts(allPosts);
        return ResponseEntity.ok(merged);
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

    // GET AI SUMMARY
    @GetMapping("/summary")
    public ResponseEntity<Map<String, String>> getAiSummary(
        @RequestParam(required = false) String area
    ) {
        List<Post> posts;
        if (area == null || area.equalsIgnoreCase("all")) {
            posts = postService.getAllPosts();
        } else {
            posts = postService.getPostsByArea(area);
        }
        String summary = aiService.generateAreaSummary(posts, area);
        Map<String, String> response = new HashMap<>();
        response.put("summary", summary);
        response.put("area", area == null ? "All Areas" : area);
        return ResponseEntity.ok(response);
    }

    // GET TRUST SCORE
    @GetMapping("/trust-score")
    public ResponseEntity<Map<String, Object>> getTrustScore(
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Map<String, Object> response = new HashMap<>();
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.put("error", "Please login to see your trust score");
            return ResponseEntity.ok(response);
        }
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            Map<String, Object> data = postService.getTrustScore(email);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            response.put("error", "Invalid session, please login again");
            return ResponseEntity.ok(response);
        }
    }

    // GET NOTIFICATIONS
    @GetMapping("/notifications")
    public ResponseEntity<Map<String, Object>> getNotifications(
        @RequestParam String city,
        @RequestParam(required = false) String since
    ) {
        List<Post> areaPosts = postService.getPostsByArea(city);
        long emergencyCount = areaPosts.stream()
            .filter(p -> "Emergency".equals(p.getCategory()) || "Flood".equals(p.getCategory()))
            .count();
        Map<String, Object> response = new HashMap<>();
        response.put("count", emergencyCount);
        response.put("city", city);
        return ResponseEntity.ok(response);
    }

    // CREATE POST
    @PostMapping
    public ResponseEntity<Post> createPost(
        @RequestBody Post post,
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                String email = jwtUtil.extractEmail(token);
                post.setPostedBy(email);
            } catch (Exception e) {
                post.setPostedBy("anonymous");
            }
        } else {
            post.setPostedBy("anonymous");
        }
        return ResponseEntity.ok(postService.createPost(post));
    }

    // UPVOTE POST - one time per user
    @PutMapping("/{id}/upvote")
    public ResponseEntity<?> upvotePost(
        @PathVariable Long id,
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = getEmailOrAnonymous(authHeader);
        Map<String, String> error = new HashMap<>();

        if (verificationRepository.findByPostIdAndUserEmailAndAction(id, email, "upvote").isPresent()) {
            error.put("error", "You already upvoted this report");
            return ResponseEntity.status(400).body(error);
        }

        Post post = postService.upvotePost(id);

        PostVerification v = new PostVerification();
        v.setPostId(id);
        v.setUserEmail(email);
        v.setAction("upvote");
        verificationRepository.save(v);

        return ResponseEntity.ok(post);
    }

    // CONFIRM POST - one time per user
    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirmPost(
        @PathVariable Long id,
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = getEmailOrAnonymous(authHeader);
        Map<String, String> error = new HashMap<>();

        if (verificationRepository.findByPostIdAndUserEmailAndAction(id, email, "confirm").isPresent()) {
            error.put("error", "You already voted on this report");
            return ResponseEntity.status(400).body(error);
        }

        Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setConfirmedCount(post.getConfirmedCount() + 1);
        postRepository.save(post);

        PostVerification v = new PostVerification();
        v.setPostId(id);
        v.setUserEmail(email);
        v.setAction("confirm");
        verificationRepository.save(v);

        return ResponseEntity.ok(post);
    }

    // DENY POST - one time per user
    @PutMapping("/{id}/deny")
    public ResponseEntity<?> denyPost(
        @PathVariable Long id,
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = getEmailOrAnonymous(authHeader);
        Map<String, String> error = new HashMap<>();

        if (verificationRepository.findByPostIdAndUserEmailAndAction(id, email, "deny").isPresent()) {
            error.put("error", "You already voted on this report");
            return ResponseEntity.status(400).body(error);
        }

        Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setDeniedCount(post.getDeniedCount() + 1);
        postRepository.save(post);

        PostVerification v = new PostVerification();
        v.setPostId(id);
        v.setUserEmail(email);
        v.setAction("deny");
        verificationRepository.save(v);

        return ResponseEntity.ok(post);
    }

    // Helper - get logged in email, or a unique anonymous id
    private String getEmailOrAnonymous(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                return jwtUtil.extractEmail(authHeader.substring(7));
            } catch (Exception e) {
                return "anonymous_" + System.currentTimeMillis();
            }
        }
        return "anonymous_" + System.currentTimeMillis();
    }

    // EDIT POST
    @PutMapping("/{id}")
    public ResponseEntity<?> editPost(
        @PathVariable Long id,
        @RequestBody Post updatedPost,
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Map<String, String> error = new HashMap<>();
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            error.put("error", "Login required");
            return ResponseEntity.status(403).body(error);
        }
        try {
            String email = jwtUtil.extractEmail(authHeader.substring(7));
            Post edited = postService.editPost(id, updatedPost, email);
            return ResponseEntity.ok(edited);
        } catch (Exception e) {
            error.put("error", "Could not edit: " + e.getMessage());
            return ResponseEntity.status(403).body(error);
        }
    }

    // DELETE POST
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    // UPLOAD IMAGE
    @PostMapping("/{id}/image")
    public ResponseEntity<Map<String, String>> uploadImage(
        @PathVariable Long id,
        @RequestParam("file") MultipartFile file
    ) {
        Map<String, String> response = new HashMap<>();
        try {
            String uploadDir = "uploads/";
            Files.createDirectories(Paths.get(uploadDir));
            String fileName = id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.write(filePath, file.getBytes());

            Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
            post.setImageUrl("/uploads/" + fileName);
            postRepository.save(post);

            response.put("imageUrl", "/uploads/" + fileName);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Upload failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}