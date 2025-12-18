# Stage 1: Dependencies
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ARGs from cloudbuild.yaml
ARG OPENAI_API_KEY
ARG _NEXT_PUBLIC_SUPABASE_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV _NEXT_PUBLIC_SUPABASE_KEY=$_NEXT_PUBLIC_SUPABASE_KEY
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3: Runner
FROM node:22-slim AS runner
WORKDIR /app

# IMPORTANT: Cloud Run specific settings
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# The custom 'build' folder mapping
# Next.js standalone output moves everything to [distDir]/standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/build/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/build/static ./build/static


EXPOSE 3000

# This is the command that Cloud Run executes
CMD ["node", "server.js"]