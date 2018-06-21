$(function () {

  var page = 1;
  var pageSize = 2;
  var imgs = [];//每次图片上传成功就往数组存储下来上传的结果。
  // 1. 判断数组的长度就知道上传了几张图片
  //2. 点击添加按钮时，需要获取到图片的信息

  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        $("tbody").html(template("render_tpl", info));

        //分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,

          //type属性：
          // 如果是首页---> first
          // 上一页-->prev
          // 下一页-->next
          // 尾页-->last
          // 具体的页码-->page
          totalPages: Math.ceil(info.total / pageSize),
          itemTexts: function (type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              //如果是page，说明就是数字，只需要返回对应的数字即可
              default:
                return page;
            }
          },
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              //如果是page，说明就是数字，只需要返回对应的数字即可
              default:
                return "跳转到" + page;
            }
          },
          useBootstrapTooltip: true,
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }

        });


      }
    });
  };

  $(".btn_add").on("click", function () {
    $("#addModal").modal("show");

    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        $(".dropdown-menu").html(template("add_tpl", info));
      }
    });
  });

  $(".dropdown-menu").on("click", "a", function () {
    $(".dropdown-text").text($(this).text());
    $([name = "brandId"]).val($(this).data("id"));
    $form.data('bootstrapValidator').updateStatus("brandId", "VALID");
  });


  //表单校验
  var $form = $("#form");
  $form.bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      brandId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择二级分类'
          },
        }
      },
      proName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品的名称'
          },
        }
      },
      proDesc: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品的描述'
          }
        }
      },
      num: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品的库存'
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '请输入商品的尺码(32-46)'
          }
        }
      },
      size: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品的尺码'
          },

          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '请输入合法的商品尺码，如(32-46)'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品的原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品的价格"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  });


  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {

      if (imgs.length >= 3) {
        return false;
      }

      //上传图片成功了
      //1. 把图片显示到页面中
      $(".img_box").append('<img src="' + data.result.picAddr + '" width="100" height="100" alt="">');

      //2. 把结果存储起来，添加的时候需要使用
      imgs.push(data.result);

      //3. 判断数组的长度，如果是3，手动让brandLogo 校验成功即可，  如果不是3，校验失败
      if (imgs.length === 3) {
        $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
      } else {
        $form.data("bootstrapValidator").updateStatus("brandLogo", "INVALID");
      }
    }
  });

  // 表单校验成功，阻止页面默认跳转，发送请求，从新渲染页面

  $form.on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    var param = $form.serialize();
    param += "&picName1="+imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
    param += "&picName2="+imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
    param += "&picName3="+imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data:param ,
      success: function (info) {
        if(info.success){
          $("#addModal").modal("hide");
          page = 1;
          render();
          //3. 重置表单的内容和样式
          $form[0].reset();
          $form.data("bootstrapValidator").resetForm();

           //下拉菜单重置
           $(".dropdown-text").text("请选择二级分类");
           $("[name='brandId']").val('');
 
           //重置图片
           $(".img_box img").remove();
           imgs = [];
 
        }
      }
    })

  });






});