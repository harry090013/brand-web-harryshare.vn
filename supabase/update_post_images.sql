-- =========================================================
-- Update post cover images based on current public/ structure
-- =========================================================

update public.posts
set
  image = '/posts/tu-duy-san-pham-la-gi-cover.png',
  cover_image = '/posts/tu-duy-san-pham-la-gi-cover.png',
  og_image = '/posts/tu-duy-san-pham-la-gi-cover.png',
  updated_at = now()
where slug = 'tu-duy-san-pham-la-gi';

update public.posts
set
  image = '/posts/mvp-la-gi-cover.png',
  cover_image = '/posts/mvp-la-gi-cover.png',
  og_image = '/posts/mvp-la-gi-cover.png',
  updated_at = now()
where slug = 'mvp-la-gi';

update public.posts
set
  image = '/posts/vibe-coding-la-gi-cover.png',
  cover_image = '/posts/vibe-coding-la-gi-cover.png',
  og_image = '/posts/vibe-coding-la-gi-cover.png',
  updated_at = now()
where slug = 'vibe-coding-la-gi';

update public.posts
set
  image = '/posts/lovable-la-gi-cover.png',
  cover_image = '/posts/lovable-la-gi-cover.png',
  og_image = '/posts/lovable-la-gi-cover.png',
  updated_at = now()
where slug = 'lovable-la-gi';

update public.posts
set
  image = '/posts/prompt-tao-landing-page-premium-bang-ai-cover.png',
  cover_image = '/posts/prompt-tao-landing-page-premium-bang-ai-cover.png',
  og_image = '/posts/prompt-tao-landing-page-premium-bang-ai-cover.png',
  updated_at = now()
where slug = 'prompt-tao-landing-page-premium-bang-ai';

update public.posts
set
  image = '/posts/tu-phuc-vu-ban-den-content-cover.png',
  cover_image = '/posts/tu-phuc-vu-ban-den-content-cover.png',
  og_image = '/posts/tu-phuc-vu-ban-den-content-cover.png',
  updated_at = now()
where slug = 'tu-phuc-vu-ban-den-content';

update public.posts
set
  image = '/posts/nghi-viec-khong-phai-luc-nao-cung-la-bo-cuoc-cover.png',
  cover_image = '/posts/nghi-viec-khong-phai-luc-nao-cung-la-bo-cuoc-cover.png',
  og_image = '/posts/nghi-viec-khong-phai-luc-nao-cung-la-bo-cuoc-cover.png',
  updated_at = now()
where slug = 'nghi-viec-khong-phai-luc-nao-cung-la-bo-cuoc';

-- =========================================================
-- Temporary fallback covers using pillar images
-- =========================================================

update public.posts
set
  image = '/pillars/tu-duy-san-pham-cover.png',
  cover_image = '/pillars/tu-duy-san-pham-cover.png',
  og_image = '/pillars/tu-duy-san-pham-cover.png',
  updated_at = now()
where slug = 'product-thinking-cho-nguoi-lam-content';

update public.posts
set
  image = '/pillars/thuong-hieu-ca-nhan-cover.png',
  cover_image = '/pillars/thuong-hieu-ca-nhan-cover.png',
  og_image = '/pillars/thuong-hieu-ca-nhan-cover.png',
  updated_at = now()
where slug = 'thuong-hieu-ca-nhan-la-gi';

update public.posts
set
  image = '/pillars/thuong-hieu-ca-nhan-cover.png',
  cover_image = '/pillars/thuong-hieu-ca-nhan-cover.png',
  og_image = '/pillars/thuong-hieu-ca-nhan-cover.png',
  updated_at = now()
where slug = 'content-pillar-la-gi';

update public.posts
set
  image = '/pillars/du-an-tai-nguyen-cover.png',
  cover_image = '/pillars/du-an-tai-nguyen-cover.png',
  og_image = '/pillars/du-an-tai-nguyen-cover.png',
  updated_at = now()
where slug = 'nhung-cong-cu-minh-dung-de-xay-harryshare';

-- =========================================================
-- Optional: Update resource cover images (if slugs match)
-- =========================================================

update public.resources
set
  image = '/resources/resource-checklist-seo-blog-ca-nhan.png',
  updated_at = now()
where slug = 'checklist-seo-blog-ca-nhan' or slug = 'resource-checklist-seo-blog-ca-nhan';

update public.resources
set
  image = '/resources/resource-lovable.png',
  updated_at = now()
where slug = 'lovable' or slug = 'resource-lovable';
