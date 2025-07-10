import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { ApiProperty } from "@nestjs/swagger";
import * as mongoose from 'mongoose';
import { Document } from "mongoose";
import { User } from "src/auth/schemas/user.schema";

@Schema({timestamps: true})
export class Servidor extends Document{

    @ApiProperty({
        type: String,
        description: `La cédula de servidor`,
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
        description: `Los apellidos de servidor`
    })
    @Prop({
        type: String,
        required: true
    })
    apellidos: string;
    
    @ApiProperty({
        type: String,
        description: `Los nombres de servidor`
    })
    @Prop({
        type: String,
        required: true
    })
    nombres: string;
    
    @ApiProperty({
        type: Date,
        description: `La fecha de nacimiento de servidor`
    })
    @Prop({
        type: Date
    })
    fecha_nacimiento: Date;
    
    @ApiProperty({
        type: Number,
        description: `El sexo de servidor`
    })
    @Prop({
        type: Number
    })
    sexo: number;
        
    @ApiProperty({
        type: String,
        description: `La dirección de servidor`
    })
    @Prop({
        type: String
    })
    direccion: string;
    
    @ApiProperty({
        type: String,
        description: `El email de servidor`
    })
    @Prop({
        type: String
    })
    email: string;
    
    @ApiProperty({
        type: String,
        description: `El celular de servidor`
    })
    @Prop({
        type: String
    })
    celular: string;
    
    @ApiProperty({
        type: String,
        description: `La imagen de servidor`
    })
    @Prop({
        type: String
    })
    img: string;
    
    @ApiProperty({
        type: Boolean,
        description: `El estado de servidor`
    })
    @Prop({
        type: Boolean,
        default: true
    })
    estado: boolean;

    @ApiProperty({
        type: User,
        description: `El usuario de creación/modificación de servidor`
    })
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    usuario: string;
}

export const ServidorSchema = SchemaFactory.createForClass( Servidor );

ServidorSchema.pre('save', function(next) {
    
    this.nombres             = this.nombres.trim().toLowerCase();
    this.apellidos           = this.apellidos.trim().toLowerCase();
    next();
    
});

ServidorSchema.pre('findOneAndUpdate', function(next) {
    const servidor: any = this.getUpdate();
    if( servidor.nombres ) servidor.nombres = servidor.nombres.trim().toLowerCase();
    if( servidor.apellidos ) servidor.apellidos = servidor.apellidos.trim().toLowerCase();
    if( servidor.direccion ) servidor.direccion = servidor.direccion.trim().toLowerCase();
    if( servidor.email ) servidor.email = servidor.email.trim().toLowerCase();
    next();
});
