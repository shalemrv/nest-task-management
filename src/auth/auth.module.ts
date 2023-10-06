import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/typeorm/entities/user.entity';
import { UsersRepository } from 'src/typeorm/repositories/users.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    providers: [AuthService, UsersRepository],
    controllers: [AuthController],
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    exports: []
})
export class AuthModule {}
