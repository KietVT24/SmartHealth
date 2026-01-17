import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useSmartNavigation = () => {
  const router = useRouter();

  const navigateTo = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const goBack = useCallback(() => {
    try {
      router.back();
    } catch (error) {
      // Fallback to home if router.back() fails
      console.warn('Navigation back failed, redirecting to home:', error);
      router.push('/');
    }
  }, [router]);

  const navigateToRecipe = useCallback((recipeId: string | number) => {
    router.push(`/menu/recipe/${recipeId}`);
  }, [router]);

  const navigateToArticle = useCallback((articleId: string | number) => {
    router.push(`/community/article/${articleId}`);
  }, [router]);

  const navigateToProfile = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const navigateToProfileEdit = useCallback(() => {
    router.push('/profile/edit');
  }, [router]);

  const navigateToSettings = useCallback((setting?: string) => {
    if (setting) {
      router.push(`/settings/${setting}`);
    } else {
      router.push('/settings');
    }
  }, [router]);

  const navigateToAnalytics = useCallback(() => {
    router.push('/analytics');
  }, [router]);

  const navigateToAIChat = useCallback(() => {
    router.push('/ai-chat');
  }, [router]);

  const navigateToCommunity = useCallback(() => {
    router.push('/community');
  }, [router]);

  const navigateToMenu = useCallback(() => {
    router.push('/menu');
  }, [router]);

  const navigateToHome = useCallback(() => {
    router.push('/');
  }, [router]);

  // Specialized navigation handlers
  const handleBackFromRecipe = useCallback(() => {
    router.push('/menu');
  }, [router]);

  const handleBackFromArticle = useCallback(() => {
    router.push('/community');
  }, [router]);

  const handleBackFromProfile = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const handleLogout = useCallback(() => {
    const confirmed = window.confirm('Bạn có chắc muốn đăng xuất?');
    if (confirmed) {
      // Clear any auth tokens or user data here
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      router.push('/login');
    }
  }, [router]);

  return {
    // Basic navigation
    navigateTo,
    goBack,
    
    // Feature-specific navigation
    navigateToRecipe,
    navigateToArticle,
    navigateToProfile,
    navigateToProfileEdit,
    navigateToSettings,
    navigateToAnalytics,
    navigateToAIChat,
    navigateToCommunity,
    navigateToMenu,
    navigateToHome,
    
    // Back handlers
    handleBackFromRecipe,
    handleBackFromArticle,
    handleBackFromProfile,
    
    // Special actions
    handleLogout
  };
};

export default useSmartNavigation;