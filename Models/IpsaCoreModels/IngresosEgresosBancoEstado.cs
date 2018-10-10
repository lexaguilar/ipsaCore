using System;
using System.Collections.Generic;

namespace IpsaCore.Models.IpsaCoreModels
{
    public partial class IngresosEgresosBancoEstado
    {
        public IngresosEgresosBancoEstado()
        {
            IngresosEgresosBanco = new HashSet<IngresosEgresosBanco>();
        }

        public short Id { get; set; }
        public string Descripcion { get; set; }

        public ICollection<IngresosEgresosBanco> IngresosEgresosBanco { get; set; }
    }
}
