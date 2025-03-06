import express from "express";
import logger from "./logger.js";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";
let logObject = {};

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello .ENV !");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}...`);
})