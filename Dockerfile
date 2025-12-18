FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN pnpm install

COPY . .
RUN pnpm run build

WORKDIR /app

EXPOSE 8080

CMD ["npm", "start"]