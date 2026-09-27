import { Router } from "express";
import { RoadmapController } from "./roadmap.controller.js";
import { validateBody } from "../../middleware/validate.js";
import {
  createRoadmapItemSchema,
  solveQuestionSchema,
} from "@cracksde/shared";

const router = Router();

router.get("/roadmap/summary", RoadmapController.getRoadmapSummary);
router.get("/roadmap/subjects", RoadmapController.getSubjects);
router.get("/roadmap/subjects/:slug", RoadmapController.getSubjectBySlug);
router.get("/roadmap/subjects/:slug/topics/:topicSlug/questions", RoadmapController.getTopicQuestions);
router.get("/roadmap/topics/:topicId/questions", RoadmapController.getTopicQuestions);
router.get("/roadmap/user/revisions", RoadmapController.getUserRevisions);
router.post("/roadmap/items", validateBody(createRoadmapItemSchema), RoadmapController.createRoadmapItem);
router.post("/roadmap/questions", validateBody(createRoadmapItemSchema), RoadmapController.createRoadmapItem);
router.post("/roadmap/items/:itemId/solve", validateBody(solveQuestionSchema), RoadmapController.solveQuestion);
router.get("/roadmap/items/:itemId/progress", RoadmapController.getItemProgress);

export default router;
