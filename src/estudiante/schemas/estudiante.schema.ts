import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import * as mongoose from 'mongoose';
import { Document } from "mongoose";

@Schema({timestamps: true})
export class Estudiante extends Document{

    @Prop({
        type: String,
        required: true,
        unique: true
    })
    cedula: string;

    @Prop({
        type: String,
        required: true
    })
    apellidos: string;
    
    @Prop({
        type: String,
        required: true
    })
    nombres: string;
    
    @Prop({
        type: Date
    })
    fecha_nacimiento: string;
    
    @Prop({
        type: Number
    })
    sexo: number;
    
    @Prop({
        type: String
    })
    ciudad: string;
    
    @Prop({
        type: String
    })
    direccion: string;
    
    @Prop({
        type: String
    })
    email: string;
    
    @Prop({
        type: String
    })
    celular: string;
    
    @Prop({
        type: String
    })
    img: string;
    
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

export const EstudianteSchema = SchemaFactory.createForClass( Estudiante );
