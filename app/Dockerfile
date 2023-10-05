# Build stage: Use Node.js to build the React app
FROM node:20.3.1-alpine AS build

WORKDIR /app

# Install app dependencies
COPY ./app/package.json ./
COPY ./app/package-lock.json ./
RUN npm install

# Copy local files to container
COPY . .

COPY ./app/gif.js /app/dist
COPY ./app/gif.js.map /app/dist
COPY ./app/gif.worker.js /app/dist
COPY ./app/gif.worker.js.map /app//dist

# Production stage: Use Nginx to serve the React app
FROM nginx:alpine

# Copy the React app from the build stage to the nginx container
COPY --from=build /app/dist /usr/share/nginx/html


# Expose port 8080
EXPOSE 8080

# Use a custom nginx configuration file to listen on port 8080
COPY ./app/web/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]