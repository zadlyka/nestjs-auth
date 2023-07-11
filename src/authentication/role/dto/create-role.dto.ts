import { IsNotEmpty, MaxLength, IsString, IsEnum } from 'class-validator';
import { Permission } from '../enums/permission.enum';

export class CreateRoleDto {
  @IsNotEmpty()
  @MaxLength(64)
  @IsString()
  readonly name: string;

  @IsEnum(Permission, { each: true })
  @IsNotEmpty()
  readonly permissions: Permission[];
}
