import { Router } from "express";


import { SandboxController } from '../controllers/sandbox.controller.ts';
import { SandboxService } from '../services/sandbox/sandbox.service.ts';
import { createSandboxProvider } from '../services/sandbox/sandbox.factory.ts';

const router = Router();

const provider = createSandboxProvider();
const sandboxService = new SandboxService(provider);
const sandboxController = new SandboxController(sandboxService);

// get all sandboxes
router.get('/', sandboxController.getContainers);

// create a new sandbox
router.post('/', sandboxController.createContainer);

// delete a sandbox
router.delete('/:id', sandboxController.deleteContainer)

// start a repl
router.post('sandbox/:id/repl/start', sandboxController.)

export default router;
