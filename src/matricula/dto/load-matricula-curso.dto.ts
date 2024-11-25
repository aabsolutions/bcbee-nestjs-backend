import { IsArray, IsString } from "class-validator";
import { Estudiante } from "src/estudiante/schemas/estudiante.schema";

export class LoadMatriculaCursoDto {

    @IsString()
    periodo: string;

    @IsString()
    curso: string;

    @IsArray()
    estudiantes: Estudiante[]

}
