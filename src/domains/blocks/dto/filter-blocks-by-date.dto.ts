import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { PaginationDto } from '../../users/dto/pagination.dto';

export class FilterBlocksByDateDto extends PaginationDto {
    @ApiProperty({ description: 'Date to filter blocks by (ISO format)', example: '2025-03-18' })
    @IsNotEmpty()
    @IsDateString()
    readonly date: string;
}