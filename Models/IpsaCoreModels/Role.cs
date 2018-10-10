using System;
using System.Collections.Generic;

namespace IpsaCore.Models.IpsaCoreModels
{
    public partial class Role
    {
        public Role()
        {
            Profilerole = new HashSet<Profilerole>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public short? Nestado { get; set; }

        public ICollection<Profilerole> Profilerole { get; set; }
    }
}
