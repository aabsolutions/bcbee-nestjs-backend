import { PartialType } from '@nestjs/swagger';
import { CreateServidorDto } from './create-servidor.dto';

export class UpdateServidorDto extends PartialType(CreateServidorDto) {}
