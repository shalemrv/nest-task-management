import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { User } from 'src/typeorm/entities/user.entity';
import { UsersRepository } from 'src/typeorm/repositories/users.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    providers: [AuthService, UsersRepository],
    controllers: [AuthController],
    imports: [
        PassportModule.register({
			defaultStrategy: 'jwt'
		}),
		JwtModule.register({
			secret: 'SECRET_HERE',
			signOptions: {
				expiresIn: 3600
			}
		}),
        TypeOrmModule.forFeature([User])
    ],
    exports: []
})
export class AuthModule {}
