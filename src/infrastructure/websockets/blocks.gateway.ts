import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Block } from 'src/domains/blocks/schemas/block.schema';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, you should restrict this to your frontend domain
  },
})
export class BlocksGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(BlocksGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Emit an event when a new block is created
   * @param block The newly created block
   */
  emitNewBlock(block: Block) {
    this.server.emit('newBlock', block);
    this.logger.log(`New block emitted: ${block}`);
  }
}