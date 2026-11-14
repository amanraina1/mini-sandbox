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
router.delete('/:id', sandboxController.deleteContainer);

// start a repl
router.post('sandbox/:id/repl/start', sandboxController.startRepl);

// stop a repl
router.delete('sandbox/repl/:sessionId', sandboxController.stopRepl);

// write to a repl
router.post('sandbox/repl/:sessionId/input', sandboxController.writeToRepl);

// SSE preflight request
router.options("/sandbox/repl/:sessionId/stream", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).end();
});

router.get("/sandbox/repl/:sessionId/stream", sandboxController.getEmitter)

export default router;
