import * as z from 'zod/mini';

export const CreateAccountSchema = z.object({
  name: z
    .string()
    .check(z.minLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' }), z.trim()),
  email: z.email({ message: 'Email inválido' }),
  password: z
    .string()
    .check(z.minLength(7, { message: 'A senha deve ter pelo menos 7 caracteres' }), z.trim()),
});
