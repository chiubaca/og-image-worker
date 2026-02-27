import { Hono } from 'hono';
import { handleBlog } from './routes/blog';
import { handleNewsletter } from './routes/newsletter';
import { handleClawedClubWebsite } from './routes/clawed-club';

const app = new Hono();

app.get('/clawed-club/newsletter', async (c) => {
	const params = new URLSearchParams(c.req.query());
	return handleNewsletter(params, c.executionCtx);
});

app.get('/clawed-club/og', async (c) => {
	const params = new URLSearchParams(c.req.query());
	return handleClawedClubWebsite(params, c.executionCtx);
});

app.get('/', async (c) => {
	const params = new URLSearchParams(c.req.query());
	return handleBlog(params, c.executionCtx);
});

app.get('*', async (c) => {
	const params = new URLSearchParams(c.req.query());
	return handleBlog(params, c.executionCtx);
});

export default app;
