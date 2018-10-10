var context = {
    ajax: {
        get: (url, data, callback, failCallback) => {
            $.get((baseAddress + url), data ? data : null, callback)
                .fail(failCallback || context.ajax.failResult);

        },
        post: (url, data, callback, failCallback) => {
            $.post((baseAddress + url), data ? data : null, callback)
                .fail(failCallback || context.ajax.failResult);
        },
        full: (url, data, callback, failCallback, type = 'post') => {
            $.ajax({
                url: (baseAddress + url),
                type: type,
                dataType: "json",
                data: data,
                success: callback,
                failure: failCallback || context.ajax.failResult,
                error: failCallback || context.ajax.failResult
            });
        },
        status: {
            BadRequest: 400,
            Unauthorized: 401,
            NotFound: 404,
            IServerError: 500
        },
        failResult: jqXHR => {
            if (jqXHR.status == context.ajax.status.Unauthorized)
                context.redirectToLogin();
            if (jqXHR.status == context.ajax.status.IServerError)
                context.showMessage({ responseJSON: 'Error interno de la aplicación' });
            else
                context.showMessage(jqXHR);
        }
    },
    validate: {
        validateField : value => (typeof (value) !== "undefined" && value != null && value != ''),
        validateChange : change => (typeof (change) !== "undefined" && change.delegateTarget.value != null && change.delegateTarget.value != '' && change.delegateTarget.value != '0'),
        isNumber : n => !isNaN(parseFloat(n)) && isFinite(n),
        isEmail : text => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(text).toLowerCase());
        },
        validateLength : value =>{
            var f = {
                iquals : _length => value.length == _length,
                between : (min, max) => value.length >= min && value.length <= max
            }
            return f
        },
        hasAnyValue : value => value.length > 0,
        propertyIsValid : id =>{
            logger.log(id);

            var propertyIsOk = true;

            var elem = findElemt(id);
            var value = elem.getValue();

            if(elem.inputMinLength)
                if(elem.inputMinLength > String(value).length){
                    showMessageValidation(elem,`Ingrese ${elem.inputMinLength} caracteres mínimo`);
                    propertyIsOk = false;
                }

            if(elem.type == context.types.email)
                if(!validate.isEmail(value)) {
                    showMessageValidation(elem,'Solo se permite formato de correo');
                    propertyIsOk = false;
                }

            return propertyIsOk;
        }
    },
    redirectToLogin: () => { window.location.href = baseAddress + 'account/logIn' },
    showMessage: jqXHR => $.notify(jqXHR.responseJSON, { mouse_over: 'pause' }),
    branchId: {
        Automovil: 1,
        Vida: 2,
        Incendio: 5
    },
    coverageId: {
        RoboHurto: 65,
        EquipoEspecial: 264
    },
    tipoDedu: {
        indeterminado: 0,
        ckeck: 1,
        select: 2
    },
    countries: [
        { code: 1, Name: 'Nicaragua', alias: 'NI' },
        { code: 2, Name: 'Honduras', alias: 'HN' },
        { code: 3, Name: 'CostaRica', alias: 'CR' }
    ],
    regions: {
        nicaragua: 1,
        honduras: 2,
        costaRica: 3,
    },
    identifierTypes: {
        cedula: 1,
    },
    itipopol: {
        singel: 'I',
        certificate: 'K'
    },
    formaPago: {
        PagoDirecto: 'D',
        tarjeta: 'T',
        cuenta: 'C',
        sinAsignar: 'S'
    },
    medioPago: {
        PGDI: 'D',
        TARJ: 'T',
        PTRC: 'S',
        CNTA: 'C',
        CCC:'K'
    },
    policy: {
        status: {
            bid: 0,
            request: 1,
            confirmed: 2,
            anulado: 3
        }
    },
    columns: {
        idCobertura: 0,
        nombre: 2,
        sa: 3,
        coa: 4,
        deducible: 5,
        prima: 6
    },
    findCountry: code => context.countries.find(c => c.code == code),
    store: {
        tipoPrestamo: [],
        tipoCredito: [],
        parentescos: [],
        equipoEspecial: []
    },
    soaPlanPrint: {
        // Id de planes que no se desean imprimir como reporte HTML de SOA
        exclude: [124]
    },
    CoverageWithRSat:[334,335],
    Cesionarios :{
        sinAsignar : '0'
    },
    extendConfig: function (cfg){
        return {
            to : function(action){
                return $.extend({ required:  () => false, message: '' ,isValid: value => validate.validateField($.trim(value))}, cfg ? cfg[action] ? cfg[action] : {} : {})
            }
        }
    },
    dataConfig: {
        createConfig: function(cfg) {

            var extendConfig = context.extendConfig(cfg);

            var options = $.extend({
                routePrefix: 'api/catalogs/',
                changeonload: !1,
                url: '', // url
                data: [], // for querystring
                route: [], // for url data
                fallCallBack : null, //funcion que se ejecutara como fallCallBack
                aliasToRates: '', // nombre de la variable al momento de tarificar
                id: '', //id de elemento HTML
                display: '', // Como se va mostrar la propidad en los mensajes
                defaultMsg: 'Este campo es requerido',
                reload: !0,
                entity: '', // a que tabla pertenece, si no pertenece a ninguna table(view model) establer la propiedad is Entity en false
                itemDependency: [], // Collecion de los item que depende
                hasDependency: function(){ return this.itemDependency.length > 0; },
                msgAlert: 'No hay datos', //msg de notificacion al usuario
                PagePosition: 0, //definir si el control esta en la pagina 0(tarificacion),1(ente) o 2(solicitud)
                PropertyOut: null, // propidad de salida, si no se especifica sera en mismo del id
                inputMinLength : null, //Longitud minima para el elemento
                type : context.types.input, //Definir el tipo de dato
                getValue : function() {
                    //let item = $('#' + this.id);
                    return getValueByTag[this.type](this.id);
                },
                onChange : function(value, text){
                    //to do somethings
                },
                isValid : value => !validate.validateField($.trim(value)),
                render : null, //Como se va pintar en el select
                dataSource:[]
            }, cfg);

            options['toQuote'] = extendConfig.to('toQuote');
            options['toSave'] =  extendConfig.to('toSave');
            options['toRequest'] = extendConfig.to('toRequest');
            options['toCancel'] = extendConfig.to('toCancel');
            options['toCotizar'] = extendConfig.to('toCotizar');

            return options;
        },
        opcion: () => {
            return context.dataConfig.createConfig(
                {
                    url: `plans/{Plan}/sumAssured`,
                    route: ['Plan'],
                    id: 'opcion',
                    hasDependency: true,
                    itemDependency: ['Plan'],
                    msgAlert: 'Seleccione un plan antes',
                });
        }
    },
    mask: {
        Nicaragua: {
            cedula: '000-000000-0000X',
            telefono: '0000-0000',
            email: 'email@dominio.com'
        },
        Honduras: {
            cedula: '0000-0000-00000',
            telefono: '0000-0000',
            email: 'email@dominio.com'
        },
        CostaRica: {
            cedula: '',
            telefono: '0000-0000',
            email: 'email@dominio.com'
        }
    },
    auUso :{
        moto : 7,
        particular : 1
    },
    page:{
        tarificacion: 0,
        ente: 1,
        datosTecnicos: 2
    },
    types :  {
        email : 'email',
        phone : 'phone',
        money : 'money',
        check : 'check',
        select : 'select',
        date : 'date',
        input : 'input',
        td : 'td'
    },
    dialog: {
        open: null,
        close: id => {
            var dialog = document.querySelector(id);
            dialog.close();
        }
    }
}

