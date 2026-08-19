# Build stage — needs dev dependencies to compile TypeScript.
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage.
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
# The migration scripts run through ts-node, so the dev dependencies stay.
RUN npm ci && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY src/database/migrations ./src/database/migrations
COPY src/config ./src/config
COPY src/database/entities ./src/database/entities
COPY tsconfig.json ./

# Run as the image's non-root user rather than root.
USER node

EXPOSE 3001
CMD ["node", "dist/main"]
