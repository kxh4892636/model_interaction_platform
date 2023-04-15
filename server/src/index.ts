/*
 * @file: server index.ts
 * @Author: xiaohan kong
 * @Date: 2023-02-24
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-24
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { projectRoute } from "./routes/project_route";
import { datasetRoute } from "./routes/dataset_route";
import { dataRoute } from "./routes/data_route";
import { modelRoute } from "./routes/model_route";
import { copyFile, copyFileSync } from "fs";

const app = express();
const port = 3456;

// cors
app.use(cors());
// helmet
app.use(helmet());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());
// Routes
app.use("/api/project", projectRoute);
app.use("/api/dataset", datasetRoute);
app.use("/api/data", dataRoute);
app.use("/api/model", modelRoute);

app.listen(port, () => {
  console.log("http://localhost:3456");
});
