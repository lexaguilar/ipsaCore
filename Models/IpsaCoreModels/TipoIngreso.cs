using System;
using System.Collections.Generic;

namespace IpsaCore.Models.IpsaCoreModels
{
    public partial class TipoIngreso
    {
        public TipoIngreso()
        {
            IngresosEgresosCaja = new HashSet<IngresosEgresosCaja>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }
        public short? TipoDoc { get; set; }

        public ICollection<IngresosEgresosCaja> IngresosEgresosCaja { get; set; }
    }
}
