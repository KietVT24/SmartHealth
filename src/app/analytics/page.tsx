'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Home,
  BookOpen,
  Users as UsersIcon,
  MessageCircle,
  User,
  TrendingUp,
  Baby,
  Calendar,
  Ruler,
  Weight,
  Activity,
  Plus,
  X,
  Check,
  AlertCircle,
  LineChart,
  BarChart3,
  Target,
  Brain,
  Heart,
  Eye,
  ChevronDown
} from 'lucide-react';

interface MetricsData {
  height: number;
  weight: number;
  headCircumference: number;
  measurementDate: string;
  notes: string;
}

interface NutritionalScore {
  category: string;
  score: number;
  color: string;
  icon: any;
}

interface ChildData {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
}

interface GrowthRecordData {
  id: string;
  height: number;
  weight: number;
  headCircumference: number | null;
  notes: string | null;
  measuredAt: string;
}

export default function Analytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showMetricsForm, setShowMetricsForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [children, setChildren] = useState<ChildData[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecordData[]>([]);
  const [metrics, setMetrics] = useState<MetricsData>({
    height: 67,
    weight: 7.2,
    headCircumference: 42,
    measurementDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Compute current stats from latest growth record
  const latestRecord = growthRecords.length > 0 ? growthRecords[growthRecords.length - 1] : null;
  const currentStats = {
    height: latestRecord?.height || 0,
    weight: latestRecord?.weight || 0,
    bmi: latestRecord ? Number((latestRecord.weight / Math.pow(latestRecord.height / 100, 2)).toFixed(1)) : 0,
  };

  const nutritionalScores: NutritionalScore[] = [
    { category: 'Trí tuệ', score: 85, color: 'bg-purple-500', icon: Brain },
    { category: 'Chiều cao', score: 78, color: 'bg-blue-500', icon: TrendingUp },
    { category: 'Cân nặng', score: 82, color: 'bg-green-500', icon: Weight },
    { category: 'Miễn dịch', score: 90, color: 'bg-pink-500', icon: Heart },
    { category: 'Thị lực', score: 75, color: 'bg-orange-500', icon: Eye }
  ];

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch children data
  useEffect(() => {
    const fetchChildren = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/children');
          if (response.ok) {
            const data = await response.json();
            setChildren(data);
            if (data.length > 0) {
              setSelectedChildId(data[0].id);
            }
          }
        } catch (error) {
          console.error('Error fetching children:', error);
        } finally {
          setIsFetchingData(false);
        }
      }
    };

    fetchChildren();
  }, [status]);

  // Fetch growth records when child is selected
  useEffect(() => {
    const fetchGrowthRecords = async () => {
      if (selectedChildId) {
        try {
          const response = await fetch(`/api/growth-records?childId=${selectedChildId}`);
          if (response.ok) {
            const data = await response.json();
            setGrowthRecords(data);
            
          }
        } catch (error) {
          console.error('Error fetching growth records:', error);
        }
      }
    };

    fetchGrowthRecords();
  }, [selectedChildId]);

  const growthData = {
    height: growthRecords.slice(-6).map(r => r.height),
    weight: growthRecords.slice(-6).map(r => r.weight),
    labels: growthRecords.slice(-6).map((_, i) => `T${i + 1}`)
  };

  // Calculate age in months
  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    return months;
  };

  const selectedChild = children.find(c => c.id === selectedChildId);

  const handleUpdateMetrics = async () => {
    if (!selectedChildId) {
      alert('Vui lòng chọn trẻ để cập nhật số đo');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/growth-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: selectedChildId,
          height: metrics.height,
          weight: metrics.weight,
          headCircumference: metrics.headCircumference,
          notes: metrics.notes,
          measuredAt: new Date(metrics.measurementDate).toISOString()
        })
      });

      if (response.ok) {
        const newRecord = await response.json();
        
        // Update local state
        setGrowthRecords(prev => [...prev, newRecord]);

        setShowMetricsForm(false);
        alert('Đã cập nhật số đo thành công ✓');
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.message || 'Không thể cập nhật số đo'}`);
      }
    } catch (error) {
      console.error('Error updating metrics:', error);
      alert('Lỗi khi cập nhật số đo');
    } finally {
      setIsLoading(false);
    }
  };

  const validateInput = (value: string, min: number, max: number): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  };

  // Show loading state
  if (status === 'loading' || isFetchingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  // Show message if no children
  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
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
                  <h1 className="text-xl font-bold text-gray-900">Phân tích & Phát triển</h1>
                  <p className="text-xs text-gray-500">Theo dõi sự tăng trưởng của bé</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="p-12 text-center">
              <Baby className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chưa có thông tin trẻ
              </h3>
              <p className="text-gray-600 mb-6">
                Vui lòng thêm thông tin trẻ để theo dõi sự phát triển
              </p>
              <Button 
                onClick={() => router.push('/profile')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Thêm thông tin trẻ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl font-bold text-gray-900">Phân tích & Phát triển</h1>
                <p className="text-xs text-gray-500">
                  {selectedChild ? selectedChild.name : 'Theo dõi sự tăng trưởng của bé'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {children.length > 1 && (
                <select
                  value={selectedChildId || ''}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>
              )}
              <Button 
                onClick={() => setShowMetricsForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Cập nhật số đo
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Current Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Chiều cao</p>
                  <p className="text-2xl font-bold">{currentStats.height} cm</p>
                  <p className="text-xs text-blue-100">+3cm/tháng</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Ruler className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Cân nặng</p>
                  <p className="text-2xl font-bold">{currentStats.weight} kg</p>
                  <p className="text-xs text-green-100">+0.7kg/tháng</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Weight className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">BMI</p>
                  <p className="text-2xl font-bold">{currentStats.bmi}</p>
                  <p className="text-xs text-purple-100">Bình thường</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Tuổi</p>
                  <p className="text-2xl font-bold">
                    {selectedChild ? calculateAge(selectedChild.dateOfBirth) : '--'} tháng
                  </p>
                  <p className="text-xs text-orange-100">
                    Sinh: {selectedChild ? new Date(selectedChild.dateOfBirth).toLocaleDateString('vi-VN') : '--'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Baby className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="w-5 h-5 text-blue-600" />
                <span>Biểu đồ chiều cao</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2">
                {growthData.height.map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t-lg relative group cursor-pointer hover:bg-blue-600 transition"
                      style={{ height: `${(height / 70) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {height} cm
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{growthData.labels[index]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span>Biểu đồ cân nặng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2">
                {growthData.weight.map((weight, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-500 rounded-t-lg relative group cursor-pointer hover:bg-green-600 transition"
                      style={{ height: `${(weight / 8) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {weight} kg
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{growthData.labels[index]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nutritional Score */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
              <span>Nutritional Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {nutritionalScores.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(item.score / 100) * 226} 226`}
                          className={item.color}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900">{item.score}%</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-1">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600">{item.category}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* BMI Standard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <span>Chuẩn BMI</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Thiếu cân</span>
                <div className="flex-1 mx-4 h-4 bg-gradient-to-r from-red-400 to-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">&lt; 15</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bình thường</span>
                <div className="flex-1 mx-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">15-18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Thừa cân</span>
                <div className="flex-1 mx-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">18-20</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Béo phì</span>
                <div className="flex-1 mx-4 h-4 bg-gradient-to-r from-red-400 to-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">&gt; 20</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">
                  BMI hiện tại của bé ({currentStats.bmi}) đang ở mức bình thường
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Update Form Modal */}
      {showMetricsForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Cập nhật số đo</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowMetricsForm(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiều cao (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="30"
                  max="200"
                  value={metrics.height}
                  onChange={(e) => setMetrics({...metrics, height: parseFloat(e.target.value) || 0})}
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">Phạm vi: 30-200 cm</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cân nặng (kg)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="2"
                  max="100"
                  value={metrics.weight}
                  onChange={(e) => setMetrics({...metrics, weight: parseFloat(e.target.value) || 0})}
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">Phạm vi: 2-100 kg</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chu vi đầu (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="30"
                  max="60"
                  value={metrics.headCircumference}
                  onChange={(e) => setMetrics({...metrics, headCircumference: parseFloat(e.target.value) || 0})}
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">Phạm vi: 30-60 cm</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày đo
                </label>
                <Input
                  type="date"
                  value={metrics.measurementDate}
                  onChange={(e) => setMetrics({...metrics, measurementDate: e.target.value})}
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú (tùy chọn)
                </label>
                <Input
                  type="text"
                  value={metrics.notes}
                  onChange={(e) => setMetrics({...metrics, notes: e.target.value})}
                  placeholder="Nhập ghi chú..."
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowMetricsForm(false)}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleUpdateMetrics}
                  disabled={isLoading || !validateInput(metrics.height.toString(), 30, 200) || !validateInput(metrics.weight.toString(), 2, 100)}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang lưu...</span>
                    </div>
                  ) : (
                    'Lưu'
                  )}
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