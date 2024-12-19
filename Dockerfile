# Use an official node image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application for production
RUN npm run build

# Expose the application on port 3000
EXPOSE 5173

# Serve the built application
CMD ["npm", "run", "preview"]
