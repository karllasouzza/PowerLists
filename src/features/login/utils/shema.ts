import * as z from 'zod/mini';

export const LoginSchema = z.object({
  email: z.email({ message: 'Email inválido' }),
  password: z
    .string()
    .check(z.minLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' }), z.trim()),
});
