import "reflect-metadata";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import http from "http";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import router from "./routes";
import swaggerFile from "./swagger/doc/swagger.json";
import ServerResponse from "./utils/ServerResponse";

config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.disable("x-powered-by");

morgan(":method :url :status :res[content-length] - :response-time ms");

app.use("/api/v1", router);
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("*", (req, res) => {
  return ServerResponse.notFound(res, "Route not found");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
