# Build stage — dev dependencies are needed to compile TypeScript.
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
# The migration and seed scripts run through ts-node against the TypeScript
# sources, so the dev dependencies stay in the runtime image.
RUN npm ci && npm cache clean --force

COPY --from=build /app/dist ./dist
# The whole source tree, not a hand-picked list of folders. Migrations and the
# seed import entities, config and shared types, and cherry-picking directories
# breaks the moment one of them imports something new.
COPY --from=build /app/src ./src
COPY tsconfig.json ./

# Run as the image's non-root user rather than root.
USER node

EXPOSE 3001
CMD ["node", "dist/main"]
