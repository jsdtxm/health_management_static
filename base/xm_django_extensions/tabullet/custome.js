var source = JSON.parse($("#tabulletvalue").val());
var readonly = {"disabled": true, "": false}[$("#tabulletvalue").attr("disabled")];

function source2json(source){
    var tmp_source = [];
    for(var i=0;i<source.length;i++){
        var tmp = {};
        for(k in source[i])
            tmp[k] = source[i][k];
        tmp_source.push(tmp);
    }
    console.log(tmp_source)
    return JSON.stringify(tmp_source);
}

function resetTabullet() {
    $("#table").tabullet({
        data: source,
        action: function(mode, data) {
            if (mode === 'save') {
                data.id = Date.now();
                source.push(data);
            }
            if (mode === 'edit') {
                for (var i = 0; i < source.length; i++) {
                    if (source[i].id == data.id) {
                        source[i] = data;
                    }
                }
            }
            if (mode == 'delete') {
                for (var i = 0; i < source.length; i++) {
                    if (source[i].id == data) {
                        source.splice(i, 1);
                        break;
                    }
                }
            }
            //刷新hidden_input
            $("#tabulletvalue").val(source2json(source));
            resetTabullet();
        }
    });
}

resetTabullet();