var dataConfig = context.dataConfig;

var onLostFocus = e =>{
    if($('#Forma').isAccount() && e.value.length > 0){

        if(e.value.length <= 9){
            if(banco.value.length > 0){
                if (tipo.value.length > 0) {
                    var _banc = banco.value;
                    var _account = e.value;
                    var _type = tipo.value;

                    var _type = $('#tipo').val();

                    var failResult =  jqXHR => {
                        if (jqXHR.status == context.ajax.status.BadRequest)
                            $('#numero').addClass('isEmpty').notify(jqXHR.responseJSON);
                        else
                            context.ajax.failResult(jqXHR);
                    }

                    context.ajax.get(`api/policies/validations/banks/${_banc}/accounts/${_account}/types/${_type}`,{},data => {
                        nombreFormaPago.value = data;
                        $('#numero').removeClass('isEmpty');
                        $('#nombreFormaPago').removeClass('isEmpty');
                    }, failResult);
                }else{
                    $('#tipo-selectized').parent().addClass('isEmpty').notify('Seleccione el banco');
                }
            }else{
                $('#banco-selectized').parent().addClass('isEmpty').notify('Seleccione el banco');
            }
        }
        else{
            $('#numero').addClass('isEmpty').notify('El número de la cuenta no puede ser mayor a 9 dígitos');
        }
    }
}

//functions
var getDatePart = (date, part) => {
    var check = moment($('#' + date).val(), 'MM/YYYY');
    if(check._isValid)
        return check.format(part);
    else
        return 0;
}

var Formatear = valorNumerico => numeral(valorNumerico.toString().replace(',', '.')).format('0,0.00');

var findSelectize = selectId => $selectizies.filter((n, v) => $(v).attr('id') == selectId)[0];

var buildParameters = properties => {
    var data = null;
    if (properties) {
        var datarow = '';
        $.each(properties, function (i, property) {
            var value = $('#' + property).val();
            datarow += '"' + property + '":' + (context.validate.isNumber(value) ? value : '"' + value + '"') + ',';
        });
        data = JSON.parse('{' + datarow.slice(0, -1) + '}');
    }
    return data;
}

var isTagSelect = row => $($(row).find("td").eq(3)[0].firstChild)[0].tagName == "A"

var Tarificar = {
    prossecing: false,
    IsOk: false,
    clear: () => { this.polCobes = []; },
    Process: function () {
        this.clear();
        this.IsOk = false;

        if (typeof hideDescount == 'function')
            hideDescount();

        var configuration = currentConfiguration();
        if (configuration) {
            var error = FieldContainsErrors('toQuote');
            if (!error)
                this.Continue();
        } else {
            $('html, body').animate({ scrollTop: 0 }, 'fast');
        }

    },
    Continue: function () {

        if (!this.prossecing) {
            this.prossecing = true;
            var tbutton = $('#tarificar');
            $(tbutton).html('Tarificando...<span class="fa fa-spinner fa-pulse"/>');

            var coverageIds = [];

            var setClassSelectedAndPush = (row, coberturaId) => {
                coverageIds.push(coberturaId);

                $(row).find("td").eq(context.columns.sa).addClass('selected-row');
                $(row).find("td").eq(context.columns.coa).addClass('selected-row');
                $(row).find("td").eq(context.columns.deducible).addClass('selected-row');
                $(row).find("td").eq(context.columns.prima).addClass('selected-row').addClass("prima").html('<span class="fa fa-pulse fa-spinner"></span>');
            }

            var clearClassSelected = row => {
                var value = Formatear(0);

                if (!isTagSelect(row))
                    $(row).find("td").eq(context.columns.sa).removeClass('selected-row').html(Formatear(value));

                $(row).find("td").eq(context.columns.coa).removeClass('selected-row').html(Formatear(value));
                $(row).find("td").eq(context.columns.deducible).removeClass('selected-row').html(Formatear(value));
                $(row).find("td").eq(context.columns.prima).removeClass('selected-row').html(Formatear(value));
            }

            //prima = 0;

            allRows().each(function (index) {
                var idcobertura = $(this).find("td").eq(context.columns.idCobertura).html();
                if (idcobertura) {
                    var row = $(this);
                    var estaMarcado = $(":checkbox:eq(0)", this).is(":checked");

                    if (estaMarcado) {
                        setClassSelectedAndPush(row, idcobertura);
                    }
                    else {
                        //Verificar si depende de una cobertura padre
                        //var coverage = coverages.find(findCoverage.bind(this, idcobertura));
                        var coverage = coverages.findById(idcobertura);

                        if (coverage.cobDepende) {
                            //var coverageParent = coverages.find(findCoverage.bind(this, coverage.cobDepende));
                            var coverageParent = coverages.findById(coverage.cobDepende);
                            //if (coveragesSelectedIds().map(c => parseInt(c)).some(id => id == coverageParent.coberturaId)) {
                            if (coverages.getById(coverageParent.coberturaId).isChecked()) {
                                setClassSelectedAndPush(row, coverage.coberturaId);
                            } else {
                                clearClassSelected(row);
                            }
                        }
                        else
                        clearClassSelected(row);
                    }
                }
            });

            if (coverageIds.length) {
                var data = {};
                var elemts = filterElemts('toQuote');

                for (const key in elemts) {
                    //if (elemts.hasOwnProperty(key) && Exists(elemts[key].id)) {
                    if (elemts.hasOwnProperty(key)) {
                        var elemt = elemts[key];
                        data[elemts[key].aliasToRates] = getValueByTag[elemt.type](elemt.id);
                    }
                }

                data["coverageIds"] = JSON.stringify(coverageIds);
                var plan = $('#Plan').val();

                var failCallBack = jqXHR => {
                    context.ajax.failResult(jqXHR)
                    resetBtn(tbutton);
                    allRows().each(function (index) {
                        var row = $(this);
                        clearClassSelected(row);
                    });
                    calculateBill();
                    Tarificar.prossecing = false;
                }

                context.ajax.get(`api/plans/${plan}/coverages/rates`, data, function (result) {
                    result.forEach(coverageData => {
                        allRows().each(function (index) {
                            var idcobertura = $(this).find("td").eq(context.columns.idCobertura).html();
                            if (idcobertura) {

                                var row = $(this);

                                if (idcobertura == coverageData.coberturaId) {
                                    if (coverageData.sa == '-1') {
                                        $.notify(coverageData.prima, 'error');
                                        Tarificar.IsOk = false;
                                        resetBtn(tbutton);
                                        allRows().each(function (index) {
                                            var row = $(this);
                                            clearClassSelected(row);
                                        });
                                        return false;
                                    }

                                    var _prima = parseFloat(coverageData.prima.replace(",", ".")) + parseFloat(coverageData.mRecargo.replace(",", "."));

                                    if (!isTagSelect(row))
                                        $(row).find("td").eq(context.columns.sa).html(Formatear(coverageData.sa));

                                    $(row).find("td").eq(context.columns.coa).html(Formatear(coverageData.coaseguro));
                                    $(row).find("td").eq(context.columns.deducible).html(Formatear(coverageData.deducible));
                                    $(row).find("td").eq(context.columns.prima).html(Formatear(round(_prima)));

                                    var _primaGravada = 0;
                                    if (coverageData.bImpuesto1)
                                        _primaGravada = round(_prima);

                                    var mdescuento = 0;
                                    mdescuento = round(round(_prima)*coverageData.pdescuento/100),

                                    polCobes.push({
                                        IdCob: idcobertura,
                                        Nombre: $(row).find("td").eq(context.columns.nombre).text(),
                                        Prima: round(_prima),
                                        SA: round(coverageData.sa),
                                        COA: round(coverageData.coaseguro),
                                        Deducible: round(coverageData.deducible),
                                        ptasa: round(coverageData.ptasa.replace(",", ".")),
                                        bDescuentoManual: coverageData.bDescuentoManual,
                                        pComision: coverageData.pComision,
                                        mComision: coverageData.pComision * round(coverageData.prima.replace(",", ".")) / 100,
                                        bImpuesto: coverageData.bImpuesto1,
                                        pdescuento: coverageData.pdescuento,
                                        mdescuento: mdescuento,
                                        mRecargo: round(coverageData.mRecargo.replace(",", ".")),
                                        pRecargo: coverageData.pRecargo,
                                        obligatoria: coverageData.obligatoria,
                                        primaGravada: _primaGravada,
                                        mPrimaBruta: round(_prima - mdescuento)
                                    });

                                }
                            }
                            Tarificar.IsOk = true;
                        });
                    });
                    resetBtn(tbutton);
                    calculateBill(true);
                    Tarificar.prossecing = false;
                }, failCallBack);

            } else {
                $.notify('Seleccione al menos una cobertura');
                Tarificar.IsOk = false;
                Tarificar.prossecing = false;
                resetBtn(tbutton);
            }
        }
    }
}

