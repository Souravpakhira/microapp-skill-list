import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';

export class CreateSkillDto {
    @IsString()
    public name: string;

    @IsNumber()
    public domainMasterId: number;
}

export class BulkCreateSkillDto {
    @IsArray()
    public data: CreateSkillDto[]
}