import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/auth/auth.module';
import { Matricula, MatriculaSchema } from './schemas/matricula.schema';
import { MatriculaController } from './matricula.controller';
import { MatriculaService } from './matricula.service';
import { ConfigModule } from '@nestjs/config';
import { Curso, CursoSchema } from 'src/curso/schemas/curso.schema';

@Module({
  controllers: [MatriculaController],
  providers: [MatriculaService],
  imports:[
    ConfigModule,
    AuthModule,
    MongooseModule.forFeature([{
      name: Matricula.name,
      schema: MatriculaSchema
    },{
      name: Curso.name,
      schema: CursoSchema
    }])
  ]
})
export class MatriculaModule {}
