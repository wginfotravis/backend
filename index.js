import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { rateLimit } from "express-rate-limit";
import mongoose from "mongoose";
import path from "path";
import { connectDB } from "./config/db.js";
import { getCustomerList } from "./controller/customerController.js";
import { getFactoryList } from "./controller/factoryController.js";
import { deleteAfterThirtyDays } from "./controller/trashController.js";
import { getAllUsersList } from "./controller/userController.js";
import errorHandler from "./middleware/errorHandler.js";
import aryaRoute from "./routes/aryaRoutes.js";
import authRouter from "./routes/authRoute.js";
import barBillingRoutes from "./routes/barBillingRoutes.js";
import barOrderRoutes from "./routes/barOrderRoutes.js";
import billingRoute from "./routes/billingRoutes.js";
import cancelRoute from "./routes/cancelRoutes.js";
import currencyRoute from "./routes/currencyRoutes.js";
import customerRoute from "./routes/customerRoutes.js";
import dashboardRoute from "./routes/dashboardRoutes.js";
import dispatchRoute from "./routes/dispatchRoutes.js";
import emailRoute from "./routes/emailRoutes.js";
import excelUploadRoute from "./routes/excelUploadRoute.js";
import factoryRoute from "./routes/factoryRoutes.js";
import jewelleryInventoryBillingRoute from "./routes/jewelleryInventoryBillingRoutes.js";
import jewelleryInventoryRoute from "./routes/jewelleryInventoryRoutes.js";
import jewelleryOrderRoute from "./routes/jewelleryOrderRoutes.js";
import logoRoute from "./routes/logoRoutes.js";
import processRoute from "./routes/processRoutes.js";
import reportRoute from "./routes/reportRoutes.js";
import silverInventoryBillingRoute from "./routes/silverInventoryBillingRoutes.js";
import silverRoute from "./routes/silverRoutes.js";
import trashRoute from "./routes/trashRoutes.js";
import uploadRoutes from "./routes/uploadRoute.js";
import usersRoute from "./routes/userRoutes.js";
import watchInventoryBillingRoute from "./routes/watchInventoryBillingRoutes.js";
import watchRoute from "./routes/watchRoutes.js";

const port = process.env.PORT || 3500;
dotenv.config();
const app = express();
connectDB();
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 1000, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later",
});
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(cors());
// apply rate limiting to all requests
app.use(limiter);

app.use("/api/v1/users", usersRoute);
app.use("/api/v1/factory", factoryRoute);
app.use("/api/v1/customers", customerRoute);
app.use("/api/v1/watch", watchRoute);
app.use("/api/v1/arya", aryaRoute);
app.use("/api/v1/silver", silverRoute);
app.use("/api/v1/upload", uploadRoutes);
app.get("/api/v1/wakeup", (req, res) => {
  res.send("Wake up call");
});
app.get("/api/v1/getCustomerList", getCustomerList);
app.get("/api/v1/getFactoryList", getFactoryList);
app.get("/api/v1/getActiveUserList", getAllUsersList);
app.use("/api/v1/jewelleryInventory", jewelleryInventoryRoute);
app.use("/api/v1/jewelleryOrder", jewelleryOrderRoute);
app.use("/api/v1/barOrder", barOrderRoutes);
app.use("/api/v1/barBilling", barBillingRoutes);
app.use("/api/v1/process", processRoute);
app.use("/api/v1/billing", billingRoute);
app.use("/api/v1/jewelleryInventoryBilling", jewelleryInventoryBillingRoute);
app.use("/api/v1/silverInventoryBilling", silverInventoryBillingRoute);
app.use("/api/v1/watchInventoryBilling", watchInventoryBillingRoute);
app.use("/api/v1/dispatch", dispatchRoute);
app.use("/api/v1/report", reportRoute);
app.use("/api/v1/login", authRouter);
app.use("/api/v1/excelUpload", excelUploadRoute);
app.use("/api/v1/email", emailRoute);
app.use("/api/v1/logo", logoRoute);
app.use("/api/v1/currency", currencyRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/cancel", cancelRoute);
app.use("/api/v1/trash", trashRoute);
app.use("/api/v1/thirtydays", deleteAfterThirtyDays);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
