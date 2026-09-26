import { Router } from "express";
import {
  getStudyPlan,
  updateStudyTask,
  updateStudyPlan,
  getRevisionList,
} from "../controllers/study-plan.controller.js";

const router = Router();

router.get("/study-plans", getStudyPlan);
router.get("/study-plans/revision-list", getRevisionList);
router.get("/study-plans/:slug", getStudyPlan);
router.patch("/study-plans/:slug", updateStudyPlan);
router.patch("/study-plans/tasks/:taskId", updateStudyTask);

export default router;
