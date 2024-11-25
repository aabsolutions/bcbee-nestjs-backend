import { IsString } from "class-validator";

export class CreateMatriculaDto {

    @IsString()
    periodo: string;

    @IsString()
    estudiante: string;

    @IsString()
    curso: string;

}
