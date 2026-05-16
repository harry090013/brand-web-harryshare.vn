-- ============================================================
-- DIAGNOSTIC: Kiểm tra RLS policies hiện tại
-- Chạy cái này trước để xem policies đang có
-- ============================================================
select tablename, policyname, cmd, qual
from pg_policies 
where tablename in ('posts', 'categories', 'comments', 'products_owned', 'orders')
order by tablename, policyname;

-- ============================================================
-- FIX: Reset toàn bộ RLS policies cho sạch
-- ============================================================

-- === POSTS: Kết hợp thành 1 policy SELECT duy nhất ===
alter table posts disable row level security;
alter table posts enable row level security;

-- Xóa tất cả policy cũ của posts
do $$ 
declare r record;
begin
  for r in select policyname from pg_policies where tablename = 'posts' loop
    execute 'drop policy if exists "' || r.policyname || '" on posts';
  end loop;
end $$;

-- Tạo lại policies posts
create policy "select posts" on posts
  for select using (published = true or auth.role() = 'authenticated');

create policy "insert posts" on posts
  for insert with check (auth.role() = 'authenticated');

create policy "update posts" on posts
  for update using (auth.role() = 'authenticated');

create policy "delete posts" on posts
  for delete using (auth.role() = 'authenticated');

-- === CATEGORIES ===
alter table categories disable row level security;
alter table categories enable row level security;

do $$ 
declare r record;
begin
  for r in select policyname from pg_policies where tablename = 'categories' loop
    execute 'drop policy if exists "' || r.policyname || '" on categories';
  end loop;
end $$;

create policy "select categories" on categories for select using (true);
create policy "manage categories" on categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- === COMMENTS ===
alter table comments disable row level security;
alter table comments enable row level security;

do $$ 
declare r record;
begin
  for r in select policyname from pg_policies where tablename = 'comments' loop
    execute 'drop policy if exists "' || r.policyname || '" on comments';
  end loop;
end $$;

create policy "select comments" on comments
  for select using (approved = true or auth.role() = 'authenticated');

create policy "insert comments" on comments
  for insert with check (true);

create policy "manage comments" on comments
  for update using (auth.role() = 'authenticated');

create policy "delete comments" on comments
  for delete using (auth.role() = 'authenticated');

-- === PRODUCTS_OWNED ===
alter table products_owned disable row level security;
alter table products_owned enable row level security;

do $$ 
declare r record;
begin
  for r in select policyname from pg_policies where tablename = 'products_owned' loop
    execute 'drop policy if exists "' || r.policyname || '" on products_owned';
  end loop;
end $$;

create policy "select products_owned" on products_owned
  for select using (published = true or auth.role() = 'authenticated');

create policy "manage products_owned" on products_owned
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- === PRODUCTS_AFFILIATE ===
alter table products_affiliate disable row level security;
alter table products_affiliate enable row level security;

do $$ 
declare r record;
begin
  for r in select policyname from pg_policies where tablename = 'products_affiliate' loop
    execute 'drop policy if exists "' || r.policyname || '" on products_affiliate';
  end loop;
end $$;

create policy "select products_affiliate" on products_affiliate
  for select using (published = true or auth.role() = 'authenticated');

create policy "manage products_affiliate" on products_affiliate
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- === ORDERS ===
alter table orders disable row level security;
alter table orders enable row level security;

do $$ 
declare r record;
begin
  for r in select policyname from pg_policies where tablename = 'orders' loop
    execute 'drop policy if exists "' || r.policyname || '" on orders';
  end loop;
end $$;

create policy "insert orders" on orders for insert with check (true);
create policy "manage orders" on orders
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- XÁC NHẬN - Kiểm tra policies mới
-- ============================================================
select tablename, policyname, cmd, qual
from pg_policies 
where tablename in ('posts', 'categories', 'comments', 'products_owned', 'orders')
order by tablename, policyname;
