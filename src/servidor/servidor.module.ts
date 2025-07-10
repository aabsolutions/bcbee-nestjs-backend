import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/auth/auth.module';
import { Servidor, ServidorSchema } from './schemas/servidor.schema';
import { ServidorController } from './servidor.controller';
import { ServidorService } from './servidor.service';

@Module({
  controllers: [ServidorController],
  providers: [ServidorService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([{
      name: Servidor.name,
      schema: ServidorSchema
    }])
  ]
})
export class ServidorModule {}
