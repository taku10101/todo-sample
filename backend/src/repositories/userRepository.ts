import { User, Post } from '../generated/prisma';
import prisma from '../lib/prisma';

export interface CreateUserData {
  email: string;
  name?: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
}

export interface UserWithPosts extends User {
  posts: Post[];
}

export class UserRepository {
  // 全ユーザー取得
  async findAll(): Promise<UserWithPosts[]> {
    return await prisma.user.findMany({
      include: {
        posts: true,
      },
    });
  }

  // ID による検索
  async findById(id: string): Promise<UserWithPosts | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });
  }

  // メールアドレスによる検索
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // ユーザー作成
  async create(data: CreateUserData): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  // ユーザー更新
  async update(id: string, data: UpdateUserData): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // ユーザー削除
  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  // ユーザー存在確認
  async exists(id: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { id },
    });
    return count > 0;
  }

  // メールアドレスの重複確認
  async isEmailTaken(email: string, excludeId?: string): Promise<boolean> {
    const where: any = { email };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    
    const count = await prisma.user.count({ where });
    return count > 0;
  }
} 