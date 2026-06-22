package com.locallens.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.locallens.backend.model.Post;

@Service
public class AiService {

   
    // Read API key from application.properties
    @Value("${groq.api.key}")
    private String groqApiKey;

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

    // GENERATE AI SUMMARY for a specific area
    public String generateAreaSummary(List<Post> posts, String area) {

        // If no posts, return default message
        if (posts.isEmpty()) {
            return "No updates yet for " + (area == null ? "your area" : area) +
                   ". Be the first to post and help your community stay informed!";
        }

        // Build text from real posts
        StringBuilder postsText = new StringBuilder();
        for (Post post : posts) {
            postsText.append("- [").append(post.getCategory()).append("] ")
                     .append(post.getArea()).append(": ")
                     .append(post.getContent()).append("\n");
        }

        // Build prompt for AI
        String prompt = "You are a local news summarizer for an Indian community app called LocalLens. " +
                "Based on these real community posts, write a SHORT 2-3 sentence summary " +
                "highlighting the most important updates. Be concise and helpful. " +
                "Posts:\n" + postsText.toString();

        return callGroqAPI(prompt);
    }
    // Calculate severity score for a post
public String getSeverity(String content, String category) {
    String prompt = "You are assessing urgency for a community alert app. " +
            "Category: " + category + ". Post: \"" + content + "\". " +
            "Rate the real-world urgency/severity as EXACTLY ONE WORD: High, Medium, or Low. " +
            "Emergencies, floods, fires, accidents = High. " +
            "Minor inconveniences, events = Low. " +
            "Respond with ONLY the word.";

    try {
        String result = callGroqAPI(prompt).trim().toLowerCase();
        if (result.contains("high")) return "High";
        if (result.contains("low")) return "Low";
        return "Medium";
    } catch (Exception e) {
        return "Medium";
    }
}
    // Analyze comment sentiment relative to post
public String analyzeComment(String postContent, String commentText) {
    String prompt = "A community post said: \"" + postContent + "\". " +
            "Someone commented: \"" + commentText + "\". " +
            "Does this comment SUPPORT (confirm it's true), DISPUTE (say it's false/fake), " +
            "or is NEUTRAL about the post? Respond with EXACTLY ONE WORD: Supports, Disputes, or Neutral.";

    try {
        String result = callGroqAPI(prompt).trim().toLowerCase();
        if (result.contains("dispute")) return "Disputes";
        if (result.contains("support")) return "Supports";
        return "Neutral";
    } catch (Exception e) {
        return "Neutral";
    }
}
    // Check if a post seems credible using AI
public String checkCredibility(String content, String category) {
    String prompt = "You are a fake news detector for a community alert app. " +
            "Analyze this post and respond with EXACTLY ONE WORD from: " +
            "'Likely Real', 'Less Likely', or 'Suspicious'. " +
            "Category: " + category + ". Post: \"" + content + "\". " +
            "Consider if it sounds like a genuine local report or spam/fake/exaggerated. " +
            "Respond with ONLY the label, nothing else.";

    try {
        String result = callGroqAPI(prompt).trim();
        if (result.toLowerCase().contains("suspicious")) return "Suspicious";
        if (result.toLowerCase().contains("less likely")) return "Less Likely";
        return "Likely Real";
    } catch (Exception e) {
        return "Unverified";
    }
}

    // Call Groq API
    private String callGroqAPI(String prompt) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + groqApiKey);

            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama-3.3-70b-versatile");

            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);

            requestBody.put("messages", List.of(message));
            requestBody.put("max_tokens", 200);
            requestBody.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_URL, request, Map.class);

            // Extract AI response text
            Map responseBody = response.getBody();
            List<Map> choices = (List<Map>) responseBody.get("choices");
            Map firstChoice = choices.get(0);
            Map messageObj = (Map) firstChoice.get("message");
            return (String) messageObj.get("content");

        } catch (Exception e) {
            return "AI summary temporarily unavailable. Check back soon!";
        }
    }
}