# syntax=docker/dockerfile:1.7
FROM node:22.17.1-alpine
WORKDIR /workspaces/jottr-io
ENV NODE_ENV=development
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN corepack enable && if [ -f pnpm-lock.yaml ]; then corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then corepack prepare yarn@stable --activate && yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
EXPOSE 5173
CMD ["sh", "-lc", "npm run dev -- --host 0.0.0.0 --port 5173"]
