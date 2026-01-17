'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  BookOpen,
  Users as UsersIcon,
  MessageCircle,
  User,
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  Syringe,
  Utensils,
  TrendingUp,
  FileText,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export default function Notifications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (status === 'authenticated') {
        try {
          const url = filter === 'unread' 
            ? '/api/notifications?unreadOnly=true' 
            : '/api/notifications';
          
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchNotifications();
  }, [status, filter]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'VACCINATION_REMINDER':
        return <Syringe className="w-5 h-5 text-blue-600" />;
      case 'MEAL_REMINDER':
        return <Utensils className="w-5 h-5 text-orange-600" />;
      case 'GROWTH_TRACKING':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'POST_APPROVED':
      case 'POST_REJECTED':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'RECIPE_APPROVED':
      case 'RECIPE_REJECTED':
        return <BookOpen className="w-5 h-5 text-pink-600" />;
      case 'COMMENT_REPLY':
        return <MessageCircle className="w-5 h-5 text-indigo-600" />;
      case 'SYSTEM':
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'VACCINATION_REMINDER':
        return 'bg-blue-50 border-blue-200';
      case 'MEAL_REMINDER':
        return 'bg-orange-50 border-orange-200';
      case 'GROWTH_TRACKING':
        return 'bg-green-50 border-green-200';
      case 'POST_APPROVED':
      case 'POST_REJECTED':
        return 'bg-purple-50 border-purple-200';
      case 'RECIPE_APPROVED':
      case 'RECIPE_REJECTED':
        return 'bg-pink-50 border-pink-200';
      case 'COMMENT_REPLY':
        return 'bg-indigo-50 border-indigo-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const handleMarkAsRead = async (notificationIds: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds }),
      });

      if (response.ok) {
        setNotifications(notifications.map(n => 
          notificationIds.includes(n.id) ? { ...n, read: true } : n
        ));
        setUnreadCount(Math.max(0, unreadCount - notificationIds.length));
        setSelectedIds([]);
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAllAsRead: true }),
      });

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await handleMarkAsRead([notification.id]);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
                className="p-2"
              >
                <span className="text-lg">←</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Thông báo</h1>
                <p className="text-xs text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả đã đọc'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button 
                  onClick={handleMarkAllAsRead}
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Đọc tất cả
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            className={filter === 'all' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Tất cả ({notifications.length})
          </Button>
          <Button
            onClick={() => setFilter('unread')}
            variant={filter === 'unread' ? 'default' : 'outline'}
            className={filter === 'unread' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Chưa đọc ({unreadCount})
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <Card className="mb-4 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Đã chọn {selectedIds.length} thông báo
                </span>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleMarkAsRead(selectedIds)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Đánh dấu đã đọc
                  </Button>
                  <Button
                    onClick={() => setSelectedIds([])}
                    size="sm"
                    variant="outline"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Hủy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Không có thông báo
              </h3>
              <p className="text-gray-600">
                {filter === 'unread' 
                  ? 'Bạn đã đọc tất cả thông báo' 
                  : 'Chưa có thông báo nào'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition hover:shadow-md border ${
                  notification.read ? 'bg-white' : getNotificationColor(notification.type)
                } ${selectedIds.includes(notification.id) ? 'ring-2 ring-green-500' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notification.id)}
                      onChange={() => toggleSelection(notification.id)}
                      className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div 
                      className="flex-1 min-w-0"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={`text-sm font-semibold ${
                          notification.read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Badge className="ml-2 bg-green-600 text-white">Mới</Badge>
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${
                        notification.read ? 'text-gray-500' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatTime(notification.createdAt)}
                        </span>
                        <div className="flex space-x-2">
                          {!notification.read && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead([notification.id]);
                              }}
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs text-green-600 hover:bg-green-50"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Đánh dấu đã đọc
                            </Button>
                          )}
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => window.location.href = '/'}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition text-gray-500 hover:text-gray-700"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Trang chủ</span>
            </button>

            <button
              onClick={() => window.location.href = '/menu'}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition text-gray-500 hover:text-gray-700"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs">Thực đơn</span>
            </button>

            <button
              onClick={() => window.location.href = '/community'}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition text-gray-500 hover:text-gray-700"
            >
              <UsersIcon className="w-5 h-5" />
              <span className="text-xs">Cộng đồng</span>
            </button>

            <button
              onClick={() => window.location.href = '/ai-chat'}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition text-gray-500 hover:text-gray-700"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">Dr. Nutri</span>
            </button>

            <button
              onClick={() => window.location.href = '/profile'}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition text-gray-500 hover:text-gray-700"
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Cá nhân</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
