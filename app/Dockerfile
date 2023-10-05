# Build stage: Use Node.js to build the React app
FROM node:20.3.1-alpine AS build

WORKDIR /test

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy local files to container
COPY . .

# Build the React app
RUN npm run build

COPY gif.js /test/dist
COPY gif.js.map /test/dist
COPY gif.worker.js /test/dist
COPY gif.worker.js.map /test/dist

# Production stage: Use Nginx to serve the React app
FROM nginx:alpine

# Copy the React app from the build stage to the nginx container
COPY --from=build /test/dist /usr/share/nginx/html


# Expose port 8080
EXPOSE 8080

# Use a custom nginx configuration file to listen on port 8080
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]