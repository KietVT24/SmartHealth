# Hướng Dẫn Chạy Dự Án

## Yêu Cầu Hệ Thống

- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn
- Tài khoản Supabase (cho database)

## Bước 1: Tải Dự Án

Tải hoặc clone dự án từ repository.

## Bước 2: Cài Đặt Dependencies

```bash
npm install
```

## Bước 3: Thiết Lập Environment Variables

1. Tạo file `.env` trong thư mục gốc của dự án
2. Sao chép các biến môi trường từ file `.env` hiện có hoặc thiết lập của riêng bạn:

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

# Google OAuth (tùy chọn)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Email Server (tùy chọn)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your_email@gmail.com"
EMAIL_SERVER_PASSWORD="your_app_password"
EMAIL_FROM="your_email@gmail.com"
```

## Bước 4: Thiết Lập Database

1. Đăng nhập vào [Supabase Studio](https://app.supabase.com)
2. Tạo một dự án mới hoặc sử dụng dự án hiện có
3. Vào **SQL Editor**
4. Sao chép nội dung file `prisma/supabase_migration.sql`
5. Chạy script SQL để tạo các bảng và dữ liệu mẫu

## Bước 5: Chạy Dự Án

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt để xem ứng dụng.

## Các Lệnh Khác

- `npm run build`: Build cho production
- `npm start`: Chạy production server
- `npm run lint`: Kiểm tra linting

## Ghi Chú

- Đảm bảo rằng tất cả biến môi trường đã được thiết lập đúng
- Nếu gặp lỗi kết nối database, kiểm tra URL Supabase
- Ứng dụng sử dụng Socket.io cho real-time features
