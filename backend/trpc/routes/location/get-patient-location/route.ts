import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const getPatientLocationSchema = z.object({
  patientId: z.string(),
});

export const getPatientLocationProcedure = publicProcedure
  .input(getPatientLocationSchema)
  .query(async ({ input }) => {
    console.log('Fetching location for patient:', input.patientId);

    return {
      patientId: input.patientId,
      location: null,
      lastUpdate: Date.now(),
      isTracking: false,
      geofenceAlerts: [],
    };
  });
