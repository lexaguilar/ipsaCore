var routeConfig = {
    createRoute : function(options){
        var settings = $.extend({
            cache : false,
            path : 'home',
            page : 'index',
            requiredJs : false,
            callback : function(p){
                if (this.requiredJs) {   
                    pages[this.path + "." + this.page].bind(p).call();
                    window.history.replaceState(null,'',`#/${this.path}/${this.page}`);
                }
            }
        }, options);

        return settings;
    }
}

var routeInstance = routeConfig;

var routes = {};

var routeList = [{
    name : 'home#index'
},{
    name : 'recibo#index',
    path : 'recibo',
    page : 'index',
    requiredJs : true,
},{
    name : 'recibo#crear',
    path : 'recibo',
    page : 'create',
    requiredJs : true,
},{
    name : 'recibo#editar',
    path : 'recibo',
    page : 'edit',
    requiredJs : true,
}];

(function(){
    for (const key in routeList) {
        if (routeList.hasOwnProperty(key)) {
            const route = routeList[key];
            routes[route.name] = function(){
                return routeInstance.createRoute({
                    hash : route.hash,
                    path : route.path,
                    page : route.page,
                    requiredJs : route.requiredJs,
                    callback : routeInstance.createRoute().callback.bind(route)
                });
            }.apply();
        }
    }
})();