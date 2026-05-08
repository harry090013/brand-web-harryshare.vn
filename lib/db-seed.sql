-- ============================================================
-- HARRYSHARE - SEED DATA (chỉ insert dữ liệu test)
-- Chạy trong Supabase SQL Editor
-- ============================================================

-- ============================================================
-- Posts (Bài viết)
-- ============================================================
insert into posts (slug, title, excerpt, category, content_html, published, published_at, likes) values
(
  'bat-dau-lam-san-pham-tu-so-khong',
  'Bắt đầu làm sản phẩm từ số 0: Những điều không ai nói với bạn',
  'Sau 3 năm tự mày mò từ phục vụ bàn đến làm sản phẩm số, mình rút ra được một điều: phần khó nhất không phải là kỹ thuật, mà là bắt đầu.',
  'lam-san-pham',
  '<h2>Tại sao mình bắt đầu làm sản phẩm?</h2><p>Câu chuyện bắt đầu từ năm 2021, khi mình còn đang làm phục vụ bàn ở một quán cà phê tại Duy Xuyên. Mình nhìn thấy người ta kiếm tiền online và nghĩ: <em>tại sao mình không thể làm được?</em></p><p>Và thế là hành trình bắt đầu.</p><h2>Sai lầm đầu tiên</h2><p>Mình cứ nghĩ làm sản phẩm cần phải có vốn lớn, cần phải có đội nhóm, cần phải biết code thật giỏi. Nhưng thực ra không phải vậy.</p><blockquote>Điều quan trọng nhất là bắt đầu, dù sản phẩm đầu tiên có tệ đến đâu.</blockquote><p>Sản phẩm đầu tiên của mình là một file PDF tổng hợp template cho POD. Mình bán 50k và kiếm được 3 đơn hàng trong tháng đầu.</p>',
  true,
  now() - interval '5 days',
  12
),
(
  'code-khong-can-hoc-dai-hoc',
  'Mình học code như thế nào mà không cần đại học chuyên ngành',
  'Học code trong 6 tháng, không có mentor, không có khóa học đắt tiền. Đây là lộ trình thực tế mình đã đi qua.',
  'code',
  '<h2>Điểm xuất phát</h2><p>Mình học E-University Duy Tân nhưng không phải ngành IT. Mình bắt đầu học code hoàn toàn tự học qua YouTube và tài liệu miễn phí.</p><p>Lộ trình của mình:</p><ul><li>Tháng 1-2: HTML/CSS cơ bản</li><li>Tháng 3-4: JavaScript và DOM</li><li>Tháng 5-6: React và Next.js</li></ul><h2>Tool mình dùng hàng ngày</h2><p>Cursor AI, GitHub Copilot, và ChatGPT để debug. Đừng ngại dùng AI — đó là công cụ chứ không phải gian lận.</p>',
  true,
  now() - interval '12 days',
  8
),
(
  'nhat-ky-thang-5-2026',
  'Nhật ký tháng 5: Chậm lại để đi nhanh hơn',
  'Một tháng tạm dừng tất cả project để suy nghĩ lại về hướng đi. Và mình nhận ra nhiều thứ hơn mình tưởng.',
  'nhat-ky',
  '<p>Tháng này mình quyết định không ra thêm sản phẩm mới nào. Không viết code mới. Chỉ đọc sách và suy nghĩ.</p>',
  false,
  null,
  0
)
on conflict (slug) do nothing;

-- ============================================================
-- Products Owned (Sản phẩm của mình)
-- ============================================================
insert into products_owned (slug, name, short_desc, price, images, published) values
(
  'notion-template-quan-ly-du-an',
  'Notion Template Quản lý Dự án',
  'Template Notion giúp bạn quản lý toàn bộ sản phẩm số từ ý tưởng đến ra mắt.',
  99000,
  ARRAY['https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800'],
  true
),
(
  'mini-course-lam-san-pham-so',
  'Mini Course: Làm sản phẩm số đầu tiên',
  'Khóa học ngắn 7 video, hướng dẫn từ ý tưởng đến ra mắt sản phẩm số trong 30 ngày.',
  299000,
  ARRAY['https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800'],
  true
)
on conflict (slug) do nothing;

-- ============================================================
-- Products Affiliate
-- ============================================================
insert into products_affiliate (slug, name, description, affiliate_url, image, price, published) values
(
  'notion',
  'Notion',
  'Tool quản lý công việc và ghi chú mình dùng hàng ngày. Phiên bản miễn phí đã đủ để bắt đầu.',
  'https://notion.so',
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
  0,
  true
),
(
  'cursor-ai',
  'Cursor AI',
  'Editor code tích hợp AI, giúp mình code nhanh gấp 3 lần. Tool thay đổi cách mình làm việc nhất năm 2024.',
  'https://cursor.sh',
  'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800',
  500000,
  true
)
on conflict (slug) do nothing;

-- ============================================================
-- Orders (Đơn hàng)
-- ============================================================
insert into orders (product_name, name, phone, address, note, status) values
(
  'Notion Template Quản lý Dự án',
  'Nguyễn Văn An',
  '0901234567',
  '123 Lê Lợi, Đà Nẵng',
  'Anh gửi file qua email nhé!',
  'new'
),
(
  'Mini Course: Làm sản phẩm số đầu tiên',
  'Trần Thị Bình',
  '0912345678',
  'Hồ Chí Minh',
  '',
  'done'
);

-- ============================================================
-- Kiểm tra kết quả
-- ============================================================
select 'categories' as table_name, count(*)::text as total from categories
union all select 'posts', count(*)::text from posts
union all select 'products_owned', count(*)::text from products_owned
union all select 'products_affiliate', count(*)::text from products_affiliate
union all select 'comments', count(*)::text from comments
union all select 'orders', count(*)::text from orders
union all select 'courses', count(*)::text from courses;
