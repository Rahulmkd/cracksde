import { Router } from "express";
import { StudyPlanController } from "./study-plan.controller.js";
import { validateBody } from "../../middleware/validate.js";
import {
  updateStudyPlanSchema,
  updateStudyTaskSchema,
} from "@cracksde/shared";

const router = Router();

router.get("/study-plans", StudyPlanController.getStudyPlan);
router.get("/study-plans/revision-list", StudyPlanController.getRevisionList);
router.get("/study-plans/:slug", StudyPlanController.getStudyPlan);
router.patch("/study-plans/:slug", validateBody(updateStudyPlanSchema), StudyPlanController.updateStudyPlan);
router.patch("/study-plans/tasks/:taskId", validateBody(updateStudyTaskSchema), StudyPlanController.updateStudyTask);

export default router;
