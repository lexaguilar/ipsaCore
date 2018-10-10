﻿using System;
using System.Collections.Generic;

namespace IpsaCore.Models.IpsaCoreModels
{
    public partial class IngresosEgresosCajaDetalle
    {
        public int Id { get; set; }
        public int ReciboId { get; set; }
        public decimal Montodolar { get; set; }
        public string CtaContable { get; set; }
        public decimal Precio { get; set; }
        public decimal Cantidad { get; set; }

        public IngresosEgresosCaja Recibo { get; set; }
    }
}
