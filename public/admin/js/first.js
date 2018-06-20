$(function () {

  var page = 1;
  var pageSize = 5;

  render();

  function render() {

    $.ajax({
      type: "get",
      url: '/category/queryTopCategoryPaging',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        //console.log(info);
        $("tbody").html(template("tpl", info));
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / pageSize),
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        });
      }
    });

  }


  $(".btn_add").on("click", function () {

    $("#addModal").modal("show");

  });


  // 表单校验
  var $form = $("#form");
  $form.bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [':disabled', ':hidden', ':not(:visible)'],
  
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
  
    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      categoryName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入一级分类的名称'
          },
          // //长度校验
          // stringLength: {
          //   min: 6,
          //   max: 30,
          //   message: '用户名长度必须在6到30之间'
          // },
          // //正则校验
          // regexp: {
          //   regexp: /^[a-zA-Z0-9_\.]+$/,
          //   message: '用户名由数字字母下划线和.组成'
          // }
        }
      },
    }
  
  });


  $form.on("success.form.bv", function (e) {

    //var categoryName = $("[name='categoryName']").val();

    e.preventDefault();
    console.log("呵呵");
    //发送ajax请求，
    $.ajax({
      type:"post",
      url:"/category/addTopCategory",
      data:$form.serialize(),
      success:function (info) {
        if(info.success){

          //关闭模态框
          $("#addModal").modal("hide");

          //重新渲染第一页
          currentPage = 1;
          render();


          //把模态框中的数据重置
          $form.data("bootstrapValidator").resetForm();
          //$form是一个jquery对象，没有reset方法
          //但是dom对象有reset方法，所以需要把form这个对象取出来，才能调用reset方法
          $form[0].reset();

        }
      }
    });
  });






});