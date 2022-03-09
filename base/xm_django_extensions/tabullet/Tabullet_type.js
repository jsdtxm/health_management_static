/**
 * Edited by Xiamin on 2019/7/18.
 * 具有type选择功能的Tabullet。很多功能都没做
 * 
 * Edited by Xiamin on 2020/6/25.
 * 进行了大量修正与改进
 */
(function ($) {
    function select2dict(select){
        // select转dict
        var dict = {};
        select.each(function(i,v){
            dict[$(v).val()] = $(v).text();
        })
        return dict;
    }

    $.fn.tabullet = function (options) {
        var defaults = {
            rowClass: '',
            columnClass: '',
            tableClass: 'table',
            textClass: 'form-control',
            editClass: 'btn btn-default',
            deleteClass: 'btn btn-danger',
            saveClass: 'btn btn-info',
            deleteContent: '删除',
            editContent: '编辑',
            saveContent: '保存',
            action: function () {
            }
        };
        options = $.extend(defaults, options);
        var columns = $(this).find('thead > tr th');
        var idMap = $(this).find('thead > tr').first().attr('data-tabullet-map');
        var metadata = [];
        columns.each(function (i, v) {
            metadata.push({
                map: $(v).attr('data-tabullet-map'),
                readonly: $(v).attr('data-tabullet-readonly'),
                select: $(v).attr('data-tabullet-select'),  //select
                type: $(v).attr('data-tabullet-type'),
                data: $(v).attr('data-tabullet-data'),
            });
        });
        var index = 0;
        var data = options.data;
        $(data).each(function (i, v) {
            v._index = index++;
        });
        var table = this;
        $(table).find("tbody").remove();
        var tbody = $("<tbody/>").appendTo($(this));
        // INSERT
        if (!readonly) {
            var insertRow = $("<tr/>").appendTo($(tbody)).attr('data-tabullet-id', "-1");
            $(metadata).each(function (i, v) {
                if (v.type === 'delete') {
                    var td = $("<td/>").appendTo(insertRow);
                    return;
                }
                if (v.type === 'edit') {
                    var td = $("<td/>")
                        .html('<button type="button" class="' + options.saveClass + '"><nobr>' + options.saveContent + '</nobr></button>')
                        .attr('data-tabullet-type', 'save')
                        .appendTo(insertRow);
                    td.find('button').click(function (event) {
                        var saveData = [];
                        var rowParent = td.closest('tr');
                        rowParent.find('input, select').each(function (ri, rv) {
                            saveData[$(rv).attr('name')] = $(rv).val();
                        });
                        //自定义部分，禁止空值,TODO 需要修改
                        if(saveData.key!="")
                            options.action('save', saveData);
                        else
                            alert('Key禁止空值！')
                        return;
                    });
                    return;
                }
                if (v.readonly !== 'true') {
                    //自定义部分，增加select渲染
                    if(!v.select){
                        $('<td/>').html('<input type="text" name="' + v.map + '" class="' + options.textClass + '"/>').appendTo(insertRow);
                    }
                    else{
                        $('<td/>').html('<select name="' + v.map + '" class="' + options.textClass + '">'+ v.select +'</select>').appendTo(insertRow);
                    }
                }
                else {
                    $("<td/>").appendTo(insertRow);
                }
            });
        }
        $(data).each(function (i, v) {
            var tr = $("<tr/>").appendTo($(tbody)).attr('data-tabullet-id', v[idMap]);
            $(metadata).each(function (mi, mv) {
                if (mv.type === 'delete') {
                    var td = $("<td/>")
                        .html('<button type="button" class="' + options.deleteClass + '"><nobr>' + options.deleteContent + '</nobr></button>')
                        .attr('data-tabullet-type', mv.type)
                        .appendTo(tr);
                    td.find('button').click(function (event) {
                        tr.remove();
                        options.action('delete', $(tr).attr('data-tabullet-id'));
                    });
                }
                else if (mv.type === 'edit') {
                    var td = $("<td/>")
                        .html('<button type="button" class="' + options.editClass + '"><nobr>' + options.editContent + '</nobr></button>')
                        .attr('data-tabullet-type', mv.type)
                        .appendTo(tr);
                    td.find('button').click(function (event) {
                        if ($(this).attr('data-mode') === 'edit') {
                            var editData = [];
                            var rowParent = td.closest('tr');
                            var rowChildren = rowParent.find('input, select');
                            $(rowChildren).each(function (ri, rv) {
                                editData[$(rv).attr('name')] = $(rv).val();
                            });
                            editData[idMap] = $(rowParent).attr('data-tabullet-id');
                            options.action('edit', editData);
                            return;
                        }
                        $(this).removeClass(options.editClass).addClass(options.saveClass).html(options.saveContent)
                            .attr('data-mode', 'edit');
                        var rowParent = td.closest('tr');
                        var rowChildren = rowParent.find('td');
                        $(rowChildren).each(function (ri, rv) {
                            if ($(rv).attr('data-tabullet-type') === 'edit' ||
                                $(rv).attr('data-tabullet-type') === 'delete') {
                                return;
                            }
                            var mapName = $(rv).attr('data-tabullet-map');
                            if ($(rv).attr('data-tabullet-readonly') !== 'true') {
                                //编辑时输入框生成
                                var select = $(rv).attr('data-tabullet-select');
                                if(select){
                                    var select_html = $('<select name="' + mapName+ '" class="' + options.textClass + '">'+ select +'</select>').find("option[value='"+v[mapName]+"']").attr("selected",true);
                                    $(rv).html(select_html.prevObject.prop("outerHTML"));
                                }
                                else{
                                    $(rv).html('<input type="text" name="' + mapName + '" value="' + v[mapName] + '" class="' + options.textClass + '"/>');
                                }
                                
                            }
                        });
                    });
                }
                else {
                    //td生成
                    var td = $("<td/>").html(mv.select?select2dict($(mv.select))[v[mv.map]]:v[mv.map])
                        .attr('data-tabullet-map', mv.map)
                        .attr('data-tabullet-readonly', mv.readonly)
                        .attr('data-tabullet-type', mv.type)
                        .attr('data-tabullet-select', mv.select)
                        .attr('data-tabullet-data', v[mv.map])
                        .appendTo(tr);
                }
            });
        });

    };
}(jQuery));
