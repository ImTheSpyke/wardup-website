# ----------------------
# Build stage
# ----------------------
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files & install deps
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# ----------------------
# Runtime stage
# ----------------------
FROM node:22-alpine
WORKDIR /app

# Copy only runtime deps
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Copy built files and static frontend
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 80

# Start app
CMD ["npm", "start"]
