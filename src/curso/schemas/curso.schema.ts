import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { Document } from "mongoose";
import { User } from "src/auth/schemas/user.schema";

@Schema({timestamps: true})
export class Curso extends Document {

    @ApiProperty({ 
        type: String,
        required: true
    })
    @Prop({
        type: String,
        required: true
    })
    grado: string;

    @ApiProperty({ 
        type: String,
        required: true
    })
    @Prop({
        type: String,
        required: true
    })
    nivel: string;

    @ApiProperty({ 
        type: String,
        required: true
    })
    @Prop({
        type: String,
        required: true
    })
    paralelo: string;

    @ApiProperty({ 
        type: String,
        required: true
    })
    @Prop({
        type: String,
        required: true
    })
    jornada: string;

    @ApiProperty({ 
        type: String,
        required: true
    })
    @Prop({
        type: String
    })
    especialidad: string;

    @ApiProperty({ 
        type: Number,
        required: true
    })
    @Prop({
        type: Number
    })
    orden: number;

    @ApiProperty({ 
        type: Boolean,
        required: true
    })
    @Prop({
        type: Boolean,
        default: true
    })
    estado: boolean;

    @ApiProperty({ 
        type: User,
        required: true
    })
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    usuario: string;

}

export const CursoSchema = SchemaFactory.createForClass( Curso );
