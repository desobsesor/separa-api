import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlocksService } from './services/blocks.service';
import { BlocksController } from './controllers/blocks.controller';
import { Block, BlockSchema } from './schemas/block.schema';
import { UsersModule } from '../users/users.module';
import { WebSocketsModule } from '../../infrastructure/websockets/websockets.module';
import { BlocksRepository } from './repositories/blocks.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Block.name, schema: BlockSchema },
    ]),
    UsersModule,
    WebSocketsModule,
  ],
  controllers: [BlocksController],
  providers: [BlocksService, BlocksRepository],
  exports: [BlocksService],
})
export class BlocksModule { }