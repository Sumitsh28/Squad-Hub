# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set working directory inside the container
WORKDIR /app/backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the backend server
CMD ["npm", "start"]
