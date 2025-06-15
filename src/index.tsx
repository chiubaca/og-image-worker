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
				fontFamily: 'Roboto',
				background: '#160f29',
				position: 'relative',
			}}
		>
			<div
				style={{
					color: 'white',
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
						fontSize: 70,
						fontWeight: '600',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						maxWidth: '100%',
					}}
				>
					{props.title}
				</h1>
				{props.description && (
					<p
						style={{
							fontSize: 40,
							maxWidth: '100%',
							opacity: 0.6,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: '-webkit-box',
							WebkitLineClamp: 3, // Limit to 3 lines
							WebkitBoxOrient: 'vertical',
						}}
					>
						{props.description}
					</p>
				)}
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
