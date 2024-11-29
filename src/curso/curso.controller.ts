import { ApiAcceptedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { Auth, GetUser } from 'src/auth/decorators';
import { CreateCursoDto, UpdateCursoDto } from './dto';
import { Curso } from './schemas/curso.schema';
import { CursoService } from './curso.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from 'src/auth/schemas/user.schema';
import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('Curso')
@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @ApiOperation({ summary: 'Create curso' })
  @ApiAcceptedResponse({
    description: 'The curso has been successfully created.'
  })
  @Auth(ValidRoles.user)
  @Post()
  create(@Body() createCursoDto: CreateCursoDto,
  @GetUser() user: User) {
    return this.cursoService.create(createCursoDto, user);
  }

  @ApiOperation({ summary: 'Filter for curso path' })
  @ApiResponse({
    status: 200,
    description: 'Filter for curso path',
    type: [Curso],
  })
  @Auth(ValidRoles.user)
  @Get('/filter')
  findManyBy( @Query() paginationDto: PaginationDto, @Body() filter: string ) {
    return this.cursoService.findManyBy(filter, paginationDto);
  }

  @ApiOperation({ summary: 'Get all cursos' })
  @Auth(ValidRoles.user)
  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.cursoService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get one curso' })
  @Auth(ValidRoles.user)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursoService.findOne(id);
  }

  @ApiOperation({ summary: 'Update curso' })
  @ApiAcceptedResponse({
    description: 'The curso has been successfully updated.'
  })
  @Auth(ValidRoles.admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto, @GetUser() user: User) {
    return this.cursoService.update(id, updateCursoDto, user);
  }

  @Auth(ValidRoles.admin)
  @Delete(':id')
  changeStatus(@Param('id') id: string, @GetUser() user: User) {
    return this.cursoService.activateDesactivate(id, user);
  }
}
