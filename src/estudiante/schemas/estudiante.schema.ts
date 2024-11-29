import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { ApiProperty } from "@nestjs/swagger";
import * as mongoose from 'mongoose';
import { Document } from "mongoose";
import { User } from "src/auth/schemas/user.schema";

@Schema({timestamps: true})
export class Estudiante extends Document{

    @ApiProperty({
        type: String,
        description: `The xxx of estudiante`,
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
        description: `The xxx of estudiante`
    })
    @Prop({
        type: String,
        required: true
    })
    apellidos: string;
    
    @ApiProperty({
        type: String,
        description: `The xxx of estudiante`
    })
    @Prop({
        type: String,
        required: true
    })
    nombres: string;
    
    @ApiProperty({
        type: Date,
        description: `The xxx of `
    })
    @Prop({
        type: Date
    })
    fecha_nacimiento: Date;
    
    @ApiProperty({
        type: Number,
        description: `The xxx of `
    })
    @Prop({
        type: Number
    })
    sexo: number;
    
    @ApiProperty({
        type: String,
        description: `The xxx of `
    })
    @Prop({
        type: String
    })
    ciudad: string;
    
    @ApiProperty({
        type: String,
        description: `The xxx of `
    })
    @Prop({
        type: String
    })
    direccion: string;
    
    @ApiProperty({
        type: String,
        description: `The xxx of `
    })
    @Prop({
        type: String
    })
    email: string;
    
    @ApiProperty({
        type: String,
        description: `The xxx of `
    })
    @Prop({
        type: String
    })
    celular: string;
    
    @ApiProperty({
        type: String,
        description: `The xxx of `
    })
    @Prop({
        type: String
    })
    img: string;
    
    @ApiProperty({
        type: Boolean,
        description: `The xxx of `
    })
    @Prop({
        type: Boolean,
        default: true
    })
    estado: boolean;

    @ApiProperty({
        type: User,
        description: `The xxx of `
    })
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    usuario: string;
}

export const EstudianteSchema = SchemaFactory.createForClass( Estudiante );

EstudianteSchema.pre('save', function(next) {
    
    this.nombres             = this.nombres.trim().toLowerCase();
    this.apellidos           = this.apellidos.trim().toLowerCase();
    this.direccion           = this.direccion.trim().toLowerCase();
    this.ciudad              = this.ciudad.trim().toLowerCase();
    this.email               = this.email.trim().toLowerCase();
    next();
    
});

EstudianteSchema.pre('findOneAndUpdate', function(next) {
    const estudiante: any = this.getUpdate();
    if( estudiante.nombres ) estudiante.nombres = estudiante.nombres.trim().toLowerCase();
    if( estudiante.apellidos ) estudiante.apellidos = estudiante.apellidos.trim().toLowerCase();
    if( estudiante.direccion ) estudiante.direccion = estudiante.direccion.trim().toLowerCase();
    if( estudiante.ciudad ) estudiante.ciudad = estudiante.ciudad.trim().toLowerCase();
    if( estudiante.email ) estudiante.email = estudiante.email.trim().toLowerCase();
    next();
});
