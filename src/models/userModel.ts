import argon2 from 'argon2';
import { AppDataSource } from '../dataSource.js';
import { User } from '../entities/userEntity.js';

export const userModel = {
  async register(email: string, password: string) {
    const repo = AppDataSource.getRepository(User);
    const passHash = await argon2.hash(password);

    const user = repo.create({ email, passwordHash: passHash });
    return await repo.save(user);
  },
};
