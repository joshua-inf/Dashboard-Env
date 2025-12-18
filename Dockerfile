# Stage 1: Build the application
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Receive secrets from cloudbuild.yaml
ARG OPENAI_API_KEY
ARG _NEXT_PUBLIC_SUPABASE_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV _NEXT_PUBLIC_SUPABASE_KEY=$_NEXT_PUBLIC_SUPABASE_KEY

RUN npm run build

# Stage 2: Run the application
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
# Force Next.js to listen on all interfaces
ENV HOSTNAME="0.0.0.0"
ENV PORT=8080

# For 'npm start', we need the build folder AND node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/build ./build

EXPOSE 8080

CMD ["npm", "start"]