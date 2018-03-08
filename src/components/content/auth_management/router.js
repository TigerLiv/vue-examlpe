import Group from './group/Group.vue'
import AddGroup from './group/AddGroup.vue'
import Role from './role/Role.vue'
import AddRole from './role/AddRole.vue'
import Manager from './user/Manager.vue'
import AddManager from './user/AddManager.vue'
import Model from './module/Model.vue'
const routes = [
  {
    path:'/manage_group',
    name:'AuthGroupManage',
    component:Group,
    meta:{title:'群组管理'}
  },{
    path:'/manage_group/:type/:id',
    name:'群组添加',
    component:AddGroup,
    meta:{title:'群组操作'}
  },{
    path:'/role',
    name:'AuthRoleManage',
    component:Role,
    meta:{title:'角色管理'}
  },{
    path:'/role/:id',
    name:'角色添加',
    component:AddRole,
    meta:{title:'角色操作'}
  },{
    path:'/auth',
    name:'AuthAdminManage',
    component:Manager,
    meta:{title:'后台用户管理'}
  },{
    path:'/auth/:id',
    name:'管理员添加',
    component:AddManager,
    meta:{title:'管理员管理'}
  },{
    path:'/model',
    name:'AuthModuleManage',
    component:Model,
    meta:{title:'模块管理'}
  }
]

export default {routes}