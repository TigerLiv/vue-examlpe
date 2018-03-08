import User from './user/User.vue'
import Statistics from './statistics/Statistics.vue'
import Share from './share/Share.vue'
//项目
import Project from './project/Project.vue'
import ProjectMiddle from './project/ProjectMiddle.vue'
import AddProject from './project/AddProject.vue'
import Visa from './project/Visa.vue'
import ProjectComment from './project/ProjectComment.vue'
import ChildProject from './project/ChildProject.vue'
//表单与国家
import Immigrant from './forms/Immigrant.vue'
import AddImmigrantFrom from './forms/AddImmigrantFrom.vue'
import Country from './forms/Country.vue'
import AddCountry from './forms/AddCountry.vue'
//发现
import Found from './found/Found.vue'
import AddFound from './found/AddFound.vue'
//群管理
import AddGroup from './group/AddGroup.vue'
import Group from './group/Group.vue'
import GroupMember from './group/GroupMember.vue'


const routes = [{
  path: '/user',
  name: 'UserManage',
  component: User,
  meta:{title:'用户管理'}
}, {
  path: '/statistics',
  name: 'DataStatistics',
  component: Statistics,
  meta:{title:'数据统计'}
}, {
  path: '/share',
  name: 'ShareManage',
  component: Share,
  meta: {title:'分享管理'}
}, {
  path: '/project_middle',
  name: 'ProjectManage',
  component: ProjectMiddle,
  meta:{title:'项目管理'},
  children:[
    {
      path: '/project',
      name: 'ProjectList',
      component: Project,
      meta:{title:'项目列表'},
    },{
      path: '/project_comment/:id',
      name: '项目相关评论',
      component: ProjectComment,
      meta:{title:'项目相关评论'}
    },
  ]
}, {
  path: '/project/:id',
  name: '项目管理',
  component: AddProject,
  meta:{title:'项目管理'},
},{
  path: '/child_project/:type/:id',
  name: '子项目管理',
  component: ChildProject,
  meta:{title:'子项目管理'},
},{
  path: '/visa',
  name: 'VIsaCategory',
  component: Visa,
  meta:{title:'签证类型'}
}, {
  path: '/immigrant',
  name: 'ImmigrantAssessForm',
  component: Immigrant,
  meta:{title:'移民评估表单'}
}, {
  path: '/add-immigrant/:id',
  name: '移民表单管理',
  component: AddImmigrantFrom,
  meta:{title:'移民表单管理'}
}, {
  path: '/CountryManager',
  name: 'CountryManager',
  component: Country,
  meta:{title:'国家管理'}
}, {
  path: '/country/:id',
  name: '国家添加',
  component: AddCountry,
  meta:{title:'国家操作'}
}, {
  path: '/DiscoverModule',
  name: 'DiscoverModule',
  component: Found,
  meta:{title:'发现模块'}
}, {
  path: '/found/:id',
  name: '添加发现',
  component: AddFound,
  meta:{title:'发现管理'}
}, {
  path: '/group/:id',
  name: '添加群',
  component: AddGroup,
  meta:{title:'群操作'}
}, {
  path: '/group',
  name: 'GroupManage',
  component: Group,
  meta:{title:'群管理'}
}, {
  path: '/group-member/:id',
  name: '群成员列表',
  component: GroupMember,
  meta:{title:'群成员列表'}
}]

export default {
  routes
}
