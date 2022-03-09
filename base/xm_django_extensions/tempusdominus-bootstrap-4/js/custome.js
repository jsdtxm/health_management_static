$('.xm-datetimepicker').each(function(){
    $(this).datetimepicker({
        format: 'YYYY/MM/DD',
        tooltips:{
            today: '今天',
            clear: '清除',
            close: '关闭',
            selectMonth: '选择月份',
            prevMonth: '上个月',
            nextMonth: '下个月',
            selectYear: '选择年份',
            prevYear: '上一年',
            nextYear: '下一年',
            selectDecade: '选择时期',
            prevDecade: '上个年代',
            nextDecade: '下个年代',
            prevCentury: '上个世纪',
            nextCentury: '下个世纪',
            incrementHour: '增加一小时',
            pickHour: '选择小时',
            decrementHour:'减少一小时',
            incrementMinute: '增加一分钟',
            pickMinute: '选择分',
            decrementMinute:'减少一分钟',
            incrementSecond: '增加一秒',
            pickSecond: '选择秒',
            decrementSecond:'减少一秒'
        },
        locale: 'zh-cn'
    })
});