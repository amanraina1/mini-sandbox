import { Router } from "express";
import { getSandboxes } from "../controllers/sandbox.controller.ts";

const router = Router();

router.get("/sandbox", getSandboxes)

export default router;