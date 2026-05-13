import { Resolver, Query, Mutation, Args, ObjectType, Field, Int } from '@nestjs/graphql';
import { StudentService } from '../services/student.service';
import { Student as StudentEntity } from '@prisma/client';

@ObjectType('Student')
class StudentType implements StudentEntity {
  @Field()
  id: string;

  @Field()
  tenantId: string;

  @Field()
  userId: string;

  @Field()
  studentId: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field()
  status: string;

  @Field({ nullable: true })
  admissionDate?: Date;

  @Field({ nullable: true })
  graduationDate?: Date;

  @Field({ nullable: true })
  programId?: string;

  @Field({ nullable: true })
  classYear?: string;

  @Field(() => Number, { nullable: true })
  gpa?: number;

  @Field(() => Number)
  cumulativeCredits: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date;
}

@ObjectType()
class StudentListResult {
  @Field(() => [StudentType])
  students: StudentType[];

  @Field(() => Int)
  total: number;
}

@ObjectType()
class StudentStatistics {
  @Field(() => Int)
  totalStudents: number;

  @Field(() => Int)
  activeStudents: number;

  @Field(() => Int)
  graduatedStudents: number;

  @Field(() => Int)
  withdrawnStudents: number;

  @Field(() => Number)
  averageGPA: number;
}

@Resolver(() => StudentType)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query(() => StudentType)
  async student(
    @Args('id') id: string,
  ): Promise<StudentType> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    return this.studentService.getStudent(tenantId, id);
  }

  @Query(() => StudentListResult)
  async students(
    @Args('status', { nullable: true }) status?: string,
    @Args('programId', { nullable: true }) programId?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ): Promise<StudentListResult> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    return this.studentService.listStudents(tenantId, {
      status,
      programId,
      limit,
      offset,
    });
  }

  @Query(() => [StudentType])
  async searchStudents(
    @Args('query') query: string,
  ): Promise<StudentType[]> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    return this.studentService.searchStudents(tenantId, query);
  }

  @Query(() => [StudentType])
  async atRiskStudents(): Promise<StudentType[]> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    return this.studentService.getAtRiskStudents(tenantId);
  }

  @Query(() => StudentStatistics)
  async studentStatistics(): Promise<StudentStatistics> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    return this.studentService.getStatistics(tenantId);
  }

  @Mutation(() => StudentType)
  async createStudent(
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('email') email: string,
    @Args('programId', { nullable: true }) programId?: string,
  ): Promise<StudentType> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    return this.studentService.createStudent(tenantId, {
      firstName,
      lastName,
      email,
      programId,
    });
  }

  @Mutation(() => StudentType)
  async updateStudent(
    @Args('id') id: string,
    @Args('firstName', { nullable: true }) firstName?: string,
    @Args('lastName', { nullable: true }) lastName?: string,
    @Args('status', { nullable: true }) status?: string,
  ): Promise<StudentType> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    return this.studentService.updateStudent(tenantId, id, {
      firstName,
      lastName,
      status: status as any,
    });
  }

  @Mutation(() => StudentType)
  async updateGPA(
    @Args('id') id: string,
    @Args('gpa', { type: () => Number }) gpa: number,
  ): Promise<StudentType> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    return this.studentService.updateGPA(tenantId, id, gpa);
  }

  @Mutation(() => Boolean)
  async deleteStudent(
    @Args('id') id: string,
  ): Promise<boolean> {
    const tenantId = process.env.CURRENT_TENANT_ID || '';
    const result = await this.studentService.deleteStudent(tenantId, id);
    return result.success;
  }
}
