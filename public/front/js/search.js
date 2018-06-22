$(function () {

  render();

  //清空列表记录 
  $('.search_bottom').on("click", ".btn_empty", function () {

    mui.confirm("您是否要清空所有的历史记录?", "温馨提示", ["否", "是"], function (e) {
      // e.index值为0表示否;1为是
      if (e.index == 1) {
        //移除lt_search_history
        localStorage.removeItem("lt_history");
        //重新渲染
        render();
      }
    })
  });

  // 删除特定下标的历史记录
  $('.search_bottom').on("click", ".btn_delete", function () {
    var that = $(this);
    mui.confirm("您是否要清空所有的历史记录?", "温馨提示", ["否", "是"], function (e) {
      // e.index值为0
      if (e.index == 1) {
        var index = that.data('index');
        var arr = getHistory();
        arr.splice(index, 1);
        localStorage.setItem('lt_history', JSON.stringify(arr));
        //重新渲染
        render();
      }
    })
  });

  // 添加历史记录
  $('.search_top button').on("click", function () {
    //console.log("hh");
    var content = $('.search_input').val().trim();
    $('.search_input').val("");

    // 若为空，弹出对话框
    if (content === "") {
      mui.toast("请输入搜索关键字");
      // 阻止浏览器默认行为
      return false;
    }

    var arr = getHistory();
    if (arr.indexOf(content) !==-1) {
      arr.splice((arr.indexOf(content)),1);
    }
    if (arr.length >= 10) {
      arr.pop();
    }

    arr.unshift(content);
    
    localStorage.setItem('lt_history', JSON.stringify(arr));
    // 重新渲染
    render();

    // 点击按钮页面直接跳转至searchList.html并拼接上key及值便于获取content
    location.href="searchList.html?key="+content;



  });







  // 获取localStorage的值
  function getHistory() {
    var history = localStorage.getItem("lt_history") || "[]";
    var arr = JSON.parse(history);
    return arr;
  }

  // 渲染页面
  function render() {
    var arr = getHistory();

    $(".search_bottom").html(template("tpl", { arr: arr }));

  }
});