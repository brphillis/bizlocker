# base node image
FROM node:20-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /brockdev-remix

ADD package.json package-lock.json .npmrc ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /brockdev-remix

COPY --from=deps /brockdev-remix/node_modules /brockdev-remix/node_modules
ADD package.json package-lock.json .npmrc ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /brockdev-remix

COPY --from=deps /brockdev-remix/node_modules /brockdev-remix/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /brockdev-remix

COPY --from=production-deps /brockdev-remix/node_modules /brockdev-remix/node_modules
COPY --from=build /brockdev-remix/node_modules/.prisma /brockdev-remix/node_modules/.prisma

COPY --from=build /brockdev-remix/build/server /brockdev-remix/build/server
COPY --from=build /brockdev-remix/build/client /brockdev-remix/build/client
ADD . .

CMD ["npm", "start"]
