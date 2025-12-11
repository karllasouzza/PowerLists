import * as z from 'zod/mini';
import { RequestPasswordRecoverySchema } from '../utils';

export type RequestPasswordRecoverySchemaType = z.infer<typeof RequestPasswordRecoverySchema>;
