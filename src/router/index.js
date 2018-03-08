import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/layout/Home'
import Login from '@/components/auth/login/Login'

//权限管理
import Management from '@/components/content/auth_management/router'
//评估小程序
import miniProject from '@/components/content/mini_project/router'
//小游戏
import minGame from '@/components/content/mini_game/router'
import OfficialWebsite from '@/components/content/official_website/router'
Vue.use(Router)
var router = new Router({
    mode: 'history',
    routes: [{
            path: '/login',
            name: 'login',
            meta: {
                title: 'login',
            },
            component: Login
        },
        {
            path: '/Management',
            name: 'AuthManage',
            meta: {title: 'AuthManage',icon:'el-icon-edit-outline'},
            component: Home,
            children: [
                ...Management.routes,
            ]
        },
        {
            path: '/miniProject',
            name: 'TpyMicroProgram',
            meta: {title: 'TpyMicroProgram',icon:'el-icon-message'},
            component: Home,
            children: [
                ...miniProject.routes,
            ]
        },
        {
            path: '/minGame',
            name: 'WishLightGame',
            meta: {title: 'WishLightGame',icon:'el-icon-menu'},
            component: Home,
            children: [
                ...minGame.routes,
            ]
        },
        {
            path: '/OfficialWebsite',
            name: 'OfficialWebsite',
            meta: {title: 'OfficialWebsite',icon:'el-icon-setting'},
            component: Home,
            children: [
                ...OfficialWebsite.routes,
            ]
        }
    ]
})
router.beforeEach((to, from, next) => {
    var auth = window.sessionStorage.getItem('TPY') || '{}'
    auth = JSON.parse(auth)
    next()
    if (to.name !== 'login' && !auth.logined) {
        next('/login')
    } else {
        next()
    }
})

export default router