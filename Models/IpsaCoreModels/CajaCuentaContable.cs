using System;
using System.Collections.Generic;

namespace IpsaCore.Models.IpsaCoreModels
{
    public partial class CajaCuentaContable
    {
        public int Id { get; set; }
        public int CajaId { get; set; }
        public string CtaCuenta { get; set; }

        public Caja Caja { get; set; }
    }
}
