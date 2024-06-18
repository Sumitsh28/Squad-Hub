# Stage 1 - the build process
FROM node:14-alpine as build

# Set working directory inside the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the frontend app
RUN npm run build

# Stage 2 - the production environment
FROM nginx:alpine

# Copy the build output from the build stage to the nginx web server directory
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
