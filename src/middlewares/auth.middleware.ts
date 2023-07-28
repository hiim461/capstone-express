import {
  Injectable,
  NestMiddleware,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers.token;
    if (bearerToken) {
      if (typeof bearerToken === 'string') {
        const splitToken = bearerToken.split('Bearer ');
        if (splitToken.length === 2) {
          const token = splitToken[1];
          try {
            const verifyToken = await this.jwtService.verifyAsync(token, {
              secret: this.configService.get('KEY'),
            });
            if (verifyToken) {
              // Lưu thông tin xác thực vào request để sử dụng trong controller
              req['authenticated'] = true;
              req['data'] = verifyToken?.data;
              next();
              return ;
            }
          } catch (error) {
            if (error instanceof TokenExpiredError) {
              throw new HttpException('Token has expire', 403);
            } else {
              if (error instanceof JsonWebTokenError) {
                throw new HttpException(
                  'Unauthorized',
                  HttpStatus.UNAUTHORIZED,
                );
              } else {
                throw new HttpException(
                  'BE error',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                );
              }
            }
          }
        }
      }
    }

    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
