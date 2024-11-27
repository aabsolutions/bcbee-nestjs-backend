import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        type: String,
        description: `User email for login and recover access to the system`,
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty({
        type: String,
        description: `The password must have a Uppercase, lowercase letter and a number`,
        minLength: 6,
        maxLength: 50
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        type: String,
        description: `Full name of new user`,
        minLength: 5
    })
    @IsString()
    @MinLength(5)
    fullName: string; 

    @ApiProperty({
        type: [String],
        description: `Roles granted to use the system, new user has a role as 'user' by default`,
        default: ['User'],
        isArray: true
    })
    @IsString({
        each: true
    })
    @IsArray()
    @IsOptional()
    roles?: string[];

    @ApiProperty({
        type: Boolean,
        description: `The state of user, default state is active`,
        default: true
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

}
