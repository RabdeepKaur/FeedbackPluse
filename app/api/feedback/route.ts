export const runtime = "nodejs"; 
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      projectKey,
      type,
      message,
      userEmail,
      userName,
      pageUrl,
    } = body;

    // Validation
    if (!projectKey) {
      return NextResponse.json(
        { error: 'Project key is required' },
        { status: 400 }
      );
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Find project by key
    const project = await prisma.project.findUnique({
      where: { projectKey },
      select: {
        id: true,
        isActive: true,
        allowedDomains: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Invalid project key' },
        { status: 404 }
      );
    }

    if (!project.isActive) {
      return NextResponse.json(
        { error: 'Project is not active' },
        { status: 403 }
      );
    }

    // Check CORS / allowed domains
    const origin = request.headers.get('origin');
    if (project.allowedDomains.length > 0 && origin) {
      const originDomain = new URL(origin).hostname;
      const isAllowed = project.allowedDomains.some((domain:string) => {
        return originDomain === domain || originDomain.endsWith(`.${domain}`);
      });

      if (!isAllowed) {
        return NextResponse.json(
          { error: 'Domain not allowed' },
          { status: 403 }
        );
      }
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        projectId: project.id,
        type: type || 'OTHER',
        message: message.trim(),
        userEmail: userEmail || null,
        userName: userName || null,
        pageUrl: pageUrl || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        feedbackId: feedback.id,
        message: 'Feedback received successfully',
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
