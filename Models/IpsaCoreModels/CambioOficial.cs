﻿using System;
using System.Collections.Generic;

namespace IpsaCore.Models.IpsaCoreModels
{
    public partial class CambioOficial
    {
        public DateTime FechaCambioOficial { get; set; }
        public decimal Dolares { get; set; }
        public decimal? Euros { get; set; }
        public string Usuarioid { get; set; }
    }
}