var round = num => {
    var scale = 2;
    var result = 0;
    if(!("" + num).includes("e")) {
        result = +(Math.round(num + "e+" + scale)  + "e-" + scale);
        return parseFloat(result).toFixed(2);
    } else {
      var arr = ("" + num).split("e");
      var sig = ""
      if(+arr[1] + scale > 0) {
        sig = "+";
      }
      result = +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
      return parseFloat(result).toFixed(2);
    }

}

var resetBtn = btn => {
    $(btn).html('<span class="fa fa-calculator"></span> Tarificar de nuevo');
}

var applyEfectAndValue = (item, value) => {
    var currentValue = $(item).getValueWithAttr();
    if (currentValue != value) {
        $(item).animateCss('fadeOutDown', function () {
            $(item).setValueWithAttr(value);
            $(item).animateCss('fadeInUp', function () { });
        });
    }
}

var findDescuentoAut = polCobes => {
    var descuentoAut = 0;
    polCobes.forEach(cobe => {
        //descuentoAut += cobe.Prima * (cobe.pdescuento / 100);
        descuentoAut += +(cobe.mdescuento);
    });
    return descuentoAut;
}

var calculateBill = (showMessage) => {
    var pDescuento = $('#pDescuento').val();
    var prima = polCobes.sum('Prima');// reduce((a,b)=> (+a) + (+b.Prima) ,0)
    applyEfectAndValue($('#Prima'), prima);

    var coveragesWithTax = polCobes.filter(cobertura => cobertura.bImpuesto);

    var PrimaWithTax = coveragesWithTax.sum('Prima');//.reduce((a, b) => ((+a) + (+b.Prima)), 0);

    var mDescuento = PrimaWithTax * pDescuento / 100;

    mDescuentoAut = findDescuentoAut(polCobes);
    mDescuento = mDescuento + mDescuentoAut;

    //Prima exonerada
    var primaExonerada = polCobes.filter(cobertura => !cobertura.bImpuesto).sum('Prima');
    $('#PrimaExonerada').setValueWithAttr(primaExonerada);

    //Prima gravada
    var primaGravada = polCobes.filter(cobertura => cobertura.bImpuesto).sum('Prima');
    $('#PrimaGravada').setValueWithAttr(primaGravada);

    applyEfectAndValue($('#Descuento'), mDescuento);

    var primaNeta = sum(prima, -mDescuento);
    applyEfectAndValue($('#PrimaNeta'), primaNeta);

    var configuration = currentConfiguration();
    if (configuration) {

        var pGasto = configuration.Pgasto;
        var pdstDerechoE = round(PrimaWithTax * pGasto / 100);
        applyEfectAndValue($('#DerechoEmision'), pdstDerechoE);

        var mImpuesto = (primaNeta + pdstDerechoE) * interes / 100;
        //var mImpuesto = round(sum(PrimaWithTax, pdstDerechoE, -mDescuento) * interes / 100);
        applyEfectAndValue($('#Impuesto'), mImpuesto);

        var time = $('#Cuotas').val();
        var interesCuota = findInteresByPlan(time);

        var mFinanciamiento = round(primaNeta * interesCuota.interes / 100);
        applyEfectAndValue($('#Financiamiento'), mFinanciamiento);

        var total = sum(primaNeta, pdstDerechoE, mImpuesto, mFinanciamiento);
        applyEfectAndValue($('#Total').addClass('bold'), total);

        showTotal(configuration.Moneda, total, showMessage);


        var mAnual = sum(primaNeta, mImpuesto);
        applyEfectAndValue($('#mAnual'), mAnual);

        var calculateFrecuency = _time => (mAnual + (primaNeta * findInteresByPlan(_time).interes / 100)) / _time;

        var mSemestral = calculateFrecuency(2);
        applyEfectAndValue($('#mSemestral'), mSemestral);

        var mTrimestral = calculateFrecuency(4);
        applyEfectAndValue($('#mTrimestral'), mTrimestral);

        var mMensual = calculateFrecuency(12);
        applyEfectAndValue($('#mMensual'), mMensual);

        if (Tarificar.IsOk) {
            var hasClass = $(".theme-config-box").hasClass("show");
            if (!hasClass) {
                showResumen('show');
                setTimeout(showResumen, 3000, 'hide');
            }
        }
    }
}

var showTotal = (money, prima, showMessage) => {
    if (prima) {
        var i = 1;
        function myLoop() {
            var f = prima / 10;
            setTimeout(function () {
                i += f;
                $('.total-label').html(`${money} ${Formatear(parseInt(i))}`);

                if (i < prima)
                    myLoop();
                else
                    $('.total-label').html(`${money} ${Formatear(prima)}`);

            }, 30)
        }

        myLoop();
    }
    else $('.total-label').html(`${money} ${Formatear(prima)}`);

    //if (showMessage) if (prima == 0) $.notify("El monto <b>total de prima</b> debe ser mayor a cero.");



}

var showResumen = cssClass => {
    //$('.page').toggleClass('fixed');

    var hasClass = $(".theme-config-box").hasClass("show");
    if (cssClass) {
        if (cssClass == 'hide') {
            $(".theme-config-box").removeClass("show");
            $(".rotate").toggleClass("left");
        } else {
            if (!hasClass) {
                $(".theme-config-box").addClass(cssClass);
                $(".rotate").toggleClass("left");
            }
        }
    } else {
        if (hasClass) {
            $(".theme-config-box").removeClass("show");
            $(".rotate").toggleClass("left");
        }
        else {
            $(".theme-config-box").addClass("show");
            $(".rotate").toggleClass("left");
        }

    }
}

