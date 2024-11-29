
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';

import { User } from 'src/auth/schemas/user.schema';
import { validarMongoID } from 'src/common/middlewares/validar-mongoid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Docente } from './schemas/docente.schema';

@Injectable()
export class DocenteService {

  private logger = new Logger();

  constructor( 
    @InjectModel(Docente.name) 
    private readonly docenteModel: Model<Docente> 
  ){}

  async findAll( paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    const docentes = await this.docenteModel.find({estado: true},{},{skip: offset, limit});

    return docentes;

  }

  async findOne(id: string) {

    if ( !validarMongoID(id) ) throw new BadRequestException(`Id provides is not a valid MongoId`);

    const bdDocente = await this.docenteModel.findById(id);
   
    if( !bdDocente ) throw new NotFoundException(`Docente with id ${ id } not found`);

    return bdDocente;

  }
  
  async create(createDocenteDto: CreateDocenteDto, user: User) {

    const { cedula } = createDocenteDto;
    const bdDocente = await this.docenteModel.findOne({ cedula });

    if ( bdDocente ) throw new BadRequestException(`Docente with cedula ${ cedula } already exists`);

    try {
      
      const newDocente = new this.docenteModel({
        ...createDocenteDto,
        usuario: user._id
      });
      
      await newDocente.save();

      return {
        docente: newDocente
      }

    } catch (error) {
      this.handleDbErrorsOnMongo(error);
    }

  }

  async update(id: string, updateDocenteDto: UpdateDocenteDto, user: User) {

    const verifyDocente = await this.findOne(id);

    const { cedula } = updateDocenteDto;
    const existsOtherDocente = await this.docenteModel.findOne({ cedula });
    if ( existsOtherDocente ) throw new BadRequestException(`Docente with cédula ${ cedula } already exists`);

    const updatedDocente = await this.docenteModel
          .findByIdAndUpdate( id, { ...updateDocenteDto, usuario: user._id }, { new: true } );

    return {
      docente: updatedDocente
    };

  }

  async activateDesactivate(id: string, user: User) {
    
    const bdDocente = await this.docenteModel.findById( id );

    if( !bdDocente ) throw new NotFoundException(`Docente with id: ${ id } not found`);
    
    try {
  
      const updatedDocente = await this.docenteModel
        .findByIdAndUpdate( id , { estado: !bdDocente.estado, usuario: user._id } , { new: true });
      return updatedDocente;
      
    } catch (error) {

      this.handleDbErrorsOnMongo(error);
      
    }

  }

  private handleDbErrorsOnMongo(error: any){

    console.log(error);
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
