# Stage 1: Build the frontend with Node.js
FROM node:18-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the Vite build
RUN npm run build

# Stage 2: Serve the build with Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build folder to the Nginx directory
# Ensure the output directory matches the one specified in vite.config.js
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 and run Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
