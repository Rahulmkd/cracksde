import { Router } from "express";
import { PracticeController } from "./practice.controller.js";
import { validateQuery } from "../../middleware/validate.js";
import { practiceQuerySchema } from "@cracksde/shared";

const router = Router();

router.get("/roadmap/practice", validateQuery(practiceQuerySchema), PracticeController.getPracticeProblems);
router.get("/roadmap/problems", validateQuery(practiceQuerySchema), PracticeController.getPracticeProblems);

export default router;
