# Stage 1: Base - Setup pnpm
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Stage 2: Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 3: Build - Inject secrets here
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ARGs are passed from cloudbuild.yaml during 'docker build'
ARG OPENAI_API_KEY
ARG _NEXT_PUBLIC_SUPABASE_KEY

# ENVs make them available to 'pnpm run build'
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV _NEXT_PUBLIC_SUPABASE_KEY=$_NEXT_PUBLIC_SUPABASE_KEY
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# Stage 4: Runner - Production environment
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=8080

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output and static assets
# Note: Next.js puts standalone files in [distDir]/standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/build/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/build/static ./build/static

USER nextjs
EXPOSE 8080

# The entry point for standalone mode
CMD ["node", "server.js"]