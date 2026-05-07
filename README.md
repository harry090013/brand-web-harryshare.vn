# Harry Share - Website cá nhân

## Cách chạy
1. Tải về, giải nén
2. `npm install`
3. Tạo project Supabase free tại supabase.com
4. Vào SQL Editor, chạy file `lib/db-schema.sql`
5. Copy `.env.example` thành `.env.local` và điền keys
6. `npm run dev` → mở http://localhost:3000

## Cấu trúc
- app/ : các trang Next.js
- app/admin : trang quản trị
- components/ : LikeButton, CommentBox, OrderForm
- lib/supabase.ts : kết nối DB

## Deploy
- Push code lên Github
- Vào vercel.com → Import project → chọn repo
- Thêm env vars → Deploy
- Mua domain harryshare.vn → trỏ về Vercel

Admin: tạo user đầu tiên trong Supabase > Authentication > Add user
