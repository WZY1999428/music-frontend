
export default [
    {
        name: "home",
        path: "home",
        component: () => import("@/views/homeView.vue"),
        meta: {
            title: "首页",
            id: "home"
        },
    },
    {
        name: "statistics",
        path: "statistics",
        component: () => import("@/views/music/statistics/index.vue"),
        meta: {
            title: "数据统计",
            id: "statistics"
        },
    },
    {
        name: "userinfo",
        path: "userinfo",
        redirect: "/userinfo/profile",
        children: [
            {
                name: "profile",
                path: "profile",
                component: () => import("@/views/userProfile/profile.vue"),
                meta: {
                    title: "用户信息",
                },
            }
        ]


    }];