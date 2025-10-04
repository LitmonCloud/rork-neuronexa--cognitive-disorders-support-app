import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { sendAlertProcedure } from "./routes/caregiver/send-alert/route";
import { sendPushProcedure } from "./routes/notifications/send-push/route";
import { caregiverAlertProcedure } from "./routes/notifications/caregiver-alert/route";
import { batchSendProcedure } from "./routes/notifications/batch-send/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  caregiver: createTRPCRouter({
    sendAlert: sendAlertProcedure,
  }),
  notifications: createTRPCRouter({
    sendPush: sendPushProcedure,
    caregiverAlert: caregiverAlertProcedure,
    batchSend: batchSendProcedure,
  }),
});

export type AppRouter = typeof appRouter;
