import 'dotenv/config'

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  SANDBOX_PROVIDER: (process.env.SANDBOX_PROVIDER || 'docker').toLowerCase() as 'docker' | 'firecracker',
  DOCKER_SOCKET_PATH: process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock',
};
