# Build React frontend
FROM node:20 AS frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# Build Spring Boot backend
FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app

COPY backend/pom.xml .
COPY backend/src ./src

# Copy React build into Spring Boot static resources
RUN mkdir -p src/main/resources/static
COPY --from=frontend-build /frontend/build ./src/main/resources/static

RUN mvn clean package -DskipTests

# Runtime image
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=frontend-build /frontend/dist ./src/main/resources/static

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
