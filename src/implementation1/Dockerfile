FROM node:22-bullseye

# Set working directory
WORKDIR /usr/src/app


COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .


# COPY docker-entrypoint.sh /usr/src/app/docker-entrypoint.sh

# # Make sure it’s executable
# RUN chmod +x /usr/src/app/docker-entrypoint.sh

# # Set it as the container entrypoint
# ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]



# Expose container port
EXPOSE 3001

# Run the app
CMD ["sh", "-c", "./node_modules/.bin/db-migrate up initialize & node index.js"]
