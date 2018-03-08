(function () {
  var a = {
    exec: function (editor) {
      // ck.dialogVisible = true
      document.getElementById('chooseImg').style.display = 'inline-block'
    }
  }
  var b = 'simpleupload'
  CKEDITOR.plugins.add(b, {
    init: function (editor) {
      editor.addCommand(b, a)
      editor.ui.addButton('simpleupload', {
        label: '添加图片',  // 鼠标悬停在插件上时显示的名字
        icon: 'plugins/simpleupload/img.svg',   // 自定义图标的路径
        command: b
      })
    }
  })
})()
