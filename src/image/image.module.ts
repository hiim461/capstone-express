import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    JwtModule.register({}),
    MulterModule.register({
      dest: './public/img', // Đường dẫn lưu trữ các file tải lên
    }),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('image');
  }
}
