import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const locationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number(),
  timestamp: z.number(),
  address: z.string().optional(),
});

const updateLocationSchema = z.object({
  patientId: z.string(),
  location: locationSchema,
  batteryLevel: z.number().optional(),
  isMoving: z.boolean(),
});

export const updateLocationProcedure = publicProcedure
  .input(updateLocationSchema)
  .mutation(async ({ input }) => {
    console.log('Location update received:', {
      patientId: input.patientId,
      location: input.location,
      batteryLevel: input.batteryLevel,
      isMoving: input.isMoving,
    });

    return {
      success: true,
      timestamp: Date.now(),
    };
  });
