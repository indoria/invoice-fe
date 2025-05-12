// routeInspector.js

function listRoutes(layer, prefix = '') {
    const routes = [];

    if (layer.route) {
        // This is a direct route (e.g., app.get(), app.post(), etc.)
        const path = prefix + layer.route.path;
        for (const stackItem of layer.route.stack) {
            routes.push({
                method: stackItem.method.toUpperCase(),
                path,
                middleware: stackItem.name || 'No middleware'
            });
        }
    } else if (layer.name === 'router' && layer.handle.stack) {
        // This is a nested router — recurse
        const newPrefix = prefix + (layer.regexp.source === '^\\/' ? '' : layer.regexp.source.replace(/\\\//g, '/').replace(/\^|\?\=\.\*$/, ''));
        for (const subLayer of layer.handle.stack) {
            routes.push(...listRoutes(subLayer, newPrefix));
        }
    } else if (layer.name === 'middleware') {
        // This is a piece of middleware without a route (e.g., app.use())
        routes.push({
            method: 'Middleware',
            path: prefix,
            middleware: layer.handle.name || 'No name'
        });
    }

    return routes;
}

function getAllRoutes(app) {
    const allRoutes = [];
    for (const layer of app._router.stack) {
        allRoutes.push(...listRoutes(layer));
    }
    return allRoutes;
}

export { getAllRoutes };
