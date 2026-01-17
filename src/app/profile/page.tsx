'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationBell from '@/components/NotificationBell';
import {
  Home,
  BookOpen,
  Users as UsersIcon,
  MessageCircle,
  User,
  Settings,
  Bell,
  LogOut,
  Edit,
  Camera,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Shield,
  HelpCircle,
  ChevronRight,
  Baby,
  Heart,
  TrendingUp,
  Award,
  Plus,
  X
} from 'lucide-react';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const [newChild, setNewChild] = useState({
    name: '',
    dateOfBirth: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    avatar: ''
  });

  const user = {
    name: session?.user?.name || 'User',
    email: session?.user?.email || '',
    phone: '+84 123 456 789',
    address: 'Hà Nội, Việt Nam',
    joinDate: '15/03/2024',
    avatar: session?.user?.image || '/api/placeholder/150/150',
  };

  // Fetch children data
  useEffect(() => {
    const fetchChildren = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/children');
          if (response.ok) {
            const data = await response.json();
            setChildren(data);
          }
        } catch (error) {
          console.error('Error fetching children:', error);
        } finally {
          setIsLoadingChildren(false);
        }
      }
    };

    fetchChildren();
  }, [status]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect
  }

  const menuItems = [
    {
      icon: Edit,
      label: 'Chỉnh sửa thông tin',
      description: 'Cập nhật thông tin cá nhân',
      color: 'text-green-600',
      action: () => window.location.href = '/profile/edit'
    },
    {
      icon: Bell,
      label: 'Cài đặt thông báo',
      description: 'Quản lý thông báo ứng dụng',
      color: 'text-blue-600',
      action: () => window.location.href = '/settings/notifications'
    },
    {
      icon: Shield,
      label: 'Bảo mật',
      description: 'Cài đặt mật khẩu và bảo mật',
      color: 'text-purple-600',
      action: () => window.location.href = '/settings/security'
    },
    {
      icon: HelpCircle,
      label: 'Trợ giúp',
      description: 'Hỗ trợ và câu hỏi thường gặp',
      color: 'text-orange-600',
      action: () => window.location.href = '/help'
    }
  ];

  const stats = [
    {
      icon: Baby,
      label: 'Theo dõi',
      value: '6 tháng',
      color: 'bg-green-100 text-green-700'
    },
    {
      icon: Heart,
      label: 'Số đo',
      value: '12 lần',
      color: 'bg-pink-100 text-pink-700'
    },
    {
      icon: TrendingUp,
      label: 'Tăng trưởng',
      value: '+15%',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      icon: Award,
      label: 'Điểm',
      value: 'A+',
      color: 'bg-purple-100 text-purple-700'
    }
  ];

  const handleAddChild = async () => {
    if (!newChild.name || !newChild.dateOfBirth || !newChild.gender) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const response = await fetch('/api/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChild),
      });

      if (response.ok) {
        const child = await response.json();
        setChildren([...children, child]);
        setShowAddChildForm(false);
        setNewChild({
          name: '',
          dateOfBirth: '',
          gender: 'MALE',
          avatar: ''
        });
        alert('Đã thêm thông tin bé thành công!');
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.error || 'Không thể thêm thông tin bé'}`);
      }
    } catch (error) {
      console.error('Error adding child:', error);
      alert('Lỗi khi thêm thông tin bé');
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
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
                <h1 className="text-xl font-bold text-gray-900">Trang cá nhân</h1>
                <p className="text-xs text-gray-500">Quản lý thông tin và cài đặt</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <NotificationBell />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-green-100 text-green-700 text-2xl font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute bottom-0 right-0 w-8 h-8 p-0 bg-green-600 hover:bg-green-700 text-white rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.address}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Tham gia: {user.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Children Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Baby className="w-5 h-5 text-green-600" />
                <span>Thông tin bé</span>
              </div>
              <Button 
                onClick={() => setShowAddChildForm(true)}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm bé
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingChildren ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Đang tải...</p>
              </div>
            ) : children.length === 0 ? (
              <div className="text-center py-8">
                <Baby className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 mb-4">Chưa có thông tin bé</p>
                <Button 
                  onClick={() => setShowAddChildForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Thêm thông tin bé
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {children.map((child, index) => {
                    const calculateAge = (dateOfBirth: string) => {
                      const birth = new Date(dateOfBirth);
                      const now = new Date();
                      const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
                      const years = Math.floor(months / 12);
                      const remainingMonths = months % 12;
                      if (years > 0) {
                        return `${years} tuổi ${remainingMonths > 0 ? `${remainingMonths} tháng` : ''}`;
                      }
                      return `${months} tháng`;
                    };

                    return (
                      <div key={child.id} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">{child.name}</h3>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <div className="text-lg font-bold text-green-600">{calculateAge(child.dateOfBirth)}</div>
                            <div className="text-xs text-gray-500">Tuổi</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">{child.gender === 'MALE' ? 'Nam' : child.gender === 'FEMALE' ? 'Nữ' : 'Khác'}</div>
                            <div className="text-xs text-gray-500">Giới tính</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-purple-600">{new Date(child.dateOfBirth).toLocaleDateString('vi-VN')}</div>
                            <div className="text-xs text-gray-500">Ngày sinh</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => window.location.href = '/analytics'}
                >
                  Xem chi tiết phát triển
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Menu Items */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button 
          variant="outline" 
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </Button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Xác nhận đăng xuất
                </h3>
                <p className="text-gray-600">
                  Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={cancelLogout}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={confirmLogout}
                >
                  Đăng xuất
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Child Form Modal */}
      {showAddChildForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Baby className="w-5 h-5 text-green-600" />
                  <span>Thêm thông tin bé</span>
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAddChildForm(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên bé <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={newChild.name}
                  onChange={(e) => setNewChild({...newChild, name: e.target.value})}
                  placeholder="Nhập tên bé"
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={newChild.dateOfBirth}
                  onChange={(e) => setNewChild({...newChild, dateOfBirth: e.target.value})}
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <select
                  value={newChild.gender}
                  onChange={(e) => setNewChild({...newChild, gender: e.target.value as 'MALE' | 'FEMALE' | 'OTHER'})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL (tùy chọn)
                </label>
                <Input
                  type="text"
                  value={newChild.avatar}
                  onChange={(e) => setNewChild({...newChild, avatar: e.target.value})}
                  placeholder="https://example.com/avatar.jpg"
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddChildForm(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleAddChild}
                >
                  Thêm bé
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition text-green-600 bg-green-50"
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