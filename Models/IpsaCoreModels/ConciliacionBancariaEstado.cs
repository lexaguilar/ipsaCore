using System;
using System.Collections.Generic;

namespace IpsaCore.Models.IpsaCoreModels
{
    public partial class ConciliacionBancariaEstado
    {
        public ConciliacionBancariaEstado()
        {
            ConciliacionBancaria = new HashSet<ConciliacionBancaria>();
            ConciliacionBancariaAux = new HashSet<ConciliacionBancariaAux>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public ICollection<ConciliacionBancaria> ConciliacionBancaria { get; set; }
        public ICollection<ConciliacionBancariaAux> ConciliacionBancariaAux { get; set; }
    }
}
