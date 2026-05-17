-- 6. Thêm Tags / Privacy / Schedule vào database
alter table public.posts
add column if not exists tags text[] default '{}',
add column if not exists visibility text not null default 'public',
add column if not exists scheduled_at timestamptz;

alter table public.posts
drop constraint if exists posts_visibility_check;

alter table public.posts
add constraint posts_visibility_check
check (visibility in ('public', 'private', 'unlisted'));
