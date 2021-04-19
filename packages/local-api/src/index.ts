import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { createCellsRouter } from "./routes/cells";

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  // Wire up express router. Handle these request handlers first.
  app.use(createCellsRouter(filename, dir));

  // Serve react assets source
  if (useProxy) {
    // Intended for development with create-react-app
    app.use(
      createProxyMiddleware({
        target: "http://localhost:3000",
        ws: true,
        logLevel: "silent",
      })
    );
  } else {
    // Intended for when user has installed CLI to their local machine
    const packagePath = require.resolve(
      "@jsnotenow/local-client/build/index.html"
    );
    app.use(express.static(path.dirname(packagePath)));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on("error", reject); // Listen on port 4005 provided from cli
  });
};
