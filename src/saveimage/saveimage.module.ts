import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SaveimageService } from './saveimage.service';
import { SaveimageController } from './saveimage.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [SaveimageController],
  providers: [SaveimageService],
})
export class SaveimageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('save-image');
  }
}
