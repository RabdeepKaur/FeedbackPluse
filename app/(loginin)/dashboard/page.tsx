export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import { getUserProjects } from '@/app/action/project';
import { cookies } from 'next/headers';

export type DashboardProject = {
  id: string;
  name: string;
  projectKey: string;
  createdAt: Date;
  isActive: boolean;
  _count: {
    feedback: number;
  };
};
export default async function DashboardPage() {
  const user = await auth.getUser();

  console.log('Dashboard - User:', user ? user.email : 'No user found');

  if (!user) {
    console.log('Redirecting to login - no user found');
    redirect('/Auth/login');
  }
const { projects, error } = await getUserProjects();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link
            href="/dashboard/project/createform"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Project
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects && projects.length > 0 ? (
            projects.map(( project: DashboardProject) => (
              <Link
                key={project.id}
                href={`/dashboard/project/${project.id}`}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {project.name}
                </h3>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{project._count.feedback} feedback</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-4 text-xs text-gray-400 font-mono">
                  Key: {project.projectKey}
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No projects yet</p>
              <Link
                href="/dashboard/project/createform"
                className="text-blue-600 hover:underline"
              >
                Create your first project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
