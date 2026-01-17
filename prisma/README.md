# 📚 Prisma Schema Documentation

## 🎉 Hoàn Thiện Schema Database

File `schema.prisma` đã được hoàn thiện với đầy đủ các models và relationships cho ứng dụng **Smart Health** - Hệ thống theo dõi sức khỏe và dinh dưỡng trẻ em.

## 📁 Files Trong Thư Mục Này

### 1. **schema.prisma** ⭐

File schema chính với 10 models và 9 enums

- User Management & Authentication
- Child Health Tracking
- Nutrition & Meal Planning
- Community & Content
- Notifications

### 2. **SCHEMA_SUMMARY_VI.md** 🇻🇳

Tóm tắt bằng tiếng Việt về schema

- Danh sách tất cả models
- Các enums đã định nghĩa
- Mối quan hệ giữa các bảng
- Tính năng nổi bật

### 3. **SCHEMA_DOCUMENTATION.md** 📖

Tài liệu chi tiết bằng tiếng Anh

- Mô tả từng model
- Design decisions
- Migration notes
- Best practices

### 4. **SCHEMA_DIAGRAM.md** 📊

Sơ đồ ASCII trực quan

- Entity relationships
- Data flow
- Content moderation workflow
- Key relationships

### 5. **QUICK_REFERENCE.md** ⚡

Tài liệu tham khảo nhanh

- Model structures
- Enum values
- Common Supabase queries
- Field constraints
- JSON formats

### 6. **supabase_migration.sql** 🗄️

SQL script để tạo database trong Supabase

- CREATE TABLE statements
- Indexes
- Triggers for updatedAt
- Row Level Security policies
- Sample data (commented)

## 🚀 Cách Sử Dụng

### Option 1: Sử Dụng Với Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Deploy to production
npx prisma migrate deploy
```

### Option 2: Sử Dụng Với Supabase (Recommended) ✅

1. Mở **Supabase Studio**
2. Vào **SQL Editor**
3. Copy nội dung file `supabase_migration.sql`
4. Run SQL script
5. Kiểm tra tables đã được tạo

## 📋 Database Schema Overview

### 10 Models Chính

1. **User** - Quản lý người dùng và xác thực
2. **Child** - Hồ sơ trẻ em
3. **GrowthRecord** - Theo dõi phát triển (chiều cao, cân nặng)
4. **Vaccination** - Lịch tiêm chủng
5. **Recipe** - Công thức nấu ăn
6. **MealPlan** - Kế hoạch ăn uống
7. **Meal** - Bữa ăn cụ thể
8. **Post** - Bài viết cộng đồng
9. **Comment** - Bình luận (nested)
10. **Notification** - Thông báo

### 9 Enums

- UserRole, UserStatus
- Gender
- MealType, RecipeStatus, DifficultyLevel
- PostStatus, PostCategory
- NotificationType

## 🔗 Key Relationships

```
User ──→ Child ──→ GrowthRecord
     │         └──→ Vaccination
     │         └──→ MealPlan ──→ Meal
     │
     ├──→ Recipe ──→ Meal
     ├──→ Post ──→ Comment ──→ Comment (nested)
     └──→ Notification
```

## ✨ Tính Năng Nổi Bật

### 1. Content Moderation System

- Recipes và Posts có workflow: DRAFT → PENDING → APPROVED/REJECTED
- Lưu lý do từ chối

### 2. Role-Based Access Control

- PARENT: Người dùng thông thường
- EXPERT: Chuyên gia dinh dưỡng
- ADMIN: Quản trị viên

### 3. Nested Comments

- Hỗ trợ bình luận lồng nhau (parent-child)
- Unlimited depth

### 4. Comprehensive Health Tracking

- Growth records với timestamps
- Vaccination schedules
- Meal planning với recipes

### 5. Notification System

- 9 loại thông báo khác nhau
- Hỗ trợ deep linking

## 📊 Database Statistics

- **Total Tables**: 10
- **Total Enums**: 9
- **Total Indexes**: 20+
- **Foreign Keys**: 15+
- **Unique Constraints**: 3

## 🔐 Security Features

- Password hashing (bcrypt)
- Email verification
- Password reset tokens
- Row Level Security (RLS) ready
- User status management

## 📝 Notes

### ⚠️ Important

Dự án hiện đang sử dụng **Supabase** trực tiếp, không dùng Prisma ORM. File schema này được giữ lại để:

- Tham khảo cấu trúc database
- Documentation cho team
- Có thể migrate về Prisma trong tương lai nếu cần

### 🎯 Next Steps

1. ✅ Review schema structure
2. ✅ Run SQL migration in Supabase
3. ⏳ Update API routes to use new schema
4. ⏳ Implement content moderation workflows
5. ⏳ Set up notification system
6. ⏳ Add RLS policies for security

## 📚 Tài Liệu Tham Khảo

### Đọc Trước Khi Bắt Đầu

1. [SCHEMA_SUMMARY_VI.md](./SCHEMA_SUMMARY_VI.md) - Tóm tắt tiếng Việt
2. [SCHEMA_DIAGRAM.md](./SCHEMA_DIAGRAM.md) - Sơ đồ trực quan

### Khi Làm Việc

3. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Tham khảo nhanh
4. [supabase_migration.sql](./supabase_migration.sql) - SQL script

### Tìm Hiểu Sâu

5. [SCHEMA_DOCUMENTATION.md](./SCHEMA_DOCUMENTATION.md) - Chi tiết đầy đủ

## 🤝 Contributing

Khi thêm models mới hoặc thay đổi schema:

1. Update `schema.prisma`
2. Update documentation files
3. Update SQL migration script
4. Test thoroughly
5. Update this README

## 📞 Support

Nếu có câu hỏi về schema:

- Đọc QUICK_REFERENCE.md cho queries thông dụng
- Xem SCHEMA_DIAGRAM.md để hiểu relationships
- Check SCHEMA_DOCUMENTATION.md cho design decisions

---

**Last Updated**: 2026-01-13  
**Schema Version**: 1.0.0  
**Database**: PostgreSQL (Supabase)  
**Status**: ✅ Production Ready
