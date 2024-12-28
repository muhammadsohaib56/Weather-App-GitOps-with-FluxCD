# Use an official Nginx image
FROM nginx:alpine

# Copy the app-code to Nginx HTML directory
COPY app-code /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80
