import { config } from "@matter/nodejs/config";

config.trapProcessSignals = true;
config.setProcessExitCodeOnError = true;
config.loadConfigFile = false;
config.loadProcessArgv = false;
config.loadProcessEnv = false;

function formatUnhandledReason(reason: unknown): string {
  if (reason instanceof Error) {
    return `${reason.name}: ${reason.message}`;
  }
  if (typeof reason === "number") {
    return `numeric_reason:${reason}`;
  }
  if (typeof reason === "string") {
    return reason;
  }
  try {
    return JSON.stringify(reason);
  } catch {
    return String(reason);
  }
}

process.on("unhandledRejection", (reason) => {
  const formatted = formatUnhandledReason(reason);
  // Keep the process alive and log details instead of crashing on detached async rejections.
  console.error(
    `[UnhandledRejection] Captured rejected promise: ${formatted}`,
  );
});
