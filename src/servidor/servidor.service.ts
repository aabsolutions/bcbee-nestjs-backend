import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateServidorDto } from './dto/create-servidor.dto';
import { Servidor } from './schemas/servidor.schema';
import { UpdateServidorDto } from './dto/update-servidor.dto';
import { User } from 'src/auth/schemas/user.schema';
import { validarMongoID } from 'src/common/middlewares/validar-mongoid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ServidorService {

  private logger = new Logger();

  constructor( 
    @InjectModel(Servidor.name) 
    private readonly estudianteModel: Model<Servidor> 
  ){}

  async findAll( paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    const estudiantes = await this.estudianteModel.find({estado: true},{},{skip: offset, limit});

    return estudiantes;

  }

  async findOne(id: string) {

    if ( !validarMongoID(id) ) throw new BadRequestException(`Id provides is not a valid MongoId`);

    const bdServidor = await this.estudianteModel.findById(id);
   
    if( !bdServidor ) throw new NotFoundException(`Servidor with id ${ id } not found`);

    return bdServidor;

  }
  
  async create(createServidorDto: CreateServidorDto, user: User) {

    const { cedula } = createServidorDto;
    const bdServidor = await this.estudianteModel.findOne({ cedula });

    if ( bdServidor ) throw new BadRequestException(`Servidor with cedula ${ cedula } already exists`);

    try {
      
      const newServidor = new this.estudianteModel({
        ...createServidorDto,
        usuario: user._id
      });
      
      await newServidor.save();

      return {
        estudiante: newServidor
      }

    } catch (error) {
      console.log(error);
      this.handleDbErrorsOnMongo(error);
    }

  }

  async update(id: string, updateServidorDto: UpdateServidorDto, user: User) {

    const verifyServidor = await this.findOne(id);

    const { cedula } = updateServidorDto;
    const existsOtherServidor = await this.estudianteModel.findOne({ cedula });
    if ( existsOtherServidor ) throw new BadRequestException(`Servidor with cédula ${ cedula } already exists`);

    const updatedServidor = await this.estudianteModel.findByIdAndUpdate( id, { ...updateServidorDto, usuario: user._id }, { new: true } );

    return updatedServidor;
  }

  async activateDesactivate(id: string, user: User) {
    
    const bdServidor = await this.estudianteModel.findById( id );

    if( !bdServidor ) throw new NotFoundException(`Servidor with id: ${ id } not found`);
    
    try {
  
      const updatedServidor = await this.estudianteModel
        .findByIdAndUpdate( id , { estado: !bdServidor.estado, usuario: user._id } , { new: true });
      return updatedServidor;
      
    } catch (error) {

      this.handleDbErrorsOnMongo(error);
      
    }

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
