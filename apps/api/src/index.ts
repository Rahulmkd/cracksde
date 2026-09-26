import express from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { env } from "./config/env.js";
import { corsOptions } from "./config/cors.js";
import { auth } from "./lib/auth.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

// Security
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Better Auth handler — MUST be before express.json()
// Express v5 uses *splat for catch-all parameters
app.all("/api/auth/*splat", toNodeHandler(auth));

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
