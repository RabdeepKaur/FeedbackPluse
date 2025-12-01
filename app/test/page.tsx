import Script from 'next/script';

export default function TestWidgetPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Test Feedback Widget
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Look for the feedback button in the bottom-right corner of this page!
        </p>

        <div className="bg-blue-50 border-2 border-amber-100 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            <span>How to Test</span>
          </h3>
          <ol className="text-black space-y-2 ml-6 list-decimal">
            <li>Click the blue white  rectangle box  (bottom-right corner)</li>
            <li>Select a feedback type (Bug, Feature, or Other)</li>
            <li>Enter your message</li>
            <li>Click Send Feedback</li>
            <li>Check your dashboard to see it appear!</li>
          </ol>
        </div>

  
      </div>

      {/* Load the feedback widget */}
   <Script
  src="/widget.js"
  data-project="cminbjgfc0004xgbya707zvsv"
  data-api-url={process.env.NEXT_PUBLIC_API_URL|| 'http://localhost:3000'}
  data-position="bottom-right"
  async
></Script>
    </div>
  );
}