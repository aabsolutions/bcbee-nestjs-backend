import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateMatriculaDto {

    @ApiProperty({
        type: String,
        description: `Periodo of matricula`
    })
    @IsString()
    periodo: string;

    @ApiProperty({
        type: String,
        description: `Valid MongoId of estudiante for matricula`
    })
    @IsString()
    estudiante: string;

    @ApiProperty({
        type: String,
        description: `Valid MongoId of curso for matricula`
    })
    @IsString()
    curso: string;

}
