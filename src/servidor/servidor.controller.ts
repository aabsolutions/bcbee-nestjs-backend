import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth, GetUser } from 'src/auth/decorators';
import { CreateServidorDto } from './dto/create-servidor.dto';
import { Servidor } from './schemas/servidor.schema';
import { ServidorService } from './servidor.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateServidorDto } from './dto/update-servidor.dto';
import { User } from 'src/auth/schemas/user.schema';
import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('Servidor')
@Controller('servidor')
export class ServidorController {
  constructor(private readonly estudianteService: ServidorService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Servidor was created',
    type: Servidor
  })
  @Auth(ValidRoles.user)
  create(@Body() createServidorDto: CreateServidorDto,
  @GetUser() user: User) {
    return this.estudianteService.create(createServidorDto, user);
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
  update(@Param('id') id: string, @Body() updateServidorDto: UpdateServidorDto,
  @GetUser() user: User) {
    return this.estudianteService.update(id, updateServidorDto, user);
  }

  @Auth(ValidRoles.admin)
  @Delete(':id')
  changeStatus(@Param('id') id: string, @GetUser() user: User ) {
    return this.estudianteService.activateDesactivate(id, user);
  }
}
