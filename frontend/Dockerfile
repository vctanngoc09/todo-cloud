# --- Giai đoạn 1: Build ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- Giai đoạn 2: Serve ---
FROM nginx:stable-alpine
# Copy file đã build từ giai đoạn 1
COPY --from=build /app/dist /usr/share/nginx/html

# Xóa cấu hình mặc định và copy file nginx.conf của mình vào
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
