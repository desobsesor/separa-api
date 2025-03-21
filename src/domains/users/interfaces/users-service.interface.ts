import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { FilterByBlockDateDto } from '../dto/filter-by-block-date.dto';

export interface IUsersService {
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(filterUsersDto?: FilterUsersDto): Promise<User[]>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<User>;
    findByBlockDate(filterByBlockDateDto: FilterByBlockDateDto): Promise<User[]>;
}