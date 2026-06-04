FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY apps/api/package*.json ./
RUN npm ci
COPY apps/api .
RUN npx prisma generate && npm run build

FROM node:20-alpine
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["sh", "-c", "until ./node_modules/.bin/prisma migrate deploy; do echo 'Migration failed, retrying in 5s...'; sleep 5; done && node dist/index.js"]
