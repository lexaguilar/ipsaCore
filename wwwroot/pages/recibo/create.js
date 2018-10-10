pages['recibo.create'] = function(){
    jQuery('.table-hidaction tbody tr').hover(function(){
        jQuery(this).find('.table-action-hide a').animate({opacity: 1});
    },function(){
        jQuery(this).find('.table-action-hide a').animate({opacity: 0});
    });

    $('.select').selectize();

    var now = moment();
    $('.datepicker')
        .val(now.format("DD-MM-YYYY"))
        .datepicker({
            autoclose: true,
            format: 'dd-mm-yyyy',
            language: 'es',
            startDate : '01-01-2017'
    });
}