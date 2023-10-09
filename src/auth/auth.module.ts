import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { User } from '..user.entity';
import { User } from '../typeorm/entities/user.entity';
import { UsersRepository } from '../typeorm/repositories/users.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([User]),
        PassportModule.register({
			defaultStrategy: 'jwt'
		}),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory(configService: ConfigService) {
                return {
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRATION')
                    }
                };
            },
        })
    ],
    exports: [
        JwtStrategy, PassportModule
    ],
    providers: [JwtStrategy, AuthService, UsersRepository],
    controllers: [AuthController],
})
export class AuthModule {}