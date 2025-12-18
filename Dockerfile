# Stage 1: Build
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG OPENAI_API_KEY
ARG _NEXT_PUBLIC_SUPABASE_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV _NEXT_PUBLIC_SUPABASE_KEY=$NEXT_PUBLIC_SUPABASE_KEY

RUN npm run build

# Stage 2: Runner (Now running as root)
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy files directly into root
COPY --from=builder /app/build/standalone ./

# Debug step to see exactly where files landed
RUN echo "--- ROOT FOLDER ---" && ls -F

EXPOSE 3000

CMD ["node", "server.js"]