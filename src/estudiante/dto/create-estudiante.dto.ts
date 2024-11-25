import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsMongoId, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateEstudianteDto {

    @ApiProperty()
    @IsString()
    @MaxLength(10)
    cedula: string;

    @ApiProperty()
    @IsString()
    apellidos: string;

    @ApiProperty()
    @IsString()
    nombres: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    fecha_nacimiento: Date;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    sexo: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    ciudad: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    direccion: string;

    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    celular: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    img: string;

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    usuario: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    estado: boolean;

}
