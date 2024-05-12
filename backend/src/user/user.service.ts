import { CreateUserInput } from './dto/createUser.input';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const { name, email, password } = createUserInput;
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }

  async getUser(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      // findUniqueメソッドでは、schema.prismaで@id(id属性)もしくは@unique(unique属性)を
      // つけたフィールドのみ検索条件（where）として使用可能
      where: { email },
    });
  }
}
