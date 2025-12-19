# Stage 1: Build
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

# Stage 2: Runner
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# For 'npm start' to work, we need:
# 1. The package.json (to find the 'start' script)
COPY --from=builder /app/package*.json ./
# 2. The FULL node_modules (production only)
COPY --from=builder /app/node_modules ./node_modules
# 3. The entire build folder (where you set distDir: 'build')
COPY --from=builder /app/build ./build
# 4. Public assets
COPY --from=builder /app/public ./public

EXPOSE 3000

# Use npm start to launch 'next start'
CMD ["npm", "start"]