FROM node:22-alpine
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile --strict-peer-dependencies=false

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["node", "dist/main.js"]
