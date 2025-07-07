import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// 全ユーザー取得
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    res.status(500).json({ error: 'ユーザーの取得に失敗しました' });
  }
});

// ユーザー詳細取得
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    res.json(user);
  } catch (error) {
    console.error('ユーザー詳細取得エラー:', error);
    res.status(500).json({ error: 'ユーザーの詳細取得に失敗しました' });
  }
});

// ユーザー作成
router.post('/', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'メールアドレスは必須です' });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    res.status(201).json(user);
  } catch (error: any) {
    console.error('ユーザー作成エラー:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'このメールアドレスは既に使用されています' });
    } else {
      res.status(500).json({ error: 'ユーザーの作成に失敗しました' });
    }
  }
});

// ユーザー更新
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        email,
        name,
      },
    });

    res.json(user);
  } catch (error: any) {
    console.error('ユーザー更新エラー:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'ユーザーが見つかりません' });
    } else if (error.code === 'P2002') {
      res.status(400).json({ error: 'このメールアドレスは既に使用されています' });
    } else {
      res.status(500).json({ error: 'ユーザーの更新に失敗しました' });
    }
  }
});

// ユーザー削除
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('ユーザー削除エラー:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'ユーザーが見つかりません' });
    } else {
      res.status(500).json({ error: 'ユーザーの削除に失敗しました' });
    }
  }
});

export default router; 