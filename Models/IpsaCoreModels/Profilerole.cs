using System;
using System.Collections.Generic;

namespace IpsaCore.Models.IpsaCoreModels
{
    public partial class Profilerole
    {
        public string Username { get; set; }
        public int RoleId { get; set; }

        public Role Role { get; set; }
        public Profile UsernameNavigation { get; set; }
    }
}
