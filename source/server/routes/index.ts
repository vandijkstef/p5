import * as express from 'express';
import * as fs from 'fs';
import * as md5 from 'md5';

const router = express();

router.on('mount', (parent) => {
	const menuObject = JSON.parse(process.env.menuObject);
	menuObject['/'] = {
		test: 'more',
	};
	process.env.menuObject = JSON.stringify(menuObject);
});

router.use((req, res, next) => {
	res.locals.title = 'Inspireer uzelf | Transavia.com';
	next();
});

router.get('/', (req, res) => {
	res.render('index');
});

router.get('/collection', (req, res) => {
	res.send(fs.readFileSync('./collected.json', 'utf8'));
});

router.get('/favs', (req: any, res) => {
	if (req.session.user) {
		const userFile = `./db/${req.session.user}.json`;
		if (fs.existsSync(userFile)) {
			const userData = JSON.parse(fs.readFileSync(userFile, 'utf8'));
			res.send(JSON.stringify({
				status: 'ok',
				favs: userData.favs,
			}));
		} else {
			res.send(JSON.stringify({status: 'bad_user'}));
		}
	} else {
		res.send(JSON.stringify({status: 'no_user'}));
	}
});

router.get('/logout', (req: any, res) => {
	req.session.user = null;
	req.session.save(() => {
		res.redirect('/');
	});
});

router.post('/fav', (req: any, res) => {
	if (req.session.user) {
		const userFile = `./db/${req.session.user}.json`;
		if (fs.existsSync(userFile)) {
			if (req.body.id === null) {
				res.send(JSON.stringify({status: 'null'}));
			} else {
				const userData = JSON.parse(fs.readFileSync(userFile, 'utf8'));
				if (!userData.favs) {
					userData.favs = [];
				}
				if (!userData.favs.includes(req.body.id)) {
					userData.favs.push(req.body.id);
					fs.writeFileSync(userFile, JSON.stringify(userData));
					res.send(JSON.stringify({status: 'ok'}));
				} else if (req.body.remove) {
					const newFavs = [];
					userData.favs.forEach((fav) => {
						if (fav !== req.body.id) {
							newFavs.push(fav);
						}
					});
					userData.favs = newFavs;
					fs.writeFileSync(userFile, JSON.stringify(userData));
					res.send(JSON.stringify({status: 'removed'}));
				} else {
					res.send(JSON.stringify({status: 'double'}));
				}
			}
		} else {
			res.send(JSON.stringify({status: 'bad_user'}));
		}
	} else {
		res.send(JSON.stringify({status: 'no_user'}));
	}
});

router.post('/login', (req: any, res) => {
	if (req.session.user) {
		res.send(JSON.stringify({status: 'double'}));
	} else {
		const userFile = `./db/${req.body.name}.json`;
		if (!fs.existsSync(userFile)) {
			if (req.body.newuser) {
				fs.writeFileSync(userFile, JSON.stringify({
					name: req.body.name,
					pass: md5(req.body.pass),
					email: req.body.email,
				}));
				req.session.user = req.body.name;
				res.send(JSON.stringify({status: 'new'}));
			} else {
				res.send(JSON.stringify({status: 'unknown'}));
			}
		} else {
			const userData = JSON.parse(fs.readFileSync(userFile, 'utf8'));
			if (md5(req.body.pass) === userData.pass) {
				req.session.user = req.body.name;
				req.session.save(() => {
					res.send(JSON.stringify({status: 'ok'}));
				});
			} else {
				res.send(JSON.stringify({status: 'bad'}));
			}
		}
	}
});

router.get('/:a', (req, res) => {
	res.redirect('/');
});

export default router;
