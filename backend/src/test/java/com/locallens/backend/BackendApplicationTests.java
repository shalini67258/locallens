package com.locallens.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "GROQ_API_KEY=test_key_placeholder",
    "EMAIL_PASSWORD=test_password_placeholder"
})
class BackendApplicationTests {

    @Test
    void contextLoads() {
        // This test simply verifies that the Spring context starts up correctly.
        // The @TestPropertySource above provides the required placeholders 
        // to prevent the application from crashing during the build.
    }

}