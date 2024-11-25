import { IsBoolean, IsEnum, IsIn, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";
import { Especialidades, Grados, Jornadas, Niveles } from "../interfaces/enums-cursos.interface";

export class CreateCursoDto {

    @IsString()
    @IsEnum(Grados, { each: true })
    grado: string;

    @IsString()
    @IsEnum(Niveles, { each: true })
    nivel: string;

    @IsString()
    @MaxLength(1)
    paralelo: string;

    @IsString()
    @IsEnum(Jornadas, { each: true })
    jornada: string;

    @IsString()
    @IsOptional()
    @IsEnum(Especialidades, { each: true })
    especialidad: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    orden: number;

    @IsBoolean()
    @IsOptional()
    estado: boolean;

}
