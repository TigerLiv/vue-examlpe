import User from './statistics/User.vue';
import Statistics from './statistics/Statistic.vue';
import EditUser from './statistics/EditUser.vue';
//点灯
import Light from './light/Light.vue';
import EditLight from './light/EditLight.vue';
import EditLightPic from './light/EditLightPic';



const routes = [{
    path: "/light-user",
    name: "WishLightUserList",
    component: User,
    meta: { title: '用户列表' }
}, {
    path: "/light-edituser/:id",
    name: "游戏小程序编辑用户",
    component: EditUser,
    meta: { title: '用户管理' }
}, {
    path: '/light-statistics',
    name: 'WishLightStatistics',
    component: Statistics,
    meta: { title: '统计' }
}, {
    path: '/light',
    name: 'WishLightList',
    component: Light,
    meta: { title: '点灯列表' }
}, {
    path: '/editlight/:id',
    name: '编辑点灯',
    component: EditLight,
    meta: { title: '点灯管理' }
}, {
    path: '/editlightpic/:id',
    name: '编辑点灯图片',
    component: EditLightPic,
    meta: {
        title: '点灯管理'
    }
}]


export default {
    routes
}