import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { Estudiante } from './schemas/estudiante.schema';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { User } from 'src/auth/schemas/user.schema';
import { validarMongoID } from 'src/common/middlewares/validar-mongoid';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class EstudianteService {

  private logger = new Logger();

  constructor( 
    @InjectModel(Estudiante.name) 
    private readonly estudianteModel: Model<Estudiante> 
  ){}

  async findAll( paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    const estudiantes = await this.estudianteModel.find({estado: true},{},{skip: offset, limit});

    return estudiantes;

  }

  async findOne(id: string) {

    if ( !validarMongoID(id) ) throw new BadRequestException(`Id provides is not a valid MongoId`);

    const bdEstudiante = await this.estudianteModel.findById(id);
   
    if( !bdEstudiante ) throw new NotFoundException(`Estudiante with id ${ id } not found`);

    return bdEstudiante;

  }
  
  async create(createEstudianteDto: CreateEstudianteDto, user: User) {

    const { cedula } = createEstudianteDto;
    const bdEstudiante = await this.estudianteModel.findOne({ cedula });

    if ( bdEstudiante ) throw new BadRequestException(`Estudiante with cedula ${ cedula } already exists`);

    try {
      
      const newEstudiante = new this.estudianteModel({
        ...createEstudianteDto,
        usuario: user._id
      });
      
      await newEstudiante.save();

      return {
        estudiante: newEstudiante
      }

    } catch (error) {
      this.handleDbErrorsOnMongo(error);
    }

  }

  async update(id: string, updateEstudianteDto: UpdateEstudianteDto, user: User) {

    const verifyEstudiante = await this.findOne(id);

    const { cedula } = updateEstudianteDto;
    const existsOtherEstudiante = await this.estudianteModel.findOne({ cedula });
    if ( existsOtherEstudiante ) throw new BadRequestException(`Estudiante with cédula ${ cedula } already exists`);

    const updatedEstudiante = await this.estudianteModel.findByIdAndUpdate( id, { ...updateEstudianteDto, usuario: user._id }, { new: true } );

    return updatedEstudiante;
  }

  async activateDesactivate(id: string, user: User) {
    
    const bdEstudiante = await this.estudianteModel.findById( id );

    if( !bdEstudiante ) throw new NotFoundException(`Estudiante with id: ${ id } not found`);
    
    try {
  
      const updatedEstudiante = await this.estudianteModel
        .findByIdAndUpdate( id , { estado: !bdEstudiante.estado, usuario: user._id } , { new: true });
      return updatedEstudiante;
      
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
