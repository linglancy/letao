$(function () {

  var page = 1;
  var pageSize = 10;

  //获取地址栏中的参数
  var key = getSearch().key;
  //console.log(key);
  //设置给当前页面的input搜索框
  $('.search_top .search_input').val(key);


  //渲染
  render();


  // 为价格和库存做点击事件可以排序
  $(".nav-bar li[data-type]").on("click",function(){
    var $this = $(this);

    if (!$this.hasClass("now")) {
      //没有now这个类
      //1. 让当前的li有now这个类，移除其他li的now
      $(this).addClass("now").siblings().removeClass("now");
      //2. 让所有span下的箭头都向下
      $(".nav-bar li span").addClass("fa-angle-down").removeClass("fa-angle-up");
    } else {
      $(this).find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }

    render();
  });

  function render() {
    var obj = {
      page: page,
      pageSize: pageSize,
      proName: key
    };


    //判断是否需要添加price或者是num参数
    var $select = $(".nav-bar li.now");
    if ($select.length > 0) {
      console.log("需要排序");
      var type = $select.data("type");
      var value = $select.find("span").hasClass("fa-angle-down") ? 2 : 1;
      //给参数增加了一个属性，属性可以能是price，也可以能是num
      obj[type] = value;
    } else {
      console.log("不需要排序");
    }



    $.ajax({
      type: "get",
      url: "/product/queryProduct",
      data: obj,
      success: function (info) {

        console.log(info);
       $(".lt_product").html(template("tpl",info));
      }
    })
  }

  //用于获取地址栏中的参数
  function getSearch() {
    //1. 获取到地址栏中的key对应的值，把这个值放到搜索框中
    var search = location.search;
    //2. 地址栏会对中文进行转码
    search = decodeURI(search);
    //3. 去掉?
    search = search.slice(1);
    //4. 变成一个数组
    var arr = search.split("&");
    var obj = {};
    arr.forEach(function (e, i) {
      var k = e.split("=")[0];
      var v = e.split("=")[1];
      obj[k] = v;
    });
    return obj;
  }

});