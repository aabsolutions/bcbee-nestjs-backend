import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/schemas/user.schema';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Matricula')
@Controller('matricula')
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @Auth(ValidRoles.user, ValidRoles.admin)
  @Post()
  create(@Body() createMatriculaDto: CreateMatriculaDto, 
  @GetUser() user: User) {
    return this.matriculaService.create(createMatriculaDto, user);
  }

  @Auth(ValidRoles.user)
  @Get()
  findAll( @Query() paginationDto: PaginationDto) {
    return this.matriculaService.findAll(paginationDto);
  }

  // presentación de listado de estudiantes matriculados en un curso y periodo determinado
  @Auth(ValidRoles.user)
  @Get('curso/:periodo/:id')
  loadMatriculaCurso( @Param('id') id: string, @Param('periodo') periodo: string ) {
    return this.matriculaService.loadMatriculaCurso(id, periodo);
  }

  // presentación de datos de la matricula de un estudiante
  @Auth(ValidRoles.user)
  @Get('estudiante/:periodo/:id')
  loadMatriculaEstudiante( @Param('id') id: string, 
  @Param('periodo') periodo: string ) {
    return this.matriculaService.loadMatriculaEstudiante(id, periodo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matriculaService.findOne(id);
  }

  @Auth(ValidRoles.admin)
  @Patch(':id')
  update(@Param('id') id: string, 
  @Body() updateMatriculaDto: UpdateMatriculaDto, 
  @GetUser() user: User) {
    return this.matriculaService.update(id, updateMatriculaDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matriculaService.remove(+id);
  }
}
