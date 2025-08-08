# search-ai/Dockerfile

# --- Giai đoạn 1: Build (Không có thay đổi lớn) ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Chúng ta không cần truyền ARG vào đây nữa
RUN npm run build

# --- Giai đoạn 2: Serve bằng Nginx (Thay đổi lớn) ---
FROM nginx:stable-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# File này sẽ được dùng để chạy lúc khởi động
COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh

# Chạy script entrypoint khi container khởi động
CMD ["/entrypoint.sh"]