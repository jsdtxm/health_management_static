function submit_extend(){
    $("div[data-type='jsoneditor']").each(function(){
        $(this).find("textarea").val(JSON.stringify(eval("editor_"+this.dataset.name).get()))
    })
}
