
var rev_dict = {} //反向查找器(text->id)
var forw_dict = {} //正向查找器(id->text)

if (!window.location.pathname.split('/').includes('view') && $(".x-select")) {
    $(".x-select").each(function(){
        var option_list = []
        
        $(this).children("option").each(function () {
            if ($(this).attr('value')) {
                rev_dict[$(this).text()] = $(this).attr('value');
                forw_dict[$(this).attr('value')] = $(this).text();
                option_list.push($(this).text())
            }
        });

        var name = $(this).attr("name")
        var id = $(this).attr("id")

        var select_text = $(this).find("option:selected").text();
        
        $(this).before('<input type="text" name="' + name + '" class="form-control x-select-rev" placeholder="在此键入关键词以搜索..." required id="' + id + '">')
        $(this).remove()

        if(option_list.length > 0)
            horsey(eval(id), {
                suggestions: option_list,
            });

        //根据form填充
        if(select_text.length > 0 && select_text != "---------")
            $("#"+id).val(select_text)
        
        //根据get填充
        var sURLVariables = decodeURIComponent(window.location.search.substring(1)).split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            // console.log(sParameterName[0]+":"+sParameterName[1]);
            if(sParameterName[0]==name)
                $("#id_"+sParameterName[0]).val(forw_dict[sParameterName[1]]);
            else
                $("#id_"+sParameterName[0]).val(sParameterName[1]);
        }
    })
}

$(".x-select-form").submit(function (e) {
    $(".x-select-rev").each(function(){
        var id_val = $(this).val();
        if (rev_dict[id_val]) {
            $(this).val(rev_dict[id_val]);
            return true;
        }
        swal('提示','请检查输入是否完整。','warning')
        return false;
    });
});

$("#verify_modal_submit").click(function (e) {
    $.ajax({
        type: "POST",
        dataType: "json",
        url:$('#verify_modal_form').attr("action"),
        data: $('#verify_modal_form').serialize(),
        success: function (data) {
            if(data['status'] == 'success'){
                swal('提示',data['text'],'success')
                $(".modal").modal("hide");
                setTimeout("window.location.reload()", 3000);
            }
        },
        error: function(data) {
            swal('提示','服务器错误','error')
         }
    });
});

$("#has_in_modal_confirm").click(function (e) {
    $.ajax({
        type: "POST",
        dataType: "json",
        url:$('#has_in_modal .modal-dialog').attr("action"),
        data: {'csrfmiddlewaretoken':$("input[name=csrfmiddlewaretoken]").val(),"status":"2"},
        success: function (data) {
            if(data['status'] == 'success'){
                swal('提示',data['text'],'success')
                $(".modal").modal("hide");
                setTimeout("window.location.reload()", 3000);
            }
        },
        error: function(data) {
            swal('提示','服务器错误','error')
         }
    });
});
