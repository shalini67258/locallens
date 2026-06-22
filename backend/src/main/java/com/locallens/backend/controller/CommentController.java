package com.locallens.backend.controller;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.locallens.backend.model.Comment;
import com.locallens.backend.model.Post;
import com.locallens.backend.repository.CommentRepository;
import com.locallens.backend.repository.PostRepository;
import com.locallens.backend.security.JwtUtil;
import com.locallens.backend.service.AiService;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = {"http://localhost:3000", "https://locallens-nccs.onrender.com"})
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AiService aiService;

    // GET all comments for a post + credibility stats
    @GetMapping("/post/{postId}")
    public ResponseEntity<Map<String, Object>> getComments(@PathVariable Long postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);

        Long supports = commentRepository.countByPostIdAndAiVerdict(postId, "Supports");
        Long disputes = commentRepository.countByPostIdAndAiVerdict(postId, "Disputes");

        // Calculate likelihood based on comment ratio
        String likelihood;
        long total = supports + disputes;
        if (total == 0) {
            likelihood = "Unverified";
        } else {
            double ratio = (double) supports / total;
            if (ratio >= 0.7) likelihood = "More Likely Happened";
            else if (ratio <= 0.3) likelihood = "Less Likely Happened";
            else likelihood = "Unclear / Mixed Reports";
        }

        Map<String, Object> response = new HashMap<>();
        response.put("comments", comments);
        response.put("supports", supports);
        response.put("disputes", disputes);
        response.put("likelihood", likelihood);

        return ResponseEntity.ok(response);
    }

    // POST a new comment - AI analyzes it automatically!
    @PostMapping("/post/{postId}")
    public ResponseEntity<Comment> addComment(
        @PathVariable Long postId,
        @RequestBody Map<String, String> body,
        @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setText(body.get("text"));

        // Get who commented
        String email = "anonymous";
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                email = jwtUtil.extractEmail(authHeader.substring(7));
            } catch (Exception e) {
                email = "anonymous";
            }
        }
        comment.setCommentedBy(email);

        // AI analyzes if comment supports or disputes the post
        comment.setAiVerdict(aiService.analyzeComment(post.getContent(), comment.getText()));

        return ResponseEntity.ok(commentRepository.save(comment));
    }

    // DELETE comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}