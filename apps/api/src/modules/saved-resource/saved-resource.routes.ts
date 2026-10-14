import { Router } from "express";
import { SavedResourceController } from "./saved-resource.controller.js";
import { validateBody } from "../../middleware/validate.js";
import { saveResourceSchema } from "@cracksde/shared";

const router = Router();

router.get("/saved-resources", SavedResourceController.getSavedResources);
router.post(
  "/saved-resources",
  validateBody(saveResourceSchema),
  SavedResourceController.createSavedResource
);
router.delete("/saved-resources/:id", SavedResourceController.deleteSavedResource);
router.patch("/saved-resources/:id/bookmark", SavedResourceController.toggleBookmark);

export default router;
