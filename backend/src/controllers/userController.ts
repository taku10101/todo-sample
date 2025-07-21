import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    
    // メソッドのバインド
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: 全ユーザー取得
   *     description: 登録されている全てのユーザーを投稿情報と共に取得します
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: ユーザー一覧の取得に成功
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async getAllUsers(req: Request, res: Response): Promise<Response> {
    const result = await this.userService.getAllUsers();
    
    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        error: result.error,
      });
    }

    return res.status(200).json(result.data);
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: ユーザー詳細取得
   *     description: 指定されたIDのユーザー詳細情報を投稿情報と共に取得します
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ユーザーID
   *         example: "cklm1234567890"
   *     responses:
   *       200:
   *         description: ユーザー詳細の取得に成功
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async getUserById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        error: '有効なユーザーIDを指定してください',
      });
    }
    
    const result = await this.userService.getUserById(id);
    
    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        error: result.error,
      });
    }

    return res.status(200).json(result.data);
  }

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: ユーザー作成
   *     description: 新しいユーザーを作成します
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserRequest'
   *     responses:
   *       201:
   *         description: ユーザーの作成に成功
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async createUser(req: Request, res: Response): Promise<Response> {
    const userData = req.body;
    const result = await this.userService.createUser(userData);
    
    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        error: result.error,
      });
    }

    return res.status(201).json(result.data);
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: ユーザー更新
   *     description: 指定されたIDのユーザー情報を更新します
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ユーザーID
   *         example: "cklm1234567890"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserRequest'
   *     responses:
   *       200:
   *         description: ユーザーの更新に成功
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async updateUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        error: '有効なユーザーIDを指定してください',
      });
    }
    
    const userData = req.body;
    const result = await this.userService.updateUser(id, userData);
    
    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        error: result.error,
      });
    }

    return res.status(200).json(result.data);
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: ユーザー削除
   *     description: 指定されたIDのユーザーを削除します（関連する投稿も削除されます）
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ユーザーID
   *         example: "cklm1234567890"
   *     responses:
   *       204:
   *         description: ユーザーの削除に成功
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async deleteUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        error: '有効なユーザーIDを指定してください',
      });
    }
    
    const result = await this.userService.deleteUser(id);
    
    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        error: result.error,
      });
    }

    return res.status(204).send();
  }
} 