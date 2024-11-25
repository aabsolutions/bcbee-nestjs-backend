import { Module } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Curso, CursoSchema } from './schemas/curso.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CursoController],
  providers: [CursoService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([{
      name: Curso.name,
      schema: CursoSchema
    }])
  ]
})
export class CursoModule {}
