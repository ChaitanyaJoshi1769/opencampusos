import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { sisService } from '@/lib/services/sis.service';

export default function Home() {
  const studentId = process.env.NEXT_PUBLIC_STUDENT_ID || 'STU-001';

  const { data: student, isLoading, error } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => sisService.getStudent(studentId),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error || !student) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading student data. Please try again.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-8 rounded-lg">
          <h1 className="text-3xl font-bold">Welcome, {student.firstName}!</h1>
          <p className="text-blue-100 mt-2">Student ID: {student.studentId}</p>
        </div>

        <StudentDashboard student={student} />
      </div>
    </Layout>
  );
}
