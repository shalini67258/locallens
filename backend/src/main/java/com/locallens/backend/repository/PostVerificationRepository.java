package com.locallens.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.locallens.backend.model.PostVerification;

@Repository
public interface PostVerificationRepository extends JpaRepository<PostVerification, Long> {
    Optional<PostVerification> findByPostIdAndUserEmail(Long postId, String userEmail);
    Optional<PostVerification> findByPostIdAndUserEmailAndAction(Long postId, String userEmail, String action);
}