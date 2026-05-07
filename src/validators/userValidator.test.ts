// TESTS DONE BY JUSTIN COATS

import { CreateUserSchema } from './userValidator';

describe('CreateUserSchema', () => {
  it('should pass with valid input', () => {
    const result = CreateUserSchema.safeParse({
      email: 'test@example.com',
      displayName: 'longusername',
      password: 'password123',
    });

    expect(result.success).toBe(true);
  });

  it('should fail with invalid email', () => {
    const result = CreateUserSchema.safeParse({
      email: 'bad-email',
      displayName: 'longusername',
      password: 'password123',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address');
    }
  });

  it('should fail when displayName is too short', () => {
    const result = CreateUserSchema.safeParse({
      email: 'test@example.com',
      displayName: 'short',
      password: 'password123',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Username must be 8 characters');
    }
  });

  it('should fail when password is too short', () => {
    const result = CreateUserSchema.safeParse({
      email: 'test@example.com',
      displayName: 'longusername',
      password: 'short',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be 8 characters');
    }
  });
});
