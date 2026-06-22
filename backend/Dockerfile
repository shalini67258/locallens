# Stage 1: Build
FROM maven:3.8.5-openjdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jdk
COPY --from=build /target/backend-0.0.1-SNAPSHOT.jar app.jar

# Use sh -c to allow environment variable expansion
ENTRYPOINT ["sh", "-c", "java -jar app.jar --spring.datasource.url=$SPRING_DATASOURCE_URL --spring.datasource.username=$DB_USERNAME --spring.datasource.password=$DB_PASSWORD"]