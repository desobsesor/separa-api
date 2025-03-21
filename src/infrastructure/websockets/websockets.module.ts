import { Module } from '@nestjs/common';
import { BlocksGateway } from './blocks.gateway';

@Module({
  providers: [BlocksGateway],
  exports: [BlocksGateway],
})
export class WebSocketsModule {}