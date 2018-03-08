import Vue from 'vue'
import axios from 'axios'
import AxiosConfig from './axios-config'
import Element from 'element-ui'
import qs from 'qs'
import router from '@/router'
Vue.use(Element)

var AxiosSND = axios.create(AxiosConfig)
AxiosSND.defaults.withCredentials = true;
Object.defineProperties(Vue.prototype, {
  axios: {
    get() {
      return AxiosSND
    }
  },

  $http: {
    get() {
      return AxiosSND
    }
  }
})

export default {
  //权限管理
  management: {
    get: 'auth/group',
    group: 'auth/group', //添加组
    group_role: 'auth/role', //添加组角色
    get_role: 'auth/role',
    role_module: 'auth/role/modules', //给角色添加修改模块
    get_module: 'auth/group/modules', //获得组下面的模块
    group_module: 'auth/group/modules', //给组添加修改模块
    module: 'auth/module', //添加模块
    auth: 'auth/admin', //添加管理员
    auth_list: 'auth/admin' //管理员列表
  },

  //用户管理
  user: {
    get: 'user',
    post: 'auth/login',
    put: 'auth',
    delete: 'auth',
    login: 'auth/login',
    check: 'auth/check',
    logout: 'auth/logout',
    updatePassword: 'auth/updatePassword'
  },
  form: {
    get: 'assess/form',
    post: 'assess/form',
    put: 'assess/form',
    delete: 'assess/form',
    add_question: 'assess/question',
    get_front: 'assess/question/front',
  },
  country: {
    get: 'country',
    post: 'country',
    put: 'country',
    delete: 'country',
  },
  share: {
    get: 'share',
    put: 'share',
    post: 'share',
    delete: 'share'
  },
  project: {
    get: 'project',
    post: 'project',
    put: 'project',
    delete: 'project',
    category: 'project/category',
    country: 'project/country',
    put_status: 'project/updateStatus',
    pcomment: 'pComment',
    pcomment_status: 'pComment/updateStatus'
  },
  statistics: {
    get: 'statistics/assess',
    get_today: 'statistics/assess/today',
    put: 'statistics/assess/updateAddNum',
  },
  found: {
    get: 'news',
    post: 'news',
    put: 'news',
    delete: 'news',
    get_content: 'news/wechat-info',
  },
  wx_group: {
    category: 'group/category',
    get: 'group',
    post: 'group',
    delete: 'group',
    user: 'group/user',
    delete_user: 'group/user',
    join: 'group/user/join',
    put_status: 'group/updateStatus'
  },
  //上传图片
  image: {
    upload: '/upload',
  },
  //点灯小游戏
  light: {
    get: '/wish/light',
    post: '/wish/light/attr',
    statistics: '/wish/light/statistics',
    user: '/wish/user',
    edit_wish: '/wish'
  },

  //视频上传
  video: {
    upload: 'video/create',
    play: 'video',
  },
  //太平洋官网(official_website)
  website: {
    //友情链接(friendly_link)
    link: {
      get: 'links',
      post: 'links',
      delete: 'links'
    },
    //专题页(special_topic)
    topic: {
      get: 'topic-page',
      post: 'topic-page',
      delete: 'topic-page'
    },
    //签证类型(visa)
    visa: {
      get: 'visa',
      post: 'visa',
      delete: 'visa'
    },
    //移民课堂（immigration_lesson）
    lesson: {
      get_speaker: 'immigrant-classroom/speaker',
      post_speaker: 'immigrant-classroom/speaker',
      delete_speaker: 'immigrant-classroom/speaker',
      get_cloumn:'immigrant-classroom/column',
      post_cloumn:'immigrant-classroom/column',
      delete_cloumn:'immigrant-classroom/column',
      get_lesson: 'immigrant-classroom',
      post_lesson: 'immigrant-classroom',
      delete_lesson: 'immigrant-classroom',
      
    },
    //前端组件（page）
    frontend: {
      get: 'frontend-component',
      post: 'frontend-component',
      delete: 'frontend-component',
    },
    //网站地图（website_map）
    map: {
      get: 'website-map',
      post: 'website-map',
      delete: 'website-map',
    },
    //公司模块
    company: {
      get: '/organization',
      post: '/organization',
    },
    //人员管理(person)
    person: {
      category: 'people/category',
      get: 'people',
      post: 'people',
      delete: 'people',
    },
    //敏感词管理
    sensitiveWord: {
      get: '/sensitiveWord',
      post: '/sensitiveWord',
      check: '/sensitiveWord/check'
    },
    //banner管理（banner）
    banner: {
      get: 'banner',
      post: 'banner',
      delete: 'banner',
      updateStatus: 'banner/updateStatus',
      postion:'banner/position',
      updateSort:'banner/updateSort',
    },
    //活动管理（activity）
    activity: {
      get:'activity',
      post:'activity',
      delete:'activity',
    },
    //成功案例（case）
    case:{
      get:'information',
      post:'information',
      delete:'information',
    },
    //导航管理（nav）
    nav: {
      get: 'navigation',
      post: 'navigation',
      delete: 'navigation',
      updateStatus: 'navigation/updateStatus',
      updateSort:'navigation/updateSort',
    },
    //资料留存
    collect: {
      get:'collect'
    }
  },
  //登录获得动态路由
  getUrl: function () {
    let route = router.options.routes
    let routes = route[route.length - 1].children
    let menus = eval("(" + sessionStorage.getItem('module') + ")")
    let promise = new Promise(function (resolve, reject) {
      route.forEach((router) => {
        if (menus.length != 0) {
          menus.forEach((menu) => {
            let path = 'path'
            let icon = 'icon'
            if (router.name == menu.identify) { //一级导航
              menu[path] = router.path
              menu[icon] = router.meta.icon
            }
            if (menu.child) {
              menu.child.forEach((child) => { //二级导航
                if (router.children) { //二级路由
                  router.children.forEach(eleRoute => {
                    if (child.identify == eleRoute.name) {
                      child[path] = eleRoute.path
                    }
                    if (child.child) { //三级导航
                      child.child.forEach(sub => {
                        if (eleRoute.children) { //三级路由
                          eleRoute.children.forEach(subRoute => {
                            if (sub.identify == subRoute.name) {
                              sub[path] = subRoute.path
                            }
                          })
                        }

                      })
                    }
                  })
                }

              })
            }
          })
        }
      })
      resolve(menus)
    })
    return promise
  },

  // 获得数据
  getData: function (type, url, params) {
    var that = this
    if (!params) {
      params = {};
    }
    let axios;
    if ('get' == type) {
      axios = AxiosSND.get(url, {
        params: params
      })
    } else if ('post' == type) {
      axios = AxiosSND.post(url, qs.stringify(params));
    }
    let promise = new Promise((resolve, reject) => {
      axios.then(response => {
        if (200 == response.status) {
          resolve(response);
        } else if (403 == response.status) {
          Vue.prototype.$message.error('未知错误！');
        } else if (500 == response.status) {
          console.log(response)
          Vue.prototype.$message.error('未知错误！');
        } else {
          Vue.prototype.$message.error('未知错误！');
        }
      }).catch((error) => {
        if (error.response.status == 401) {
          Vue.prototype.axios.get(that.user.check).then(res => {
            if (res.data.code == 200) {
              console.log('已登录')
            } else {
              Vue.prototype.$message.error('登录异常，请重新登录！');
              router.push('/login')
            }
          }).catch((error) => {
            if (error.response.status == 401) {
              Vue.prototype.$message.error('登录异常，请重新登录！');
              router.push('/login')
            }
          })
        } else if (error.request) {
          Vue.prototype.$message.error('网络异常，请检查您的网络并刷新重试！');
        } else {
          Vue.prototype.$message.error('未知错误，请刷新重试！');
        }
      })
    })
    return promise;
  },

  //时间戳，在需要时间转换的时候可以直接调用
  getTime: function (time) {
    var newDate = new Date();
    newDate.setTime(time * 1000);
    Date.prototype.format = function (format) {
      var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes()
      };
      if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
      }
      return format;
    }
    return newDate.format('yyyy-MM-dd hh:mm')
  },
  //时间戳，在需要时间转换的时候可以直接调用 'yyyy-MM-dd hh:mm:ss'
  getSeconds: function (time) {
    var newDate = new Date();
    newDate.setTime(time * 1000);
    Date.prototype.format = function (format) {
      var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds()
      };
      if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
      }
      return format;
    }
    return newDate.format('yyyy-MM-dd hh:mm:ss')
  },
  getDateTime: function (time, formatType) {
    var newDate = new Date();
    newDate.setTime(time * 1000);
    Date.prototype.format = function (format) {
      var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes()
      };
      if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
      }
      return format;
    }
    let formatStr = formatType ? formatType : 'yyyy-MM-dd';
    return newDate.format(formatStr);
  },
  setCookie: function (name, val, days) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + days)
    document.cookie = name + "=" + escape(val) + ((days == null) ? "" : ";expires=" + exdate.toGMTString())
  },
  getCookie: function (c_name) {
    if (document.cookie.length > 0) {
      var c_start = document.cookie.indexOf(c_name + "=")
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1
        var c_end = document.cookie.indexOf(";", c_start)
        if (c_end == -1) c_end = document.cookie.length
        return unescape(document.cookie.substring(c_start, c_end))
      }
    }
    return ""
  },
  deleteRepetionChar: function (arr) {
    //先判断输入进来的是数组对象还是字符串
    if (typeof arr == "object") {
      var arr = arr;
    } else if (typeof arr == "string") {
      //字符串转为数组
      var arr = arr.split(",")
    }
    //存放不相同的数据
    var box = []; //存放去重数据
    var thisArr; //当前的值arr[i]
    //遍历数组
    for (var i = 0; i < arr.length; i++) {
      thisArr = arr[i]
      //定义一个旗子，检查是不是有重复的字符
      var flag = true;
      //遍历存放数据盒子，检查是否等于当前元素
      for (var j = 0; j < box.length; j++) {
        //如果值存在
        if (box[j] == thisArr) {
          flag = false;
          break; //结束for循环
        }
      }
      if (flag == false) {
        //continue返回执行函数而不压入数组
        continue;
      }
      box.push(thisArr);
    }
    return box
  },
  cloneObj: function (obj) {
    let str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
      return;
    } else if (window.JSON) {
      str = JSON.stringify(obj), //系列化对象
        newobj = JSON.parse(str); //还原
    } else {
      for (let i in obj) {
        newobj[i] = typeof obj[i] === 'object' ?
          cloneObj(obj[i]) : obj[i];
      }
    }
    return newobj;
  },

}
