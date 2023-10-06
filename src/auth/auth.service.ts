import {
    Injectable,
    ConflictException,
    BadRequestException,
    InternalServerErrorException
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/typeorm/entities/user.entity';
import { UsersRepository } from 'src/typeorm/repositories/users.repository';

import { DbErrorCodes } from 'src/models/db-error-codes';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { JwtPayload } from './dto/jwt-payload.interface';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private jwtService: JwtService
    ) {}

    async signup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const userCreation = await this.usersRepository.createUser(authCredentialsDto);
        
        if (userCreation != null) {

            switch (userCreation) {
                case DbErrorCodes.mysql.duplicate:
                    throw new ConflictException('Username already taken.');

                default: throw new InternalServerErrorException('Something went wrong. Unable to sign up');
            }
        }
    }

    async login(loginCredentialsDto: LoginCredentialsDto): Promise<{accessToken: string}> {

        const { username, password } = loginCredentialsDto;

        const user = await this.usersRepository.findOneBy({ username });
        
        if (!user || !await bcrypt.compare(password, user.password))
            throw new BadRequestException('Invalid Username and/or Password');

        const payload: JwtPayload = {
            username,
            id: user.id
        }

        const accessToken: string = this.jwtService.sign(payload);

        return { accessToken };
    }
}
 