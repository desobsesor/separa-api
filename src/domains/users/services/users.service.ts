import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Block, BlockDocument } from '../../blocks/schemas/block.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { DateTime } from 'luxon';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @InjectModel(Block.name) private blockModel: Model<BlockDocument>,
    @Inject('TIMEZONE_CONFIG') private readonly timezoneConfig: any
  ) {
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = await this.usersRepository.create(createUserDto);
      return createdUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Error creating user ' + error.message);
    }
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const users = await this.usersRepository.findAll({});
    const total = users.length;

    const data = users.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.usersRepository.remove(id);
  }

  async findUsersByBlockDate(date: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [year, month, day] = date.split('-').map(num => parseInt(num));

    const startDate = DateTime.fromObject({ year, month, day }, { zone: this.timezoneConfig.timezone }).startOf('day').toJSDate();
    const endDate = DateTime.fromObject({ year, month, day }, { zone: this.timezoneConfig.timezone }).endOf('day').toJSDate();

    const blocks = await this.blockModel.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).exec();

    const userIds = [...new Set(blocks.map(block => block.attachedUser))];

    const users = await this.usersRepository.findByIds(userIds);
    const total = users.length;

    const data = users.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  async findUsersWithReservations(filterUsersDto: FilterUsersDto, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const { filterValue, tags } = filterUsersDto;

      const startTime = new Date();
      const endTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

      if (!filterValue && (!tags || tags.length === 0)) {
        const { data: data_, total: total_ } = await this.usersRepository.findBlocksByTimeRange(startTime, endTime, skip, limit);

        const totalPages = Math.ceil(total_ / limit);

        return {
          data: data_,
          meta: {
            total: total_,
            page,
            limit,
            totalPages
          }
        }
      }

      const { data: filteredBlocks, total: total_ } = await this.usersRepository.findUsersWithReservations(
        filterValue as string,
        tags as string[],
        startTime,
        endTime,
        skip,
        limit
      );

      const totalPages = Math.ceil(total_ / limit);

      return {
        data: filteredBlocks,
        meta: {
          total: total_,
          page,
          limit,
          totalPages
        }
      };
    } catch (error) {
      console.log(error);
      return {
        error
      }
    }
  }
}