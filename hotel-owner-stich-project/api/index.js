import app from '../server/index.js';

export default function handler(request, response) {
  const url = new URL(request.url, 'http://localhost');
  const route = url.searchParams.get('route');

  if (route) {
    url.searchParams.delete('route');
    const query = url.searchParams.toString();
    request.url = `/api/${route}${query ? `?${query}` : ''}`;
  }

  return app(request, response);
}