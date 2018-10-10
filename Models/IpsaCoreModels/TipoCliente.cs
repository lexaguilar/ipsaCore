using System;
using System.Collections.Generic;

namespace IpsaCore.Models.IpsaCoreModels
{
    public partial class TipoCliente
    {
        public TipoCliente()
        {
            Cliente = new HashSet<Cliente>();
        }

        public short Id { get; set; }
        public string Tipocliente1 { get; set; }

        public ICollection<Cliente> Cliente { get; set; }
    }
}
