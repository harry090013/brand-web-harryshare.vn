-- Chạy trong Supabase SQL Editor
create table posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text,
  category text,
  image text,
  content_html text,
  published boolean default true,
  published_at timestamp,
  likes int default 0,
  created_at timestamp default now()
);

create table products_affiliate (
  id uuid default gen_random_uuid() primary key,
  slug text unique,
  name text, description text, content_html text,
  affiliate_url text, image text, price int,
  created_at timestamp default now()
);

create table products_owned (
  id uuid default gen_random_uuid() primary key,
  slug text unique,
  name text, short_desc text, content_html text,
  price int, images text[],
  created_at timestamp default now()
);

create table comments (
  id uuid default gen_random_uuid() primary key,
  post_slug text, name text, content text,
  approved boolean default false,
  created_at timestamp default now()
);

create table orders (
  id uuid default gen_random_uuid() primary key,
  product_id uuid, product_name text,
  name text, phone text, address text, note text,
  status text default 'new',
  created_at timestamp default now()
);

-- Function tăng like
create or replace function increment_likes(post_slug text)
returns void language sql as $$
  update posts set likes = likes + 1 where slug = post_slug;
$$;

-- RLS policies (cho phép đọc public)
alter table posts enable row level security;
create policy "public read" on posts for select using (published = true);
