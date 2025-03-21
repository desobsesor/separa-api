import { Block } from '../schemas/block.schema';
import { CreateBlockDto } from '../dto/create-block.dto';
import { UpdateBlockDto } from '../dto/update-block.dto';

export interface IBlocksRepository {
    create(createBlockDto: CreateBlockDto): Promise<Block>;
    findAll(): Promise<Block[]>;
    findOne(id: string): Promise<Block>;
    update(id: string, updateBlockDto: UpdateBlockDto): Promise<Block>;
    remove(id: string): Promise<Block>;
    findOverlappingBlocks(userId: string, startTime: Date, endTime: Date, excludeBlockId?: string): Promise<Block[]>;
    findBlocksByDate(date: Date, page?: number, limit?: number): Promise<{ blocks: Block[], total: number }>;
}