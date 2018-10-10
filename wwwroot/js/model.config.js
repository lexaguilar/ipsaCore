var extendConfig= function (cfg){
    return {
        to : function(action){
            return $.extend({ isRequired:  () => false, message: '' ,isValid: value => context.validate.validateField($.trim(value))}, cfg ? cfg[action] ? cfg[action] : {} : {})
        }
    }
}

var modelConfig ={

    createModel : function(options){
        var settings = $.extend({
            routePrefix: 'api/catalogs/',
            id : null,           
            url: '',
            data: [],
            route: [],      
            elemt: '', 
            entity: '',
            itemDependency: [],
            hasDependency: function(){ return this.itemDependency.length > 0; },            
            pagePosition: 0,
            columnName: null,
            inputMinLength : null, 
            type : context.types.input,
            getValue : function() {
                return getValueByTag[this.type](this.id);
            },
            mode : 'single'
        }, options);

        settings['save'] = extendConfig(options).to('save');

        return settings;
    }
}

var _modelsList = [];
var _models = [];

var createModel = function(modelsList){

    for (let index = 0; index < modelsList.length; index++) {

        const model = modelsList[index];
        const entity = model.entity;       

        for (let i = 0; i < model.columns.length; i++) {
            const column = model.columns[i];

            var cfg = {};
            for (const property in column) {
                if (column.hasOwnProperty(property)) {
                    const prop = column[property];
                    cfg[property] = prop;                    
                }
            }

            cfg['entity'] = entity;           
            cfg['mode'] =  model.mode;
            _models.add(
                function(){
                    return modelConfig.createModel(cfg);
                }.apply()
            )
            // _models[cfg.id] = function(){
            //     return modelConfig.createModel(cfg);
            // }.apply();

        }
    }    
};