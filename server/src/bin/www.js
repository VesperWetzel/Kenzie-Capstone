import app from "../";
import http from "http";
import { port } from "../config/server.config";
import { green, red, yellow, blue } from "chalk";

const server = http.createServer(app);

server.listen(port);

server.on("listening", () => {
  console.log(
    `${green("[Server]")} Now listening for HTTP requests at ${blue(
      "http://localhost:"
    )}${yellow(port)}`
  );
});