var findInteresByPlan = time => {

    var configuration = currentConfiguration();
    var data = [];
    if (configuration)
        data = configuration.intereses;

    var result
    if (data)
        result = data.find(d => d.time == time)

    return result || { time: 0, interes: 0 };
}

var getValue = e => $(e).attr('data-value');

var filterElemts = tag => {
    var elemts = {};
    for (const key in dataConfig) {
        var elemt = dataConfig[key]();
        if (elemt[tag].required())
            elemts[elemt.propertyOut || elemt.id] = elemt;
    }
    return elemts;
}

var findElemt = id => {
    var elem;

    elem = dataConfig[id];

    i = 0;
    for (var e in elem) {
        i++;
    }

    if (i > 1) {
        logger.error('Entidades duplicadas con el id ' + id)
    }

    if (elem)
        return elem();
    else
        return elem;
}

var findAllDataOfEntity = obj => {
    var elemts = {};
    for (const key in dataConfig) {
        var elemt = dataConfig[key]();
        if (elemt['entity'] == obj.entity)
            elemts[key] = elemt;
    }
    return elemts;
}

var Exists = elem => $('#' + elem).prop('id');

var buildEntity = obj => {
    obj['tag'] = obj.tag || 'toSave';

    var elemts = findAllDataOfEntity(obj);

    var data = {
        _tag: obj.tag,
        include: function (entity) {
            var t = this;
            if (!t.hasError) {
                t[entity] = buildEntity(
                    {
                        entity: entity,
                        tag: data['_tag']
                    }
                )
            }
            return t;
        },
        isValid: function () {
            var toReturn = true;
            var ob = this;
            
            for (var i in ob) {
                if (!ob.hasOwnProperty(i)) continue;
               
                if ((typeof ob[i]) == 'object' && ob[i] != null) {
                    if (!ob[i].isValid())
                        toReturn = false;
                } else {
                    if (i == 'hasError')
                        toReturn = false;
                }
            }
            return toReturn;
        },
        data: function () {
            var ob = this;
            for (var i in ob) {
                if (!ob.hasOwnProperty(i)) continue;

                if ((typeof ob[i]) == 'object' && ob[i] != null) {
                    if (ob[i].data) {
                        ob[i] = ob[i].data();
                    }
                } else {
                    if ((typeof ob[i]) == 'function' || i == '_tag')
                        delete ob[i];
                }
            }
            return ob;
        },
        setColumn: function (column, value) {
            var ob = this;
            ob[column] = value;
        },
        add : function(newData){
            var that = this;
            for (const key in newData) {
                if (object.hasOwnProperty(key)) {
                    that[key] = object[key]
                }
            }
        }
    };

    if (modelIsValid(elemts, obj.tag)) {
        
        for (const key in elemts) {
            if (elemts.hasOwnProperty(key)) {
                elemt = elemts[key];
                data[elemt.PropertyOut || elemt.id] = elemt.getValue();
            }
            else
                logger.log(`No se encontró el siguiente elemento: ${elemts[key].id} para la propiedad ${key}`)
        }
        return data;
        
    }

    data['hasError'] = true;
    return data;

}

var modelIsValid = (elemts, tag) => {
    var ok = true
    for (const key in elemts) {
        if (elemts.hasOwnProperty(key) && Exists(elemts[key].id)) {
            let elemt = elemts[key];
            let value = elemt.getValue();

            if (elemt[tag].required())
                if (!elemt[tag].isValid(value)) {
                    showMessageError(elemt)(tag);
                    ok = false;
                }

            if(ok)
                if (validate.hasAnyValue($.trim(value)))
                    if (!validate.propertyIsValid(elemt.id))
                        ok = false;
                    else
                        clearCssError(elemt);
                else
                    clearCssError(elemt);
        }
        else {
            logger.warn(`No se encontró el template para el id : ${elemts[key].id} para la propiedad ${key}`);
        }
    };
    return ok;
}

var FieldContainsErrors = (tag, up = true) => {
    var ok = true
    var elemts = filterElemts(tag);

    ok = modelIsValid(elemts, tag);

    if (!ok && up)
        $('html, body').animate({ scrollTop: 0 }, 'fast');

    return !ok;
}

var clearValueByTag = item => {
    var ValueByTag = {
        //A: function () { return $(item).editable('getValue').SA },
        INPUT: function () { return $(item).val('') },
        SELECT: function () {
            var $select = findSelectize($(item).prop("id"))
            var control = $select.selectize;
            control.clear();
        },
        TEXTAREA: function () { return this.INPUT(); }
    }
    if($(item).length)
        return ValueByTag[$(item).prop("tagName")]();
}

var tagNames = {
    SELECT: function (id) {
        $('#' + id + '-selectized').parent().removeClass('isEmpty');
    },
    INPUT: function (id) {
        $('#' + id).removeClass('isEmpty');
    },
    TEXTAREA: function (id) {
        this.INPUT(id);
    },
    A: function (id) {
        this.INPUT(id);
    },
    TD: function (id) {
        this.INPUT(id);
    }
}

var clearCssError = item => tagNames[$('#' + item.id).prop("tagName")](item.id)

var showMessageError = item => {
    return function (tag) {
        var elem = {
            SELECT: function () {
                $('#' + item.id + '-selectized').parent().addClass('isEmpty');
                $('#' + item.id).addError(item[tag].message || item.defaultMsg);
            },
            INPUT: function () {
                $('#' + item.id).addClass('isEmpty').addError(item[tag].message);
            },
            TEXTAREA: function () {
                this.INPUT();
            },
            A: function () {
                this.INPUT();
            }
        }

        var tagName = $('#' + item.id).prop("tagName");
        if (tagName)
        {
            if (item.PagePosition == getCurrentPage())
                elem[tagName]();
            else
                $.notify(item[tag].message || item.defaultMsg)
        }else{
            throw new TypeError(`No se encontro el id ${item.id}`);
        }
    }
}

var showMessageValidation = (item, msg) => {

    var elem = {
        SELECT: function () {
            $('#' + item.id + '-selectized').parent().addClass('isEmpty').notify(msg, 'warn');
        },
        INPUT: function () {
            $('#' + item.id).addClass('isEmpty').notify(msg, 'warn');
        },
        TEXTAREA: function () {
            this.INPUT();
        },
        A: function () {
            this.INPUT();
        }
    }

    if (item.PagePosition == getCurrentPage())
        elem[$('#' + item.id).prop("tagName")]();
    else
        $.notify(msg)
}

var findUrl = (prop, params) => {
    var ready = true;
    var url = prop.url;
    prop.route.forEach((e, i) => {

        var item = $('#' + prop.route[i]);

        if (validate.validateField(item.val()))
            url = url.replace('{' + prop.route[i] + '}', item.val());
        else {
            var elem = findElemt(item[0].id);
            if (elem) {
                showMessageError(elem);
                ready = false;
            }
        }
    });

    $.each(params, function (property, value) {
        url = url.replace('{' + property + '}', value);
    });

    if (ready)
        if (url)
            return prop.routePrefix + url;
        else
            return '';
    else
        return '';
}

var compareOr = obj => {
    return {
        with : (...obsj) => obsj.some(x => x ==obj)
    }
}

