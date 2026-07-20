import * as fc from 'fast-check';
import { LoginSchema } from '../utils/schema';

describe('LoginSchema', () => {
  describe('email validation', () => {
    it('should reject empty email', () => {
      const result = LoginSchema.safeParse({ email: '', password: '123456' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid email format', () => {
      const result = LoginSchema.safeParse({ email: 'not-an-email', password: '123456' });
      expect(result.success).toBe(false);
    });

    it('should accept valid email', () => {
      const result = LoginSchema.safeParse({ email: 'test@example.com', password: '123456' });
      expect(result.success).toBe(true);
    });

    it('should accept email with subdomains', () => {
      const result = LoginSchema.safeParse({ email: 'user@mail.example.com', password: '123456' });
      expect(result.success).toBe(true);
    });
  });

  describe('password validation', () => {
    it('should reject empty password', () => {
      const result = LoginSchema.safeParse({ email: 'test@example.com', password: '' });
      expect(result.success).toBe(false);
    });

    it('should reject password shorter than 6 characters', () => {
      const result = LoginSchema.safeParse({ email: 'test@example.com', password: '12345' });
      expect(result.success).toBe(false);
    });

    it('should accept password with exactly 6 characters', () => {
      const result = LoginSchema.safeParse({ email: 'test@example.com', password: '123456' });
      expect(result.success).toBe(true);
    });

    it('should accept long passwords', () => {
      const result = LoginSchema.safeParse({ email: 'test@example.com', password: 'a'.repeat(100) });
      expect(result.success).toBe(true);
    });
  });

  describe('property-based: valid emails are accepted', () => {
    it('should accept all valid email formats from fast-check', () => {
      fc.assert(
        fc.property(
          fc.record({
            email: fc.constantFrom(
              'test@example.com',
              'user@domain.org',
              'name.last@company.co.uk',
              'test+tag@example.com',
            ),
            password: fc.string({ minLength: 6, maxLength: 50 }),
          }),
          (data) => {
            const result = LoginSchema.safeParse(data);
            expect(result.success).toBe(true);
          },
        ),
      );
    });
  });

  describe('property-based: invalid emails are rejected', () => {
    it('should reject emails without @ symbol', () => {
      fc.assert(
        fc.property(
          fc.record({
            email: fc.constantFrom('testexample.com', 'user.domain.com', 'name@'),
            password: fc.constant('123456'),
          }),
          (data) => {
            const result = LoginSchema.safeParse(data);
            expect(result.success).toBe(false);
          },
        ),
      );
    });
  });

  describe('property-based: short passwords are rejected', () => {
    it('should reject passwords shorter than 6 characters', () => {
      fc.assert(
        fc.property(
          fc.record({
            email: fc.constant('test@example.com'),
            password: fc.string({ maxLength: 5 }),
          }),
          (data) => {
            const result = LoginSchema.safeParse(data);
            expect(result.success).toBe(false);
          },
        ),
      );
    });
  });
});
