$(function () {
  var page = 1;
  var pageSize = 5;


  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        //console.log(info);
        $("tbody").html(template("render_tpl", info));

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

    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        $(".dropdown-menu").html(template("add_tpl", info));
      }
    });
  });



  //为下拉框中的每个a注册委托事件并获取到a的内容
  $(".dropdown-menu").on("click", "a", function () {
    $("#dropdownMenu1 .dropdown-text").text($(this).text());

    $("[name='categoryId']").val($(this).data("id"));


    //3. 让categoryId校验变成成功
    $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });


  // 图片初始化上传
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      //console.log(data);
      $(".img_box img").attr("src", data.result.picAddr);

      $(".img_box [name='brandLogo']").val(data.result.picAddr);

      //把brandLogo改成成功
      $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });


  // 表单校验
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
      categoryId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择一级分类'
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
      brandName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入二级分类'
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: '请上传图片'
          }
        }
      },
    }

  });

  // 表单校验成功
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    // validator.resetForm();
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $form.serialize(),
      success: function (info) {
        if (info.success) {
          // 隐藏模态框
          $("#addModal").modal("hide");
          page = 1;
          render();

          // 重置表单的内容及样式
          console.log($form);
          $form[0].reset();
          $form.data("bootstrapValidator").resetForm();


          // 重置下拉框组件和图片
          $("#dropdownMenu1 .dropdown-text").text("请选择一级分类");

          $("[name='categoryId']").val("");
          $(".img_box img").attr("src", "images/none.png");
          $("[name='brandLogo']").val('');

        }
      }
    });
  });





});