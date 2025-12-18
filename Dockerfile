# Stage 1: Dependencies
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Stage 2: Builder
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Receive secrets from cloudbuild.yaml
ARG OPENAI_API_KEY
ARG _NEXT_PUBLIC_SUPABASE_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV _NEXT_PUBLIC_SUPABASE_KEY=$_NEXT_PUBLIC_SUPABASE_KEY

RUN npm run build

# Stage 3: Runner (Optimized for Cloud Run)
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
# Cloud Run expects 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Copy only the necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/build/standalone ./
COPY --from=builder /app/build/static ./build/static

EXPOSE 8080

# Run the standalone server instead of 'npm start'
CMD ["node", "server.js"]