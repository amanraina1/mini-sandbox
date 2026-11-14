import { env } from '../../config/env.ts';
import { SandboxProvider } from './interfaces/sandbox.interface.ts';
import { DockerProvider } from './providers/docker.provider.ts';

export function createSandboxProvider(): SandboxProvider {
  switch (env.SANDBOX_PROVIDER) {
    case 'docker':
      return new DockerProvider(env.DOCKER_SOCKET_PATH);
    default:
      throw new Error(`Unsupported SANDBOX_PROVIDER: ${env.SANDBOX_PROVIDER}`);
  }
}
