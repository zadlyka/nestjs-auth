import { IsNotEmpty, MaxLength, IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @MaxLength(64)
  @IsEmail()
  readonly username: string;

  @IsNotEmpty()
  @MaxLength(8)
  @IsString()
  readonly password: string;
}
