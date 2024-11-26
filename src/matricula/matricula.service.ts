import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { Matricula } from './schemas/matricula.schema';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { User } from 'src/auth/schemas/user.schema';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validarMongoID } from 'src/common/middlewares/validar-mongoid';
import { LoadMatriculaCursoDto } from './dto/load-matricula-curso.dto';
import { Curso } from 'src/curso/schemas/curso.schema';

@Injectable()
export class MatriculaService {

  private logger = new Logger();

  constructor( 
    @InjectModel(Matricula.name) 
    private readonly matriculaModel: Model<Matricula>,
    @InjectModel(Curso.name)
    private readonly cursoModel: Model<Curso>
  ){}
    
  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    const matriculas = await this.matriculaModel.find({},{},{skip: offset, limit});

    return matriculas;

  }

  async loadMatriculaEstudiante(idEstudiante: string, periodo: string) {

    if ( !validarMongoID(idEstudiante) ) throw new BadRequestException(`Id provides is not a valid MongoId`);
    
    try {
      
      const matricula = await this.matriculaModel.aggregate([
          {
            $lookup:
              {
                from: "cursos",
                localField: "curso",
                foreignField: "_id",
                as: "curso"
              }
          },
          {
            $unwind:
              {
                path: "$curso"
              }
          },
          {
            $match:
              {
                $and: [
                  {
                    periodo: periodo,
                    estudiante: new mongoose.Types.ObjectId( idEstudiante )
                  }
                ]
              }
          },
          {
            '$project': {
              'curso._id': 1,
              'curso.grado': 1,
              'curso.nivel': 1,
              'curso.paralelo': 1,
              'curso.jornada': 1,
              'curso.especialidad': 1
            }
        }
        
      ]).exec();

      if ( !matricula ) throw new NotFoundException(`Matriculas for ${ idEstudiante } not exists`);
       
      let dataMatricula: any;
      
      matricula.map( matricula => {
        dataMatricula = {
          id: matricula._id,
          cursoId: matricula.curso._id
        }
      });

      const cursoPlain = await this.getCursoDataPlain(dataMatricula.cursoId);

      const matriculaEstudiante = {
        idMatricula: dataMatricula.id,
        periodo,
        curso: cursoPlain
      }

      return matriculaEstudiante;

    } catch (error) {

      this.handleDbErrorsOnMongo(error);

    }


  }

  async loadMatriculaCurso(idCurso: string, periodo: string ) {

    if ( !validarMongoID(idCurso) ) throw new BadRequestException(`Id provides is not a valid MongoId`);

    try {
      
      const matriculas = await this.matriculaModel.aggregate([
        {
          '$lookup': {
            'from': 'estudiantes', 
            'localField': 'estudiante', 
            'foreignField': '_id', 
            'as': 'estudiante'
          }
        }, {
          '$unwind': {
            'path': '$estudiante'
          }
        }, {
          '$match': {
            '$and': [{
                        'periodo': periodo,
                        'curso': new mongoose.Types.ObjectId( idCurso )
                    }]
          }
        }, 
        {
          '$sort': {
            'estudiante.apellidos': 1
          }
        },
        {
            '$project': {
              'estudiante._id': 1,
              'estudiante.cedula': 1,
              'estudiante.apellidos': 1,
              'estudiante.nombres': 1,
              'estudiante.fecha_nacimiento': 1,
              'estudiante.sexo': 1,
            }
        }
      ]).exec();

      if ( !matriculas ) throw new NotFoundException(`Matriculas for ${ idCurso } not exists`);
  
      let estudiantes = [];
  
      matriculas.map(
        matricula => {
          estudiantes.push({
            id: matricula.estudiante._id,
            cedula: matricula.estudiante.cedula,
            nombre_completo: `${matricula.estudiante.apellidos} ${matricula.estudiante.nombres}`,
            fecha_nacimiento: matricula.estudiante.fecha_nacimiento,
            sexo: matricula.estudiante.sexo
          });
        }
      );

      const cursoPlain = await this.getCursoDataPlain(idCurso);

      const matriculasCurso: LoadMatriculaCursoDto = {
        curso: cursoPlain,
        periodo,
        estudiantes
      };
  
      return matriculasCurso;

    } catch (error) {
      this.handleDbErrorsOnMongo(error);
    }

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

  async getCursoDataPlain( idCurso: string ){
    
    const dataCurso = await this.cursoModel.findById( idCurso );
    let curso = `${ dataCurso.grado } de ${ dataCurso.nivel } paralelo '${ dataCurso.paralelo }' jornada ${ dataCurso.jornada }`;

    if( dataCurso.especialidad ) curso.concat(` especialidad ${ dataCurso.especialidad }`);

    return curso;
  }
  
}
