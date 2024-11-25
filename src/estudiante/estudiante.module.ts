import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/auth/auth.module';
import { Estudiante, EstudianteSchema } from './schemas/estudiante.schema';
import { EstudianteController } from './estudiante.controller';
import { EstudianteService } from './estudiante.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [EstudianteController],
  providers: [EstudianteService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([{
      name: Estudiante.name,
      schema: EstudianteSchema
    }])
  ]
})
export class EstudianteModule {}
