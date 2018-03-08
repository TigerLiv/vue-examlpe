import Nav from './nav/Nav.vue'
import Page from './page/Page.vue'
import AddPage from './page/AddPage.vue'
//人员管理（顾问，文案，律师，客服）
import Person from './person/Person.vue'
import PersonType from './person/PersonType.vue'
import AddPerson from './person/AddPerson.vue'
//活动管理
import Activity from './activity/Activity.vue'
import AddActivity from './activity/AddActivity.vue'
import ReservationStaff from './activity/ReservationStaff.vue'
//最新案例，新闻
import News from './news/News.vue'
import AddNew from './news/AddNew.vue'
//友情链接
import FriendlyLink from './friendly_link/FriendlyLink.vue'
//专题
import SpecialTopic from './special_topic/SpecialTopic.vue'
//移民课堂
import Lesson from './immigrant_lesson/Lesson.vue'
import ImmigrantSpeaker from './immigrant_lesson/ImmigrantSpeaker.vue'
import ImmigrantColumn from './immigrant_lesson/ImmigrantColumn.vue'
import ImmigrantLesson from './immigrant_lesson/ImmigrantLesson.vue'
import AddLesson from './immigrant_lesson/AddLesson.vue'
//网站地图
import WebsiteMap from './website_map/WebsiteMap.vue'
//公司
import Company from './company/Company.vue'
import AddCompany from './company/AddCompany.vue'
//banner
import Banner from './banner/Banner.vue'
//敏感词
import Sensitive from './sensitive_word/Sensitive'
//成功案列
import Information from './information/Information.vue'
import AddInformation from './information/AddInformation.vue'
import DataRetention from './data_retention/DataRetention.vue'

const routes = [{
        path: '/nav',
        name: 'Nav',
        component: Nav,
        meta: { title: '导航栏管理' }
    }, {
        path: '/page',
        name: 'modifyPage',
        component: Page,
        meta: { title: '页面代码管理' }
    }, {
        path: '/page/:id',
        name: '添加页面',
        component: AddPage,
        meta: { title: '页面管理' }
    }, {
        path: '/person',
        name: 'PersonManage',
        component: Person,
        meta: { title: '人员管理列表' }
    }, {
        path: '/person_type',
        name: '人员分类',
        component: PersonType,
        meta: { title: '人员分类' }
    }, {
        path: '/person/:id',
        name: '添加人员',
        component: AddPerson,
        meta: { title: '人员管理' }
    }, {
        path: '/activity',
        name: 'Activity',
        component: Activity,
        meta: { title: '活动管理' }
    }, {
        path: '/activity/:id',
        name: '活动操作',
        component: AddActivity,
        meta: { title: '活动操作' }
    }, {
        path: '/staff',
        name: '活动预约人员',
        component: ReservationStaff,
        meta: { title: '活动预约人员' }
    }, {
        path: '/new/',
        name: '新闻列表',
        component: News,
        meta: { title: '新闻列表' }
    }, {
        path: '/new/:id',
        name: '新闻管理',
        component: AddNew,
        meta: { title: '新闻管理' }
    }, {
        path: '/link',
        name: 'FriendlyLink',
        component: FriendlyLink,
        meta: { title: '友情链接' }
    }, {
        path: '/special_topic',
        name: 'SpecialTopic',
        component: SpecialTopic,
        meta: { title: '专题页' }
    }, {
        path: '/immigrantLesson',
        name: '移民课堂',
        component: Lesson,
        meta: { title: '移民课堂' },
        children: [{
            path: '/immigrant_speaker',
            name: 'ImmigrantSpeaker',
            component: ImmigrantSpeaker,
            meta: { title: '移民课堂讲师' },
        },{
            path: '/immigrant_column',
            name: 'ImmigrantColumn',
            component: ImmigrantColumn,
            meta: { title: '移民课堂栏目' },
        }, {
            path: '/immigrant_lesson',
            name: 'ImmigrantLesson',
            component: ImmigrantLesson,
            meta: { title: '移民课堂列表' },
        }, ],
    }, {
        path: '/lesson/:id',
        name: '移民课堂添加修改',
        component: AddLesson,
        meta: { title: '移民课堂管理' },
    }, {
        path: '/website_map',
        name: 'WebsiteMap',
        component: WebsiteMap,
        meta: { title: '网站地图' },
    }, {
        path: '/company',
        name: 'Company',
        component: Company,
        meta: { title: '公司列表' },
    }, {
        path: '/company/:id',
        name: '添加修改公司',
        component: AddCompany,
        meta: { title: '公司管理' },
    }, {
        path: '/banner',
        name: 'Banner',
        component: Banner,
        meta: { title: '图片管理' },
    },
    {
        path: '/sensitive',
        name: 'SensitiveWords',
        component: Sensitive,
        meta: { title: '敏感词列表' },
    },
    {
        path: '/information',
        name: 'Cases',
        component: Information,
        meta: { title: '移民资讯' },
    },
    {
        path: '/information/:id',
        name: '移民资讯管理',
        component: AddInformation,
        meta: { title: '移民资讯管理' },
    },
    {
        path: '/collect',
        name: 'Collect',
        component: DataRetention,
        meta: { title: '资料留存' },
    }
]

export default {
    routes
}