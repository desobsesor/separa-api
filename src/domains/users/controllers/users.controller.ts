import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { FilterByBlockDateDto } from '../dto/filter-by-block-date.dto';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('UsersController');
    this.logger.log('UsersController initialized');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user', description: 'Creates a new user with the provided data' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 409, description: 'Conflict - Email already exists' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Retrieves a paginated list of all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  findAll(@Query() paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.usersService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID', description: 'Retrieves a specific user by their ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: '6151f7aa2d38c12e4c78e123' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user', description: 'Updates a user with the provided data' })
  @ApiParam({ name: 'id', description: 'User ID', example: '6151f7aa2d38c12e4c78e123' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user', description: 'Removes a user from the system' })
  @ApiParam({ name: 'id', description: 'User ID', example: '6151f7aa2d38c12e4c78e123' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('v0/by-block-date')
  @ApiOperation({ summary: 'Find users by block date', description: 'Retrieves users who have reservations on a specific date' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  findUsersByBlockDate(
    @Query() filterByBlockDateDto: FilterByBlockDateDto,
  ) {
    this.logger.log('Adentro del endpoint');
    const { createdAt, page, limit } = filterByBlockDateDto;
    return this.usersService.findUsersByBlockDate(createdAt, page, limit);
  }

  @Post('v0/with-reservations')
  @ApiOperation({ summary: 'Find users with reservations', description: 'Retrieves users who have reservations with optional filtering' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  findUsersWithReservations(
    @Body() filterUsersDto: FilterUsersDto
  ) {
    const { page, limit } = filterUsersDto;
    return this.usersService.findUsersWithReservations(
      { ...filterUsersDto, tags: !filterUsersDto.tags ? [] : filterUsersDto.tags },
      page,
      limit
    );
  }

}