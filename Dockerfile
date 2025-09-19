# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the project files
COPY . .

# Expose the application port
EXPOSE 3000

# Set environment variables (can be overridden in docker-compose or at runtime)
ENV PORT=3000

# Start the service
CMD ["node", "index.js"]