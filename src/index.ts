import { ImageResponse } from 'workers-og';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const params = new URLSearchParams(new URL(request.url).search);
		const title = params.get('title') || 'Missing title';
		const description = params.get('description') || 'Missing description';

		const html = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100vw; background: #160f29; border: 8px solid white">
				<div style="display: flex; flex-direction:column ;width: 100vw; padding: 40px; color: white;">
						<h1 style="font-size: 60px; font-weight: 600; margin: 0; font-weight: 500">${title}</h1>
						<p>${description}</p>
				</div>
    </div>
   `;

		return new ImageResponse(html, {
			width: 1200,
			height: 630,
		});
	},
};
