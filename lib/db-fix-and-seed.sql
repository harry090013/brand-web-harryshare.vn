-- ============================================================
-- HARRYSHARE - FINAL FIX (v3)
-- Chạy trong Supabase SQL Editor
-- ============================================================

-- ============================================================
-- BLOCK 1: Tạo lại bảng COMMENTS với schema đúng
-- (Schema cũ dùng article_id + author_id cho authenticated users
--  Schema mới dùng post_slug + name để cho phép public comment)
-- ============================================================

-- Backup dữ liệu cũ (nếu có)
-- create table if not exists comments_backup as select * from comments;

-- Xóa và tạo lại
drop table if exists comments cascade;

create table comments (
  id uuid default gen_random_uuid() primary key,
  post_slug text not null,
  name text not null,
  content text not null,
  approved boolean default false,
  created_at timestamp default now()
);

-- RLS cho comments
alter table comments enable row level security;

create policy "public read approved comments" on comments
  for select using (approved = true);

create policy "public insert comments" on comments
  for insert with check (true);

create policy "admin full access comments" on comments
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- BLOCK 2: Seed data - Comments (sau khi tạo lại bảng)
-- ============================================================
insert into comments (post_slug, name, content, approved) values
(
  'bat-dau-lam-san-pham-tu-so-khong',
  'Minh Tuan',
  'Bài viết rất hay anh ơi! Anh có thể chia sẻ thêm về cách tìm khách hàng đầu tiên không?',
  false
),
(
  'bat-dau-lam-san-pham-tu-so-khong',
  'Linh Chi',
  'Cảm ơn anh đã chia sẻ hành trình thực tế. Bài này giúp mình rất nhiều!',
  true
),
(
  'code-khong-can-hoc-dai-hoc',
  'Hoang Nam',
  'Lộ trình học code của anh rất thực tế. Tháng 3-4 anh học JavaScript từ nguồn nào vậy?',
  false
);

-- ============================================================
-- BLOCK 3: Kiểm tra toàn bộ dữ liệu
-- ============================================================
select 'categories' as table_name, count(*)::text as total from categories
union all select 'posts', count(*)::text from posts
union all select 'products_owned', count(*)::text from products_owned
union all select 'products_affiliate', count(*)::text from products_affiliate
union all select 'comments', count(*)::text from comments
union all select 'orders', count(*)::text from orders
union all select 'courses', count(*)::text from courses;
