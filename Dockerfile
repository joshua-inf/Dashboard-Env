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

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# In default mode, we need the production dependencies
COPY --from=builder /app/node_modules ./node_modules
# Copy the hidden .next folder (where the chunks live)
COPY --from=builder /app/.next ./.next
# Copy public assets and package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]