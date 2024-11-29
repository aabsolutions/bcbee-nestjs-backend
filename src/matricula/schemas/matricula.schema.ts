import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

@Schema({timestamps: true})
export class Matricula extends Document{

    @ApiProperty({
        type: String,
        description: `The periodo of matricula`
    })
    @Prop({
        type: String,
        required: true
    })
    periodo: string;

    @ApiProperty({
        type: String,
        description: `The estudiante MongoId of matricula`
    })
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: true
    })
    estudiante: string;

    @ApiProperty({
        type: String,
        description: `The curso MongoId of matricula`
    })
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curso',
        required: true
    })
    curso: string;

    @ApiProperty({
        type: String,
        description: `The user MongoId of matricula`
    })
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    })
    usuario: string;

}
export const MatriculaSchema = SchemaFactory.createForClass( Matricula );
