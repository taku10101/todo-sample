import { User } from '../generated/prisma';
import { 
  UserRepository, 
  UserWithPosts, 
  CreateUserData, 
  UpdateUserData 
} from '../repositories/userRepository';

export interface UserServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // 全ユーザー取得
  async getAllUsers(): Promise<UserServiceResult<UserWithPosts[]>> {
    try {
      const users = await this.userRepository.findAll();
      return {
        success: true,
        data: users,
      };
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
      return {
        success: false,
        error: 'ユーザーの取得に失敗しました',
        statusCode: 500,
      };
    }
  }

  // ユーザー詳細取得
  async getUserById(id: string): Promise<UserServiceResult<UserWithPosts>> {
    try {
      if (!id || typeof id !== 'string') {
        return {
          success: false,
          error: '有効なユーザーIDを指定してください',
          statusCode: 400,
        };
      }

      const user = await this.userRepository.findById(id);
      
      if (!user) {
        return {
          success: false,
          error: 'ユーザーが見つかりません',
          statusCode: 404,
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      console.error('ユーザー詳細取得エラー:', error);
      return {
        success: false,
        error: 'ユーザーの詳細取得に失敗しました',
        statusCode: 500,
      };
    }
  }

  // ユーザー作成
  async createUser(userData: CreateUserData): Promise<UserServiceResult<User>> {
    try {
      // バリデーション
      if (!userData.email) {
        return {
          success: false,
          error: 'メールアドレスは必須です',
          statusCode: 400,
        };
      }

      // メールアドレス形式チェック
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return {
          success: false,
          error: '有効なメールアドレスを入力してください',
          statusCode: 400,
        };
      }

      // 重複チェック
      const isEmailTaken = await this.userRepository.isEmailTaken(userData.email);
      if (isEmailTaken) {
        return {
          success: false,
          error: 'このメールアドレスは既に使用されています',
          statusCode: 400,
        };
      }

      const user = await this.userRepository.create(userData);
      return {
        success: true,
        data: user,
      };
    } catch (error: any) {
      console.error('ユーザー作成エラー:', error);
      
      // Prismaエラーハンドリング
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'このメールアドレスは既に使用されています',
          statusCode: 400,
        };
      }

      return {
        success: false,
        error: 'ユーザーの作成に失敗しました',
        statusCode: 500,
      };
    }
  }

  // ユーザー更新
  async updateUser(id: string, userData: UpdateUserData): Promise<UserServiceResult<User>> {
    try {
      // バリデーション
      if (!id || typeof id !== 'string') {
        return {
          success: false,
          error: '有効なユーザーIDを指定してください',
          statusCode: 400,
        };
      }

      // ユーザー存在確認
      const userExists = await this.userRepository.exists(id);
      if (!userExists) {
        return {
          success: false,
          error: 'ユーザーが見つかりません',
          statusCode: 404,
        };
      }

      // メールアドレス形式チェック
      if (userData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
          return {
            success: false,
            error: '有効なメールアドレスを入力してください',
            statusCode: 400,
          };
        }

        // メールアドレス重複チェック（自分以外）
        const isEmailTaken = await this.userRepository.isEmailTaken(userData.email, id);
        if (isEmailTaken) {
          return {
            success: false,
            error: 'このメールアドレスは既に使用されています',
            statusCode: 400,
          };
        }
      }

      const user = await this.userRepository.update(id, userData);
      return {
        success: true,
        data: user,
      };
    } catch (error: any) {
      console.error('ユーザー更新エラー:', error);
      
      // Prismaエラーハンドリング
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'ユーザーが見つかりません',
          statusCode: 404,
        };
      }
      
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'このメールアドレスは既に使用されています',
          statusCode: 400,
        };
      }

      return {
        success: false,
        error: 'ユーザーの更新に失敗しました',
        statusCode: 500,
      };
    }
  }

  // ユーザー削除
  async deleteUser(id: string): Promise<UserServiceResult<void>> {
    try {
      if (!id || typeof id !== 'string') {
        return {
          success: false,
          error: '有効なユーザーIDを指定してください',
          statusCode: 400,
        };
      }

      // ユーザー存在確認
      const userExists = await this.userRepository.exists(id);
      if (!userExists) {
        return {
          success: false,
          error: 'ユーザーが見つかりません',
          statusCode: 404,
        };
      }

      await this.userRepository.delete(id);
      return {
        success: true,
      };
    } catch (error: any) {
      console.error('ユーザー削除エラー:', error);
      
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'ユーザーが見つかりません',
          statusCode: 404,
        };
      }

      return {
        success: false,
        error: 'ユーザーの削除に失敗しました',
        statusCode: 500,
      };
    }
  }
} 