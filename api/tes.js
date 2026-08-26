// Tanpa impor modul pihak ketiga apapun

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
    // Dummy test data
    const articles = [
      {
        title: "Test Berhasil",
        link: "https://www.tvonenews.com/test",
        category: "Uji Coba",
        image: "",
        time: "Baru saja"
      }
    ];

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

export default handler;
