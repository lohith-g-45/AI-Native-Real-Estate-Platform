FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable \
 && corepack prepare pnpm@9.15.9 --activate \
 && pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main.js"]