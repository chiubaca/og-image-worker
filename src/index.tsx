import * as React from 'react';
import { ImageResponse } from 'workers-og';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const params = new URLSearchParams(new URL(request.url).search);
		const title = params.get('title') || 'Missing title';
		const description = params.get('description') || 'Missing description';

		return new ImageResponse(<OgBlog title={title} description={description} />, {
			width: 1200,
			height: 630,
			fonts: [
				{
					name: 'Roboto',
					data: await fetchFont('https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-400-normal.ttf', ctx),
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
				position: 'relative',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					filter: 'url(#grainy)',
					opacity: 0.1, // Adjust opacity of the grain
					pointerEvents: 'none', // Make sure it doesn't interfere with content
				}}
			/>
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
					zIndex: 1, // Ensure content is above the grain
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
			<div
				style={{
					position: 'absolute',
					bottom: 40,
					right: 40,
					fontSize: 30,
					color: 'white',
					opacity: 0.8,
					zIndex: 1,
				}}
			>
				chiubaca.com
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
