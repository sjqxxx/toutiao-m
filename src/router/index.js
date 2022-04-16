import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/login', //路由路径
        name: 'login',
        component: () =>
            import ('@/views/login') //自动就会加载到login/index.vue
    },
    {
        path: '/search',
        name: 'search',
        component: () =>
            import ('@/views/search')
    },
    {
        path: '/article/:articleId',
        name: 'article',
        component: () =>
            import ('@/views/article'),
        // 将路由动态参数映射到组件的 props 中，更推荐这种做法
        // 说白了就是把路由参数映射到组件的props 数据中
        props: true
    },
    {
        path: '/user-profile',
        name: 'user-profile',
        component: () =>
            import ('@/views/user-profile')
    },
    {
        path: '/', //路由路径
        // name: 'layout', //如果父路由有默认子路由，那它的name没有意义
        component: () =>
            import ('@/views/layout'),
        children: [{
                path: '', // 默认子路由,只能有一个
                name: 'home',
                component: () =>
                    import ('@/views/home')
            },
            {
                path: 'qa',
                name: 'qa',
                component: () =>
                    import ('@/views/qa')
            },
            {
                path: 'video',
                name: 'video',
                component: () =>
                    import ('@/views/video')
            },
            {
                path: 'my',
                name: 'my',
                component: () =>
                    import ('@/views/my')
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router