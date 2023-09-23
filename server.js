import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/authRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import colors from "colors";
import connectDB from "./config/db.js";
import analyticRoutes from "./routes/analyticRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import path from "path";

const app = express();
connectDB();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
//Test Routes
app.use("/api/v1/user", router);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/analytics", analyticRoutes);
app.use("/api/v1/admin", adminRouter);

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const PORT = process.env.PORT || 4545;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
