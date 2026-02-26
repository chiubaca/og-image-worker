import * as React from 'react';
import { ImageResponse } from 'workers-og';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const params = url.searchParams;
		const title = params.get('title') || 'Missing title';
		const description = params.get('description') || 'Missing description';

		if (url.pathname.startsWith('/newsletter/clawed-club')) {
			const issue = params.get('issue') || '1';
			return new ImageResponse(<OgNewsletter issue={issue} />, {
				width: 1200,
				height: 630,
				fonts: [
					{
						name: 'JetBrains Mono',
						data: await fetchFont('https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.ttf', ctx),
						weight: 400,
						style: 'normal',
					},
				],
			});
		}

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
							WebkitLineClamp: 3,
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

function OgNewsletter(props: { issue: string }) {
	return (
		<div
			style={{
				display: 'flex',
				height: '100vh',
				fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", "Consolas", monospace',
				background: '#1a1a2e',
				position: 'relative',
				border: '20px solid #FF4C4C',
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
				<span
					style={{
						fontSize: 30,
						opacity: 0.6,
						textTransform: 'uppercase',
						letterSpacing: 4,
						color: '#FF7070',
					}}
				>
					Newsletter
				</span>
				<h1
					style={{
						fontSize: 80,
						fontWeight: '700',
						marginTop: 10,
						color: '#FF4C4C',
					}}
				>
					The Weekly Claws
				</h1>
				<p
					style={{
						fontSize: 40,
						opacity: 0.8,
						marginTop: 20,
					}}
				>
					Issue #{props.issue}
				</p>
			</div>
			<div
				style={{
					position: 'absolute',
					bottom: 40,
					right: 40,
					fontSize: 30,
					color: '#FF7070',
					opacity: 0.8,
					zIndex: 1,
				}}
			>
				Clawed Club
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
