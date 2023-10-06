import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'src/typeorm/entities/user.entity';
import { AuthCredentialsDto } from "src/auth/dto/auth-credentials.dto";


@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(private datasorce: DataSource) {
        super(User, datasorce.createEntityManager());
    }

    private async getPasswordHash(password: string): Promise<string> {
        return await bcrypt.hash(
            password,
            await bcrypt.genSalt()
        );
    }

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<string | void> {
        
        const { username, password } = authCredentialsDto;

        const createdUser = this.create({
            username,
            password: await this.getPasswordHash(password)
        });

        try {
            await this.save(createdUser);
        } catch (error) {
            return error.code;
        }

        return;
    }
}