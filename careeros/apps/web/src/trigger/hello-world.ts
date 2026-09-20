import { task, logger, wait } from "@trigger.dev/sdk";

export const helloWorldTask = task({
  id: "hello-world",
  maxDuration: 60,
  run: async (payload: { message?: string } = {}) => {
    logger.info("AuraCareer AI Background Worker is alive!", { payload });
    await wait.for({ seconds: 2 });
    return {
      success: true,
      message: payload.message || "Hello from Trigger.dev in AuraCareer AI!",
      timestamp: new Date().toISOString(),
    };
  },
});
