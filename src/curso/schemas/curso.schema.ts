import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({timestamps: true})
export class Curso extends Document {

    @Prop({
        type: String,
        required: true
    })
    grado: string;

    @Prop({
        type: String,
        required: true
    })
    nivel: string;

    @Prop({
        type: String,
        required: true
    })
    paralelo: string;

    @Prop({
        type: String,
        required: true
    })
    jornada: string;

    @Prop({
        type: String
    })
    especialidad: string;

    @Prop({
        type: Number
    })
    orden: number;

    @Prop({
        type: Boolean,
        default: true
    })
    estado: boolean;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    usuario: string;

}

export const CursoSchema = SchemaFactory.createForClass( Curso );
