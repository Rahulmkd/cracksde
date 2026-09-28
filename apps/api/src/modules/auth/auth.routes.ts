import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../../lib/auth.js";

const router = Router();

// Better Auth handler - mounted at /api/auth
// Express v5 uses *splat for catch-all route parameters
router.all("/auth/*splat", toNodeHandler(auth));
router.all("/auth", toNodeHandler(auth));

export default router;
