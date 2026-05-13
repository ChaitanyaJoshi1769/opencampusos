import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            🎓 OpenCampusOS
          </Link>

          <div className="flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-blue-600">
              Courses
            </Link>
            <Link href="/grades" className="text-gray-700 hover:text-blue-600">
              Grades
            </Link>
            <Link href="/transcript" className="text-gray-700 hover:text-blue-600">
              Transcript
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-blue-600">
              Profile
            </Link>
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
