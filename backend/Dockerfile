# Multi-stage Dockerfile for the JobHub backend (Spring Boot / Maven)
# Builds the app in a Maven build stage and copies the fat jar into a lightweight JRE image

# --- Build stage ---
FROM maven:3.9.6-eclipse-temurin-17 as build
WORKDIR /workspace

# Copy only the backend project (jobhub) sources
COPY jobhub/ ./jobhub/

# Build without tests for faster image builds (adjust if you want tests to run)
WORKDIR /workspace/jobhub
RUN mvn -B -DskipTests package 

# --- Runtime stage ---
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the jar produced by the build stage
COPY --from=build /workspace/jobhub/target/*.jar /app/app.jar

EXPOSE 8080

# Allow overriding JVM options and support Render's $PORT env var
ENV JAVA_OPTS ""

# Use the PORT env if provided by Render; default to 8080 otherwise
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
