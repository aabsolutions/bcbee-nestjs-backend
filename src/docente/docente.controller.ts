import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { Auth, GetUser } from 'src/auth/decorators';
import { CreateDocenteDto, UpdateDocenteDto } from './dto';
import { Docente } from './schemas/docente.schema';
import { DocenteService } from './docente.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from 'src/auth/schemas/user.schema';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('docente')
export class DocenteController {
  constructor(private readonly docenteService: DocenteService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Docente was created',
    type: Docente
  })
  @Auth(ValidRoles.user)
  create(@Body() createDocenteDto: CreateDocenteDto,
  @GetUser() user: User) {
    return this.docenteService.create(createDocenteDto, user);
  }

  @Auth(ValidRoles.user)
  @Get()
  findAll( @Query() paginationDto:PaginationDto ) {
    return this.docenteService.findAll( paginationDto );
  }

  @Auth(ValidRoles.user)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docenteService.findOne(id);
  }

  @Auth(ValidRoles.admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocenteDto: UpdateDocenteDto,
  @GetUser() user: User) {
    return this.docenteService.update(id, updateDocenteDto, user);
  }

  @Auth(ValidRoles.admin)
  @Delete(':id')
  changeStatus(@Param('id') id: string, @GetUser() user: User ) {
    return this.docenteService.activateDesactivate(id, user);
  }

}
