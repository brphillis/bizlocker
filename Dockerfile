# base node image
FROM node:18 as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl procps

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /brockdev

ADD package.json .npmrc ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /brockdev

COPY --from=deps /brockdev/node_modules /brockdev/node_modules
ADD package.json .npmrc ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /brockdev

COPY --from=deps /brockdev/node_modules /brockdev/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /brockdev

COPY --from=production-deps /brockdev/node_modules /brockdev/node_modules
COPY --from=build /brockdev/node_modules/.prisma /brockdev/node_modules/.prisma

COPY --from=build /brockdev/build/server /brockdev/build/server
COPY --from=build /brockdev/build/client /brockdev/build/client
ADD . .

CMD ["npm", "start"]


