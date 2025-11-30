import * as z from 'zod/mini';
import { PasswordRecoverySchema } from '../utils';

export type PasswordRecoverySchemaType = z.infer<typeof PasswordRecoverySchema>;
