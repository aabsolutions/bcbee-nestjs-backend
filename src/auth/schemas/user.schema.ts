import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class User extends Document{
    
    
    @ApiProperty({
        type: String,
        description: `User email for login and recover access to the system`,
    })
    @Prop({
        type: 'string',
        unique: true,
        required: true
    })
    email: string;

    @ApiProperty({
        type: String,
        description: `Full name of new user`,
        minLength: 5
    })
    @Prop({
        type: 'string'
    })    
    fullName: string;

    @ApiProperty({
        type: String,
        description: `The password must have a Uppercase, lowercase letter and a number`,
        minLength: 6,
        maxLength: 50
    })
    @Prop({
        type: 'string',
        required: true,
        select: false
    })
    password: string;

    @ApiProperty({
        type: Boolean,
        description: `The state of user, default state is active`,
        default: true
    })
    @Prop({
        type: 'bool',
        default: true
    })    
    isActive: boolean;

    @ApiProperty({
        type: [String],
        description: `Roles granted to use the system, new user has a role as 'user' by default`,
        default: ['User'],
        isArray: true
    })
    @Prop({
        type: [String],
        default: ['user'],

    })
    roles: string[];

}

export const UserSchema = SchemaFactory.createForClass( User );

UserSchema.pre('save', function(next) {
    
    const user = this;
    this.fullName = this.fullName.trim().toLowerCase();
    next();
});

UserSchema.pre('findOneAndUpdate', function(next) {
    const update: any = this.getUpdate();
    if( update.fullName ) update.fullName = update.fullName.trim().toLowerCase();
    next();
});

