import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 シードデータを投入中...');

  // 既存データをクリア
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  // ユーザーを作成
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
    },
  });

  console.log(`✅ ユーザーを作成しました: ${user1.name}, ${user2.name}`);

  // カテゴリを作成
  const category1 = await prisma.category.create({
    data: {
      name: 'テクノロジー',
      slug: 'technology',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'ライフスタイル',
      slug: 'lifestyle',
    },
  });

  console.log(`✅ カテゴリを作成しました: ${category1.name}, ${category2.name}`);

  // 投稿を作成
  const post1 = await prisma.post.create({
    data: {
      title: 'TypeScriptとPrismaの素晴らしい組み合わせ',
      content: 'TypeScriptとPrismaを使用することで、型安全なデータベース操作が可能になります。',
      published: true,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Node.jsバックエンド開発のベストプラクティス',
      content: 'Express、Prisma、TypeScriptを組み合わせたモダンな開発手法について解説します。',
      published: true,
      authorId: user1.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: '効率的なデータベース設計について',
      content: 'Prismaを使用したスキーマ設計とマイグレーション管理のコツ。',
      published: false,
      authorId: user2.id,
    },
  });

  console.log(`✅ 投稿を作成しました: ${post1.title}, ${post2.title}, ${post3.title}`);

  console.log('🎉 シードデータの投入が完了しました！');
}

main()
  .catch((e) => {
    console.error('❌ シードデータの投入中にエラーが発生しました:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 