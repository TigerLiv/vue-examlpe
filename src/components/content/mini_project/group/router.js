import AddGroup from './AddGroup.vue'
import Group from './Group.vue'
import GroupMember from './GroupMember.vue'

const routes = [
  {
    path:'/group/:id',
    name:'添加群',
    component:AddGroup
  },
  {
    path:'/group',
    name:'群列表',
    component:Group
  },
  {
    path:'/group-member/:id',
    name:'群列表',
    component:GroupMember
  }
]

export default {routes}