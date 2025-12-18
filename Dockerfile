# ... (Stages 1 & 2 remain the same) ...

# Stage 3: Runner
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 1. Copy the files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/build/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/build/static ./build/static

# --- DEBUG SECTION ---
# This will print the entire file structure to your Cloud Build logs
RUN echo "--- CHECKING ROOT DIRECTORY ---" && ls -F
RUN echo "--- CHECKING BUILD DIRECTORY ---" && ls -R build/ || echo "build folder not found"
# ---------------------

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]