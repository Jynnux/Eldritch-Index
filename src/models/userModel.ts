import argon2 from 'argon2';
import { AppDataSource } from '../dataSource.js';
import { User } from '../entities/userEntity.js';

export const userModel = {
  async createUser(email: string, displayName: string, password: string) {
    const repo = AppDataSource.getRepository(User);
    const passHash = await argon2.hash(password);
    // create the user for db
    const user = repo.create({ email, displayName, passwordHash: passHash });
    // return the user
    return await repo.save(user);
  },
  async getUserByEmail(email: string) {
    const repo = AppDataSource.getRepository(User);
    return await repo.findOne({
      where: { email },
    });
  },
  async getUserById(id: string) {
    const repo = AppDataSource.getRepository(User);
    return await repo.findOne({ where: { id } });
  },
  async deleteUserById(userId: string) {
    const repo = AppDataSource.getRepository(User);
    return await repo.delete({ id: userId });
  },
};
