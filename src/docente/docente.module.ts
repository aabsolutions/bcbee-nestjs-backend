import { Module } from '@nestjs/common';
import { DocenteService } from './docente.service';
import { DocenteController } from './docente.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Docente, DocenteSchema } from './schemas/docente.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DocenteController],
  providers: [DocenteService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([{
      name: Docente.name,
      schema: DocenteSchema
    }])
  ]
})
export class DocenteModule {}
