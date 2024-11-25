import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class User extends Document{
    
    @Prop({
        type: 'string',
        unique: true,
        required: true
    })
    email: string;

    @Prop({
        type: 'string'
    })    
    fullName: string;

    @Prop({
        type: 'string',
        required: true,
        select: false
    })
    password: string;

    @Prop({
        type: 'bool',
        default: true
    })    
    isActive: boolean;

    @Prop({
        type: [String],
        default: ['user'],

    })
    roles: string[];

}

export const UserSchema = SchemaFactory.createForClass( User );
