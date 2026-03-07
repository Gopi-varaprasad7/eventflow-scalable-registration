import express from "express";
import { initDB } from "./models/user-model";
import userRoutes from "./routes/user.routes";
import { ErrorMiddleware} from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes"
const PORT = 5001;

const app = express();

app.use(express.json());
app.use("/users",userRoutes);
app.use('/api/auth',authRoutes);
app.use(ErrorMiddleware);

initDB();

app.listen(PORT,"0.0.0.0", () => {
  console.log("Server running on port 5001");
});