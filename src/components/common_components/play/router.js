import upload from './UploadPlugin'
import VideoList from './VideoList'
import PlayVideo from './PlayVideo'

const routes = [
	{
		path:'/uploader',
		name:'点播',
		component: upload
	},
	{
		path:'/play-list',
		name:'点播列表',
		component: VideoList
	},
	{
		path:'/play-video/:videoId',
		name:'播放',
		component: PlayVideo
	},
]

export default {routes}