var sum = (...obj) => obj.sum();


var fillSelect = ($select, data, options, lock, silent = false) => {
    var control = $select.selectize;

    var elemet = $(control.$input[0]);

    if ($(elemet).attr('defaultvalue')) {
        options.defaultValue = $(elemet).attr('defaultvalue');
        $(elemet).removeAttr('defaultvalue');
    }

    if (lock) control.lock(); else control.unlock();

    control.clearOptions();

    if (!data.length)
        if(options.fallCallBack)
            data = options.fallCallBack();

    control.addOption(data);

    if (data.some(x => x.id == options.defaultValueLock)) {
        control.setValue(options.defaultValueLock, silent);
        control.lock();
    } else {
        if (data.length == 1){
            if (data[0].value)
                control.setValue(data[0].value, silent);
            else
                control.setValue(data[0].id, silent);
            control.lock();
        }
        else{
            if (options.defaultValue != null || options.defaultValue != undefined)
                control.setValue(options.defaultValue, silent);
            else if (options.open)
                control.open();
        }
    }

    if (options.render) {
        control.clearCache();
        control.settings.render = options.render;
    }
}

var ConfigurationByPlan = plan => basicConfiguration.find(p => p.id == plan);

var currentConfiguration = () => {
    var plan = $('#Plan').val();
    var config = ConfigurationByPlan(plan);
    if (config)
        return config;
    else {
        $.notify('Debe seleccionar un plan antes.');
        $('#Plan-selectized').parent().addClass('isEmpty');
        $('#Plan').addError('Seleccione un plan');
        return null;
    }
}

var hasData = function (select) {
    var hasOptions = 0;
    for (k in select.options) {
        hasOptions++;
    }
    return hasOptions;
}

var hasItemSelected = control => control.items.length

var validate = context.validate;

var validateCovergaresSelected = elem => {
    if (elem.checked) {
        //Obtenemos todas las coberturas seleccionadas
        var $coveragesSelected = coverages.getIdsOfCoverageSelected;//coveragesSelectedIds(0);

        //Obtenemos el codigo cobRepite de la cobertura
        var cobRepite = coverages.findById(elem.id).cobRepite;

        //Verificamos que sea mayor que cero, ya que las que son cobRepite=0 no aplican
        if (cobRepite) {
            //Obtenemos todas las coberturas con ese valor cobRepite
            var _coverages = coverages.whereCobRepite(cobRepite);

            var _coverageSelectedIqualCode = $coveragesSelected.filter(containsCoverage.bind(this, _coverages));

            //Si ya mas de 1 seleccionada, mostrar mensaje de que no puede seleccionar dos
            if (_coverageSelectedIqualCode) {
                if (_coverageSelectedIqualCode.length > 1) {

                    var newCoverageSelected = _coverages.find(x => x.coberturaId == elem.id);
                    var oldCoverageSelected = _coverages.find(x => x.coberturaId != elem.id && _coverageSelectedIqualCode.includes(`${x.coberturaId}`));

                    var li = listOfCoverages(_coverages);

                    $('#pChangeCoverage').html('Ya tiene seleccionado la cobertura de <code class="highlight">' + oldCoverageSelected.nombre + '</code>, desea cambiar por la <code class="highlight">' + newCoverageSelected.nombre + '</code> ? <br /><br /> Solo puede seleccionar una cobertura de las sig: ' + li);

                    var dialog = document.querySelector('#changeCoverage');
                    if (!dialog.showModal)
                        dialogPolyfill.registerDialog(dialog);
                    dialog.showModal();

                    $('#btnChangeCovergare').attr('onClick', `changeCoverage(${newCoverageSelected.coberturaId})`);
                    $('#btnCancelChange').attr('onClick', `changeCoverage(${oldCoverageSelected.coberturaId})`);
                }
            }
        }
    }
}

var setAdditionalInfo = elem => {

    if (elem.checked) {
        $("." + elem.id + "ItemSpecial").fadeIn();
        Tarificar.Process();
    } else {
        $("." + elem.id + "ItemSpecial").fadeOut();
        Tarificar.Process();
    }

}

var listOfCoverages = _array => {
    var ul = '';
    var li = '';
    _array.forEach(e => {
        li += '<li>' + e.nombre + '</li>';
    });
    if (li.length) {
        ul = '<ul>' + li + '</ul>';
    }
    return ul;
}

$('.spin-icon').click(function () {
    showResumen();
});

var showDivs = configuration => {
    if (!configuration.Bbeneficiario)
        $("#divBeneficiarios").hide();
    else
        $("#divBeneficiarios").show();

    if (!configuration.BLlevaPrestamo)
        $("#liTerceros").hide();
    else
        $("#liTerceros").show();

    if (!configuration.llevaCesionario)
        $("#divLlevaCesion").hide();
    else
        $("#divLlevaCesion").show();

    if (!configuration.BTalonario)
        $("#divLlevaTalonario").parent().hide();
    else
        $("#divLlevaTalonario").parent().show();

    if (configuration.BSoa)
        $(".Hide-Soa").hide();
    else
        $(".Hide-Soa").show();

    if (!context.soaPlanPrint.exclude.includes(configuration.id))
        $("#divSOMEX").hide();
    else
        $("#divSOMEX").show();

    $('#opcion').loadCatalog();
    var selectizeOption = findSelectize('opcion');
    var hasOptions = hasData(selectizeOption.selectize);

    if (hasOptions) {
        $('#opcion').parent().parent().show();
        selectizeOption.selectize.enable();
    }
    else {
        $('#opcion').parent().parent().hide();
        selectizeOption.selectize.disable();
    }

    if (configuration.BLlevaPrestamo) {
        context.ajax.get('api/catalogs/Loanstypes', null, data => context.store.tipoPrestamo = data, null);
        context.ajax.get('api/catalogs/Creditstypes', null, data => context.store.tipoCredito = data, null);
    }
    if (configuration.Bbeneficiario) {
        context.ajax.get('api/catalogs/Relationship', null, data => context.store.parentescos = data, null)
    }
}

var loadMasterPolicy = (plan, itipopol) => {

    if (itipopol == context.itipopol.certificate) {


        $('#masterPolicy').loadCatalog();

        var $masterPolicy = findSelectize('masterPolicy');
        $('#masterPolicy').parent().parent().show();
        $masterPolicy.selectize.enable();
    } else {
        $('#masterPolicy').clearCatalog();
        var $masterPolicy = findSelectize('masterPolicy');
        $masterPolicy.selectize.disable();
        $('#masterPolicy').parent().parent().hide();
    }
}

var calculateDepre = anio => {

    var ValorDepre = findValueDepre(anio || $('#auAnio').val());
    var _auValorNuevo = $('#auValorNuevo').getValueWithAttr();

    var Porcent = 1;
    if ($('#IsNewCar').is(':checked'))
        Porcent = ValorDepre.percent;

    $('#auValorNuevoDepre').setValueWithAttr(_auValorNuevo * Porcent);

}

var changeChecked = {
    IsNewCar: () => {
        calculateDepre();
    },
    default: () => { }
}

var findValueDepre = anio => {
    var result = Depre.find(function (val) {
        var _YearNow = new Date().getFullYear();
        var _YearDiff = _YearNow - anio;
        return val.id == _YearDiff;
    });

    return result || { id: 0, percent: 0 };
}

