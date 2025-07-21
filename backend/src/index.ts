import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import prisma from './lib/prisma';
import userRoutes from './routes/userRoutes';
import { swaggerUi, specs } from './config/swagger';

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア設定
app.use(helmet()); // セキュリティヘッダー
app.use(cors()); // CORS設定
app.use(morgan('combined')); // ログ出力
app.use(express.json()); // JSON解析
app.use(express.urlencoded({ extended: true })); // URL encoded解析

// ルート設定
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API Server is running with Prisma!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ヘルスチェック
app.get('/health', async (req, res) => {
  try {
    // データベース接続確認
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'OK',
      database: 'Connected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'Service Unavailable',
      database: 'Disconnected',
      error: 'Database connection failed'
    });
  }
});

// Swagger UI設定
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Tech Select API Documentation',
}));

// APIルート設定
app.use('/api/users', userRoutes);

// 404ハンドラー
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/users',
      'POST /api/users',
      'GET /api/users/:id',
      'PUT /api/users/:id',
      'DELETE /api/users/:id'
    ]
  });
});

// エラーハンドラー
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// サーバー起動
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🗃️  Database: SQLite`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`🏗️  Architecture: 3-Layer (Controller → Service → Repository)`);
  console.log(`📝 API Endpoints:`);
  console.log(`   GET    /api/users      - 全ユーザー取得`);
  console.log(`   POST   /api/users      - ユーザー作成`);
  console.log(`   GET    /api/users/:id  - ユーザー詳細取得`);
  console.log(`   PUT    /api/users/:id  - ユーザー更新`);
  console.log(`   DELETE /api/users/:id  - ユーザー削除`);
});

// グレースフルシャットダウン
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  server.close(async () => {
    console.log('🔌 HTTP server closed');
    
    try {
      await prisma.$disconnect();
      console.log('🗃️  Database connection closed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  
  server.close(async () => {
    try {
      await prisma.$disconnect();
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });
}); 