#!/bin/sh
# entrypoint.sh

# 1. Thay thế placeholder URL backend trong file index.html
# Chú ý: Dấu / cần được escape thành \/
ESCAPED_URL=$(echo $VITE_API_BASE_URL | sed 's/\//\\\//g')
sed -i "s/__VITE_API_BASE_URL__/$ESCAPED_URL/g" /usr/share/nginx/html/index.html

# 2. Thay thế biến $PORT trong file template và tạo ra file config cuối cùng cho Nginx
envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# 3. Khởi chạy Nginx ở foreground
nginx -g 'daemon off;'