import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as fs from 'fs';
import * as fileStore from 'session-file-store';
const FileStore = fileStore(session);

const config = {
	port: process.env.PORT || 3000,
};

process.env.menuObject = '{}';

// Create new express app in 'app'
const app = express();
// Link the templating engine to the express app
app.set('view engine', 'ejs');
// Tell the views engine/ejs where the template files are stored (Settingname, value)
app.set('views', 'views');

// Tell express to use a 'static' folder
// If the url matches a file it will send that file
// Sending something (responding) ends the response cycle
app.use(express.static('public'));
app.use('/images', express.static('images'));

app.use(bodyParser.urlencoded({
	extended: false,
}));
app.use(bodyParser.json());

app.use(session({
	secret: 'chocolate',
	resave: false,
	saveUninitialized: true,
	store: new FileStore(),
	cookie: { secure: false },
}));

app.use((req: any, res, next) => {
	res.locals.title = 'Undefined';
	res.locals.menu = JSON.parse(process.env.menuObject);

	const userFile = `./db/${req.session.user}.json`;
	if (!fs.existsSync(userFile)) {
		req.session.user = null;
	}

	if (req.session.user) {
		res.locals.user = JSON.parse(fs.readFileSync(userFile, 'utf8'));
	}

	next();
});

// Get our route file
import indexRouter from './routes/index';
// Tell express to use our posts.js file for /posts routes
app.use('/', indexRouter);

// Actually set up the server
app.listen(config.port, () => {
	console.log(`Application started on port: ${config.port}`);
});
