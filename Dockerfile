# Use an official Node image
FROM node:22-alpine AS builder

# Set work directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Use a smaller runtime image
FROM node:22-alpine

WORKDIR /app

# Copy only what’s needed for runtime
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Copy built files and static frontend
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Expose the app port
EXPOSE 80

# Start command
CMD ["npm", "start"]
