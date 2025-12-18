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
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Copy essentials (Note: removing 'build/' prefix for static if needed)
COPY --from=builder /app/public ./public
COPY --from=builder /app/build/standalone ./
COPY --from=builder /app/build/static ./build/static

EXPOSE 3000

# This "sh -c" syntax is the most aggressive way to force the port
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 PORT=3000 node server.js"]