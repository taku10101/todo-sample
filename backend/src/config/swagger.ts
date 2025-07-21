import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tech Select API',
      version: '1.0.0',
      description: 'フルスタック技術選定アプリケーションのAPI',
      contact: {
        name: 'API Support',
        email: 'support@techselect.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: '開発環境',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['email'],
          properties: {
            id: {
              type: 'string',
              description: 'ユーザーID',
              example: 'cklm1234567890',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'メールアドレス',
              example: 'user@example.com',
            },
            name: {
              type: 'string',
              description: 'ユーザー名',
              example: 'John Doe',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '作成日時',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '更新日時',
            },
            posts: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Post',
              },
              description: 'ユーザーの投稿一覧',
            },
          },
        },
        Post: {
          type: 'object',
          required: ['title', 'authorId'],
          properties: {
            id: {
              type: 'string',
              description: '投稿ID',
              example: 'cklm1234567890',
            },
            title: {
              type: 'string',
              description: '投稿タイトル',
              example: 'TypeScript入門',
            },
            content: {
              type: 'string',
              description: '投稿内容',
              example: 'TypeScriptについて解説します...',
              nullable: true,
            },
            published: {
              type: 'boolean',
              description: '公開状態',
              default: false,
            },
            authorId: {
              type: 'string',
              description: '作成者ID',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '作成日時',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '更新日時',
            },
          },
        },
        Category: {
          type: 'object',
          required: ['name', 'slug'],
          properties: {
            id: {
              type: 'string',
              description: 'カテゴリID',
            },
            name: {
              type: 'string',
              description: 'カテゴリ名',
              example: 'テクノロジー',
            },
            slug: {
              type: 'string',
              description: 'スラッグ',
              example: 'technology',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '作成日時',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '更新日時',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'エラーメッセージ',
            },
          },
        },
        CreateUserRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'メールアドレス',
              example: 'user@example.com',
            },
            name: {
              type: 'string',
              description: 'ユーザー名',
              example: 'John Doe',
              nullable: true,
            },
          },
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'メールアドレス',
            },
            name: {
              type: 'string',
              description: 'ユーザー名',
              nullable: true,
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: 'リソースが見つかりません',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        BadRequest: {
          description: '不正なリクエスト',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        InternalServerError: {
          description: 'サーバー内部エラー',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Swaggerドキュメントを含むファイルのパス
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs }; 