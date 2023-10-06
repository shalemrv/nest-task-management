import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersRepository } from 'src/typeorm/repositories/users.repository';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { DbErrorCodes } from 'src/models/db-error-codes';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(UsersRepository) private usersRepository: UsersRepository) {}

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
}
