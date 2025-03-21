import { IsOptional, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';

export class FilterUsersDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Value to filter users by (searches in name, address, phone, email)', example: 'john' })
  @IsOptional()
  @IsString()
  readonly filterValue?: string;

  @ApiPropertyOptional({ description: 'Specific fields to search in (name, address, phoneNumber, email)', example: ['name', 'email'], type: [String] })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  readonly tags?: string[];

  @ApiPropertyOptional({ description: 'Start time for filtering users by block date', example: '2023-01-01T00:00:00Z' })
  @IsOptional()
  @IsString()
  readonly startTime?: string;
}