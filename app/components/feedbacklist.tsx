'use client';

import { useState } from 'react';
import { analyzeSentiment } from '@/app/action/feedback';

interface Feedback {
  id: string;
  message: string;
  type: 'BUG' | 'FEATURE' | 'OTHER';
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'PENDING';
  sentimentScore: number | null;
  userEmail: string | null;
  userName: string | null;
  pageUrl: string | null;
  createdAt: Date;
  isRead: boolean;
  labels: Array<{
    label: {
      id: string;
      name: string;
      color: string;
    };
  }>;
}

export default function FeedbackList({ 
  feedback, 
  projectId 
}: { 
  feedback: Feedback[];
  projectId: string;
}) {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const handleAnalyzeSentiment = async (feedbackId: string) => {
    setAnalyzingId(feedbackId);
    
    try {
      const result = await analyzeSentiment(feedbackId);
      
      if (result.error) {
        alert(result.error);
      } else {
        // Refresh the page to show updated sentiment
        window.location.reload();
      }
    } catch (error) {
      alert('Failed to analyze sentiment');
    } finally {
      setAnalyzingId(null);
    }
  };

  const getBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE':
        return 'bg-green-100 text-green-800';
      case 'NEGATIVE':
        return 'bg-red-100 text-red-800';
      case 'NEUTRAL':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BUG':
        return 'bg-red-100 text-red-800';
      case 'FEATURE':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!feedback || feedback.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500 text-lg">No feedback yet</p>
        <p className="text-gray-400 mt-2">
          Install the widget on your site to start collecting feedback
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <div
          key={item.id}
          className={`bg-white rounded-lg shadow p-6 border-l-4 ${
            item.isRead ? 'border-gray-300' : 'border-blue-500'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(item.type)}`}>
                {item.type}
              </span>
             <span className={`px-2 py-1 rounded text-xs ${getBadgeColor(item.sentiment)}`}>
              {item.sentiment.toUpperCase()}
            </span>
              {item.labels.map((label) => (
                <span
                  key={label.label.id}
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ 
                    backgroundColor: label.label.color + '20',
                    color: label.label.color 
                  }}
                >
                  {label.label.name}
                </span>
              ))}
            </div>
            {/*
            <span className="text-sm text-gray-500">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>*/}
          </div>

          <p className="text-gray-800 mb-4">{item.message}</p>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              {item.userName && <span className="mr-4">👤 {item.userName}</span>}
              {item.userEmail && <span className="mr-4">📧 {item.userEmail}</span>}
              {item.pageUrl && (
                <a 
                  href={item.pageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  🔗 View Page
                </a>
              )}
            </div>

            {item.sentiment === 'PENDING' && (
              <button
                onClick={() => handleAnalyzeSentiment(item.id)}
                disabled={analyzingId === item.id}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {analyzingId === item.id ? 'Analyzing...' : '🤖 Analyze Sentiment'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
