'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

type SentimentType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

export async function getProjectFeedback(
  projectId: string,
  filters?: {
    type?: 'BUG' | 'FEATURE' | 'OTHER';
    isRead?: boolean;
    sentiment?: SentimentType;
  }
) {
  try {
    const feedback = await prisma.feedback.findMany({
      where: {
        projectId,
        ...(filters?.type && { type: filters.type }),
        ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
        ...(filters?.sentiment && { sentiment: filters.sentiment }),
      },
      include: {
        labels: {
          include: {
            label: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { feedback };
  } catch (error) {
    console.error('Get feedback error:', error);
    return { error: 'Failed to fetch feedback' };
  }
}

export async function analyzeSentiment(feedbackId: string) {
  try {
    const userId = await auth.getUserId();
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      include: {
        project: {
          select: { userId: true },
        },
      },
    });

    if (!feedback) {
      return { error: 'Feedback not found' };
    }

    // Verify user owns this project
    if (feedback.project.userId !== userId) {
      return { error: 'Unauthorized' };
    }

    // Call AI API for sentiment analysis
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/analyze-sentiment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedbackId: feedback.id,
        message: feedback.message,
        type: feedback.type,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to analyze sentiment');
    }

    // Update feedback with sentiment
    const updated = await prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        sentiment: data.sentiment,
        sentimentScore: data.score,
      },
    });

    revalidatePath(`/dashboard/project/${feedback.projectId}`);

    return { 
      success: true,
      sentiment: updated.sentiment,
      score: updated.sentimentScore,
    };
  } catch (error: unknown) {
    console.error('Analyze sentiment error:', error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : 'Failed to analyze sentiment';
    return { error: message };
  }
}