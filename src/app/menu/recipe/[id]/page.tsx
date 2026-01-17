'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock,
  Users,
  Flame,
  Star,
  ChefHat,
  Heart,
  Share2,
  Bookmark,
  ArrowLeft,
  TrendingUp,
  Shield,
  Eye,
  Calendar,
  User as UserIcon,
  CheckCircle,
  ShoppingBasket,
  Utensils
} from 'lucide-react';

export default function RecipeDetail() {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const recipe = {
    id: 1,
    name: 'Cháo cá hồi bí đỏ',
    image: '/api/placeholder/600/400',
    time: '35 phút',
    difficulty: 'Dễ',
    servings: '2 người',
    calories: 280,
    protein: 18,
    fat: 12,
    carbs: 32,
    fiber: 6,
    rating: 4.8,
    reviews: 124,
    author: {
      name: 'Bs. Nguyễn Thị An',
      title: 'Chuyên gia Dinh dưỡng',
      avatar: '/api/placeholder/40/40',
      isDoctor: true
    },
    healthScore: 'A+',
    nutritionBenefits: [
      'Tăng miễn dịch',
      'Bổ sung vitamin D',
      'Phát triển thị lực',
      'Tốt cho não bộ'
    ],
    ingredients: [
      '100g cá hồi tươi',
      '150g bí đỏ',
      '50g gạo tẻ',
      '1 lít nước dùng',
      'Hành lá, rau mùi',
      'Muối, tiêu, dầu ăn'
    ],
    instructions: [
      {
        step: 1,
        title: 'Sơ chế nguyên liệu',
        description: 'Cá hồi làm sạch, cắt hạt lựu. Bí đỏ gọt vỏ, cắt hạt lựu. Gạo vo sạch.'
      },
      {
        step: 2,
        title: 'Nấu cháo',
        description: 'Cho gạo vào nồi, đổ nước dùng đun sôi. Hạ nhỏ lửa, ninh khoảng 20 phút cho gạo nhừ.'
      },
      {
        step: 3,
        title: 'Thêm cá và bí',
        description: 'Cho bí đỏ vào ninh thêm 10 phút. Sau đó cho cá hồi vào, nấu khoảng 5 phút cho cá chín.'
      },
      {
        step: 4,
        title: 'Hoàn thành',
        description: 'Nêm nếm gia vị vừa ăn. Rắc hành lá, rau mùi thái nhỏ lên trên. Tắt bếp.'
      }
    ],
    nutritionScores: [
      { category: 'Protein', score: 85, color: 'bg-blue-500' },
      { category: 'Vitamin D', score: 92, color: 'bg-yellow-500' },
      { category: 'Omega-3', score: 88, color: 'bg-green-500' },
      { category: 'Fiber', score: 70, color: 'bg-purple-500' }
    ],
    tags: ['tăng chiều cao', 'tăng cường miễn dịch', 'phát triển trí não'],
    publishedAt: '2 ngày trước',
    prepTime: '15 phút',
    cookTime: '20 phút'
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share recipe');
  };

  const handleBack = () => {
    window.location.href = '/menu';
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
                onClick={handleBack}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Chi tiết công thức</h1>
                <p className="text-xs text-gray-500">Hướng dẫn nấu ăn chi tiết</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleShare}
                className="p-2"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSave}
                className={`p-2 ${isSaved ? 'text-green-600' : 'text-gray-500'}`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Image and Basic Info */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <div className="w-full h-64 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                    <div className="text-6xl">🍲</div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{recipe.rating}</span>
                    <span className="text-sm text-gray-500">({recipe.reviews})</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold">Điểm sức khỏe: {recipe.healthScore}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{recipe.name}</h2>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Flame className="w-4 h-4" />
                      <span>{recipe.calories} cal</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ChefHat className="w-4 h-4" />
                      <span>{recipe.difficulty}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={recipe.author.avatar} />
                        <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                          {recipe.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium text-gray-900">
                            {recipe.author.name}
                          </span>
                          {recipe.author.isDoctor && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              BS
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{recipe.author.title}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{recipe.publishedAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Lợi ích dinh dưỡng</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {recipe.nutritionBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-800">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBasket className="w-5 h-5 text-blue-600" />
                  <span>Nguyên liệu</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Utensils className="w-5 h-5 text-purple-600" />
                  <span>Hướng dẫn thực hiện</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recipe.instructions.map((instruction) => (
                    <div key={instruction.step} className="flex space-x-4">
                      <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                        {instruction.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {instruction.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {instruction.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nutrition Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin dinh dưỡng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Calo</span>
                    <span className="font-semibold">{recipe.calories} kcal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Protein</span>
                    <span className="font-semibold text-blue-600">{recipe.protein}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Chất béo</span>
                    <span className="font-semibold text-orange-600">{recipe.fat}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tinh bột</span>
                    <span className="font-semibold text-purple-600">{recipe.carbs}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Chất xơ</span>
                    <span className="font-semibold text-green-600">{recipe.fiber}g</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Điểm dinh dưỡng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recipe.nutritionScores.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">{item.category}</span>
                        <span className="text-sm font-semibold">{item.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thời gian thực hiện</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-gray-600">Sơ chế</span>
                    </div>
                    <span className="font-semibold">{recipe.prepTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center">
                        <Flame className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-gray-600">Nấu</span>
                    </div>
                    <span className="font-semibold">{recipe.cookTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-gray-600">Tổng cộng</span>
                    </div>
                    <span className="font-semibold text-green-600">{recipe.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleLike}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Đã thích' : 'Thích công thức'}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}