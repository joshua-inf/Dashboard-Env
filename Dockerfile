# Stage 1: Build
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runner
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=8080

# Copy everything from the builder stage to the runner stage
COPY --from=builder /app ./

EXPOSE 8080

# Use npm start to launch
CMD ["npm", "start"]