import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/schemas/user.schema';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Auth()
  @Post()
  create(@Body() createCursoDto: CreateCursoDto,
  @GetUser() user: User) {
    return this.cursoService.create(createCursoDto, user);
  }

  @Auth()
  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.cursoService.findAll(paginationDto);
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursoService.findOne(id);
  }

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
