# ---------- Build ----------
FROM node:22-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Run ----------
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Cloud Run provides PORT automatically
ENV HOSTNAME=0.0.0.0

# Copy standalone output
COPY --from=builder /app ./

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]
