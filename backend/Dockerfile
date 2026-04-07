FROM node:20-alpine AS base
WORKDIR /app

# Dependencies — skip postinstall (prisma generate) since schema isn't here yet
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Build — full source available, run generate + compile
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package.json package-lock.json ./
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 3001
CMD ["sh", "entrypoint.sh"]
