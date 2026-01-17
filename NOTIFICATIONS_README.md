# Hệ Thống Thông Báo

## Tổng Quan

Hệ thống thông báo cung cấp khả năng gửi và quản lý thông báo cho người dùng, bao gồm:

- Thông báo nhắc nhở tiêm chủng
- Thông báo theo dõi phát triển
- Thông báo duyệt/từ chối bài viết
- Thông báo duyệt/từ chối công thức
- Thông báo trả lời bình luận
- Thông báo hệ thống

## Các Loại Thông Báo

### 1. VACCINATION_REMINDER

Nhắc nhở người dùng về lịch tiêm chủng sắp tới cho con của họ.

### 2. MEAL_REMINDER

Nhắc nhở về bữa ăn hoặc kế hoạch dinh dưỡng.

### 3. GROWTH_TRACKING

Nhắc nhở cập nhật số đo phát triển của trẻ.

### 4. POST_APPROVED / POST_REJECTED

Thông báo khi bài viết được duyệt hoặc bị từ chối.

### 5. RECIPE_APPROVED / RECIPE_REJECTED

Thông báo khi công thức được duyệt hoặc bị từ chối.

### 6. COMMENT_REPLY

Thông báo khi có người trả lời bình luận.

### 7. SYSTEM

Thông báo hệ thống chung.

## API Endpoints

### GET /api/notifications

Lấy danh sách thông báo của người dùng hiện tại.

**Query Parameters:**

- `unreadOnly` (boolean): Chỉ lấy thông báo chưa đọc
- `limit` (number): Số lượng thông báo tối đa (mặc định: 50)

**Response:**

```json
{
  "notifications": [...],
  "unreadCount": 5
}
```

### POST /api/notifications

Tạo thông báo mới.

**Body:**

```json
{
  "type": "SYSTEM",
  "title": "Tiêu đề thông báo",
  "message": "Nội dung thông báo",
  "link": "/optional-link"
}
```

### PATCH /api/notifications

Đánh dấu thông báo đã đọc.

**Body (đánh dấu nhiều thông báo):**

```json
{
  "notificationIds": ["id1", "id2", "id3"]
}
```

**Body (đánh dấu tất cả):**

```json
{
  "markAllAsRead": true
}
```

### DELETE /api/notifications

Xóa thông báo.

**Query Parameters:**

- `id` (string): ID của thông báo cần xóa
- `deleteAll` (boolean): Xóa tất cả thông báo đã đọc

### POST /api/notifications/reminders

Trigger tạo thông báo nhắc nhở tự động (dành cho cron job).

**Headers:**

```
Authorization: Bearer YOUR_CRON_SECRET
```

**Response:**

```json
{
  "success": true,
  "message": "Reminders created successfully",
  "data": {
    "vaccinationReminders": 3,
    "growthTrackingReminders": 5,
    "total": 8
  }
}
```

## Sử Dụng Utility Functions

### Import

```typescript
import {
  createNotification,
  notifyPostApproved,
  notifyPostRejected,
  notifyRecipeApproved,
  notifyRecipeRejected,
  notifyCommentReply,
  sendSystemNotification,
  sendSystemNotificationToAll,
} from "@/lib/notifications";
```

### Ví Dụ: Thông báo bài viết được duyệt

```typescript
await notifyPostApproved(postId);
```

### Ví Dụ: Thông báo bài viết bị từ chối

```typescript
await notifyPostRejected(postId, "Nội dung không phù hợp");
```

### Ví Dụ: Gửi thông báo hệ thống

```typescript
await sendSystemNotification(
  userId,
  "Cập nhật hệ thống",
  "Hệ thống sẽ bảo trì vào 2h sáng ngày mai",
  "/maintenance"
);
```

### Ví Dụ: Gửi thông báo cho tất cả người dùng

```typescript
await sendSystemNotificationToAll(
  "Tính năng mới",
  "Chúng tôi vừa ra mắt tính năng theo dõi phát triển!",
  "/analytics"
);
```

## Component NotificationBell

Component hiển thị icon chuông thông báo với số lượng thông báo chưa đọc.

### Sử Dụng

```tsx
import NotificationBell from "@/components/NotificationBell";

function Header() {
  return (
    <header>
      <NotificationBell />
    </header>
  );
}
```

### Tính Năng

- Hiển thị số lượng thông báo chưa đọc
- Tự động cập nhật mỗi 30 giây
- Click để chuyển đến trang thông báo

## Trang Notifications

Trang `/notifications` hiển thị danh sách thông báo với các tính năng:

### Tính Năng

- ✅ Lọc thông báo (Tất cả / Chưa đọc)
- ✅ Đánh dấu đã đọc (từng thông báo hoặc tất cả)
- ✅ Chọn nhiều thông báo để thao tác hàng loạt
- ✅ Xóa thông báo
- ✅ Hiển thị thời gian tương đối (vừa xong, 5 phút trước, ...)
- ✅ Icon và màu sắc khác nhau cho từng loại thông báo
- ✅ Click vào thông báo để chuyển đến trang liên quan

## Thiết Lập Cron Job (Tùy Chọn)

Để tự động gửi thông báo nhắc nhở, bạn có thể thiết lập cron job:

### Vercel Cron Jobs

Thêm vào `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/notifications/reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Manual Cron (Linux/Mac)

```bash
# Chạy mỗi ngày lúc 9h sáng
0 9 * * * curl -X POST https://your-domain.com/api/notifications/reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### GitHub Actions

Tạo file `.github/workflows/notifications.yml`:

```yaml
name: Send Notifications
on:
  schedule:
    - cron: "0 9 * * *" # 9 AM daily
  workflow_dispatch:

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Reminders
        run: |
          curl -X POST https://your-domain.com/api/notifications/reminders \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## Bảo Mật

1. **CRON_SECRET**: Đặt giá trị bảo mật trong file `.env`:

   ```
   CRON_SECRET="your-secure-random-secret-here"
   ```

2. **Authentication**: Tất cả API endpoints đều yêu cầu xác thực người dùng (trừ endpoint reminders).

3. **Authorization**: Người dùng chỉ có thể xem/sửa/xóa thông báo của chính họ.

## Tùy Chỉnh

### Thêm Loại Thông Báo Mới

1. Thêm vào enum `NotificationType` trong `src/lib/notifications.ts`
2. Thêm icon và màu sắc trong `src/app/notifications/page.tsx`:
   ```typescript
   const getNotificationIcon = (type: string) => {
     switch (type) {
       case "YOUR_NEW_TYPE":
         return <YourIcon className="w-5 h-5 text-blue-600" />;
       // ...
     }
   };
   ```

### Tùy Chỉnh Thời Gian Polling

Trong `NotificationBell.tsx`, thay đổi interval:

```typescript
const interval = setInterval(fetchUnreadCount, 60000); // 60 giây
```

## Troubleshooting

### Thông báo không hiển thị

- Kiểm tra xem người dùng đã đăng nhập chưa
- Kiểm tra console để xem có lỗi API không
- Xác nhận database có bảng `notifications`

### Số lượng chưa đọc không cập nhật

- Kiểm tra polling interval trong NotificationBell
- Xóa cache trình duyệt
- Kiểm tra API `/api/notifications` có hoạt động không

### Cron job không chạy

- Xác nhận CRON_SECRET đúng
- Kiểm tra logs của cron job
- Test endpoint bằng Postman/curl
