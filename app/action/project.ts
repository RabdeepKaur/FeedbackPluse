'use server';

import prisma  from '@/lib/prisma';
import { auth } from '@/lib/auth'; // Your auth helper
import { revalidatePath } from 'next/cache';

export async function createProject(formData: FormData) {
  try {
    const userId = await auth.getUserId(); // Get current user ID
    
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    const name = formData.get('name') as string;
    

    if (!name || name.trim().length === 0) {
      return { error: 'Project name is required' };
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),

        userId,
      },
    });

    revalidatePath('/dashboard');
    
    return { 
      success: true, 
      project: {
        id: project.id,
        name: project.name,
        projectKey: project.projectKey,
      }
    };
  } catch (error) {
    console.error('Create project error:', error);
    return { error: 'Failed to create project' };
  }
}

export async function getUserProjects() {
  try {
    const userId = await auth.getUserId();
    
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        projectKey: true,
        createdAt: true,
        isActive: true,
        _count: {
          select: { feedback: true },
        },
      },
    });

    return { projects };
  } catch (error) {
    console.error('Get projects error:', error);
    return { error: 'Failed to fetch projects' };
  }
}

export async function getProjectById(projectId: string) {
  try {
    const userId = await auth.getUserId();
    
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    const project = await prisma.project.findFirst({
      where: { 
        id: projectId,
        userId, // Ensure user owns this project
      },
      include: {
        _count: {
          select: { feedback: true },
        },
      },
    });

    if (!project) {
      return { error: 'Project not found' };
    }

    return { project };
  } catch (error) {
    console.error('Get project error:', error);
    return { error: 'Failed to fetch project' };
  }
}

export async function deleteProject(projectId: string) {
  try {
    const userId = await auth.getUserId();
    
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    await prisma.project.delete({
      where: { 
        id: projectId,
        userId, // Ensure user owns this project
      },
    });

    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Delete project error:', error);
    return { error: 'Failed to delete project' };
  }
}
