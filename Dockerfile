# ---------------- FRONTEND (VITE) ----------------
FROM node:20 AS frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .

ENV CI=false
RUN npm run build


# ---------------- BACKEND (SPRING BOOT) ----------------
FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app

COPY backend/pom.xml ./
COPY backend/src ./src

RUN mvn clean package -DskipTests


# ---------------- RUNTIME ----------------
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=backend-build /app/target/*.jar app.jar

# Copy React build into Spring Boot static folder
COPY --from=frontend-build /frontend/dist ./static

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
