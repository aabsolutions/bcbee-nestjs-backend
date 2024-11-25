import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/auth/auth.module';
import { Matricula, MatriculaSchema } from './schemas/matricula.schema';
import { MatriculaController } from './matricula.controller';
import { MatriculaService } from './matricula.service';

@Module({
  controllers: [MatriculaController],
  providers: [MatriculaService],
  imports:[
    AuthModule,
    MongooseModule.forFeature([{
      name: Matricula.name,
      schema: MatriculaSchema
    }])
  ]
})
export class MatriculaModule {}
