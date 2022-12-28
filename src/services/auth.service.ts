import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { isEmpty } from '@utils/util';

class AuthService {
  public users = new PrismaClient().user;

  public async signup(userData: CreateUserDto) {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await this.users.findUnique({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData = this.users.create({ data: { ...userData, password: hashedPassword },select: {
      id:true,
      email: true,
      name: true,
    }, });

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{tokenData: TokenData} > {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await this.users.findUnique({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

    const tokenData = this.createToken(findUser);

    const updateUser = await this.users.update({
      where: {
        id: findUser.id
      },
      data: {
        jwt_token: tokenData.token
      }
    })
    return { tokenData };
  }

  public async logout(userData: DataStoredInToken): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await this.users.findFirst({ where: { email: userData.email} });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id, email: user.email, name: user.name };
    const secretKey: string = SECRET_KEY;

    return { token: sign(dataStoredInToken, secretKey) };
  }

}

export default AuthService;
