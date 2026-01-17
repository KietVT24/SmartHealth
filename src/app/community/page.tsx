'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationBell from '@/components/NotificationBell';
import { 
  Search,
  Home,
  BookOpen,
  Users as UsersIcon,
  MessageCircle,
  User,
  Heart,
  Share2,
  Bookmark,
  TrendingUp,
  Clock,
  Eye
} from 'lucide-react';

export default function Community() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'knowledge', label: 'Kiến thức' },
    { id: 'experience', label: 'Kinh nghiệm' },
    { id: 'questions', label: 'Hỏi đáp' }
  ];

  const articles: any[] = [];

  const recommendedAuthors: any[] = [];

  const popularTags: any[] = [];

  const communityStats = {
    members: 0,
    articles: 0,
    doctors: 0,
    dailyActive: 0
  };

  const handleArticleClick = (articleId: number) => {
    window.location.href = `/community/article/${articleId}`;
  };

  const handleTagClick = (tagName: string) => {
    setSearchQuery(tagName);
  };

  const handleFollowAuthor = async (authorId: number) => {
    // Implement follow logic
    console.log('Follow author:', authorId);
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
                <h1 className="text-xl font-bold text-gray-900">Cộng đồng Smart Health</h1>
                <p className="text-xs text-gray-500">Chia sẻ kiến thức, kinh nghiệm nuôi con</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <NotificationBell />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Search and Tabs */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="flex space-x-2 overflow-x-auto">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Articles List */}
            <div className="space-y-6">
              {articles.length === 0 ? (
                <div className="text-center py-16">
                  <UsersIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có bài viết nào</h3>
                  <p className="text-gray-500">Các bài viết từ cộng đồng sẽ được cập nhật sớm</p>
                </div>
              ) : (
                articles.map((article) => (
                  <Card 
                    key={article.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden group"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {article.category}
                            </Badge>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{article.readTime}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{article.publishedAt}</span>
                          </div>

                          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition">
                            {article.title}
                          </h3>

                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {article.excerpt}
                          </p>

                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={article.author.avatar} />
                                <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                                  {article.author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-sm font-medium text-gray-900">
                                    {article.author.name}
                                  </span>
                                  {article.author.isDoctor && (
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                      BS
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">{article.author.title}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{article.views}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="w-3 h-3" />
                                <span>{article.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="w-3 h-3" />
                                <span>{article.comments}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Share2 className="w-3 h-3" />
                                <span>{article.shares}</span>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFollowAuthor(article.id);
                              }}
                              className="text-xs"
                            >
                              {article.author.isFollowing ? 'Đang theo dõi ✓' : 'Theo dõi +'}
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-3">
                            {article.tags.map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="text-xs cursor-pointer hover:bg-green-50 hover:border-green-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTagClick(tag);
                                }}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="w-32 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <div className="text-2xl">📝</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thống kê cộng đồng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{communityStats.members.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Thành viên</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{communityStats.articles.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Bài viết</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{communityStats.doctors}</div>
                    <div className="text-xs text-gray-500">Chuyên gia</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{communityStats.dailyActive.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Hoạt động/ngày</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Authors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tác giả đề xuất</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedAuthors.map((author) => (
                    <div key={author.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={author.avatar} />
                          <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                            {author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium text-gray-900">
                              {author.name}
                            </span>
                            {author.title.includes('Bs.') && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                BS
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{author.followers.toLocaleString()} người theo dõi</span>
                        </div>
                      </div>
                      <Button
                        variant={author.isFollowing ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleFollowAuthor(author.id)}
                        className="text-xs"
                      >
                        {author.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags phổ biến</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-green-50 hover:border-green-300 text-xs"
                      onClick={() => handleTagClick(tag.name)}
                    >
                      {tag.name} ({tag.count})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
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
              onClick={() => window.location.href = '/menu'}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition text-gray-500 hover:text-gray-700"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs">Thực đơn</span>
            </button>

            <button
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition text-green-600 bg-green-50"
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