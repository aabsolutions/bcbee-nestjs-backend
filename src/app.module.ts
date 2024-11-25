import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { CursoModule } from './curso/curso.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_HOST),
    AuthModule,
    CommonModule,
    EstudianteModule,
    CursoModule
  ],
})
export class AppModule {}
