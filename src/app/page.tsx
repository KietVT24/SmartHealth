'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Baby, 
  Heart, 
  TrendingUp, 
  Calendar, 
  Clock,
  Users,
  BookOpen,
  MessageCircle,
  Home,
  Pill,
  User
} from 'lucide-react';

export default function SmartHealthHome() {
  const [activeTab, setActiveTab] = useState('home');
  const { data: session, status } = useSession();
  const router = useRouter();

  const recentActivities: any[] = [];

  // Handler to check authentication before accessing features
  const handleFeatureClick = (path: string) => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else {
      router.push(path);
    }
  };

  const features = [
    {
      id: 1,
      title: 'Tăng Chiều Cao',
      description: 'Theo dõi và cải thiện chiều cao',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-700 border-green-200',
      path: '/analytics'
    },
    {
      id: 2,
      title: 'Kiểm Soát Cân Nặng',
      description: 'Quản lý cân nặng khoa học',
      icon: Heart,
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      path: '/analytics'
    },
    {
      id: 3,
      title: 'Dinh Dưỡng',
      description: 'Thực đơn thông minh',
      icon: Baby,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      path: '/menu'
    },
    {
      id: 4,
      title: 'Lịch Tiêm Chủng',
      description: 'Nhắc nhở tiêm chủng',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      path: '/analytics'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Baby className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart Health</h1>
                <p className="text-xs text-gray-500">Dinh đường khoa học – Con khoe, mẹ vui</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative" onClick={() => handleFeatureClick('/notifications')}>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs">🔔</span>
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              <Avatar 
                className="w-8 h-8 cursor-pointer hover:opacity-80 transition hover:ring-2 hover:ring-green-500"
                onClick={() => handleFeatureClick('/profile')}
              >
                <AvatarImage src={session?.user?.image || "/api/placeholder/40/40"} />
                <AvatarFallback className="bg-green-100 text-green-700 text-xs font-semibold">
                  {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Chào mừng mẹ quay trở lại! 👋
          </h2>
          <p className="text-gray-600">
            Hôm nay bé đã sẵn sàng cho một ngày phát triển khỏe mạnh yet?
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-opacity-50 group"
                onClick={() => handleFeatureClick(feature.path)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span>Hoạt động gần đây</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Chưa có hoạt động nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                      <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900">
                          {activity.title}
                        </h4>
                        <p className="text-xs text-gray-500 mb-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Tuổi của bé</p>
                  <p className="text-2xl font-bold">--</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Baby className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Chiều cao</p>
                  <p className="text-2xl font-bold">-- cm</p>
                  <p className="text-xs text-blue-100">Chưa có dữ liệu</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Cân nặng</p>
                  <p className="text-2xl font-bold">-- kg</p>
                  <p className="text-xs text-purple-100">Chưa có dữ liệu</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition ${
                activeTab === 'home' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Trang chủ</span>
            </button>

            <button
              onClick={() => window.location.href = '/menu'}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition ${
                activeTab === 'menu' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs">Thực đơn</span>
            </button>

            <button
              onClick={() => window.location.href = '/community'}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition ${
                activeTab === 'community' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">Cộng đồng</span>
            </button>

            <button
              onClick={() => window.location.href = '/ai-chat'}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition ${
                activeTab === 'ai' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">Dr. Nutri</span>
            </button>

            <button
              onClick={() => window.location.href = '/profile'}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition ${
                activeTab === 'profile' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
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