# Stage 1: Build ứng dụng React
FROM node:22-alpine AS build-stage

WORKDIR /app

# Copy các file quản lý thư viện trước
COPY package*.json ./
RUN npm install

# Copy toàn bộ code và build
COPY . .
RUN npm run build

# Stage 2: Chạy ứng dụng bằng Nginx
FROM nginx:stable-alpine AS production-stage
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Nhớ kiểm tra xem project của bạn build ra 'dist' hay 'build' nhé
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]