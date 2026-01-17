'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  Eye,
  Calendar,
  User as UserIcon,
  Clock,
  CheckCircle,
  TrendingUp,
  Users as UsersIcon,
  Send,
  ThumbsUp,
  MoreHorizontal
} from 'lucide-react';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    isDoctor?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

export default function ArticleDetail() {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: {
        name: 'Me Lan',
        avatar: '/api/placeholder/40/40',
        isDoctor: false
      },
      content: 'Bài viết rất hữu ích! Tôi đã áp dụng cho bé nhà mình và thấy kết quả tốt. Cảm ơn bác sĩ đã chia sẻ kiến thức quý báu.',
      timestamp: '2 giờ trước',
      likes: 23,
      isLiked: false
    },
    {
      id: '2',
      author: {
        name: 'Bs. Trần Văn B',
        avatar: '/api/placeholder/40/40',
        isDoctor: true
      },
      content: 'Bài viết rất chi tiết và khoa học. Tôi muốn bổ sung thêm rằng ngoài dinh dưỡng, việc cho bé vận động hợp lý cũng rất quan trọng cho sự phát triển.',
      timestamp: '5 giờ trước',
      likes: 45,
      isLiked: true
    }
  ]);

  const article = {
    id: 1,
    title: '1000 ngày đầu đời: Nên tăng vàng cho sự phát triển của trẻ',
    excerpt: 'Giai đoạn 1000 ngày đầu đời là "cửa sổ vàng" cho sự phát triển toàn diện của trẻ. Đây là thời điểm não bộ phát triển nhanh nhất, chiếm khoảng 80% kích thước não người lớn...',
    content: `
# 1000 ngày đầu đời: Nên tăng vàng cho sự phát triển của trẻ

Giai đoạn 1000 ngày đầu đời là "cửa sổ vàng" cho sự phát triển toàn diện của trẻ. Đây là thời điểm não bộ phát triển nhanh nhất, chiếm khoảng 80% kích thước não người lớn, đồng thời là nền tảng cho sức khỏe thể chất và trí tuệ trong suốt cuộc đời.

## Tầm quan trọng của 1000 ngày đầu đời

1000 ngày đầu đời được tính từ thời điểm thụ thai đến khi trẻ được 2 tuổi, bao gồm:
- 270 ngày trong thai kỳ
- 365 ngày đầu đời
- 365 ngày năm thứ hai

Đây là giai đoạn "nhạy cảm" nhất, khi các cơ quan và hệ thống trong cơ thể trẻ phát triển với tốc độ nhanh nhất.

## Dinh dưỡng tối ưu cho sự phát triển

### 1. Sữa mẹ - "vàng trắng" quý giá
Sữa mẹ là nguồn dinh dưỡng hoàn hảo cho trẻ trong 6 tháng đầu đời:
- Chứa đầy đủ các chất dinh dưỡng cần thiết
- Chất kháng thể giúp tăng cường miễn dịch
- Dễ tiêu hóa, hấp thu tốt
- Tạo gắn kết tình cảm mẹ con

### 2. Dinh dưỡng bổ sung từ 6 tháng
Khi trẻ được 6 tháng, cần bắt đầu cho ăn dặm với các thực phẩm giàu dinh dưỡng:
- **Sắt**: Thịt bò, gan, lòng đỏ trứng
- **Canxi**: Sữa, phô mai, rau xanh đậm
- **Kẽm**: Hải sản, thịt, các loại đậu
- **Vitamin A**: Cà rốt, bí đỏ, rau xanh
- **Omega-3**: Cá hồi, các loại hạt

### 3. Các chất cần đặc biệt chú ý

**DHA cho phát triển não bộ:**
- Cá hồi, cá trích, cá mòi
- Các loại hạt (óc chó, hạnh nhân)
- Dầu thực vật

**Chất xơ cho hệ tiêu hóa:**
- Các loại rau xanh
- Trái cây tươi
- Ngũ cốc nguyên hạt

## Lời khuyên từ chuyên gia

1. **Cho bé bú mẹ hoàn toàn trong 6 tháng đầu**
2. **Bắt đầu ăn dặm đúng lúc (6 tháng)**
3. **Đa dạng hóa thực đơn**
4. **Tạo môi trường ăn uống tích cực**
5. **Theo dõi tăng trưởng định kỳ**

## Kết luận

Đầu tư vào dinh dưỡng trong 1000 ngày đầu đời là đầu tư cho tương lai của trẻ. Một nền tảng dinh dưỡng tốt sẽ giúp trẻ phát triển tối ưu về thể chất, trí tuệ và cảm xúc.
    `,
    author: {
      name: 'Bs. Nguyễn Thị An',
      title: 'Chuyên gia Dinh dưỡng',
      avatar: '/api/placeholder/40/40',
      isDoctor: true,
      followers: 5230
    },
    image: '/api/placeholder/800/400',
    category: 'Kiến thức',
    readTime: '5 phút đọc',
    likes: 234,
    comments: 45,
    shares: 12,
    views: 1520,
    tags: ['dinh dưỡng', '1000 ngày đầu đời', 'phát triển trẻ', 'sữa mẹ'],
    publishedAt: '2 ngày trước',
    lastUpdated: '2 ngày trước'
  };

  const relatedArticles = [
    {
      id: 2,
      title: 'Top 10 thực phẩm giúp bé tăng chiều cao',
      author: 'Bs. Trần Văn B',
      readTime: '3 phút đọc',
      likes: 189
    },
    {
      id: 3,
      title: 'Dấu hiệu nhận biết bé thiếu chất',
      author: 'Me Bông',
      readTime: '4 phút đọc',
      likes: 156
    }
  ];

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    console.log('Share article');
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'Nguyễn Vân A',
        avatar: '/api/placeholder/40/40',
        isDoctor: false
      },
      content: commentText,
      timestamp: 'Vừa xong',
      likes: 0,
      isLiked: false
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
        : comment
    ));
  };

  const handleBack = () => {
    window.location.href = '/community';
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
                <h1 className="text-xl font-bold text-gray-900">Chi tiết bài viết</h1>
                <p className="text-xs text-gray-500">Kiến thức từ chuyên gia</p>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Article Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{article.publishedAt}</span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {article.title}
                </h1>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={article.author.avatar} />
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {article.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-gray-900">
                          {article.author.name}
                        </span>
                        {article.author.isDoctor && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            BS
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{article.author.title}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Theo dõi
                  </Button>
                </div>

                <div className="w-full h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-6xl">💻</div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
                  />
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleLike}
                      className={`flex items-center space-x-1 ${isLiked ? 'text-red-600' : 'text-gray-500'}`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{article.likes + (isLiked ? 1 : 0)}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-500">
                      <MessageCircle className="w-4 h-4" />
                      <span>{article.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{article.views}</span>
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleShare}
                    className="text-gray-500"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span>Bình luận ({comments.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Comment Input */}
                <div className="flex space-x-3 mb-6">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                      NVA
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="relative">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Viết bình luận của bạn..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:border-green-500 focus:ring-green-500"
                        rows={3}
                      />
                      <Button
                        onClick={handleComment}
                        disabled={!commentText.trim()}
                        className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                          {comment.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">
                                {comment.author.name}
                              </span>
                              {comment.author.isDoctor && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  BS
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{comment.content}</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeComment(comment.id)}
                            className={`text-xs ${comment.isLiked ? 'text-red-600' : 'text-gray-500'}`}
                          >
                            <ThumbsUp className={`w-3 h-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                            Phản hồi
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tác giả</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={article.author.avatar} />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {article.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-gray-900">
                        {article.author.name}
                      </span>
                      {article.author.isDoctor && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          BS
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{article.author.title}</span>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600 mb-4">
                  <span className="font-semibold">{article.author.followers.toLocaleString()}</span>
                  <br />
                  người theo dõi
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Theo dõi
                </Button>
              </CardContent>
            </Card>

            {/* Related Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bài viết liên quan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedArticles.map((relatedArticle) => (
                    <div key={relatedArticle.id} className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition">
                      <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                        {relatedArticle.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{relatedArticle.author}</span>
                        <span>{relatedArticle.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Heart className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{relatedArticle.likes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Article Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thống kê</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lượt xem</span>
                    <span className="font-semibold">{article.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lượt thích</span>
                    <span className="font-semibold">{article.likes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bình luận</span>
                    <span className="font-semibold">{article.comments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Chia sẻ</span>
                    <span className="font-semibold">{article.shares}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}