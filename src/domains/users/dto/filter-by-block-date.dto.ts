import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class FilterByBlockDateDto extends PaginationDto {
  @ApiProperty({ description: 'Start date for filtering blocks', example: '2023-01-01' })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({ description: 'End date for filtering blocks', example: '2023-01-31' })
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @ApiProperty({ description: 'Date to filter blocks by (ISO format)', example: '2025-03-18' })
  @IsNotEmpty()
  @IsDateString()
  readonly createdAt: string;

}