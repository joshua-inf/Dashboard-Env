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
ENV PORT=3000



# 1. Copy the standalone build (the server)
COPY --from=builder /app/build/standalone ./
# 2. Copy the static assets (THIS FIXES THE 404s)
# Note: standalone server looks for static files in [distDir]/static
COPY --from=builder /app/build/static ./build/static
# 3. Copy public assets (Logos, favicons, etc)
COPY --from=builder /app/public ./public

EXPOSE 3000

# Use npm start to launch
CMD ["node", "server.js"]