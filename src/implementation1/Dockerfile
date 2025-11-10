FROM node:22-bullseye

# Set working directory
WORKDIR /usr/src/app

# Install curl, bash, and k6
# RUN apt-get update && apt-get install -y \
#     curl \
#     bash \
#     gnupg2 \
#     && curl -s https://packagecloud.io/install/repositories/loadimpact/k6/script.deb.sh | bash \
#     && apt-get install -y k6 \
#     && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source code
COPY . .


# COPY docker-entrypoint.sh /usr/src/app/docker-entrypoint.sh

# # Make sure it’s executable
# RUN chmod +x /usr/src/app/docker-entrypoint.sh

# Set it as the container entrypoint
# ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]



# Expose container port
EXPOSE 3001

# Run the app
CMD ["node", "index.js"]