var containsCoverage = (_coverages, idCober) => _coverages.some(ele => parseInt(ele.coberturaId) == parseInt(idCober));

var allRows = () => $('#coberturas tbody tr');

var changeCoverage = idCober => {
    if (idCober) {
        var $_coveragesSelectedIds = coverages.getIdsOfCoverageSelected;
        var cobRepite = coverages.findById(idCober).cobRepite;
        var _coverages = coverages.whereCobRepite(cobRepite);

        var _coverageSelectedIqualCode = $_coveragesSelectedIds.filter(containsCoverage.bind(this, _coverages));

        var UnSelect = _coverageSelectedIqualCode.find(elem => parseInt(elem) != parseInt(idCober));

        var rows = allRows();
        $.each(rows, function (i, tr) {
            var idcobertura = $(this).find("td").eq(0).html();

            if (parseInt(idcobertura) == parseInt(idCober))
                $(":checkbox:eq(0)", this).prop('checked', true);

            if (parseInt(idcobertura) == parseInt(UnSelect))
                $(":checkbox:eq(0)", this).prop('checked', false);
        });

        var dialogCoverage = document.querySelector('#changeCoverage');
        dialogCoverage.close();

    }
}

var Page = {
    Next: () => Page.move(1),
    Prev: () => Page.move(-1),
    move: nextPage => {
        move(nextPage);
    }
}

var findRecord = (options, option, field) => {
    var record = null;
    for (var o in options) {
        if (options[o][field] == option)
            record = options[o]
    }
    return record;
}

var copyData = (selectizeTo, data) => {
    selectizeTo.selectize.clearOptions();
    for (var option in data)
        selectizeTo.selectize.addOption(data[option]);

}

var getOptionsAsArray = selectizeTo =>{
    var options = selectizeTo.selectize.options
    var data = [];

    for (var option in options)
        data.push(options[option]);

    return data;
}

var getCurrentPage = () => {
    var position = 0;
    $('.page').filter((i, ele) => {
        if ($(ele).is(':visible'))
            position = i;
    });
    return position;
}

var returnInt = _number => { return !isNaN(parseFloat(_number)) && isFinite(_number) }

var esBisiesto = anyo => ((((anyo % 100) != 0) && ((anyo % 4) == 0)) || ((anyo % 400) == 0))

class coverageManager {
    constructor(coverages) {
        this._coveragesBilding = coverages;
    }
    findById(idCober) {
        return this._coveragesBilding.find(x => x.coberturaId == idCober)
    }

    whereCobRepite(cobRepite) {
        return this._coveragesBilding.filter(x => x.cobRepite == cobRepite)
    }

    getById(idCober) {
        return {
            isChecked: () => {
                return this.getIdsOfCoverageSelected.map(c => parseInt(c)).some(id => id == idCober)
            },
            isValid: () => {
                this.getIdsOfCoverageSelected.filter(x => x.id == idCober).length;
            }
        }
    }

    get getIdsOfCoverageSelected() {
        return this.CoveragesSelected();
    }

    CoveragesSelected() {
        var arrayCoverages = [];
        $.each(allRows(), function (i, tr) {
            var idcobertura = $(this).find("td").eq(0).html();
            if ($(":checkbox:eq(0)", this).is(":checked")) {
                arrayCoverages.push(idcobertura);
            }
        });
        return arrayCoverages;
    }
}

var showEnteEdit = which => {
    $('#EnteInfo').fadeOut(function () {
        $('#EnteEditing').fadeIn();
    });
}

var NumIdPress = e => {
    if (e.keyCode == 13) {
        searchEnte($('#btnSearchEnte'));
    }
}

$('#btnSearchEnte').click(function (e) {
    searchEnte(this);
});

var searchEnte = btn => {
    var tipoId = $('#TipoId').val()
    var numId = NumId;
    var enteManager = new EnteManager(numId, tipoId, 'ente');
    enteManager.SearchResult(btn);
}

var clearEnte = () => {
    var enteManager = new EnteManager();
    enteManager.Clear(TipoEnte.value);
    closeDiagoClient();
}

var closeDiagoClient = () => {
    var closeDiagoClient = document.querySelector('#newClient');
    closeDiagoClient.close();
}

class EnteManager {
    constructor(numId, typeDocument, tipoEnte) {
        this.typeDocument = typeDocument;
        this.numId = numId;
        this.tipoEnte = tipoEnte
    }

    Clear(tipoEnte) {

        var ente = findAllDataOfEntity({ entity: tipoEnte });

        for (const key in ente) {
            if (ente.hasOwnProperty(key)) {
                //No limpiar el tipo de identificacion ni la identificacion
                if (ente[key].PropertyOut != 'NumId' && ente[key].PropertyOut != 'TipoId') {
                    var item = $('#' + ente[key].id);

                    if ($(item).hasValue())
                        $(item).setValueWithAttr(0);
                    else
                        clearValueByTag(item);
                }
            }
        }

        showEnteEdit();
        $('.controls-ente').removeClass('sg-novisible');
    }

    SearchResult(b) {
        var id = $(this.numId).val();
        var SearchEnte = () => {
            if (!$(b).isLoading('Buscando ente, por favor espere')) {
                $(b).btnLoading();
                var ente = this;
                context.ajax.get(`api/entities/${id}/identificatiionType/${this.typeDocument}`, null, function (result) {
                    $('.controls-ente').removeClass('sg-novisible');
                    showEnteEdit();

                    var sufijo = '';
                    if (ente.tipoEnte == 'pagador')
                        sufijo = 'Pag';

                    setHtmlFromEntity(result, sufijo);
                    $(b).btnDefault('Buscar');   

                }, jqXHR => {
                    $(b).btnDefault('Buscar');

                    if (jqXHR.status == context.ajax.status.NotFound) {

                        var tipoIdentificacion = $('#TipoId').text();

                        $('#pErrorFindingEnte').html(`No se encontró el ente con ${tipoIdentificacion} ${jqXHR.responseJSON}`);

                        var dialog = document.querySelector('#newClient');

                        if (!dialog.showModal)
                            dialogPolyfill.registerDialog(dialog);
                        TipoEnte.value = ente.tipoEnte;
                        dialog.showModal();
                    }
                    else {
                        context.ajax.failResult(jqXHR);
                    }
                });
            }
        }

        if (!$(this.numId).val()) {
            $(this.numId).notify('Ingrese la identificación');
        } else {
            if (this.typeDocument == context.identifierTypes.cedula) {
                if (this.IdentificationIsValida()) {
                    SearchEnte();
                } else {
                    $(this.numId).notify('La cédula no es válida');
                }
            } else {
                SearchEnte();
            }
        }
    }

    IdentificationIsValida() {
        return vefiricateIdentification($(this.numId).val());
    }
}

//Buscando Datos del Pagador
var NumIdPagPress = e => {
    if (e.keyCode == 13) {
        searchPagador($('#btnSearchPagador'));
    }
}

$('#btnSearchPagador').click(function (e) {
    searchPagador(this);
});

var searchPagador = btn => {
    var tipoId = $('#TipoIdPag').val()
    var numId = NumIdPag;
    var enteManager = new EnteManager(numId, tipoId, 'pagador');
    enteManager.SearchResult(btn);
}

