import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ImageController],
  providers: [ImageService]
})
export class ImageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('image');
  }
}
