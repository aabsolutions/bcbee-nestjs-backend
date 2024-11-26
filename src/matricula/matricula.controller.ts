import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/schemas/user.schema';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('matricula')
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @Auth()
  @Post()
  create(@Body() createMatriculaDto: CreateMatriculaDto, 
  @GetUser() user: User) {
    return this.matriculaService.create(createMatriculaDto, user);
  }

  @Auth()
  @Get()
  findAll( @Query() paginationDto: PaginationDto) {
    return this.matriculaService.findAll(paginationDto);
  }

  // presentación de listado de estudiantes matriculados en un curso y periodo determinado
  @Auth()
  @Get('curso/:periodo/:id')
  loadMatriculaCurso( @Param('id') id: string, @Param('periodo') periodo: string ) {
    return this.matriculaService.loadMatriculaCurso(id, periodo);
  }

  // presentación de datos de la matricula de un estudiante
  @Auth()
  @Get('estudiante/:periodo/:id')
  loadMatriculaEstudiante( @Param('id') id: string, @Param('periodo') periodo: string ) {
    return this.matriculaService.loadMatriculaEstudiante(id, periodo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matriculaService.findOne(id);
  }

  @Auth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatriculaDto: UpdateMatriculaDto, @GetUser() user: User) {
    return this.matriculaService.update(id, updateMatriculaDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matriculaService.remove(+id);
  }
}
