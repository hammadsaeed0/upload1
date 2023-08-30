// const express = require('express')
// const app = express()
// const PORT = process.env.PORT || 3000

// app.get('/', (req, res) => {
//   res.send("Hey by hammad")
// })

// app.get('/about', (req, res) => {
//   res.json({message: "Success By Hamamd"})
// })



// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`)
// })

import express from "express";
import { connectDB } from "./config/database.js";
import { APP_PORT } from "./config/index.js";
import BuyerRoutes from "./routes/BuyerRoutes.js";
import FreelancerRoutes from "./routes/FreelancerRoutes.js"
import ErrorMiddleware from "./middleware/Error.js";
import fileupload from "express-fileupload";
const app = express();
import cors from 'cors';


connectDB();

// Use Middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  fileupload({
    useTempFiles: true,
  })
);
app.use(cors());

// Import User Routes Hey
app.use("/v1", FreelancerRoutes);
app.use("/v1", BuyerRoutes);

app.listen(APP_PORT, () => {
  console.log(`app  on port ${APP_PORT}`);
});

app.use(ErrorMiddleware);
