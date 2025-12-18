FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
RUN pnpm install --no-frozen-lockfile

COPY . .
RUN pnpm build

WORKDIR /app

EXPOSE 8080

CMD ["npm", "start"]