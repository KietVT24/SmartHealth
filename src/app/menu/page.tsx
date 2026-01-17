'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Filter,
  Clock,
  Users,
  Flame,
  Star,
  ChevronDown,
  Home,
  BookOpen,
  Users as UsersIcon,
  MessageCircle,
  User
} from 'lucide-react';

export default function SmartMenu() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    people: '2',
    nutrition: 'all',
    age: '0-14'
  });

  const recipes: any[] = [];

  const handleRecipeClick = (recipeId: number) => {
    window.location.href = `/menu/recipe/${recipeId}`;
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
                <h1 className="text-xl font-bold text-gray-900">Thực đơn thông minh</h1>
                <p className="text-xs text-gray-500">Gợi ý món ăn khoa học cho bé</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="relative">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs">🔔</span>
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 border-gray-200 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Số người:</span>
              <select 
                value={selectedFilters.people}
                onChange={(e) => setSelectedFilters({...selectedFilters, people: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="1">1 người</option>
                <option value="2">2 người</option>
                <option value="3">3 người</option>
                <option value="4">4 người</option>
                <option value="5+">5+ người</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Dinh dưỡng:</span>
              <select 
                value={selectedFilters.nutrition}
                onChange={(e) => setSelectedFilters({...selectedFilters, nutrition: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="all">Tất cả</option>
                <option value="protein">Giàu protein</option>
                <option value="vitamin">Giàu vitamin</option>
                <option value="calcium">Giàu canxi</option>
                <option value="iron">Giàu sắt</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Độ tuổi:</span>
              <select 
                value={selectedFilters.age}
                onChange={(e) => setSelectedFilters({...selectedFilters, age: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="0-1">0-1 tuổi</option>
                <option value="1-3">1-3 tuổi</option>
                <option value="3-6">3-6 tuổi</option>
                <option value="6-10">6-10 tuổi</option>
                <option value="10-14">10-14 tuổi</option>
                <option value="0-14">0-14 tuổi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có công thức nào</h3>
              <p className="text-gray-500">Các công thức nấu ăn sẽ được cập nhật sớm</p>
            </div>
          ) : (
            recipes.map((recipe) => (
              <Card 
                key={recipe.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden group"
                onClick={() => handleRecipeClick(recipe.id)}
              >
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                    <div className="text-4xl">🍲</div>
                  </div>
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-semibold">{recipe.rating}</span>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-green-600 transition">
                    {recipe.name}
                  </h3>

                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{recipe.servings}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Flame className="w-3 h-3" />
                      <span>{recipe.calories} cal</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-600 font-medium">P: {recipe.protein}g</span>
                      <span className="text-orange-600 font-medium">F: {recipe.fat}g</span>
                    </div>
                    <span className="text-gray-400">{recipe.reviews} đánh giá</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {recipe.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRecipeClick(recipe.id);
                    }}
                  >
                    Xem công thức
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
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
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition text-green-600 bg-green-50"
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