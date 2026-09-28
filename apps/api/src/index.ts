import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { corsOptions } from "./config/cors.js";
import { authRouter } from "./modules/auth/index.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler.js";

// Ensure BigInt is safely serialized to JSON strings in Express responses
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const app = express();

// Security
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Better Auth handler — MUST be mounted before express.json()
app.use("/api", authRouter);

// Body parsing — after auth handler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`\n🚀 API server running at http://localhost:${env.PORT}`);
  console.log(`📋 Health check: http://localhost:${env.PORT}/api/health`);
  console.log(`🔐 Auth endpoint: http://localhost:${env.PORT}/api/auth\n`);
});

export default app;
