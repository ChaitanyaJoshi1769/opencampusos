import { apiClient } from '../api-client';

export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'active' | 'suspended' | 'graduated' | 'withdrawn';
  gpa?: number;
  programId?: string;
  cumulativeCredits: number;
  admissionDate?: string;
}

export interface Enrollment {
  id: string;
  sectionId: string;
  status: 'enrolled' | 'dropped' | 'completed';
  grade?: string;
  gradePoints?: number;
  attendancePercentage?: number;
}

export interface Transcript {
  id: string;
  gpa?: number;
  totalCredits?: number;
  honors?: string;
}

export const sisService = {
  async getStudent(studentId: string): Promise<Student> {
    return apiClient.get<Student>(`/v1/students/${studentId}`);
  },

  async listStudents(filters?: {
    status?: string;
    programId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ students: Student[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.programId) params.append('programId', filters.programId);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    return apiClient.get<{ students: Student[]; total: number }>(
      `/v1/students?${params.toString()}`,
    );
  },

  async updateStudent(
    studentId: string,
    data: Partial<Student>,
  ): Promise<Student> {
    return apiClient.patch<Student>(`/v1/students/${studentId}`, data);
  },

  async getStatistics(): Promise<{
    totalStudents: number;
    activeStudents: number;
    averageGPA: number;
  }> {
    return apiClient.get('/v1/students/statistics');
  },

  async getAtRiskStudents(): Promise<Student[]> {
    return apiClient.get('/v1/students/at-risk');
  },

  async searchStudents(query: string): Promise<Student[]> {
    return apiClient.get(`/v1/students/search?q=${encodeURIComponent(query)}`);
  },
};
