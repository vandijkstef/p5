interface Route {
	url: string;
	route: Function;
}

export class Router {

	private routes: [Route];

	constructor(routes) {
		this.routes = routes;

		this.routes[0].route();
	}
}