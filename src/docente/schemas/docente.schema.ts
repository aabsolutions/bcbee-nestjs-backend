import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import * as mongoose from 'mongoose';

import { User } from "src/auth/schemas/user.schema";
import { MaxLength } from 'class-validator';

@Schema({timestamps: true})
export class Docente extends Document{

    @ApiProperty({
        type: String,
        description: `The xxx of docente`,
        maxLength: 10
    })
    @Prop({
        type: String,
        required: true,
        unique: true,
        maxlength: 10
    })
    cedula: string;

    @ApiProperty({
        type: String,
        description: `The xxx of docente`
    })
    @Prop({
        type: String,
        required: true
    })
    apellidos: string;
    
    @ApiProperty({
        type: String,
        description: `The xxx of docente`
    })
    @Prop({
        type: String,
        required: true
    })
    nombres: string;
    
    @ApiProperty({
        type: Date,
        description: `The xxx of docente`
    })
    @Prop({
        type: Date
    })
    fecha_nacimiento: Date;
    
    @ApiProperty({
        type: Number,
        description: `The xxx of docente`
    })
    @Prop({
        type: Number
    })
    sexo: number;
    
    @ApiProperty({
        type: String,
        description: `The xxx of docente`
    })
    @Prop({
        type: String
    })
    ciudad: string;
    
    @ApiProperty({
        type: String,
        description: `The xxx of docente`
    })
    @Prop({
        type: String
    })
    direccion: string;
    
    @ApiProperty({
        type: String,
        description: `The xxx of docente`
    })
    @Prop({
        type: String
    })
    email: string;

    @ApiProperty({
        type: String,
        description: `The xxx of docente`
    })
    @Prop({
        type: String
    })
    email_institucional: string;
    
    @ApiProperty({
        type: String,
        description: `The xxx of docente`,
        minLength: 10
    })
    @Prop({
        type: String,
        minlength: 10
    })
    celular: string;

    @ApiProperty({
        type: String,
        description: `The xxx of docente`,
        minLength: 10
    })
    @Prop({
        type: String,
        minlength: 10
    })
    celular_urg: string;
    
    @ApiProperty({
        type: String,
        description: `The xxx of docente`
    })
    @Prop({
        type: String
    })
    img: string;
    
    @ApiProperty({
        type: Boolean,
        description: `The xxx of docente`
    })
    @Prop({
        type: Boolean,
        default: true
    })
    estado: boolean;

    @ApiProperty({
        type: User,
        description: `The xxx of docente`
    })
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    usuario: string;
}

export const DocenteSchema = SchemaFactory.createForClass( Docente );
