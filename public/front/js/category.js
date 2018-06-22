$(function () {

  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    success: function (info) {

      $(".categroy_aside_left ul").html(template("tpl", info));

      renderSec(info.rows[0].id);
    }
  });

  function renderSec(id) {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: { id: id },
      success: function (info) {

        console.log(info);

        $(".categroy_brand_right ul").html(template("tpl_brand", info));
      }
    });
  }


  $(".categroy_aside_left ul").on("click", "li", function () {
    $(this).addClass("now").siblings().removeClass("now");
    var id = $(this).data("id");
    console.log(id);
    renderSec(id);
  });







});