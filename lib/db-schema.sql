-- ============================================================
-- HARRYSHARE - FULL DATABASE SCHEMA (Chạy trong Supabase SQL Editor)
-- Chạy từng block, nếu bảng đã tồn tại thì bỏ qua block đó
-- ============================================================

-- ============================================================
-- 1. BẢNG POSTS (Bài viết)
-- ============================================================
-- Nếu bảng chưa tồn tại:
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  excerpt text,         -- Tóm tắt ngắn hiển thị ngoài danh sách
  category text,
  image text,
  content_html text,    -- Nội dung HTML từ TinyMCE
  published boolean default false,
  published_at timestamp,
  likes int default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Nếu bảng đã tồn tại mà có cột "description" thay vì "excerpt", chạy lệnh này:
-- alter table posts rename column description to excerpt;

-- Thêm cột updated_at nếu chưa có:
alter table posts add column if not exists updated_at timestamp default now();
alter table posts add column if not exists excerpt text;

-- ============================================================
-- 2. BẢNG CATEGORIES (Danh mục)
-- ============================================================
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamp default now()
);

-- Thêm một vài danh mục mặc định:
insert into categories (name, slug, description) values
  ('Làm sản phẩm', 'lam-san-pham', 'Hành trình xây dựng sản phẩm số từ đầu'),
  ('Code thực chiến', 'code', 'Kỹ thuật và code trong thực tế'),
  ('Nhật ký', 'nhat-ky', 'Ghi chép hành trình cá nhân')
on conflict (slug) do nothing;

-- ============================================================
-- 3. BẢNG PRODUCTS_AFFILIATE (Sản phẩm giới thiệu)
-- ============================================================
create table if not exists products_affiliate (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  description text,
  content_html text,
  affiliate_url text,
  image text,
  price int,
  published boolean default true,
  created_at timestamp default now()
);

-- ============================================================
-- 4. BẢNG PRODUCTS_OWNED (Sản phẩm của mình)
-- ============================================================
create table if not exists products_owned (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  short_desc text,
  content_html text,
  price int,
  images text[],
  published boolean default true,
  created_at timestamp default now()
);

-- ============================================================
-- 5. BẢNG COURSES (Khóa học)
-- ============================================================
create table if not exists courses (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text,
  content_html text,
  image text,
  price int,
  published boolean default false,
  created_at timestamp default now()
);

-- ============================================================
-- 6. BẢNG COMMENTS (Bình luận)
-- ============================================================
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  post_slug text not null,
  name text not null,
  content text not null,
  approved boolean default false,
  created_at timestamp default now()
);

-- ============================================================
-- 7. BẢNG ORDERS (Đơn hàng)
-- ============================================================
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  product_id uuid,
  product_name text,
  name text,
  phone text,
  address text,
  note text,
  status text default 'new',
  created_at timestamp default now()
);

-- ============================================================
-- 8. DATABASE FUNCTIONS
-- ============================================================
-- Hàm tăng like bài viết
create or replace function increment_likes(post_slug text)
returns void language sql as $$
  update posts set likes = likes + 1 where slug = post_slug;
$$;

-- Trigger tự cập nhật updated_at khi sửa bài viết
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_updated_at on posts;
create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();

-- ============================================================
-- 9. RLS POLICIES (Row Level Security)
-- ============================================================

-- === POSTS ===
alter table posts enable row level security;

-- Public chỉ đọc bài đã xuất bản
drop policy if exists "public read posts" on posts;
create policy "public read posts" on posts
  for select using (published = true);

-- Admin (người đăng nhập) có toàn quyền
drop policy if exists "admin full access posts" on posts;
create policy "admin full access posts" on posts
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- === CATEGORIES ===
alter table categories enable row level security;

drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories
  for select using (true);

drop policy if exists "admin full access categories" on categories;
create policy "admin full access categories" on categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- === PRODUCTS_AFFILIATE ===
alter table products_affiliate enable row level security;

drop policy if exists "public read products_affiliate" on products_affiliate;
create policy "public read products_affiliate" on products_affiliate
  for select using (published = true);

drop policy if exists "admin full access products_affiliate" on products_affiliate;
create policy "admin full access products_affiliate" on products_affiliate
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- === PRODUCTS_OWNED ===
alter table products_owned enable row level security;

drop policy if exists "public read products_owned" on products_owned;
create policy "public read products_owned" on products_owned
  for select using (published = true);

drop policy if exists "admin full access products_owned" on products_owned;
create policy "admin full access products_owned" on products_owned
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- === COURSES ===
alter table courses enable row level security;

drop policy if exists "public read courses" on courses;
create policy "public read courses" on courses
  for select using (published = true);

drop policy if exists "admin full access courses" on courses;
create policy "admin full access courses" on courses
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- === COMMENTS ===
alter table comments enable row level security;

drop policy if exists "public read approved comments" on comments;
create policy "public read approved comments" on comments
  for select using (approved = true);

drop policy if exists "public insert comments" on comments;
create policy "public insert comments" on comments
  for insert with check (true);

drop policy if exists "admin full access comments" on comments;
create policy "admin full access comments" on comments
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- === ORDERS ===
alter table orders enable row level security;

drop policy if exists "public insert orders" on orders;
create policy "public insert orders" on orders
  for insert with check (true);

drop policy if exists "admin full access orders" on orders;
create policy "admin full access orders" on orders
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- 10. SUPABASE STORAGE (Chạy trong Storage tab, hoặc SQL)
-- ============================================================
-- Tạo bucket 'images' nếu chưa có (chạy trong Supabase Dashboard > Storage)
-- insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict do nothing;

-- Policy cho phép public đọc ảnh:
-- drop policy if exists "Public read images" on storage.objects;
-- create policy "Public read images" on storage.objects for select using (bucket_id = 'images');

-- Policy cho phép admin upload ảnh:
-- drop policy if exists "Admin upload images" on storage.objects;
-- create policy "Admin upload images" on storage.objects for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');

-- drop policy if exists "Admin delete images" on storage.objects;
-- create policy "Admin delete images" on storage.objects for delete using (bucket_id = 'images' and auth.role() = 'authenticated');
