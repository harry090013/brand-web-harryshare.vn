const urls = [
  '/',
  '/ghi-chep',
  '/ve-harry',
  '/lien-he',
  '/login-admin',
  '/tu-duy-san-pham',
  '/thuong-hieu-ca-nhan',
  '/ai-vibe-coding',
  '/hanh-trinh-lam-nghe',
  '/du-an-tai-nguyen',
  '/chia-se',
  '/chia-se/tu-phuc-vu-ban-den-content',
  '/hanh-trinh-lam-nghe/tu-phuc-vu-ban-den-content'
];

async function testUrl(path) {
  const url = `http://localhost:3000${path}`;
  try {
    const res = await fetch(url, { redirect: 'manual' });
    console.log(`[TEST] Path: ${path} | Status: ${res.status} | Location: ${res.headers.get('location') || 'N/A'}`);
    return { path, status: res.status, location: res.headers.get('location'), ok: res.status >= 200 && res.status < 400 };
  } catch (error) {
    console.error(`[ERROR] Path: ${path} failed:`, error.message);
    return { path, ok: false, error: error.message };
  }
}

async function run() {
  console.log("Starting server routes test including post detail page...");
  const results = [];
  for (const path of urls) {
    const res = await testUrl(path);
    results.push(res);
  }
  const failed = results.filter(r => !r.ok);
  if (failed.length > 0) {
    console.error("\nSome tests FAILED:");
    console.error(JSON.stringify(failed, null, 2));
    process.exit(1);
  } else {
    console.log("\nAll tests PASSED successfully!");
    process.exit(0);
  }
}

run();
