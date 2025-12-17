# 1. Base Stage
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# 2. Dependencies Stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 3. Build Stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# --- ADD ARGS HERE ---
# These are passed in from cloudbuild.yaml during 'docker build'
ARG OPENAI_API_KEY
ARG _NEXT_PUBLIC_SUPABASE_KEY

# Convert ARGs to ENVs so the Next.js build process can see them
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV _NEXT_PUBLIC_SUPABASE_KEY=$_NEXT_PUBLIC_SUPABASE_KEY
# ---------------------

RUN pnpm run build

# 4. Production Runner Stage
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Security: Run as non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# IMPORTANT: We copy from 'build' instead of '.next'
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/build/standalone ./
# Note: Next.js standalone moves static files to [distDir]/static 
# but the runner expects them at [distDir]/static
COPY --from=builder --chown=nextjs:nodejs /app/build/static ./build/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]