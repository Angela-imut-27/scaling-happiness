import axios from 'npm:axios';
import * as cheerio from 'npm:cheerio';

async function scrapeTvOneNews() {
  const url = 'https://www.tvonenews.com/';
  const { data } = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    timeout: 10000
  });

  const $ = cheerio.load(data);
  const articles = [];

  $('.article-list-row').each((_, element) => {
    const title = $(element).find('.ali-title h3').text().trim() || $(element).find('.ali-title').text().trim();
    const link = $(element).find('a.ali-title').attr('href') || $(element).find('a.alt-link').attr('href');
    const category = $(element).find('.ali-cate a').text().trim();
    const image = $(element).find('.article-list-thumb img').attr('src') || $(element).find('.article-list-thumb img').attr('data-src');
    const time = $(element).find('.ali-misc li').last().text().trim();

    if (title && link) {
      articles.push({
        title,
        link: link.startsWith('http') ? link : `https://www.tvonenews.com${link}`,
        category: category || '',
        image: image || '',
        time: time || '-'
      });
    }
  });

  return articles;
}

const handler = async (request) => {
  const headersResponse = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json; charset=utf-8'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: headersResponse });
  }

  try {
    const articles = await scrapeTvOneNews();

    return new Response(JSON.stringify({
      status: true,
      creator: 'SofiApis',
      data: {
        total: articles.length,
        articles
      }
    }, null, 2), { status: 200, headers: headersResponse });

  } catch (error) {
    return new Response(JSON.stringify({
      status: false,
      creator: 'SofiApis',
      data: { error: error.message || 'Terjadi kesalahan saat mengambil berita.' }
    }, null, 2), { status: 500, headers: headersResponse });
  }
};

// Ekspor default agar terbaca oleh main.js
export default handler;
export { scrapeTvOneNews };
