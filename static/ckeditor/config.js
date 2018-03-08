/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
  // config.filebrowserImageUploadUrl = 'http://mt.qeebu.cn/test/upload'
  config.image_previewText = ' '
  config.removeButtons = 'Image'
  config.toolbar = 'default'
  // config.extraPlugins = (config.extraPlugins ? ',lineheight' : 'lineheight')
  config.extraPlugins = "font,lineheight,simpleupload"
  config.font_names='宋体/宋体;黑体/黑体;仿宋/仿宋_GB2312;楷体/楷体_GB2312;隶书/隶书;幼圆/幼圆;微软雅黑/微软雅黑;'+ config.font_names;
  config.FontSizes = '56px;48px;34px;32px;29px;24px;21px;20px;18px;16px;15px;14px;12px;10px;8px' ; 
}
