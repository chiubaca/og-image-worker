import * as React from 'react';
import { ImageResponse } from 'workers-og';
import type { ExecutionContext } from '@cloudflare/workers-types';

const LOBSTER_IMAGE_URL = 'https://drive.usercontent.google.com/download?id=16h8cMmiNK3DVzbPBMmsmC-ne0nF_haH_';

export async function handleClawedClubWebsite(params: URLSearchParams, ctx: ExecutionContext): Promise<Response> {
	return new ImageResponse(<OgClawedClubWebsite />, {
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

function OgClawedClubWebsite() {
	return (
		<div
			style={{
				display: 'flex',
				height: '100vh',
				fontFamily: '"JetBrains Mono", "Consolas", monospace',
				background: '#1a1a2e',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<img
				src={LOBSTER_IMAGE_URL}
				alt="Lobster"
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					opacity: 0.35,
				}}
			/>
			<div
				style={{
					color: 'white',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					flexGrow: 1,
					width: '100%',
					padding: 40,
					zIndex: 1,
					textAlign: 'center',
				}}
			>
				<span
					style={{
						fontSize: 30,
						letterSpacing: 4,
						color: '#FF4C4C',
						textShadow: '0 0 5px #FF4C4C',
					}}
				>
					{`<website>`}
				</span>
				<h1
					style={{
						fontSize: 80,
						fontWeight: '700',
						marginTop: 10,
						color: '#FF4C4C',
						textShadow: '0 0 5px #FF4C4C',
					}}
				>
					clawed.club
				</h1>
				<p
					style={{
						fontSize: 20,
						opacity: 0.8,
						marginTop: 20,
						textShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
					}}
				>
					Your OpenClaw and AI digest. Delivered fresh every week.
				</p>
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
