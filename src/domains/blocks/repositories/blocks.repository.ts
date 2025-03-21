import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Block, BlockDocument } from '../schemas/block.schema';
import { CreateBlockDto } from '../dto/create-block.dto';
import { UpdateBlockDto } from '../dto/update-block.dto';
import { DateTime } from 'luxon';

@Injectable()
export class BlocksRepository {
    constructor(
        @InjectModel(Block.name) private blockModel: Model<BlockDocument>,
        @Inject('TIMEZONE_CONFIG') private readonly timezoneConfig: any
    ) { }

    async create(createBlockDto: CreateBlockDto): Promise<Block> {
        const startTime = new Date(createBlockDto.startTime);
        const year = startTime.getFullYear();
        const month = startTime.getMonth() + 1;
        const day = startTime.getDate();

        const startDate = DateTime.fromObject({ year, month, day }, { zone: this.timezoneConfig.timezone }).startOf('day').toJSDate();

        const createdBlock = new this.blockModel({
            ...createBlockDto,
            userId: createBlockDto.attachedUser,
            date: startDate,
        });

        return createdBlock.save();
    }

    async findAll(): Promise<Block[]> {
        return this.blockModel.find().exec();
    }

    async findOne(id: string): Promise<Block> {
        return this.blockModel.findById(id).exec() as any;
    }

    async update(id: string, updateBlockDto: UpdateBlockDto): Promise<Block> {
        return this.blockModel.findByIdAndUpdate(
            id,
            updateBlockDto,
            { new: true }
        ).exec() as any;
    }

    async remove(id: string): Promise<Block> {
        return this.blockModel.findByIdAndDelete(id).exec() as any;
    }

    async findOverlappingBlocks(userId: string, startTime: Date, endTime: Date, excludeBlockId?: string): Promise<Block[]> {
        const query: any = {
            attachedUser: userId,
            $or: [
                // New block starts during an existing block
                {
                    startTime: { $lte: startTime },
                    endTime: { $gt: startTime }
                },
                // New block ends during an existing block
                {
                    startTime: { $lt: endTime },
                    endTime: { $gte: endTime }
                },
                // New block completely contains an existing block
                {
                    startTime: { $gte: startTime },
                    endTime: { $lte: endTime }
                }
            ]
        };

        if (excludeBlockId) {
            query._id = { $ne: excludeBlockId };
        }

        return this.blockModel.find(query).exec();
    }

    async findBlocksByDate(date: Date, page = 1, limit = 10): Promise<{ blocks: Block[], total: number }> {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const startDate = DateTime.fromObject({ year, month: month + 1, day }, { zone: this.timezoneConfig.timezone }).startOf('day').toJSDate();
        const endDate = DateTime.fromObject({ year, month: month + 1, day }, { zone: this.timezoneConfig.timezone }).endOf('day').toJSDate();

        const skip = (page - 1) * limit;

        const [blocks, total] = await Promise.all([
            this.blockModel.find({
                startTime: {
                    $gte: startDate,
                    $lte: endDate
                }
            })
                .populate('attachedUser')
                .skip(skip)
                .limit(limit)
                .exec(),
            this.blockModel.countDocuments({
                startTime: {
                    $gte: startDate,
                    $lte: endDate
                }
            })
        ]);

        return {
            blocks,
            total
        };
    }
}