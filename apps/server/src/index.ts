import express from "express";
import cors from "cors";
import sandboxRoutes from "./routes/sandbox.route.ts"
import { env } from "./config/env.ts"

const app = express();

app.use(express.json())
app.use(cors())

app.use("/api/v1/sandbox", sandboxRoutes);

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} using [${env.SANDBOX_PROVIDER}] provider`);
});