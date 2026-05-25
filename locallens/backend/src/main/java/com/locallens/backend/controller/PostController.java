package com.locallens.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.locallens.backend.model.Post;
import com.locallens.backend.service.PostService;

// @RestController = this class handles HTTP requests
// @RequestMapping = all APIs start with /api/posts
// @CrossOrigin = allows React (port 3000) to call this API
@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private PostService postService;

    // GET ALL POSTS
    // URL: GET http://localhost:8080/api/posts
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // GET POSTS BY AREA
    // URL: GET http://localhost:8080/api/posts/area/Kukatpally
    @GetMapping("/area/{area}")
    public ResponseEntity<List<Post>> getPostsByArea(@PathVariable String area) {
        return ResponseEntity.ok(postService.getPostsByArea(area));
    }

    // CREATE NEW POST
    // URL: POST http://localhost:8080/api/posts
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        return ResponseEntity.ok(postService.createPost(post));
    }

    // UPVOTE POST
    // URL: PUT http://localhost:8080/api/posts/1/upvote
    @PutMapping("/{id}/upvote")
    public ResponseEntity<Post> upvotePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.upvotePost(id));
    }

    // DELETE POST
    // URL: DELETE http://localhost:8080/api/posts/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }
}
