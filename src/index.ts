/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
function jsonResponse(data: string, init: ResponseInit = {}): Response {
	return new Response(data, {
		...init,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
			...(init.headers || {}),
		},
	});
}

export default {
	async fetch(request, env, ctx): Promise<Response> {

		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type'
				}
			});
		}

		const url = new URL(request.url);
		switch (url.pathname) {
			case '/message':
				return jsonResponse(await env.codeman_kv.get('ff'));
			case '/random':
				return jsonResponse(await env.codeman_kv.put('ff', 1234));
			default:
				return jsonResponse('Not Found', { status: 404 });
		}
	}
} satisfies ExportedHandler<Env>;
