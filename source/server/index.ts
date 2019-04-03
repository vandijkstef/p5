import * as express from 'express';

const config = {
	port: 3000,
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

app.use((req, res, next) => {
	res.locals.title = 'Undefined';
	res.locals.menu = JSON.parse(process.env.menuObject);
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
