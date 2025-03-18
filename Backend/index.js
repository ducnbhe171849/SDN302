// create server
const express = require("express");

// const v8 = require("v8");

// console.log(v8.getHeapStatistics());

const app = express();

//end create server

require("dotenv").config(); // .env

// database
const database = require("./config/database");
const port = process.env.PORT;
database.connectToDatabase();
//end database

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
// end body parser

// cors
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//end cors

// cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());
//end cookie-parser

// router v1
const routerApiV1 = require("./API/V1/routers/index.router");
routerApiV1(app);

//end router v1

// run server
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
