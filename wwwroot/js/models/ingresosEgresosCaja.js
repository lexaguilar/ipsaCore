_modelsList.add({
    entity : 'ingresosEgresosCaja',
    mode : 'single',
    columns: [
        {
            id:'Id'
        },{
            id:'NumRecibo',save : {
                required : () => true,
                message: ''
            }
        },{
            id:'NoOrdenPago',
        },{
            id:'TipoMonedaId',
            save : {
                required : () => true,
                message: 'Seleccione el tipo de moneda'
            }
        },{
            id:'ClienteId', 
        },{
            id:'FechaProceso',
            type : context.types.date,
            save : {
                required : () => true,
                message: 'Seleccione una fecha'
            }
        },{
            id:'Muestra',
        },{
            id:'Beneficiario',
            save : {
                required : () =>true,
                message: 'Ingrese el beneficiario'
            }
        },{
            id:'TipoCleinteId',
        },{
            id:'NoSerie',
        }
    ]
});
