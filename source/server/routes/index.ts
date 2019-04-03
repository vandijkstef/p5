import * as express from 'express';

const router = express();

router.on('mount', (parent) => {
	const menuObject = JSON.parse(process.env.menuObject);
	menuObject['/'] = {
		test: 'more',
	};
	process.env.menuObject = JSON.stringify(menuObject);
});

router.use((req, res, next) => {
	res.locals.title = 'Index';
	next();
});

router.get('/', (req, res: any) => {
	res.render('index');
});

export default router;
