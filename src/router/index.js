import { createWebHistory, createRouter } from 'vue-router'

import LoginView from '../views/login.vue'
import LayoutView from '../layout/index.vue'

const routes = [
    { path: '/login', component: LoginView, name: "LoginView" },
    {
        path: '/',
        component: LayoutView,
        name: "LayoutView",
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/errors/notFound.vue'),
        name: "NotFoundView",
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// 路由守卫
router.beforeEach((to) => {
    // 登录页直接放行
    
    if (to.path === '/login') {
        return;
    }

    // 没 token → 登录页
    if (!getToken()) {
        return {
            path: '/login',
            query: {
                redirect: to.fullPath
            }
        };
    }
});



registerRoutes(router)
export default router