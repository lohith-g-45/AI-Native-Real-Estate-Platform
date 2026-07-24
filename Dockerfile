FROM node:22-alpine
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --no-frozen-lockfile --strict-peer-dependencies=false

COPY . .
RUN pnpm build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main.js"]