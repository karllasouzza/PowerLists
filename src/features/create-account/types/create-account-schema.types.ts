import { z } from 'zod/mini';
import { CreateAccountSchema } from '../utils';

export type CreateAccountSchemaType = z.infer<typeof CreateAccountSchema>;
