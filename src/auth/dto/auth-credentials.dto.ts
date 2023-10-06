import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(6)
    @MaxLength(30)
    // @Matches(
    //     /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //         message: 'Password must have at least 1 uppercase, 1 lowercase and 1 special character'
    //     }
    // )
    password: string;

    /*
        @Matches(
            /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
                message: 'Password must have at least 1 uppercase, 1 lowercase and 1 special character'
            }
        )
    */
}