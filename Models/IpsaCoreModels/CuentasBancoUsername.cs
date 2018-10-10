using System;
using System.Collections.Generic;

namespace IpsaCore.Models.IpsaCoreModels
{
    public partial class CuentasBancoUsername
    {
        public int Id { get; set; }
        public int BancoCuenta { get; set; }
        public string Username { get; set; }

        public Profile UsernameNavigation { get; set; }
    }
}
