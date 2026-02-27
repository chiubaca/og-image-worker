import { Hono } from 'hono';
import { handleBlog } from './routes/blog';
import { handleNewsletter } from './routes/newsletter';

const app = new Hono();

app.get('/clawed-club/newsletter', async (c) => {
	const params = new URLSearchParams(c.req.query());
	return handleNewsletter(params, c.executionCtx);
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
