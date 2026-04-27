# --- Giai đoạn 1: Build file JAR bằng Maven ---
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
# Copy file cấu hình maven và mã nguồn
COPY pom.xml .
COPY src ./src
# Build project và bỏ qua chạy Unit Test để nhanh hơn
RUN mvn clean package -DskipTests
# --- Giai đoạn 2: Tạo Image thực thi (JRE) ---
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copy file .jar đã build từ giai đoạn 1 sang
# Lưu ý: Tên file JAR mặc định thường là [artifactId]-[version].jar
COPY --from=build /app/target/*.jar app.jar
# Cloud Run sẽ cấp cổng qua biến môi trường $PORT (mặc định là 8080)
EXPOSE 8080
# Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
