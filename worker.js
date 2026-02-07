const apiUrl = 'https://ajsrzteoovahabndebyp.supabase.co';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const requestUrl = new URL(request.url);
  const isWebSocketUpgrade = request.headers.get('Upgrade') === 'websocket';

  if (isWebSocketUpgrade) {
    // Xử lý yêu cầu WebSocket
    if (requestUrl.protocol !== 'https:') {
      return new Response('WebSocket connections must be made over HTTPS.', { status: 400 });
    }

    // Note that Cloudflare Workers does not support the WebSocket constructor.
    // Instead, we use the `webSocket` property on the response to establish a WebSocket connection.
    let [client, server] = Object.values(new WebSocketPair());

    server.accept();

    server.addEventListener('message', async (messageEvent) => {
      // Here you might want to proxy the message to your API or do some other processing

      // Echo the message back to the client for demonstration purposes
      server.send(messageEvent.data);
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  } else {
    // Xử lý yêu cầu HTTP
    const response = await fetch(`${apiUrl}${requestUrl.pathname}${requestUrl.search}`, {
      method: request.method,
      headers: request.headers,
      body: request.body ? request.body : null,
    });
    return response;
  }
}