import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { BlocksGateway } from 'src/infrastructure/websockets/blocks.gateway';
import { UsersService } from '../../users/services/users.service';
import { CreateBlockDto } from '../dto/create-block.dto';
import { UpdateBlockDto } from '../dto/update-block.dto';
import { BlocksRepository } from '../repositories/blocks.repository';
import { Block } from '../schemas/block.schema';

@Injectable()
export class BlocksService {
  constructor(
    private readonly blocksRepository: BlocksRepository,
    private readonly usersService: UsersService,
    private readonly blocksGateway: BlocksGateway,
    @Inject('TIMEZONE_CONFIG') private readonly timezoneConfig: any
  ) {
  }

  async create(createBlockDto: CreateBlockDto): Promise<Block> {
    await this.usersService.findOne(createBlockDto.attachedUser);

    const startTime = new Date(createBlockDto.startTime);
    const endTime = new Date(createBlockDto.endTime);

    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    if (new Date(createBlockDto.startTime) >= new Date(createBlockDto.endTime)) {
      throw new BadRequestException('Start time must be before end time');
    }

    const overlappingBlocks = await this.blocksRepository.findOverlappingBlocks(
      createBlockDto.attachedUser,
      startTime,
      endTime
    );

    if (overlappingBlocks.length > 0) {
      throw new ConflictException('This time slot overlaps with an existing reservation');
    }

    const createdBlock = await this.blocksRepository.create(createBlockDto);

    this.blocksGateway.emitNewBlock(createdBlock);

    return createdBlock;
  }

  async findAll(): Promise<Block[]> {
    return this.blocksRepository.findAll();
  }

  async findBlocksByDate(date: string, page = 1, limit = 10) {
    const dt = DateTime.fromISO(date, { zone: this.timezoneConfig.timezone });
    const dateObj = dt.toJSDate();
    const { blocks, total } = await this.blocksRepository.findBlocksByDate(dateObj, page, limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data: blocks,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  // Migration script example - moved to repository if needed
  async migrateBlocks() {
    // This functionality could be moved to the repository if needed
    // For now, we'll keep it as a placeholder
    console.log('Migration functionality moved to repository');
  }

  async findOne(id: string): Promise<Block> {
    const block = await this.blocksRepository.findOne(id);
    if (!block) {
      throw new NotFoundException(`Block with ID ${id} not found`);
    }
    return block;
  }

  async update(id: string, updateBlockDto: UpdateBlockDto): Promise<Block> {
    const block = await this.blocksRepository.findOne(id);
    if (!block) {
      throw new NotFoundException(`Block with ID ${id} not found`);
    }

    if (updateBlockDto.startTime || updateBlockDto.endTime) {
      const startTime = updateBlockDto.startTime ? new Date(updateBlockDto.startTime) : new Date(block.startTime);
      const endTime = updateBlockDto.endTime ? new Date(updateBlockDto.endTime) : new Date(block.endTime);

      if (startTime >= endTime) {
        throw new BadRequestException('Start time must be before end time');
      }

      const overlappingBlocks = await this.blocksRepository.findOverlappingBlocks(
        updateBlockDto.attachedUser ?? block.attachedUser as any,
        startTime,
        endTime,
        id
      );

      if (overlappingBlocks.length > 0) {
        throw new ConflictException('This time slot overlaps with an existing reservation');
      }
    }

    return this.blocksRepository.update(id, updateBlockDto);
  }

  async remove(id: string): Promise<Block> {
    const block = await this.blocksRepository.findOne(id);
    if (!block) {
      throw new NotFoundException(`Block with ID ${id} not found`);
    }

    return this.blocksRepository.remove(id);
  }
}