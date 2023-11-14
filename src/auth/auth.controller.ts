import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Get('/throttle-test')
    getTest() {
        return {
            message: 'This is a testing route for Throttler'
        };
    }

    @SkipThrottle()
    @Get('/throttle-skip')
    throttleSkip() {
        return {
            message: 'Throttler is turned off for this route. Go nuts !!!'
        };
    }

    @Post('/sign-up')
    async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return await this.authService.signup(authCredentialsDto);
    }

    @Post('/login')
    async login(@Body() loginCredentialsDto: LoginCredentialsDto) {
        return await this.authService.login(loginCredentialsDto);
    }

    @Post('/test-guard')
    @UseGuards(AuthGuard())
    test(@Req() req) {
        console.log(req);
        return `YAY !!! You're authenticated !!!`;
    }
}
