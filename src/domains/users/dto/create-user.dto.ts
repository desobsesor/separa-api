import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({ description: 'Physical address of the user', example: '123 Main St, City' })
    @IsNotEmpty()
    @IsString()
    readonly address: string;

    @ApiProperty({ description: 'Contact phone number', example: '+1234567890' })
    @IsNotEmpty()
    //@IsPhoneNumber()
    readonly phoneNumber: string;

    @ApiProperty({ description: 'Email address (must be unique)', example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: 'User password (min 6 characters)', example: 'password123', minLength: 6 })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @IsOptional()
    readonly password?: string;

    @ApiPropertyOptional({ description: 'Creation timestamp (auto-generated if not provided)' })
    @IsOptional()
    readonly createdAt?: Date;
}