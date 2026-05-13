import React from 'react';
import { Student } from '@/lib/services/sis.service';
import { StatCard } from './StatCard';

interface StudentDashboardProps {
  student: Student;
}

export function StudentDashboard({ student }: StudentDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Current GPA"
          value={student.gpa?.toFixed(2) || 'N/A'}
          subtitle="Cumulative"
          color="bg-blue-500"
        />
        <StatCard
          title="Credits Earned"
          value={student.cumulativeCredits.toString()}
          subtitle="Total"
          color="bg-green-500"
        />
        <StatCard
          title="Status"
          value={student.status.charAt(0).toUpperCase() + student.status.slice(1)}
          subtitle="Enrollment Status"
          color="bg-purple-500"
        />
        <StatCard
          title="Year"
          value={student.status === 'active' ? 'Junior' : 'N/A'}
          subtitle="Class Standing"
          color="bg-orange-500"
        />
      </div>

      {/* Student Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 text-sm">Full Name</p>
            <p className="text-lg font-semibold">
              {student.firstName} {student.lastName}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Student ID</p>
            <p className="text-lg font-semibold">{student.studentId}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-lg font-semibold">{student.email}</p>
          </div>
          {student.phone && (
            <div>
              <p className="text-gray-600 text-sm">Phone</p>
              <p className="text-lg font-semibold">{student.phone}</p>
            </div>
          )}
          {student.admissionDate && (
            <div>
              <p className="text-gray-600 text-sm">Admission Date</p>
              <p className="text-lg font-semibold">
                {new Date(student.admissionDate).toLocaleDateString()}
              </p>
            </div>
          )}
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <p className="text-lg font-semibold capitalize">{student.status}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition text-left">
            <p className="font-semibold text-blue-600">📚 View Courses</p>
            <p className="text-sm text-gray-600">See your current enrollment</p>
          </button>
          <button className="bg-green-50 border-2 border-green-200 rounded-lg p-4 hover:bg-green-100 transition text-left">
            <p className="font-semibold text-green-600">📊 Check Grades</p>
            <p className="text-sm text-gray-600">View your current grades</p>
          </button>
          <button className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 hover:bg-purple-100 transition text-left">
            <p className="font-semibold text-purple-600">📄 Get Transcript</p>
            <p className="text-sm text-gray-600">Download your transcript</p>
          </button>
        </div>
      </div>

      {/* AI Copilot Widget */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">🤖 AI Academic Assistant</h2>
        <p className="mb-4">Ask questions about your courses, degree requirements, or academic planning.</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask anything about your academics..."
            className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-blue-100 outline-none"
          />
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
