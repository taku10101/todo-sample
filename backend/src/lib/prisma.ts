import { PrismaClient } from '../generated/prisma';

// グローバルPrismaインスタンス管理
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// 開発環境での複数のPrismaインスタンス作成を防ぐ
const prisma = globalThis.__prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

export default prisma; 