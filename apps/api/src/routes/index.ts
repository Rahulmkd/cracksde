import { Router } from "express";
import healthRouter from "../modules/health/health.routes.js";
import roadmapRouter from "../modules/roadmap/roadmap.routes.js";
import practiceRouter from "../modules/practice/practice.routes.js";
import studyPlanRouter from "../modules/study-plan/study-plan.routes.js";
import profileRouter from "../modules/profile/profile.routes.js";

const router = Router();

router.use(healthRouter);
router.use(roadmapRouter);
router.use(practiceRouter);
router.use(studyPlanRouter);
router.use(profileRouter);

export default router;
