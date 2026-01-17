import { prisma } from './prisma';

export type NotificationType = 
  | 'VACCINATION_REMINDER'
  | 'MEAL_REMINDER'
  | 'GROWTH_TRACKING'
  | 'POST_APPROVED'
  | 'POST_REJECTED'
  | 'RECIPE_APPROVED'
  | 'RECIPE_REJECTED'
  | 'COMMENT_REPLY'
  | 'SYSTEM';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

/**
 * Create a notification for a user
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link: link || null,
      },
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Create vaccination reminder notifications for upcoming vaccinations
 */
export async function createVaccinationReminders() {
  try {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Find vaccinations scheduled in the next 3 days that haven't been completed
    const upcomingVaccinations = await prisma.vaccination.findMany({
      where: {
        scheduledDate: {
          gte: now,
          lte: threeDaysFromNow,
        },
        completedDate: null,
      },
      include: {
        child: {
          include: {
            parent: true,
          },
        },
      },
    });

    // Create notifications for each upcoming vaccination
    for (const vaccination of upcomingVaccinations) {
      const daysUntil = Math.ceil(
        (new Date(vaccination.scheduledDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      await createNotification({
        userId: vaccination.child.parentId,
        type: 'VACCINATION_REMINDER',
        title: 'Nhắc nhở tiêm chủng',
        message: `Bé ${vaccination.child.name} có lịch tiêm ${vaccination.vaccineName} vào ${daysUntil} ngày nữa`,
        link: '/analytics',
      });
    }

    return upcomingVaccinations.length;
  } catch (error) {
    console.error('Error creating vaccination reminders:', error);
    throw error;
  }
}

/**
 * Create growth tracking reminder for children who haven't been measured recently
 */
export async function createGrowthTrackingReminders() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find children without recent growth records
    const children = await prisma.child.findMany({
      include: {
        growthRecords: {
          orderBy: {
            measuredAt: 'desc',
          },
          take: 1,
        },
        parent: true,
      },
    });

    let count = 0;
    for (const child of children) {
      const lastRecord = child.growthRecords[0];
      
      if (!lastRecord || new Date(lastRecord.measuredAt) < thirtyDaysAgo) {
        await createNotification({
          userId: child.parentId,
          type: 'GROWTH_TRACKING',
          title: 'Nhắc nhở theo dõi phát triển',
          message: `Đã lâu rồi bạn chưa cập nhật số đo cho bé ${child.name}. Hãy cập nhật để theo dõi sự phát triển của bé!`,
          link: '/analytics',
        });
        count++;
      }
    }

    return count;
  } catch (error) {
    console.error('Error creating growth tracking reminders:', error);
    throw error;
  }
}

/**
 * Notify user when their post is approved
 */
export async function notifyPostApproved(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    await createNotification({
      userId: post.authorId,
      type: 'POST_APPROVED',
      title: 'Bài viết đã được duyệt',
      message: `Bài viết "${post.title}" của bạn đã được duyệt và xuất bản`,
      link: `/community/posts/${postId}`,
    });
  } catch (error) {
    console.error('Error notifying post approval:', error);
    throw error;
  }
}

/**
 * Notify user when their post is rejected
 */
export async function notifyPostRejected(postId: string, reason?: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    await createNotification({
      userId: post.authorId,
      type: 'POST_REJECTED',
      title: 'Bài viết bị từ chối',
      message: reason 
        ? `Bài viết "${post.title}" của bạn bị từ chối. Lý do: ${reason}`
        : `Bài viết "${post.title}" của bạn bị từ chối`,
      link: `/community/posts/${postId}`,
    });
  } catch (error) {
    console.error('Error notifying post rejection:', error);
    throw error;
  }
}

/**
 * Notify user when their recipe is approved
 */
export async function notifyRecipeApproved(recipeId: string) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        author: true,
      },
    });

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    await createNotification({
      userId: recipe.authorId,
      type: 'RECIPE_APPROVED',
      title: 'Công thức đã được duyệt',
      message: `Công thức "${recipe.title}" của bạn đã được duyệt và xuất bản`,
      link: `/menu/recipes/${recipeId}`,
    });
  } catch (error) {
    console.error('Error notifying recipe approval:', error);
    throw error;
  }
}

/**
 * Notify user when their recipe is rejected
 */
export async function notifyRecipeRejected(recipeId: string, reason?: string) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        author: true,
      },
    });

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    await createNotification({
      userId: recipe.authorId,
      type: 'RECIPE_REJECTED',
      title: 'Công thức bị từ chối',
      message: reason 
        ? `Công thức "${recipe.title}" của bạn bị từ chối. Lý do: ${reason}`
        : `Công thức "${recipe.title}" của bạn bị từ chối`,
      link: `/menu/recipes/${recipeId}`,
    });
  } catch (error) {
    console.error('Error notifying recipe rejection:', error);
    throw error;
  }
}

/**
 * Notify user when someone replies to their comment
 */
export async function notifyCommentReply(commentId: string, replyAuthorId: string) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        author: true,
        post: true,
      },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    // Don't notify if replying to own comment
    if (comment.authorId === replyAuthorId) {
      return;
    }

    const replyAuthor = await prisma.user.findUnique({
      where: { id: replyAuthorId },
    });

    await createNotification({
      userId: comment.authorId,
      type: 'COMMENT_REPLY',
      title: 'Có người trả lời bình luận của bạn',
      message: `${replyAuthor?.name || 'Ai đó'} đã trả lời bình luận của bạn trong bài viết "${comment.post.title}"`,
      link: `/community/posts/${comment.postId}#comment-${commentId}`,
    });
  } catch (error) {
    console.error('Error notifying comment reply:', error);
    throw error;
  }
}

/**
 * Send system notification to a user
 */
export async function sendSystemNotification(
  userId: string,
  title: string,
  message: string,
  link?: string
) {
  return createNotification({
    userId,
    type: 'SYSTEM',
    title,
    message,
    link,
  });
}

/**
 * Send system notification to all users
 */
export async function sendSystemNotificationToAll(
  title: string,
  message: string,
  link?: string
) {
  try {
    const users = await prisma.user.findMany({
      where: {
        status: 'ACTIVE',
      },
    });

    const notifications = users.map(user => ({
      userId: user.id,
      type: 'SYSTEM' as NotificationType,
      title,
      message,
      link: link || null,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    return users.length;
  } catch (error) {
    console.error('Error sending system notification to all:', error);
    throw error;
  }
}
