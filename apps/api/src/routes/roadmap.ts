import { Router } from "express";
import {
  getRoadmapSubjects,
  getRoadmapSubjectBySlug,
  getTopicQuestions,
  solveQuestion,
  getItemProgress,
  getUserRevisionItems,
  getRoadmapSummary,
  getPracticeProblems,
  createRoadmapItem,
} from "../controllers/roadmap.controller.js";

const router = Router();

router.get("/roadmap/summary", getRoadmapSummary);
router.get("/roadmap/practice", getPracticeProblems);
router.get("/roadmap/problems", getPracticeProblems);
router.get("/roadmap/subjects", getRoadmapSubjects);
router.get("/roadmap/subjects/:slug", getRoadmapSubjectBySlug);
router.get("/roadmap/subjects/:slug/topics/:topicSlug/questions", getTopicQuestions);
router.get("/roadmap/topics/:topicId/questions", getTopicQuestions);
router.get("/roadmap/user/revisions", getUserRevisionItems);
router.post("/roadmap/items", createRoadmapItem);
router.post("/roadmap/questions", createRoadmapItem);
router.post("/roadmap/items/:itemId/solve", solveQuestion);
router.get("/roadmap/items/:itemId/progress", getItemProgress);

export default router;
