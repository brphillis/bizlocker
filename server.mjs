import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import express from "express";

installGlobals();

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      );

const app = express();

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    "/assets",
    express.static("build/client/assets", {
      immutable: true,
      maxAge: "1y",
    }),
  );
}
app.use(express.static("build/client", { maxAge: "1h" }));

// handle SSR requests
app.all(
  "*",
  createRequestHandler({
    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
      : await import("./build/server/index.js"),
  }),
);

const port = 3000;
app.listen(port, () => console.log("http://localhost:" + port));

// if (process.env.NODE_ENV !== "production") {
//   const httpsOptions = {
//     key: fs.readFileSync("./key.pem"),
//     cert: fs.readFileSync("./certificate.pem"),
//   };

//   const server = https.createServer(httpsOptions, app);

//   server.listen(port, () => console.log("http://localhost:" + port));
// } else {
//   app.listen(port, () => console.log("http://localhost:" + port));
// }
