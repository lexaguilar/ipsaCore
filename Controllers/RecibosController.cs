using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using IpsaCore.Models;
using IpsaCore.Models.IpsaCoreModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace IpsaCore.Controllers
{
    [AllowAnonymous]
    public class RecibosController : Controller
    {
        private readonly IPSAContext db;
        private readonly Newtonsoft.Json.JsonSerializerSettings jsonOptions = new Newtonsoft.Json.JsonSerializerSettings { MaxDepth = 1, ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore };
        public RecibosController(IPSAContext _db)
        {
            db = _db;
        }

        public IActionResult getNumRecibos(string id)
        {
            var result = db.IngresosEgresosCaja
            .Include(x => x.Caja)
            .Where(x => x.NumRecibo == id.PadLeft(10,'0'))
            .Select(x => new {
                x.Id,
                x.NumRecibo,
                x.Caja.Description,
                x.Beneficiario,
                x.Username
            }).ToArray();

            return Json(result);
        }     

        public IActionResult get(int id)
        {
            var result = db.IngresosEgresosCaja.Single(x => x.Id == id);        

            return Json(result,jsonOptions);
        }     

    }
}