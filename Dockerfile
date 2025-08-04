# search-ai/Dockerfile

# Giai đoạn 1: Build aplication
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Giai đoạn 2: Serve bằng Nginx
FROM nginx:stable-alpine
# Sao chép các file tĩnh đã được build từ giai đoạn 1
COPY --from=builder /app/dist /usr/share/nginx/html
# Sao chép file cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]