-- ============================================================
-- HARRYSHARE - DATABASE UPGRADE SCRIPT
-- Chạy script này trong Supabase SQL Editor để thêm các cột còn thiếu
-- ============================================================

-- 1. BẢNG POSTS
alter table posts add column if not exists slug text;
alter table posts add column if not exists title text;
alter table posts add column if not exists excerpt text;
alter table posts add column if not exists category text;
alter table posts add column if not exists image text;
alter table posts add column if not exists content_html text;
alter table posts add column if not exists published boolean default false;
alter table posts add column if not exists published_at timestamp;
alter table posts add column if not exists likes int default 0;
alter table posts add column if not exists updated_at timestamp default now();

-- 2. BẢNG CATEGORIES
alter table categories add column if not exists name text;
alter table categories add column if not exists slug text;
alter table categories add column if not exists description text;

-- 3. BẢNG PRODUCTS_AFFILIATE
alter table products_affiliate add column if not exists slug text;
alter table products_affiliate add column if not exists name text;
alter table products_affiliate add column if not exists description text;
alter table products_affiliate add column if not exists content_html text;
alter table products_affiliate add column if not exists affiliate_url text;
alter table products_affiliate add column if not exists image text;
alter table products_affiliate add column if not exists price int;
alter table products_affiliate add column if not exists published boolean default true;

-- 4. BẢNG PRODUCTS_OWNED
alter table products_owned add column if not exists slug text;
alter table products_owned add column if not exists name text;
alter table products_owned add column if not exists short_desc text;
alter table products_owned add column if not exists content_html text;
alter table products_owned add column if not exists price int;
alter table products_owned add column if not exists images text[];
alter table products_owned add column if not exists published boolean default true;

-- 5. BẢNG COURSES
alter table courses add column if not exists slug text;
alter table courses add column if not exists title text;
alter table courses add column if not exists description text;
alter table courses add column if not exists content_html text;
alter table courses add column if not exists image text;
alter table courses add column if not exists price int;
alter table courses add column if not exists published boolean default false;

-- 6. BẢNG COMMENTS
alter table comments add column if not exists post_slug text;
alter table comments add column if not exists name text;
alter table comments add column if not exists content text;
alter table comments add column if not exists approved boolean default false;

-- 7. BẢNG ORDERS
alter table orders add column if not exists product_id uuid;
alter table orders add column if not exists product_name text;
alter table orders add column if not exists name text;
alter table orders add column if not exists phone text;
alter table orders add column if not exists address text;
alter table orders add column if not exists note text;
alter table orders add column if not exists status text default 'new';
