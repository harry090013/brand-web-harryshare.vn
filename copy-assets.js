const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Harry\\.gemini\\antigravity\\brain\\3fbd6bb0-dead-41f3-a2f7-565a3ba4964a';
const destDir = 'C:\\Users\\Harry\\.gemini\\antigravity\\brain\\7c43594b-51ff-4ddb-8881-895dbb5ecddf';

const files = ['homepage.png', 'pillar_tu_duy_san_pham.png', 'post_detail_liked_and_commented.png', 'recording.webm'];

files.forEach(file => {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} successfully.`);
  } else {
    console.warn(`File ${file} does not exist in source.`);
  }
});
