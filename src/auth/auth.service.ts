import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist';
import { PrismaClient } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  prisma = new PrismaClient();
  async login(userLogin: LoginDto) {
    try {
      const user = await this.prisma.nguoi_dung.findFirst({
        where: {
          email: userLogin.email,
        },
      });
      if (!user) {
        throw new HttpException(
          { message: `No user found for email: ${userLogin.email}`, code: 404 },
          404,
        );
      } else {
        if (bcrypt.compareSync(userLogin.mat_khau, user.mat_khau)) {
          try {
            const token = await this.jwtService.signAsync(
              { data: user },
              { secret: this.configService.get('KEY'), expiresIn: '200m' },
            );
            const { mat_khau: pw, ...usWithoutPw } = user;
            throw new HttpException(
              {
                message: {
                  data: { user: usWithoutPw, token: `Bearer ${token}` },
                  message: 'Login successful',
                  statusCode: 200,
                },
                code: 200,
              },
              200,
            );
          } catch (error) {
            throw error;
          }
        } else {
          throw new HttpException(
            { message: 'Invalid password', code: 400 },
            400,
          );
        }
      }
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.status != 500 ? error.response.code : 500,
      );
    }
  }
  async signUp(userSignUp) {
    try {
      const { email, mat_khau }: SignUpDto = userSignUp;
      const checkUser = await this.prisma.nguoi_dung.findFirst({
        where: {
          email: email,
        },
      });
      if (checkUser) {
        throw new HttpException(
          { message: 'Email already exists', code: 409 },
          409,
        );
      } else {
        try {
          const newUser = {
            ...userSignUp,
            mat_khau: bcrypt.hashSync(mat_khau, 10),
          };
          const us = await this.prisma.nguoi_dung.create({ data: newUser });
          const { mat_khau: pw, ...newUserWithoutPw } = us;
          throw new HttpException(
            {
              message: {
                data: { user: newUserWithoutPw },
                message: 'Registration successful',
                statusCode: 200,
              },
              code: 200,
            },
            200,
          );
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      throw new HttpException(
        error.response.message,
        error.status != 500 ? error.response.code : 500,
      );
    }
  }
}
