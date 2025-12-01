'use client';

import { useRouter, useSearchParams } from 'next/navigation';
type FeedbackFilterspromps = {
  selectedType: string;
  selectedSentiment: string;
};
export default function FeedbackFilters({ selectedType, selectedSentiment }: FeedbackFilterspromps)  {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentType = searchParams.get('type') || 'ALL';
  const currentSentiment = searchParams.get('sentiment') || 'ALL';

  const handleTypeFilter = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === 'ALL') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    router.push(`?${params.toString()}`);
  };

  const handleSentimentFilter = (sentiment: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sentiment === 'ALL') {
      params.delete('sentiment');
    } else {
      params.set('sentiment', sentiment);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 mb-3">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Type Filter */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feedback Type
          </label>
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'BUG', 'FEATURE', 'OTHER'].map((type) => (
              <button
                key={type}
                onClick={() => handleTypeFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Sentiment Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sentiment
          </label>
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'POSITIVE', 'NEUTRAL', 'NEGATIVE', 'PENDING'].map((sentiment) => (
              <button
                key={sentiment}
                onClick={() => handleSentimentFilter(sentiment)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentSentiment === sentiment
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {sentiment}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
