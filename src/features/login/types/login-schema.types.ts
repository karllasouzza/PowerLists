import { z } from 'zod/mini';
import { LoginSchema } from '../utils';

export type LoginSchemaType = z.infer<typeof LoginSchema>;
