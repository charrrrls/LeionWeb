/**
 * Algolia API 测试脚本
 * 快速发送10个搜索请求来完成验证
 */

const https = require('https');

const config = {
  appId: '5INFST4F2A',
  apiKey: '6d4ddb96ac3fa4b4887f8ce14c27de4b',
  indexName: 'leionweb-blog'
};

// 测试搜索词列表
const searchQueries = [
  'Git',
  'Hexo',
  'JavaScript',
  'Vue',
  'React',
  'Node.js',
  'CSS',
  'HTML',
  'TypeScript',
  'webpack'
];

function searchAlgolia(query, index) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      query: query,
      hitsPerPage: 5
    });

    const options = {
      hostname: `${config.appId.toLowerCase()}-dsn.algolia.net`,
      port: 443,
      path: `/1/indexes/${config.indexName}/query`,
      method: 'POST',
      headers: {
        'X-Algolia-API-Key': config.apiKey,
        'X-Algolia-Application-Id': config.appId,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`✅ 请求 ${index + 1}/10 - 搜索 "${query}": ${result.hits ? result.hits.length : 0} 结果`);
          resolve(result);
        } catch (error) {
          console.log(`❌ 请求 ${index + 1}/10 - 搜索 "${query}": 解析错误`);
          resolve({ error: error.message });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ 请求 ${index + 1}/10 - 搜索 "${query}": ${error.message}`);
      resolve({ error: error.message });
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 开始发送 Algolia 搜索测试请求...\n');
  
  for (let i = 0; i < searchQueries.length; i++) {
    await searchAlgolia(searchQueries[i], i);
    // 添加小延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n🎉 已完成 10 个 API 搜索请求！');
  console.log('现在您可以在 Algolia Dashboard 中看到请求统计了。');
}

runTests().catch(console.error);