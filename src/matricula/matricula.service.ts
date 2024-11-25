import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { Matricula } from './schemas/matricula.schema';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { User } from 'src/auth/schemas/user.schema';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validarMongoID } from 'src/common/middlewares/validar-mongoid';

@Injectable()
export class MatriculaService {

  private logger = new Logger();

  constructor( @InjectModel(Matricula.name) 
  private readonly matriculaModel: Model<Matricula> ){}

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    const matriculas = await this.matriculaModel.find({},{},{skip: offset, limit});

    return matriculas;

  }

  async findOne(id: string) {

    if ( !validarMongoID(id) ) throw new BadRequestException(`Id provides is not a valid MongoId`);

    const bdMatricula = await this.matriculaModel.findById(id);

    if( !bdMatricula ) throw new NotFoundException(`Matricula with id ${ id } not found`);

    return bdMatricula;

  }
  
  async create(createMatriculaDto: CreateMatriculaDto, user: User) {

    const { periodo, estudiante, curso } = createMatriculaDto;
    const bdMatricula = await this.matriculaModel.findOne({ periodo, estudiante, curso });

    if ( bdMatricula ) throw new BadRequestException(`Matricula of student ${ estudiante } on curso ${ curso } already exists in periodo ${ periodo }`);
    
    try {
      
      const newMatricula = new this.matriculaModel( {
        ...createMatriculaDto,
        usuario: user._id
      });

      await newMatricula.save();

      return {
        matricula: newMatricula
      }
      
    } catch (error) {
      this.handleDbErrorsOnMongo(error);
    }

  }


  async update(id: string, updateMatriculaDto: UpdateMatriculaDto, user: User) {

    const verifyMatricula = await this.findOne(id);

    const { periodo, estudiante, curso } = updateMatriculaDto;
    const bdMatricula = await this.matriculaModel.findOne({ periodo, estudiante, curso });

    if ( bdMatricula ) throw new BadRequestException(`Matricula of student ${ estudiante } on curso ${ curso } already exists in periodo ${ periodo }`);

    const updatedMatricula = await this.matriculaModel.findByIdAndUpdate( id, { ...updateMatriculaDto, usuario: user._id }, { new: true } );

    return {
      matricula: updatedMatricula
    };

  }

  remove(id: number) {
    return `This action removes a #${id} matricula`;
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
