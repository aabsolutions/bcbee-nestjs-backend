import { IsBoolean, IsEnum, IsIn, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";
import { Especialidades, Grados, Jornadas, Niveles } from "../interfaces/enums-cursos.interface";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCursoDto {

    @ApiProperty({ enum: Grados, description: `Name of course`})
    @IsString()
    @IsEnum(Grados, { each: true })
    grado: string;

    @ApiProperty({ enum: Niveles, description: `Level of education of course`})
    @IsString()
    @IsEnum(Niveles, { each: true })
    nivel: string;

    @ApiProperty({
        type: String,
        description: `Letter asignated to paralelo`,
        examples: ['A', 'B', 'C'],
        maxLength: 1
    })
    @IsString()
    @MaxLength(1)
    paralelo: string;

    @ApiProperty({ enum: Jornadas, description: `Jornada of course`})
    @IsString()
    @IsEnum(Jornadas, { each: true })
    jornada: string;

    @ApiProperty({ enum: Especialidades, description: `Especialidad of course`})
    @IsString()
    @IsOptional()
    @IsEnum(Especialidades, { each: true })
    especialidad: string;

    @ApiProperty({
        type: Number,
        description: `Order to sort`,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    orden: number;

    @ApiProperty({
        type: Boolean,
        description: `Status of the curso, by default is true`,
    })
    @IsBoolean()
    @IsOptional()
    estado: boolean;

}
