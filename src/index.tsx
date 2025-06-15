import * as React from 'react';
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

		return new ImageResponse(<OgBlog title={title} description={description} />, {
			width: 1200,
			height: 630,
			fonts: [
				{
					name: 'Roboto',
					data: await fetchFont('https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.1/fonts/roboto/Roboto-Regular.ttf', ctx),
					weight: 400,
					style: 'normal',
				},
			],
		});
	},
};

function OgBlog(props: { title: string; description?: string }) {
	return (
		<div
			style={{
				display: 'flex',
				height: '100vh',
				border: '5px solid white',
				fontFamily: 'Roboto',
				background: '#160f29',
				padding: 10,
			}}
		>
			<div
				style={{
					color: 'white',

					borderRadius: 10,
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					flexGrow: 1,
					width: '100%',
					padding: 40,
				}}
			>
				<h1
					style={{
						fontSize: 100,
						fontWeight: '600',
					}}
				>
					{props.title}
				</h1>
				{props.description && <p style={{ fontSize: 60, maxWidth: '100vw', opacity: 0.6 }}>{props.description}</p>}
			</div>
		</div>
	);
}

async function fetchFont(url: string, ctx: ExecutionContext) {
	const cache = await caches.open('fonts');
	const cached = await cache.match(url);
	if (cached) {
		console.log('font cache hit');
		return cached.arrayBuffer();
	}
	console.log('font cache miss');
	const response = await fetch(url);
	ctx.waitUntil(cache.put(url, response.clone()));

	return response.arrayBuffer();
}
