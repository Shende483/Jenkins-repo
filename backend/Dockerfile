# 🛠 Stage 1: Build Image
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies (including devDependencies)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and configuration files
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
COPY .env ./

# Build the application
RUN npm run build

# 🚀 Stage 2: Production Image
FROM node:20-alpine
WORKDIR /app

# Copy only required files from builder
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/.env /app/.env

# Set the port
EXPOSE 3040

# Run the application
CMD ["npm", "run", "start:prod"]