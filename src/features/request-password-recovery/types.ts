import * as z from 'zod/mini';
import { RequestPasswordRecoverySchema } from './utils/schema';

export type RequestPasswordRecoverySchemaType = z.infer<typeof RequestPasswordRecoverySchema>;
