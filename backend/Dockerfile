# Use Node.js Image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY package.json ./
RUN npm install

COPY . .

# Expose Port
EXPOSE 3000

# Start App
CMD ["node", "server.js"]

