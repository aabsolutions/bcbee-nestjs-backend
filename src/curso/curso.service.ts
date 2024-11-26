import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, Query } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Curso } from './schemas/curso.schema';
import { User } from 'src/auth/schemas/user.schema';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validarMongoID } from 'src/common/middlewares/validar-mongoid';
import { query } from 'express';

@Injectable()
export class CursoService {
  
  private logger = new Logger();

  constructor( @InjectModel('Curso') private readonly cursoModel: Model<Curso> ){}

  async create(createCursoDto: CreateCursoDto, user: User) {

    const { grado, nivel, paralelo, jornada, especialidad } = createCursoDto;
    const bdCurso = await this.cursoModel.findOne({ grado, nivel, paralelo, jornada, especialidad });

    if( bdCurso ) throw new BadRequestException(`Curso ${grado} ${nivel} ${paralelo} ${jornada} ${especialidad} already exists`);

    try {

      const newCurso = new this.cursoModel({
        ...createCursoDto,
        usuario: user._id
      });
      
      await newCurso.save();

      return {
        curso: newCurso
      }

    } catch (error) {
      this.handleDbErrorsOnMongo(error);
    }
    
  }

  async findManyBy( filtros: any, paginationDto: PaginationDto){

    let query: any = {};

    if (filtros.nivel) query.nivel = filtros.nivel;
    if (filtros.jornada) query.jornada = filtros.jornada;
    if (filtros.especialidad) query.especialidad = filtros.especialidad;
         
    const cursos = await this.cursoModel.find( query, {});
    
    return cursos;

  }

  

  async findAll( paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    const cursos = await this.cursoModel.find({estado: true},{},{skip: offset, limit});

    return cursos;

  }

  async findOne(id: string) {

    if ( !validarMongoID(id) ) throw new BadRequestException(`Id provides is not a valid MongoId`);

    const bdCurso = await this.cursoModel.findById(id);
   
    if( !bdCurso ) throw new NotFoundException(`Curso with id ${ id } not found`);

    return bdCurso;  
  
  }

  async update(id: string, updateCursoDto: UpdateCursoDto, user: User) {

    const verifyCurso = await this.findOne(id);    
    
    const { 
      grado        = verifyCurso.grado, 
      nivel        = verifyCurso.nivel, 
      paralelo     = verifyCurso.paralelo, 
      jornada      = verifyCurso.jornada, 
      especialidad = verifyCurso.especialidad 
    } = updateCursoDto;

    const bdCurso = await this.cursoModel.findOne({ grado, nivel, paralelo, jornada, especialidad });

    if( bdCurso ) throw new BadRequestException(`Curso ${grado} ${nivel} ${paralelo} ${jornada} ${especialidad} already exists`);

    const updatedCurso = await this.cursoModel.findByIdAndUpdate( id, { ...updateCursoDto, usuario: user._id }, { new: true } );

    return updatedCurso;

  }

  async activateDesactivate(id: string, user: User) {
    
    const bdCurso = await this.cursoModel.findById( id );

    if( !bdCurso ) throw new NotFoundException(`Curso with id: ${ id } not found`);
    
    try {
  
      const updatedCurso = await this.cursoModel
        .findByIdAndUpdate( id , { estado: !bdCurso.estado, usuario: user._id } , { new: true });
      return {
        curso: updatedCurso
      };
      
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
