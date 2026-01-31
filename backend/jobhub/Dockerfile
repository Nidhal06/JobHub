# -------- BUILD STAGE --------
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml first (better Docker cache)
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copy source code
COPY src ./src

# Build the Spring Boot fat jar
RUN mvn -B -DskipTests package

# -------- RUNTIME STAGE --------
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Support Render $PORT
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
