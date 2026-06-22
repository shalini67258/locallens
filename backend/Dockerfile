# Stage 1: Build the app
FROM maven:3.8.5-openjdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Run the app
FROM eclipse-temurin:17-jdk
# This copies the finished file to the root
COPY --from=build /target/backend-0.0.1-SNAPSHOT.jar app.jar
# This just starts the app. It's the cleanest way to do it.
ENTRYPOINT ["java", "-jar", "app.jar"]