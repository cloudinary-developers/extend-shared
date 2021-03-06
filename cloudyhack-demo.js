/**
* @param context {WebtaskContext}
*/

var cloudinary = require("cloudinary");


function autoTagByID(context, cb){
var public_id = context.query.public_id  || "flooded_road_1";   //existing asset if none passed
var options =  { categorization: "google_tagging,imagga_tagging,aws_rek_tagging", 
  auto_tagging: 0.6, type:"upload" };

    cloudinary.v2.uploader.explicit(public_id,options, function(error,result) {
      if(error){
        cb(error);
      }
      
      if(result){
        console.log(result);
        cb(null, result);
      }
    });
  
}


function test(context,cb){
  
var url = "https://res.cloudinary.com/demo-robert/image/upload/v1523390181/ec18d5b63b46a112b486a97a9d8885d7.jpg";
var options = {ocr: "adv_ocr"};
    cloudinary.v2.uploader.upload(url,options, function(error,result) {
      console.log(result);
      var ocrResult = result.info.ocr.adv_ocr.data[0].fullTextAnnotation.text || 0;
      console.log(ocrResult);
      
      publicId = result.public_id;
      if (ocrResult !== 0) {
        cloudinary.v2.uploader.add_tag(ocrResult, publicId,
          function(result) {
            console.log(result)
        });
      }
    });
    
}


function findByTag(context, cb){
  
  var options ={context:true, tags:true, max_results:500};

     cloudinary.v2.api.resources_by_tag("imageCon", options,
      function(error, result){
        if(error){
          cb(error);
        }
        console.log(result); 
        cb(null, result);
      });
  
}



module.exports = function(context, cb) {
  
  
   cloudinary.config({
      "cloud_name": context.secrets.cloud_name,
      "api_key":  context.secrets.api_key,
      "api_secret": context.secrets.api_secret
    });

//findByTag(context, cb);
autoTagByID(context,cb)
 
};