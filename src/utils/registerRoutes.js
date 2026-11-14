
import layoutViewRoutes from "../router/layoutViewChildren"


function registerRoutes(router, menuList) {

    if (!menuList) {
        menuList = getItem("menuList") || [];
    }
    // TODO: 注册路由
    const routesList = menuList.slice(0);
    const parentMap = new Map();
    while (routesList.length) {
        const item = routesList.shift();
        if (item.children && item.children.length) {
            routesList.push(...item.children);
        }
        const newRouter = {
            name: item.path,
            parentId: item.parentId,
            path: item.path.replace(/^\//, ''),
            meta: {
                title: item.title,
                icon: item.icon,
                id: item.id
            },
        }
        if (item.component && item.type == 1) {
            newRouter.component = () => import(`@/views/${item.component}.vue`)
        }

        parentMap.set(item.id, newRouter);
    };
    const newRoutes = [];
    for (const route of parentMap.values()) {
        const parent = parentMap.get(route.parentId);
        if (parent) {
            parent.children = parent.children || [];
            parent.children.push(route);
        } else {
            route.path = `/${route.path}`;
            newRoutes.push(route);
        }
    }
    const layoutView = router.getRoutes().find(route => route.name === 'LayoutView');
    if (layoutView) {
        router.removeRoute(layoutView.name)
        newRoutes.push(...layoutViewRoutes)
        layoutView.redirect = "/home"
        layoutView.children = newRoutes
        router.addRoute(layoutView)
    }
}


export default registerRoutes