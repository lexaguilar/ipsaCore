using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using IpsaCore.Models;
using IpsaCore.Models.IpsaCoreModels;

namespace IpsaCore.Controllers
{
    public class CatalogsController : Controller
    {
        private readonly IPSAContext _db;

        public CatalogsController(IPSAContext db)
        {
            _db = db;
        }

        
    }
}