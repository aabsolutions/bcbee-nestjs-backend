import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { Auth } from './decorators';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  
  @Auth(ValidRoles.admin, ValidRoles.user)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Auth(ValidRoles.admin, ValidRoles.user)
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Auth(ValidRoles.admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  @Auth(ValidRoles.admin)
  @Delete(':id')
  changeStatus(@Param('id') id: string) {
    return this.authService.activateDesactivate(id);
  }
}
