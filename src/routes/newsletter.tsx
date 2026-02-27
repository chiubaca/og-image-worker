import * as React from 'react';
import { ImageResponse } from 'workers-og';
import type { ExecutionContext } from '@cloudflare/workers-types';

export async function handleNewsletter(
	params: URLSearchParams,
	ctx: ExecutionContext
): Promise<Response> {
	const issue = params.get('issue') || '1';

	return new ImageResponse(<OgNewsletter issue={issue} />, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: 'JetBrains Mono',
				data: await fetchFont(
					'https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.ttf',
					ctx
				),
				weight: 400,
				style: 'normal',
			},
		],
	});
}

function OgNewsletter(props: { issue: string }) {
	return (
		<div
			style={{
				display: 'flex',
				height: '100vh',
				fontFamily:
					'"JetBrains Mono", "Fira Code", "SF Mono", "Consolas", monospace',
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
