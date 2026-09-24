
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
        name: "userinfo",
        path: "userinfo",
        redirect: "/userinfo/profile",
        children: [
            {
                name: "profile",
                path: "profile",
                component: () => import("@/views/user/profile.vue"),
                meta: {
                    title: "用户信息",
                },
            }
        ]


    }];