var vefiricateIdentification = cedula => {
    if (country.code != context.regions.nicaragua)
        return true;

    if (cedula[3] === '-' && cedula[10] === '-') {
        var cedulaTemp = [...cedula].filter(returnInt).join('');
        return cedula.toString().replace(/-/g, '').toUpperCase() === cedulaTemp.concat('ABCDEFGHJKLMNPQRSTUVWXY'[parseInt(cedulaTemp) % 23]).toUpperCase();
    }
    return false;
}

var changeToFormaPago = e => {

    $('#debitoAutomatico').removeClass('active').removeClass('in');
    $('#formaPago').addClass('active').addClass('in');

    $($('#tabFormaPago li')[0]).addClass('active');
    $($('#tabFormaPago li')[1]).removeClass('active');
}

var changeToDebito = e => {
    $('#formaPago').removeClass('active').removeClass('in');
    $('#debitoAutomatico').addClass('active').addClass('in');

    $($('#tabFormaPago li')[1]).addClass('active');
    $($('#tabFormaPago li')[0]).removeClass('active');
}

var showPrestamos = e => {
    var dialog = document.querySelector('#dialogPrestamo');
    if (!dialog.showModal)
        dialogPolyfill.registerDialog(dialog);

    $('#tblPrestamos').dataSource(Prestamos, 'prestamo');
    $('#lblprestamoError').html('');
    dialog.showModal();
}

var showBeneficiario = e => {
    var dialog = document.querySelector('#dialogBeneficiario');
    if (!dialog.showModal)
        dialogPolyfill.registerDialog(dialog);

    $('#tblBeneficiario').dataSource(Beneficiarios, 'beneficiario');

    dialog.showModal();
}

var removeRecord = r => {
    $(r).parent().parent().addClass('animated zoomOut');
    setTimeout(function () {
        $(r).parent().parent().remove();
    }, 500);
}

function printDocument(b, id, attachment = false) {
    downloadFile(baseAddress + "api/reports/policies/" + id + "/requests", function () {
        $(b).html('<i style="color:#337ab7" class="fa fa-spinner fa-pulse"></i>');
    }, function () {
        $(b).html('<i style="color:#3c763d" class="fa fa-print"></i>');
    });
}

function printDocumentRow(b, id, ramo, cia, estado, soa, planId) {

    if (cia == 1 && ramo == 1 && estado == 2 && soa == 1 && !context.soaPlanPrint.exclude.includes(planId)) {
        // var win = window.open(`${basePath}ReportSOA/Policy/${id}`, '_blank');
        var definition = "titlebar=no,location=no,statusbar=no,menubar=no,width=" + screen.width + ",height=" + screen.height;
        var win = window.open(`${baseAddress}ReportSOA/Policy/${id}`, '', definition);
        win.focus();
    } else {
        printDocument(b, id, true);
    }
}

function printDocumentData(b, estado, cia, text, planId) {
    if (Poliza_Id.value > 0) {


        var config = currentConfiguration();

        if (config == null) return;

        if (planId == null) {
            planId = config.id;
        }

        if (cia == 1 && branchId == 1 && estado == 2 && config.BSoa && !context.soaPlanPrint.exclude.includes(planId)) {
            var definition = "titlebar=no,location=no,statusbar=no,menubar=no,width=" + screen.width + ",height=" + screen.height;
            var win = window.open(`${baseAddress}ReportSOA/Policy/${Poliza_Id.value}`, '', definition);
            win.focus();
        } else {
            var additionalParams = "";

            if (estado == 1) additionalParams = "?mDoc=sol"

            downloadFile(`${baseAddress}api/reports/policies/${Poliza_Id.value}/requests${additionalParams}`, function () {
                $(b).html('Descargando <span class="fa fa-spinner fa-pulse text-info"></span>');
            }, function () {
                $(b).html(`${text} <span class="fa fa-file-pdf-o text-danger"></span>`);
            });
        }
    }
}

function printQuoteDocument(b, estado, cia, text) {
    if (Cotizacion_Id.value > 0) {
        var definition = "titlebar=no,location=no,statusbar=no,menubar=no,width=" + screen.width + ",height=" + screen.height;
        //var win = window.open(`${baseAddress}Cotizacion/Policy/21`, '', definition);
        var win = window.open(`${baseAddress}Cotizacion/Policy/${Cotizacion_Id.value}`, '', definition);
        win.focus();
    }
}

var emitting = false;
function EmitPolicy(b, titleb) {

    if (emitting) {
        $.notify('Emisión en progreso por favor espere', 'warn');
    } else {
        emitting = true;
        $(b).html('Emitiendo póliza <span class="fa fa-spinner fa-pulse"></span>');

        if (Poliza_Id.value > 0) {
            $.get(`${baseAddress}api/policies/${Poliza_Id.value}/emissions`, function (data) {

                $.get(`${baseAddress}api/policies/${Poliza_Id.value}/Getcnpoliza`, function (Rcnpoliza) {
                    tagPoliza_cnpoliza.innerHTML = Rcnpoliza;
                    $.notify('Póliza confirmada No. Póliza: <b>' + Rcnpoliza + '</b>', { type: 'success' });
                })

                $(b).parent().find('button.sg-novisible-2').show();
                $(b).remove();
            }).fail(function (data) {
                showOkModal('Emisión', data.responseText.replace("\"", ""));
            }).always(function () {
                $(b).html('<span class="fa fa-check-square"></span> ' + titleb);
                emitting = false;
            });

        } else {
            $.notify('No se puede emitir poliza con ID: ' + Poliza_Id.value, 'error');
            emitting = false;
        }
    }
}

//#region Anulación de Poliza

var anularPolizaDialog = document.querySelector('#AnularPolizaModal');
function AnularPoliza(id) {

    $("#AnularPolizaID").html(id);
    $("#AnularPolizaObservaciones").val("");

    if (!anularPolizaDialog.showModal)
        dialogPolyfill.registerDialog(anularPolizaDialog);

    context.ajax.get('api/catalogs/cancelacion', data => {
        fillSelect($('#AnularPolizaCausa')[0], data, {  }, false);
    });

    anularPolizaDialog.showModal();

}

var anulando = false;

$("#AnularPolizaModalOk").click(function () {
    if (anulando) {
        $.notify("Espere por favor, se esta anulando la poliza.", { type: 'info' });
        return;
    }

    var data = buildEntity({ entity: 'AnularPoliza', tag: 'toCancel' });

    if (!data.hasError) {
        var d = data.data();
        d['policyId'] = $("#AnularPolizaID").html();
        anulando = true;
        $("#AnularPolizaModalClose").fadeOut();
        $("#AnularPolizaModalOk").html('<i class="fa fa-spinner fa-pulse"></i>&nbsp;&nbsp;Anulando...');
        $.getJSON(`${baseAddress}api/policies/Cancelation`, d, function (data) {
            anularPolizaDialog.close();

            var resultDataTable = $('#policies').DataTable();
            if (resultDataTable != undefined) resultDataTable.ajax.reload();

            $.notify(data, { type: 'success' });
        }).fail(function (data) {
            context.ajax.failResult(data);
        }).always(function () {
            $("#AnularPolizaModalOk").html('<i class="fa fa-check-square"></i>&nbsp;&nbsp;Aceptar');
            $("#AnularPolizaModalClose").fadeIn();

            anulando = false;
        });
    }
});

$("#AnularPolizaModalClose").click(function () {
    anularPolizaDialog.close();
});

