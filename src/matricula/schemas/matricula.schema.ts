import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({timestamps: true})
export class Matricula extends Document{

    @Prop({
        type: String,
        required: true
    })
    periodo: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: true
    })
    estudiante: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curso',
        required: true
    })
    curso: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    })
    usuario: string;

}
export const MatriculaSchema = SchemaFactory.createForClass( Matricula );
