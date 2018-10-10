if (!String.prototype.notInclude) {
    (function() {      
      String.prototype.notInclude = function(chars) {
          var that = this;
        if(this.includes(chars))
            return {              
                then : function(string){                
                    return that.concat();
                }
            }
        else
            return {              
                then : function(string){                
                    return string;
                }
            }
      };
    })();
}

if (!Array.prototype.add) {
    (function() {      
        Array.prototype.add = function(ob) {
            this.push(ob);
        }
    })();
}

HTMLElement.prototype.getValue = function(){
    return this.getAttribute('data-value');
}

HTMLElement.prototype.setValue = function(value){
    return this.setAttribute('data-value',value);
}

$.fn.getProperties = function () {
    var model = _models.find(x => x.elemt == this.id || x.id == this.id);
    if(model==undefined)
        throw new Error(`No se encontró las propiedades en la lista de modelos con el id ${this.id}`)
    return model;
}

$.fn.loadCatalog = function (settings) {
    var options = $.extend({       
        extraParams: {},
        defaultValue: null,
        failCallback: undefined,
        lock: false,
        url: null,
        parameters: null,
        open: false,
        silent: false,
        render : ''
    }, settings);

    var that = this;

    return new Promise((resolve, reject) => {
        $(that).each(function () {
            var select = $(this);            

            var $selectize = findSelectize(select.attr('id'));

            var properties = this.getProperties();

            var render = options.render || properties.render;            

            var EjecuteProcess = () => {
                $(select).loadingShow(true);

                var lock = options.lock;

                var callback = result => {

                    fillSelect(
                        $selectize,
                        result,
                        {
                            render: render,
                            fallCallBack : properties.fallCallBack,
                            defaultValue: options.defaultValue,
                            defaultValueLock: options.defaultValueLock,
                            open: options.open
                        },
                        lock, options.silent);

                    $(select).loadingShow(false);

                    resolve(result);
                }

                
                var parameters = options.parameters ? options.parameters : buildParameters(properties.data);
                var url = options.url ? (properties.routePrefix + options.url) : findUrl(properties, options.extraParams);

                if (url)
                    context.ajax[options.verb](url, parameters, callback, options.failCallback);
                else
                    callback(properties.dataSource);

            }

            var hasOptions = hasData($selectize.selectize);

            if (hasOptions && properties.reload) {
                EjecuteProcess();
            } else if (!hasOptions) {
                EjecuteProcess();
            } else {
                if(options.defaultValue)
                {
                    var control = $selectize.selectize;
                    control.setValue(options.defaultValue, options.silent);
                    resolve();
                }
                else
                    resolve();
            }
        });
    });
}