//#endregion

function downloadFile(url, loadingState, defaultState) {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 2/*HEADERS_RECEIVED*/) {

            var cheader = xhr.getAllResponseHeaders('content-type');
            var responseUrl = xhr.responseURL;

            if (xhr.status === 200 && responseUrl.indexOf('Account/LogIn') != -1 && cheader.indexOf('text/html') != -1) {
                xhr.abort();
                context.redirectToLogin();
            }
        }
    }

    xhr.open("GET", url, true);
    xhr.responseType = "blob";

    xhr.onload = function (oEvent) {

        defaultState();

        if (this.status === 200) {
            var filename = "";
            var disposition = xhr.getResponseHeader('Content-Disposition');

            if (disposition && disposition.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
            }

            var type = xhr.getResponseHeader('Content-Type');

            var blob = xhr.response;
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                window.navigator.msSaveBlob(blob, filename);
            } else {
                var URL = window.URL || window.webkitURL;
                var downloadUrl = URL.createObjectURL(blob);

                if (filename) {
                    var a = document.createElement("a");
                    if (typeof a.download === 'undefined') {
                        window.location = downloadUrl;
                    } else {
                        a.href = downloadUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                    }
                } else {
                    window.location = downloadUrl;
                }

                setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 1000); // cleanup
            }
        }
        else if (this.status === 400 || this.status === 500) {
            $.notify('Ha ocurrido un problema al generar el reporte', 'error');
            var reader = new FileReader();
            reader.onload = function () {
                logger.log(reader.result)
            }
            reader.readAsText(xhr.response);
        }
        else if (this.status === 404) {

            var reader = new FileReader();
            reader.onload = function () {
                if (reader.result == "")
                    $.notify('No hay datos que mostrar para el filtro especificado', 'info');
                else
                    $.notify(reader.result, 'info');
            }
            reader.readAsText(xhr.response);

        }
    };

    xhr.send();
    loadingState();
    setTimeout(function () { defaultState() }, 120000);
}

var showAlert = id => {

    var thisElemt = findElemt(id);

    if (thisElemt) {
        if (thisElemt.hasDependency()) {
            if (thisElemt.itemDependency.length) {
                thisElemt.itemDependency.forEach(field => {
                    setTimeout(() => {
                        var value = $('#' + field).val();

                        if (validate.validateField(value)) {
                            var itemDependency = findElemt(field);
                            var hasOptions = hasData(findSelectize(id).selectize);

                            if (!hasOptions) {

                                if (thisElemt.id == 'masterPolicy' && $('#itipopol').val() == 'K')
                                    $('#' + id + '-selectized').parent().notify('No hay pólizas maestras asignadas al usuario ' + context.currentUser, 'info');
                                else
                                    $('#' + id + '-selectized').parent().notify('No se encontraron ' + (thisElemt.display || thisElemt.id) + ' para ' + (itemDependency.display || itemDependency.id), 'info');
                            }
                        } else
                            $('#' + id + '-selectized').parent().notify(thisElemt.msgAlert, 'info');
                    }, 800
                    );
                });
            } else {
                $('#' + id + '-selectized').parent().notify('El campo no está configurado para cargar las dependencias', 'info');
            }
        }
    }
}

var showSubConjunto = (id, toggle) => toggle ? $("#subConjunto" + id).slideDown() : $("#subConjunto" + id).slideUp();

/**
 * Modal Section
 */
var okDialog = document.querySelector('#OkModal');

function showOkModal(title, message) {

    $("#OkModalHeader").html(title);
    $("#OkModalMessage").html(message);

    if (!okDialog.showModal)
        dialogPolyfill.registerDialog(okDialog);
    okDialog.showModal();
}

$("#OkModalClose").click(function () {
    okDialog.close();
});

var setValueByTag = {
    email : function(id, value){
        this.input(id, value);
    },
    phone : function(id, value){
        this.input(id, value);
    },
    money : function(id, value){
        $(id).setValueWithAttr(value);
    },
    check : function(id, value){
        $(id).prop('checked',value);
    },
    select : function(id, value){
        setValueSelect(id , {id : value});
    },
    date : function(id, value){

        var dp = moment(value);

        if(dp._isValid)
            $('#' + id).datepicker("setDate", dp.format('DD-MM-YYYY'));

    },
    input : function(id, value){
        document.querySelector('#' + id).value = value;       
    },
    td : function(id, value){
        $('#' + id).setValueWithAttr(value);
    },
}

var getValueByTag = {    
    email : function(id){ return this.input('#' + id); },
    phone : function(id){ return this.input('#' + id); },
    money : id =>  $('#' + id).getValueWithAttr(),
    check : id => document.querySelector('#' + id).checked,
    select : function(id){ return this.input('#' + id);},
    date : function(id){
        var value = this.input('#' + id);
        var date = moment(value,'DD-MM-YYYY');

        if (date._isValid)
            return moment($(item).val(),'DD-MM-YYYY').utc().format();
        else
            return '';
    },
    input : id => document.querySelector('#' + id).value,
    td : id => document.querySelector('#' + id),
}

var searchElemt = function(elem){

    return {
        setValue : function(value){
            setValueByTag[elem.type](elem.id,value);
        }
    }

}

var setValueSelect = (id,data) => {     

    let elem = findElemt(id);
    if(elem.hasDependency()){

        let newElemt = findElemt(elem.itemDependency.first());

        return setValueSelect(newElemt.id, data).then(r=>{
            return $('#' + elem.id).loadCatalog({defaultValue: data[elem.PropertyOut||elem.id], silent: true});
        });

    }else{
        return $('#' + elem.id).loadCatalog({defaultValue: data[elem.PropertyOut||elem.id], silent: true});
    }

}  

var setHtmlFromEntity = (entity, sufijo = '') => {    
  
    for (const key in entity) {
        if (entity.hasOwnProperty(key)) {
            if (!arr.includes(key)) {

                const value = entity[key + sufijo];
                let elemt = findElemt(key + sufijo);
            
                if(elemt)
                    searchElemt(elemt).setValue(value);
                else
                    logger.warn('key ' + key + ' not mapped in configurations');
            }
        }
    }
}



// Constructor.
var Interface = function(name, methods) {
    if(arguments.length != 2) {
        throw new Error('Interface constructor called with &quot; + arguments.length arguments, but expected exactly 2');
    }
    this.name = name;
    this.methods = [];
    for(var i = 0, len = methods.length; i < len; i++) {
        if(typeof methods[i] !== 'string') {
            throw new Error('Interface constructor expects method names to be passed in as a string.');
        }
        this.methods.push(methods[i]);
    }
};

Interface.ensureImplements = function(object) {
    if(arguments.length < 2) {
        throw new Error('Function Interface.ensureImplements called with ' + arguments.length + ' arguments, but expected at least 2');
    }
    for(var i = 1, len = arguments.length; i < len; i++) {
        var interface = arguments[i];
        if(interface.constructor !== Interface) {
            throw new Error('Function Interface.ensureImplements expects arguments two and above to be instances of Interface.');
        }
        for(var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
            var method = interface.methods[j];
            if(!object[method] || typeof object[method] !== 'function') {
                throw new Error('Function Interface.ensureImplements: object does not implement the '  + interface.name + ' interface. Method '+ method + ' was not found.');
            }
        }
    }
};

var scope = {}

