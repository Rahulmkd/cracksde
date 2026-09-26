import { Router } from "express";
import healthRouter from "./health.js";
import roadmapRouter from "./roadmap.js";
import studyPlanRouter from "./study-plan.js";

const router = Router();

router.use(healthRouter);
router.use(roadmapRouter);
router.use(studyPlanRouter);

export default router;
