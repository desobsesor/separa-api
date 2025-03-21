import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Block, BlockDocument } from '../../blocks/schemas/block.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Block.name) private blockModel: Model<BlockDocument>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async findAll(filter: any = {}): Promise<User[]> {
        return this.userModel.find(filter).exec();
    }

    async findOne(id: string): Promise<User> {
        return this.userModel.findById(id).exec() as unknown as any;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec() as unknown as any;
    }

    async remove(id: string): Promise<User> {
        return this.userModel.findByIdAndDelete(id).exec() as unknown as any;
    }

    async findByIds(userIds: User[]): Promise<User[]> {
        return this.userModel.find({
            _id: { $in: userIds },
        }).exec();
    }

    async findUsersWithReservations(filterValue: string, tags: string[], startTime: Date, endTime: Date, skip: number, limit: number) {
        const blocks = await this.blockModel.find({
            startTime: {
                $gte: startTime,
                $lte: endTime
            }
        }).populate('attachedUser').exec();

        let filteredBlocks = blocks;

        if (filterValue) {
            filteredBlocks = blocks.filter(block => {
                const user = block.attachedUser as any;
                if (!user) return false;

                if (tags && tags.length > 0) {
                    const validFields = ['name', 'address', 'phoneNumber', 'email'];
                    const validTags = tags.filter(tag => validFields.includes(tag.toLowerCase()));

                    if (validTags.length > 0) {
                        return validTags.some(tag => {
                            const field = tag.toLowerCase();
                            return user[field]?.toLowerCase().includes(filterValue.toLowerCase());
                        });
                    }
                } else {
                    return (
                        user.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
                        user.address?.toLowerCase().includes(filterValue.toLowerCase()) ||
                        user.phoneNumber?.toLowerCase().includes(filterValue.toLowerCase()) ||
                        user.email?.toLowerCase().includes(filterValue.toLowerCase())
                    );
                }
            });
        }

        const total = filteredBlocks.length;
        const data = filteredBlocks.slice(skip, skip + limit);

        return { data, total };
    }

    async findBlocksByTimeRange(startTime: Date, endTime: Date, skip: number, limit: number) {
        const [data, total] = await Promise.all([
            this.blockModel.find(
                {
                    startTime: {
                        $gte: startTime,
                        $lte: endTime
                    }
                }
            )
                .populate('attachedUser')
                .skip(skip).limit(limit).exec(),
            this.blockModel.countDocuments({
                startTime: {
                    $gte: startTime,
                    $lte: endTime
                }
            })
        ]);

        return { data, total };
    }
}