$(function () {
  // 表单自动校验
  var $form = $("form");
  // 校验规则：1. 用户名不能为空 2. 用户密码不能为空 3. 用户密码长度为6-12位

  $form.bootstrapValidator({

    //设置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //设置校验规则
    fields: {

      username: {
        validators: {
          notEmpty: {
            message: "用户名不能为空"
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度是6-12位"
          },
          callback: {
            message: "密码错误"
          }
        }
      }

    }

  });

  // 表单校验成功,注册表单校验成功的事件，阻止默认，使用ajax提交
  $form.on("success.form.bv", function (e) {
    //阻止表单的默认提交
    e.preventDefault();
    //使用ajax进行提交
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $form.serialize(),
      dataType: "json",
      success: function (data) {
        if (data.success) {
          location.href = "index.html";
        }
        if (data.error === 1000) {
          $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback")
        }
        if (data.error === 1001) {
          $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback")
        }
      }
    });
  });

  //重置功能，重置样式
  $("[type='reset']").on("click", function () {

    //重置表单样式
    $("form").data("bootstrapValidator").resetForm();

  });
})

