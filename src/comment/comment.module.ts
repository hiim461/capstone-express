import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  imports:[JwtModule.register({})],
  controllers: [CommentController],
  providers: [CommentService]
})

export class CommentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('comment');
  }
}