import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto';


@Injectable()
export class AuthService {

  private logger = new Logger();

  constructor(
    @InjectModel(User.name) 
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {

    const { password, ...userData } = createUserDto;
    
    try {

      const newUser = new this.userModel( {
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      } );
      await newUser.save();

      return {
        newUser,
        token: this.getJwtToken({ id: newUser.id })
      }  
      
    } catch (error) {
      this.handleDbErrorsOnMongo(error);      
    } 
  }

  findAll() {

    const users = this.userModel.find({});
    return users;

  }

  async login( loginUserDto: LoginUserDto){

    const { password, email } = loginUserDto;
    const loggedUser = await this.userModel.findOne({ email }, { password: true, email: true});

    if( !loggedUser ) 
      throw new UnauthorizedException(`Cretendials are not valid (email)`);

    if( !bcrypt.compareSync( password, loggedUser.password ))
      throw new UnauthorizedException(`Cretendials are not valid (password)`);

    return {
      user: loggedUser,
      token: this.getJwtToken({ id: loggedUser.id })
    }

  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const bdUser = await this.userModel.findById( id );

    if( !bdUser ) throw new NotFoundException(`User with id: ${ id } not found`);
    
    try {
  
      const updatedUser = await this.userModel.findByIdAndUpdate( id , updateUserDto , { new: true });
      return updatedUser;
      
    } catch (error) {

      this.handleDbErrorsOnMongo(error);
      
    }

  }

  async activateDesactivate(id: string) {

    const bdUser = await this.userModel.findById( id );

    if( !bdUser ) throw new NotFoundException(`User with id: ${ id } not found`);
    
    try {
  
      const updatedUser = await this.userModel.findByIdAndUpdate( id , { isActive: !bdUser.isActive } , { new: true });
      return updatedUser;
      
    } catch (error) {

      this.handleDbErrorsOnMongo(error);
      
    }
  }

  
  async checkStatus( user: any ){
    return {
      user,
      token: this.getJwtToken({ id: user._id })
    }
  }


  private getJwtToken( payload: JwtPayload ){
    
    const token = this.jwtService.sign( payload );
    return token;

  }

  private handleDbErrorsOnMongo(error: any){
    try {
      if(error.errorResponse.code===11000){
        this.logger.log(error.errorResponse.errmsg);
        throw new BadRequestException(error.errorResponse.errmsg);
      }
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(`Please check server logs`);  
    }    
  }
}
