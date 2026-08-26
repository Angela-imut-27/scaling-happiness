import "axios";
import "cheerio";

Deno.serve(async (request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json; charset=utf-8'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (pathname === '/' || pathname === '') {
    return new Response(JSON.stringify({
      status: true,
      creator: 'SofiApis',
      message: 'API Gateway Deno Deploy is running.'
    }, null, 2), { status: 200, headers: corsHeaders });
  }

  try {

    const cleanPath = pathname.startsWith('/api/') ? pathname.replace('/api/', '') : pathname.slice(1);
    const targetFile = `./api/${cleanPath}.js`;

    const module = await import(targetFile);

    if (typeof module.default === 'function') {
      return await module.default(request);
    } else {
      return new Response(JSON.stringify({
        status: false,
        creator: 'SofiApis',
        error: `File ${cleanPath}.js tidak memiliki export default function.`
      }, null, 2), { status: 500, headers: corsHeaders });
    }

  } catch (error) {
    return new Response(JSON.stringify({
      status: false,
      creator: 'SofiApis',
      error: `Endpoint '${pathname}' tidak ditemukan atau gagal dimuat.`,
      detail: error.message
    }, null, 2), { status: 404, headers: corsHeaders });
  }
});