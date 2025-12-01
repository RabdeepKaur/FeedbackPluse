import { getProjectById } from '@/app/action/project';
import { getProjectFeedback } from '@/app/action/feedback';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Filter from '@/app/components/filter';
import FeedbackList from '@/app/components/feedbacklist';
import Pagination from '@/app/components/Pageination';

export default async function ProjectPage({ 
  params ,
 searchParams
}: { 
  params: Promise<{ id: string }> 
  searchParams:{type?:string;
     sentiment?:string ;
page?:string;
  }
}) {
  // Await params in Next.js 15+
  const { id } = await params;
  const resolvedSearch = await searchParams;

  console.log("SERVER SEARCH PARAMS:", resolvedSearch);

  const user = await auth.getUser();
  if (!user) redirect('/Auth/login');

  const { project, error: projectError } = await getProjectById(id);
  if (projectError || !project) redirect('/dashboard');

  const { feedback = [] } = await getProjectFeedback(id);

  // Filters
  const selectedType = resolvedSearch.type || 'ALL';
  const selectedSentiment = resolvedSearch.sentiment || 'ALL';

  const filteredFeedback = feedback
    .filter((item: any) => {
      const matchType = selectedType === 'ALL' || item.type === selectedType;
      const matchSentiment = selectedSentiment === 'ALL' || item.sentiment === selectedSentiment;
      return matchType && matchSentiment;
    })
    .map((item: any) => ({ ...item, isRead: item.isRead ?? false,
     }));

  // Pagination
  const page = Number(resolvedSearch.page) || 1;
  const pageSize = 10;

  const start = (page - 1) * pageSize;
  const paginatedFeedback = filteredFeedback.slice(start, start + pageSize);

  const totalPages = Math.ceil(filteredFeedback.length / pageSize);

console.log("FILTER TYPE:", selectedType);
console.log("FILTER SENTIMENT:", selectedSentiment);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">Embed Script:</p>
            <code className=" text-black block p-3 bg-white rounded border text-sm overflow-x-auto">
              {/** we have to add lit compoent here  */}
              {`<script src="${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/widget.js" data-project="${project.projectKey}"></script>`}
            </code>
          </div>
        </div>
{/*
        <div className="mt-6">
          <h2 className="text-black text-2xl font-bold mb-4">Feedback</h2>
          <Filter/>
          {feedback && feedback.length > 0 ? (
            <div className="space-y-4">
              {feedback.map((item: any) => (
                <div key={item.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {item.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-800">{item.message}</p>
                  {item.userEmail && (
                    <p className="text-sm text-gray-500 mt-2">From: {item.userEmail}</p>
                  )}
                </div>
              ))}
              <div>

                </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg">No feedback yet</p>
              <p className="text-gray-400 mt-2">
                Install the widget on your site to start collecting feedback
              </p>
            </div>
          )}
        </div>*/}
       {/* Filters */}
              <Filter
          selectedType={selectedType}
          selectedSentiment={selectedSentiment}
        />

        <FeedbackList feedback={paginatedFeedback} projectId={id} />

        <Pagination
          totalPages={totalPages}
        />


      </div>
    </div>
  );
}