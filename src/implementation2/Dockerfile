FROM node:22-bullseye

# Set working directory
WORKDIR /usr/src/app

# Set environment
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Default command
CMD ["node", "grpc-server.js"]
