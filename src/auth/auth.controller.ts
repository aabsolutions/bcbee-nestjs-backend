import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiAcceptedResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Auth, GetUser } from './decorators';
import { AuthService } from './auth.service';
import { LoginUserDto, CreateUserDto, UpdateUserDto } from './dto';
import { ValidRoles } from './interfaces';
import { User } from './schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login registered users' })
  @ApiAcceptedResponse({
    description: 'The user has been successfully logged.'
  })
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: User,
  })
  @Auth(ValidRoles.admin, ValidRoles.user)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get('renew')
  @Auth(ValidRoles.user)
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus( user );
  }

  @ApiOperation({ summary: 'Get one user' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiCreatedResponse({
    description: 'The user has been successfully updated.',
    type: User,
  })
  @Auth(ValidRoles.admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Activate or desactivate user' })
  @ApiCreatedResponse({
    description: 'The user has been successfully activated/desactivated.',
    type: User,
  })
  @Auth(ValidRoles.admin)
  @Delete(':id')
  changeStatus(@Param('id') id: string) {
    return this.authService.activateDesactivate(id);
  }
}
