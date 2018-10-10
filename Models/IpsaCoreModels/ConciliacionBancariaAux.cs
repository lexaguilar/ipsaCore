using System;
using System.Collections.Generic;

namespace IpsaCore.Models.IpsaCoreModels
{
    public partial class ConciliacionBancariaAux
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public string Referencia { get; set; }
        public int TipoMovimientoId { get; set; }
        public decimal Debito { get; set; }
        public decimal Credito { get; set; }
        public int EstadoId { get; set; }
        public string Uuid { get; set; }
        public int ProcesoBancoId { get; set; }
        public bool Conciliado { get; set; }
        public int IdOrigen { get; set; }
        public short TableInfo { get; set; }
        public int IdRef { get; set; }

        public ConciliacionBancariaEstado Estado { get; set; }
        public ProcesoBanco ProcesoBanco { get; set; }
        public TipoMovimiento TipoMovimiento { get; set; }
    }
}
