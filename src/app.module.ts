import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UsersModule } from './domains/users/users.module';
import { BlocksModule } from './domains/blocks/blocks.module';
import { WebSocketsModule } from './infrastructure/websockets/websockets.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { TimezoneModule } from './infrastructure/config/timezone.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TimezoneModule,
    LoggerModule,
    DatabaseModule,
    UsersModule,
    BlocksModule,
    WebSocketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
