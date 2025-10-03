import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { sendAlertProcedure } from "./routes/caregiver/send-alert/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  caregiver: createTRPCRouter({
    sendAlert: sendAlertProcedure,
  }),
});

export type AppRouter = typeof appRouter;
