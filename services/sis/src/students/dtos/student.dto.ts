import { IsString, IsEmail, IsOptional, IsDateString, IsNumber, Min, Max } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  studentId?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  programId?: string;

  @IsOptional()
  @IsDateString()
  admissionDate?: string;
}

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  status?: 'active' | 'suspended' | 'graduated' | 'withdrawn';

  @IsOptional()
  @IsString()
  programId?: string;
}

export class StudentListQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  programId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4)
  gpaMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}

export class UpdateGPADto {
  @IsNumber()
  @Min(0)
  @Max(4)
  gpa: number;
}
