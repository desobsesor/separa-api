import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { BlockStyle } from '../schemas/block.schema';

export class CreateBlockDto {
  @ApiProperty({ description: 'Start time of the reservation block', example: '2023-10-15T10:00:00Z' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  readonly startTime: Date;

  @ApiProperty({ description: 'End time of the reservation block', example: '2023-10-15T11:00:00Z' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  readonly endTime: Date;

  @ApiProperty({ description: 'User ID associated with this reservation', example: '6151f7aa2d38c12e4c78e123' })
  @IsNotEmpty()
  @IsMongoId()
  readonly attachedUser: string;

  @ApiPropertyOptional({
    description: 'Style of the reservation block',
    enum: BlockStyle,
    default: BlockStyle.OTHER,
    example: BlockStyle.OTHER
  })
  @IsOptional()
  @IsEnum(BlockStyle)
  readonly style?: BlockStyle;

  @ApiPropertyOptional({ description: 'Creation timestamp (auto-generated if not provided)' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly createdAt?: Date;

  @ApiPropertyOptional({ description: 'Start time of the reservation block in string format' })
  @IsOptional()
  readonly startTimeStr?: string;
}