# Stage 1: Build
FROM node:22-slim AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Build Next.js (force webpack for Turbopack conflict)
RUN npm run build --webpack

# Stage 2: Production
FROM node:22-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copy only necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080

# Start the app
CMD ["npm", "start"]
