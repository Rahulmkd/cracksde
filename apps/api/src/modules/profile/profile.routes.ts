import { Router } from "express";
import { ProfileController } from "./profile.controller.js";
import { validateBody } from "../../middleware/validate.js";
import { updateProfileSchema } from "@cracksde/shared";

const router = Router();

router.get("/profile", ProfileController.getProfile);
router.patch("/profile", validateBody(updateProfileSchema), ProfileController.updateProfile);
router.put("/profile", validateBody(updateProfileSchema), ProfileController.updateProfile);
router.get("/profile/stats", ProfileController.getStats);

export default router;
