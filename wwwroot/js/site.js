// Write your JavaScript code.
$(document).ready(function() {
    $('#preloader').delay(350).fadeOut(function(){
        $('body').delay(350).css({'overflow':'visible'});
    });
    var inicio = document.querySelector('.menu').firstElementChild.firstElementChild;
    loadPage('home', inicio);

    jQuery('.nav-parent > a').click(function() {
      
        var parent = jQuery(this).parent();
        var sub = parent.find('> ul');
        
        // Dropdown works only when leftpanel is not collapsed
        if(!jQuery('body').hasClass('leftpanel-collapsed')) {
           if(sub.is(':visible')) {
              sub.slideUp(200, function(){
                 parent.removeClass('nav-active');
                 jQuery('.mainpanel').css({height: ''});
                 adjustmainpanelheight();
              });
           } else {
              closeVisibleSubMenu();
              parent.addClass('nav-active');
              sub.slideDown(200, function(){
                 adjustmainpanelheight();
              });
           }
        }
        return false;
     });
});

function closeVisibleSubMenu() {
    jQuery('.nav-parent').each(function() {
       var t = jQuery(this);
       if(t.hasClass('nav-active')) {
          t.find('> ul').slideUp(200, function(){
             t.removeClass('nav-active');
          });
       }
    });
}
 
function adjustmainpanelheight() {
    // Adjust mainpanel height
    var docHeight = jQuery(document).height();
    if(docHeight > jQuery('.mainpanel').height())
       jQuery('.mainpanel').height(docHeight);
}

jQuery('.panel .panel-close').click(function(){
    jQuery(this).closest('.panel').fadeOut(200);
    return false;
});

// Menu Toggle
jQuery('.menutoggle').click(function(){
      
    var body = jQuery('body');
    var bodypos = body.css('position');
    
    if(bodypos != 'relative') {
       
       if(!body.hasClass('leftpanel-collapsed')) {
          body.addClass('leftpanel-collapsed');
          jQuery('.nav-bracket ul').attr('style','');
          
          jQuery(this).addClass('menu-collapsed');
          
       } else {
          body.removeClass('leftpanel-collapsed chat-view');
          jQuery('.nav-bracket li.active ul').css({display: 'block'});
          
          jQuery(this).removeClass('menu-collapsed');
          
       }
    } else {
       
       if(body.hasClass('leftpanel-show'))
          body.removeClass('leftpanel-show');
       else
          body.addClass('leftpanel-show');
       
       adjustmainpanelheight();         
    }

});

// Chat View
jQuery('#chatview').click(function(){
    
    var body = jQuery('body');
    var bodypos = body.css('position');
    
    if(bodypos != 'relative') {
       
       if(!body.hasClass('chat-view')) {
          body.addClass('leftpanel-collapsed chat-view');
          jQuery('.nav-bracket ul').attr('style','');
          
       } else {
          
          body.removeClass('chat-view');
          
          if(!jQuery('.menutoggle').hasClass('menu-collapsed')) {
             jQuery('body').removeClass('leftpanel-collapsed');
             jQuery('.nav-bracket li.active ul').css({display: 'block'});
          } else {
             
          }
       }
       
    } else {
       
       if(!body.hasClass('chat-relative-view')) {
          
          body.addClass('chat-relative-view');
          body.css({left: ''});
       
       } else {
          body.removeClass('chat-relative-view');   
       }
    }
    
});

var clearMenus = menus =>{
    for (const key in menus) {
        if (menus.hasOwnProperty(key)) {
            const element = menus[key];
            $(element).removeClass('active').removeClass('nav-active');
            var subMenus = element.children;
            clearMenus(subMenus);
        }
    }
}

//Cargar vistas
var loadPage = (routeName,a,parameter) =>
{
    if(!routeName)
        throw new Error('No ha especificado el nombre del route.');

    if(typeof routeName != 'string')
        throw new Error('El nombre del route debe ser string.');

    var name =  routeName.notInclude('#').then(`${routeName}#index`)
    var scope = routes[name];

    if(!scope)
        throw new Error('No se encontro el route ' + routeName + ' en el objeto routes[{...}]');    

    var menus = document.querySelector('.menu').children;
    clearMenus(menus);    

    $(a).parent().addClass('active').parent().parent().addClass('active');

    $('.contentpanel').fadeOut(function(){
        var qString = '6dIwhmFc1hWcUAFS5VuayzTCUHBpa0o96nTZCgH9d9s'; 

        if(!scope.cache)
            qString=(+new Date()).toString(36);

        var cache = scope.cache;
        $.get(basePath + `pages/${scope.path}/${scope.page}.html?_d=${qString}`, function(_html){
            $('.contentpanel').html(_html);            
            if(typeof scope.callback == 'function')
                scope.callback(parameter);
            $('.contentpanel').fadeIn();
        });
    });
    
}

$('#numRecibo').mask('0000000000', {
    onChange: function(cep){
        if(cep.length)
            searchNumRecibo(cep);
    }   
  });

var desactivar = el => {
    $(el).removeClass('activated');
}

var activar = el => {
    $(el).addClass('activated');
}

var myVar;

function searchNumRecibo(numRecibo) {    
    myStopFunction();
    myVar = setTimeout(function(){
        $('#numRecibo').addClass('searching');
        fetch(basePath + 'recibos/getNumRecibos/'+numRecibo)
        .then(function(response) {
            return response.json();
        })
        .then(function(recibos) {
            
            var result = '';

            for (const recibo in recibos) {
                result += `<div class="content-recibo" onclick="loadRecibo(${recibos[recibo].id})" onmouseover="activar(this)" onmouseleave="desactivar(this)">
                                <span class="sr-username"><span class="fa fa-user"></span> ${recibos[recibo].username}</span>
                                <span class="sr-label">${recibos[recibo].numRecibo}</span>
                                <span class="sr-caption"><span class="fa fa-map-marker"></span> ${recibos[recibo].description}</span>
                                <span class="sr-caption"><span class="fa fa-tag"></span> ${recibos[recibo].beneficiario}</span>
                            </div>`;
                
            }
            $('#listRecibos').html(result);
            $('#listRecibos-content').fadeIn();
            $('#numRecibo').removeClass('searching');
        });

        
     }, 1000);
}

var loadRecibo = id =>{
    $("#listRecibos-content").hide();
    loadPage('recibo#editar',null,id);
}

function myStopFunction() {
    clearTimeout(myVar);
}

$(document).on('click', function (e) {
    if ($(e.target).closest("#listRecibos-content").length === 0) {
        $("#listRecibos-content").fadeOut();
    }
});

var setHtmlFromEntity = entity => { 
    
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

var $elemt = selector => document.querySelector(selector);

var searchElemt = function(elem){

    return {
        setValue : function(value){
            setValueByTag[elem.type](elem.id,value);
        }
    }

}

var getValueByTag = {    
    email : function(id){ return this.input('#' + id); },
    phone : function(id){ return this.input('#' + id); },
    money : id =>  $elemt('#' + id).getValue(),
    check : id => $elemt('#' + id).checked,
    select : function(id){ return this.input('#' + id);},
    date : function(id){
        var value = this.input('#' + id);
        var date = moment(value,'DD-MM-YYYY');

        if (date._isValid)
            return moment(date,'DD-MM-YYYY').utc().format();
        else
            return '';
    },
    input : id =>$elemt('#' + id).value,
    td : id => $elemt('#' + id).getValue(),
}

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
        $('#' + id).setValue(value);
    },
}

context = {
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
}