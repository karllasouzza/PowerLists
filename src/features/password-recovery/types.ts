import * as z from 'zod/mini';
import { PasswordRecoverySchema } from './utils/schema';

export type PasswordRecoverySchemaType = z.infer<typeof PasswordRecoverySchema>;
