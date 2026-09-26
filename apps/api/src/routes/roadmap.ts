import { Router } from "express";
import {
  getRoadmapSubjects,
  getRoadmapSubjectBySlug,
  getRoadmapSummary,
} from "../controllers/roadmap.controller.js";

const router = Router();

router.get("/roadmap/summary", getRoadmapSummary);
router.get("/roadmap/subjects", getRoadmapSubjects);
router.get("/roadmap/subjects/:slug", getRoadmapSubjectBySlug);

export default router;
