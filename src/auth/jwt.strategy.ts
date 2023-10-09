import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./dto/jwt-payload.interface";

import { User } from "../typeorm/entities/user.entity";
import { UsersRepository } from "../typeorm/repositories/users.repository";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const {id, username} = payload;
        
        const user = await this.usersRepository.findOneBy({id, username});

        if (!user)
            throw new UnauthorizedException('You are not authorized to make this request');

        return user;
    }
}