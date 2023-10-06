import { Controller, Post, Body } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { LoginCredentialsDto } from './dto/login-credentials.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/sign-up')
    async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return await this.authService.signup(authCredentialsDto);
    }

    @Post('/login')
    async login(@Body() loginCredentialsDto: LoginCredentialsDto) {
        return await this.authService.login(loginCredentialsDto);
    }
}
