FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate
COPY . .
RUN npx tsc -p tsconfig.build.json --incremental false

EXPOSE 3000

CMD ["node", "dist/src/main"]