import { Injectable, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from "bcryptjs" 

@Injectable()
export class UserService {
  prisma = new PrismaClient();
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async getUser(userInfo) {
    try {
      throw new HttpException(
        {
          mess: { data: userInfo, message: 'Successful', statusCode: 200 },
          code: 200,
        },
        200,
      );
    } catch (ex) {
      throw new HttpException(
        ex.response.mess,
        ex.status != 500 ? ex.response.code : 500,
      );
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const newUser = {...updateUserDto, mat_khau: bcrypt.hashSync(updateUserDto.mat_khau,10)}
      const {mat_khau:pw, ...newU} = newUser
      const data = await this.prisma.nguoi_dung.update({
        data: newU,
        where: { nguoi_dung_id: id },
      });
      throw new HttpException(
        {
          mess: { data:newU, message: 'Update successful', statusCode: 200 },
          code: 200,
        },
        200,
      );
    } catch (ex) {
      throw new HttpException(
        ex.response.mess,
        ex.status != 500 ? ex.response.code : 500,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
