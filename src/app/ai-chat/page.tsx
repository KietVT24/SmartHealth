'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send,
  Mic,
  Paperclip,
  Home,
  BookOpen,
  Users as UsersIcon,
  MessageCircle,
  User,
  Bot,
  User2,
  Clock,
  CheckCircle,
  Sparkles,
  Heart,
  Brain,
  Target
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Xin chào! Tôi là Dr. Nutri, chuyên gia tư vấn dinh dưỡng thông minh cho trẻ em. Tôi có thể giúp gì cho bạn hôm nay?',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    {
      id: 1,
      text: 'Bé biếng ăn phải làm sao?',
      icon: '🍽️',
      category: 'eating'
    },
    {
      id: 2,
      text: 'Thực đơn tăng chiều cao',
      icon: '📏',
      category: 'height'
    },
    {
      id: 3,
      text: 'Dấu hiệu thiếu chất',
      icon: '⚠️',
      category: 'deficiency'
    }
  ];

  const features = [
    {
      icon: Clock,
      title: 'Tư vấn 24/7',
      description: 'Luôn sẵn sàng hỗ trợ'
    },
    {
      icon: Brain,
      title: 'Kiến thức khoa học',
      description: 'Dựa trên nghiên cứu y tế'
    },
    {
      icon: Target,
      title: 'Cá nhân hóa',
      description: 'Phù hợp với từng bé'
    },
    {
      icon: CheckCircle,
      title: 'Hiệu quả cao',
      description: 'Giải pháp thực tế'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getAIResponse(message),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('biếng ăn')) {
      return 'Tôi hiểu lo lắng của bạn về việc bé biếng ăn. Dưới đây là một số giải pháp hiệu quả:\n\n🥣 **Thay đổi thực đơn:**\n- Đa dạng hóa món ăn với màu sắc hấp dẫn\n- Cho bé tham gia vào quá trình nấu ăn\n- Chia nhỏ bữa ăn thành nhiều lần trong ngày\n\n⏰ **Thời gian ăn uống:**\n- Tạo không gian ăn uống vui vẻ, không áp lực\n- Giới hạn thời gian ăn khoảng 20-30 phút\n- Tránh cho bé ăn vặt trước bữa chính\n\n🥗 **Thực phẩm gợi ý:**\n- Cháo yến mạch chuối\n- Súp gà nấm\n- Cháo cá hồi bí đỏ\n\nBạn muốn tôi đưa ra thực đơn chi tiết cho bé không?';
    }
    
    if (message.includes('chiều cao') || message.includes('tăng chiều cao')) {
      return 'Để giúp bé tăng chiều cao tối ưu, bạn cần tập trung vào các yếu tố sau:\n\n🥛 **Dinh dưỡng cần thiết:**\n- **Canxi:** Sữa, sữa chua, phô mai, đậu phụ\n- **Protein:** Thịt, cá, trứng, các loại đậu\n- **Vitamin D:** Cá hồi, trứng, ánh nắng mặt trời\n- **Kẽm:** Thịt bò, hàu, hạt bí\n\n🏃‍♂️ **Vận động:**\n- Đạp xe, bơi lội, nhảy dây\n- Các bài tập kéo giãn nhẹ nhàng\n- Chơi ngoài trời ít nhất 30 phút/ngày\n\n😴 **Giấc ngủ:**\n- Ngủ đủ 8-10 giờ/đêm\n- Giờ ngủ cố định trước 22h\n\nBạn muốn tôi tư vấn thực đơn cụ thể cho độ tuổi của bé không?';
    }
    
    if (message.includes('thiếu chất') || message.includes('dấu hiệu')) {
      return 'Các dấu hiệu thiếu chất ở trẻ em thường bao gồm:\n\n🔍 **Dấu hiệu nhận biết:**\n- Mệt mỏi, hay quấy khóc\n- Chậm tăng trưởng, còi cọc\n- Da khô, tóc dễ gãy\n- Hay ốm vặt, miễn dịch kém\n- Chậm phát triển trí tuệ\n\n🧪 **Các loại thiếu chất phổ biến:**\n- **Thiếu sắt:** Mệt mỏi, da nhợt nhạt\n- **Thiếu canxi:** Chậm lớn, còi xương\n- **Thiếu vitamin A:** Khô mắt, dễ nhiễm trùng\n- **Thiếu kẽm:** Chậm ăn, biếng ăn\n\n💡 **Giải pháp:**\n- Khám dinh dưỡng định kỳ\n- Tăng cường thực phẩm đa dạng\n- Bổ sung vitamin theo chỉ định\n\nBạn có nghi ngờ bé đang thiếu chất cụ thể nào không?';
    }
    
    return 'Cảm ơn câu hỏi của bạn. Tôi đang phân tích và sẽ đưa ra tư vấn phù hợp nhất. Bạn có thể cho tôi biết thêm về độ tuổi của bé và vấn đề cụ thể bạn đang quan tâm để tôi tư vấn chính xác hơn nhé!';
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Dr. Nutri</h1>
                  <p className="text-xs text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Trực tuyến - Chuyên gia tư vấn
                  </p>
                </div>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Questions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {quickQuestions.map((question) => (
            <Card 
              key={question.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-green-300"
              onClick={() => handleQuickQuestion(question.text)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{question.icon}</div>
                <p className="text-sm font-medium text-gray-900">{question.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chat Messages */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="h-96 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className={
                        message.type === 'user' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }>
                        {message.type === 'user' ? (
                          <User2 className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-2">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-green-100 text-green-700">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Input Area */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Paperclip className="w-5 h-5 text-gray-500" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Nhập câu hỏi của bạn..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(inputMessage);
                    }
                  }}
                  className="pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"
                >
                  <Mic className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
              <Button 
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-green-600 hover:bg-green-700 text-white p-2"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-6 h-6 text-green-700" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
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
              onClick={() => window.location.href = '/community'}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition text-gray-500 hover:text-gray-700"
            >
              <UsersIcon className="w-5 h-5" />
              <span className="text-xs">Cộng đồng</span>
            </button>

            <button
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition text-green-600 bg-green-50"
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