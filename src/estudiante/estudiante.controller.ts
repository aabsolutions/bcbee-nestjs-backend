import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth, GetUser } from 'src/auth/decorators';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { Estudiante } from './schemas/estudiante.schema';
import { EstudianteService } from './estudiante.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { User } from 'src/auth/schemas/user.schema';
import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('Estudiantes')
@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Product was created',
    type: Estudiante
  })
  @Auth(ValidRoles.user)
  create(@Body() createEstudianteDto: CreateEstudianteDto,
  @GetUser() user: User) {
    return this.estudianteService.create(createEstudianteDto, user);
  }

  @Auth(ValidRoles.user)
  @Get()
  findAll( @Query() paginationDto:PaginationDto ) {
    return this.estudianteService.findAll( paginationDto );
  }

  @Auth(ValidRoles.user)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estudianteService.findOne(id);
  }

  @Auth(ValidRoles.admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstudianteDto: UpdateEstudianteDto,
  @GetUser() user: User) {
    return this.estudianteService.update(id, updateEstudianteDto, user);
  }

  @Auth(ValidRoles.admin)
  @Delete(':id')
  changeStatus(@Param('id') id: string, @GetUser() user: User ) {
    return this.estudianteService.activateDesactivate(id, user);
  }
}
