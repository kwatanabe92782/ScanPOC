using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ScanPOC.Controllers
{
    [Route("api/Image")]
    [ApiController]
    public class ImageController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("Upload")]
        public String Create(ImageData image)
        {
            using (FileStream fileStream = new FileStream(image.Identifier,FileMode.Create))
            {
                fileStream.Write(System.Convert.FromBase64String(image.Data));
            }
            return "Image was saved!";
        }   
    }
}
