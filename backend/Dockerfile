# Use Node.js v20 as the base image
FROM node:20  

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Start the app
CMD ["npm", "run", "dev"]
