import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { BlocksService } from '../services/blocks.service';
import { CreateBlockDto } from '../dto/create-block.dto';
import { UpdateBlockDto } from '../dto/update-block.dto';
import { FilterBlocksByDateDto } from '../dto/filter-blocks-by-date.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('blocks')
@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new reservation block', description: 'Creates a new reservation block with the provided data' })
  @ApiResponse({ status: 201, description: 'Reservation created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data or time conflict' })
  @ApiResponse({ status: 409, description: 'Conflict - Time slot overlaps with existing reservation' })
  async create(@Body() createBlockDto: CreateBlockDto) {
    const block = await this.blocksService.create(createBlockDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Reservation created successfully',
      data: block
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all reservation blocks', description: 'Retrieves a list of all reservation blocks' })
  @ApiResponse({ status: 200, description: 'Blocks retrieved successfully' })
  findAll() {
    return this.blocksService.findAll();
  }

  @Get('by-date')
  @ApiOperation({ summary: 'Get blocks by date', description: 'Retrieves reservation blocks for a specific date' })
  @ApiResponse({ status: 200, description: 'Blocks retrieved successfully' })
  findBlocksByDate(@Query() filterBlocksByDateDto: FilterBlocksByDateDto) {
    const { date, page, limit } = filterBlocksByDateDto;
    return this.blocksService.findBlocksByDate(date, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get block by ID', description: 'Retrieves a specific reservation block by its ID' })
  @ApiParam({ name: 'id', description: 'Block ID', example: '6151f7aa2d38c12e4c78e123' })
  @ApiResponse({ status: 200, description: 'Block retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Block not found' })
  findOne(@Param('id') id: string) {
    return this.blocksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update block', description: 'Updates a reservation block with the provided data' })
  @ApiParam({ name: 'id', description: 'Block ID', example: '6151f7aa2d38c12e4c78e123' })
  @ApiResponse({ status: 200, description: 'Block updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data or time conflict' })
  @ApiResponse({ status: 404, description: 'Block not found' })
  @ApiResponse({ status: 409, description: 'Conflict - Time slot overlaps with existing reservation' })
  update(@Param('id') id: string, @Body() updateBlockDto: UpdateBlockDto) {
    return this.blocksService.update(id, updateBlockDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete block', description: 'Removes a reservation block from the system' })
  @ApiParam({ name: 'id', description: 'Block ID', example: '6151f7aa2d38c12e4c78e123' })
  @ApiResponse({ status: 200, description: 'Block deleted successfully' })
  @ApiResponse({ status: 404, description: 'Block not found' })
  remove(@Param('id') id: string) {
    return this.blocksService.remove(id);
  }
}