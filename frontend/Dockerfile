# Stage 1: Build the React application
FROM node:20-slim AS build

WORKDIR /app

# Copy package files first to leverage Docker cache for dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the project (This generates the 'dist' folder)
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output from the first stage to Nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration to handle React Router paths
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]