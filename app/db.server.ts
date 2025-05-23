import { PrismaClient } from "@prisma/client";
import invariant from "tiny-invariant";
import { createISO8601DateNow } from "../prisma/validation";
import { createSeedData } from "./utility/initialize";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = getClient() as unknown as PrismaClient;
} else {
  if (!global.__db__) {
    global.__db__ = getClient() as unknown as PrismaClient;
  }
  prisma = global.__db__;
}

function getClient() {
  const { DATABASE_URL } = process.env;
  invariant(typeof DATABASE_URL === "string", "DATABASE_URL env var not set");

  const databaseUrl = new URL(DATABASE_URL);

  const isLocalHost = databaseUrl.hostname === "localhost";

  const PRIMARY_REGION = isLocalHost ? null : process.env.PRIMARY_REGION;
  const FLY_REGION = isLocalHost ? null : process.env.FLY_REGION;

  const isReadReplicaRegion = !PRIMARY_REGION || PRIMARY_REGION === FLY_REGION;

  if (!isLocalHost) {
    if (databaseUrl.host.endsWith(".internal")) {
      databaseUrl.host = `${FLY_REGION}.${databaseUrl.host}`;
    }

    if (!isReadReplicaRegion) {
      // 5433 is the read-replica port
      databaseUrl.port = "5433";
    }
  }

  console.log(`🔌 setting up prisma client to ${databaseUrl.host}`);
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is. So if you need to change
  // something in this file, you'll need to manually restart the server.
  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl.toString(),
      },
    },
    log: ["error"],
  }).$extends({
    query: {
      $allModels: {
        create({ args, query }) {
          args.data = { ...args.data, createdAt: createISO8601DateNow() };
          return query(args);
        },

        createMany({ args, query }) {
          args.data = { ...args.data, createdAt: createISO8601DateNow() };
          return query(args);
        },

        update({ args, query }) {
          args.data = { ...args.data, updatedAt: createISO8601DateNow() };
          return query(args);
        },

        updateMany({ args, query }) {
          args.data = { ...args.data, updatedAt: createISO8601DateNow() };
          return query(args);
        },
      },
    },
  });

  // connect eagerly
  client.$connect().then(() => createSeedData());

  return client;
}

export { prisma };
