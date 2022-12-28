import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';
import { CreateUserDto } from '@dtos/users.dto';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'User created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const { tokenData } = await this.authService.login(userData);

      // res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: tokenData, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: DataStoredInToken = req.user;
      const logOutUserData: DataStoredInToken = await this.authService.logout(userData);

      // res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
