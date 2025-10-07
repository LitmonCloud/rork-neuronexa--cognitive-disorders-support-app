import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const locationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number(),
  timestamp: z.number(),
  address: z.string().optional(),
});

const geofenceEventSchema = z.object({
  patientId: z.string(),
  geofenceId: z.string(),
  geofenceName: z.string(),
  eventType: z.enum(['enter', 'exit']),
  location: locationSchema,
  timestamp: z.number(),
});

export const geofenceEventProcedure = publicProcedure
  .input(geofenceEventSchema)
  .mutation(async ({ input }) => {
    console.log('Geofence event received:', {
      patientId: input.patientId,
      geofenceName: input.geofenceName,
      eventType: input.eventType,
      location: input.location,
    });

    return {
      success: true,
      alertSent: input.eventType === 'exit',
      timestamp: Date.now(),
    };
  });
