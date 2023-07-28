import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger/dist';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginEntity, SignUpEntity } from './entities/auth.entity';
import { SignUpDto } from './dto/signUp.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @ApiBody({
    description: 'login info',
    type: LoginEntity,
  })
  @Post('/login')
  login(@Body() { email, mat_khau }: LoginDto) {
    const userLogin = { email, mat_khau };
    return this.authService.login(userLogin);
  }

  @HttpCode(200)
  @ApiBody({
    description: 'sign-up info',
    type: SignUpEntity,
  })
  @Post('/sign-up')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }
}
