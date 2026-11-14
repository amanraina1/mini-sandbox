import { Router } from "express";


import { SandboxController } from '../controllers/sandbox.controller.ts';
import { SandboxService } from '../services/sandbox/sandbox.service.ts';
import { createSandboxProvider } from '../services/sandbox/sandbox.factory.ts';

const router = Router();

const provider = createSandboxProvider();
const sandboxService = new SandboxService(provider);
const sandboxController = new SandboxController(sandboxService);

router.get('/', sandboxController.getContainers);
router.post('/', sandboxController.createContainer);

export default router;
