FROM node:16-alpine

MAINTAINER "Nic Jansma"

# Metrics on port 9696
EXPOSE 9696

# Create app directory
WORKDIR /usr/src/app

# Get package.json and package-lock.json
COPY package*.json ./

# Setup the build environment
RUN apk --no-cache add --virtual native-deps \
        g++ make python3 && \
    npm install --only=production && \
    apk del native-deps

# Copy over source
COPY src/ src/

# Run Node
CMD ["node", "./src/index.js"]
