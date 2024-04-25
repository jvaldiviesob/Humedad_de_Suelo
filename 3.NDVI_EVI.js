var coleccion_imagenes=require('users/corfobbppciren2023/Humedad_de_Suelo:1.coleccion_imagenes');
var firstYear=require('users/corfobbppciren2023/Humedad_de_Suelo:0.firstYear');
var rep_y_geometria=require('users/corfobbppciren2023/Humedad_de_Suelo:2.rep_y_geometria');

///////////////NDVI & EVI
var modis = coleccion_imagenes.MOD13A2;
var oeel=require('users/OEEL/lib:loadAll');
var firstYear = firstYear.firstYear;
var firstDaymodis = ee.String(ee.Number(firstYear).subtract(1)).cat('-12-13');
var lastDaymodis = ee.String(ee.Number(firstYear).add(1)).cat('-03-20');
// 26 images in the current year
modis=modis.filterDate(firstDaymodis,lastDaymodis).select(["NDVI","EVI"]);

// SG filter
var s=oeel.ImageCollection.SavatskyGolayFilter(modis,
        ee.Filter.maxDifference(1000*3600*24*48, 'system:time_start', null, 'system:time_start'),
        function(infromedImage,estimationImage){
          return ee.Image.constant(ee.Number(infromedImage.get('system:time_start'))
            .subtract(ee.Number(estimationImage.get('system:time_start'))));},
        3,["NDVI","EVI"],modis);


///////////////////////////Linear interpolation
////24 images, filter 12/19(or 12/18) and 1/17 which have masked values
s=ee.ImageCollection(s.toList(26).slice(1,25)).select(["d_0_NDVI","d_0_EVI"])
  .map(function(img){
    return img;//.unmask(0)
  });

// Yr start date 
var ddStart = ee.Number(s.aggregate_min('system:time_start'));
// Yr end date
var ddEnd =  ee.Number(s.aggregate_max('system:time_start'));
// DD list
var ddList = ee.List.sequence(ddStart, ddEnd, (24*60*60*1000));
// DD list to img collection  
var ddCll = ee.ImageCollection.fromImages(
                    ddList.map(function (tuple){return ee.Image.constant(tuple).toInt64()
                              .set('system:time_start',ee.Number(tuple))
                              .select(['constant'],['time']);
                            })
);
// Original NDVI copier
function copyValue (img){
 var time = img.metadata('system:time_start');
 function mask (val){
   var timeOrig = val.metadata('system:time_start');
   var masked = timeOrig.eq(time);
   return val.mask(masked);
 }
 var ndviCll = s.map(mask);
 return img.addBands(ndviCll.max()); 
}
var filledDate = ddCll.map(copyValue);


var day = (24*60*60*1000);
var timeDelta = (16*day);
// when 12/19, it is 13 days
// when 12/18, it is 14 days
var timeDelta1= (13*day);
// Create a list of original calculated dates
var startDayList = s.toList(24).map(function(ele){
  ele=ee.Image(ele);
  return ele.get("system:time_start");
}).slice(0,23);
// convert it in an image collection
function toImage(tuple){
  return ee.Image.constant(ee.Number(tuple)).set('system:time_start',tuple);
}
var imgCll = ee.ImageCollection.fromImages(startDayList.map(toImage));

///////////////*******************************//////////////////////
/////////////The function to interpolate EVI
function NDVIinterpolator(img){
  img=ee.Image(img);
  // get the first day of the subsample 
  var begin = ee.Number(img.get('system:time_start'));
  // get the end day of the subsample
  //var end = begin.add(ee.Number(timeDelta));
  var difference = ee.String(ee.Date(ee.Number(img.get('system:time_start'))).format('YYYY-MM-dd')).slice(5).compareTo("12-18").neq(0)
                   .and(ee.String(ee.Date(ee.Number(img.get('system:time_start'))).format('YYYY-MM-dd')).slice(5).compareTo("12-19").neq(0));
  var end = ee.Algorithms.If(difference,
            begin.add(ee.Number(timeDelta)),
            begin.add(ee.Number(timeDelta1))
  );
  //convert to an image
  var minDD = ee.Image(filledDate.filterDate(begin).first()); 
  var maxDD = ee.Image(filledDate.filterDate(end).first());
  
  //calculate the coefficent
  var angularCoeff = ee.Algorithms.If(difference,
                     (maxDD.select('d_0_NDVI').subtract(minDD.select('d_0_NDVI'))).divide(timeDelta),
                     (maxDD.select('d_0_NDVI').subtract(minDD.select('d_0_NDVI'))).divide(timeDelta1)
  );
  var q = ee.Algorithms.If(difference,
          ((maxDD.select('time').multiply(minDD.select('d_0_NDVI'))).subtract(minDD.select('time').multiply(maxDD.select('d_0_NDVI'))))
          .divide(timeDelta),
          ((maxDD.select('time').multiply(minDD.select('d_0_NDVI'))).subtract(minDD.select('time').multiply(maxDD.select('d_0_NDVI'))))
          .divide(timeDelta1)
  );
  //refilter the out collection
  var mnth = filledDate.filterDate(begin,end);
  
  // interpolate the values
  function ndviInterpolator(img){
    var NDVI = (img.select('time').multiply(angularCoeff)).add(q);
    var result = img.select('d_0_NDVI').unmask(NDVI);
    return result;
  }
  var filledMth = mnth.map(ndviInterpolator);
  return filledMth.cast({"d_0_NDVI": "float"}, ["d_0_NDVI"]);
}
///////////////*******************************//////////////////////
/////////////The function to interpolate EVI
function EVIinterpolator(img){
  img=ee.Image(img);
  // get the first day of the subsample 
  var begin = ee.Number(img.get('system:time_start'));
  // get the end day of the subsample
  //var end = begin.add(ee.Number(timeDelta));
  var difference = ee.String(ee.Date(ee.Number(img.get('system:time_start'))).format('YYYY-MM-dd')).slice(5).compareTo("12-18").neq(0)
                   .and(ee.String(ee.Date(ee.Number(img.get('system:time_start'))).format('YYYY-MM-dd')).slice(5).compareTo("12-19").neq(0));
  var end = ee.Algorithms.If(difference,
            begin.add(ee.Number(timeDelta)),
            begin.add(ee.Number(timeDelta1))
  );
  //convert to an image
  var minDD = ee.Image(filledDate.filterDate(begin).first()); 
  var maxDD = ee.Image(filledDate.filterDate(end).first());
  
  //calculate the coefficent
  var angularCoeff = ee.Algorithms.If(difference,
                     (maxDD.select('d_0_EVI').subtract(minDD.select('d_0_EVI'))).divide(timeDelta),
                     (maxDD.select('d_0_EVI').subtract(minDD.select('d_0_EVI'))).divide(timeDelta1)
  );
  var q = ee.Algorithms.If(difference,
          ((maxDD.select('time').multiply(minDD.select('d_0_EVI'))).subtract(minDD.select('time').multiply(maxDD.select('d_0_EVI'))))
          .divide(timeDelta),
          ((maxDD.select('time').multiply(minDD.select('d_0_EVI'))).subtract(minDD.select('time').multiply(maxDD.select('d_0_EVI'))))
          .divide(timeDelta1)
  );
  //refilter the out collection
  var mnth = filledDate.filterDate(begin,end);
  
  // interpolate the values
  function ndviInterpolator(img){
    var NDVI = (img.select('time').multiply(angularCoeff)).add(q);
    var result = img.select('d_0_EVI').unmask(NDVI);
    return result;
  }
  var filledMth = mnth.map(ndviInterpolator);
  return filledMth.cast({"d_0_EVI": "float"}, ["d_0_EVI"]);
}
///////////////*******************************//////////////////////
//apply the interpolation function to NDVI
var sgliNDVICollection =  ee.ImageCollection(imgCll.map(NDVIinterpolator).flatten().toList(3000)).map(function(img){
  //.divide(10000) why the "system: time_Start" disappear after divide?
  return img.clip(rep_y_geometria.Boundary);//.reproject("EPSG:4326",null,1000);
});

var NDVI=sgliNDVICollection;



//apply the interpolation function to NDVI
var sgliEVICollection =  ee.ImageCollection(imgCll.map(EVIinterpolator).flatten().toList(3000)).map(function(img){
  return img.clip(rep_y_geometria.Boundary);//.reproject("EPSG:4326",null,1000);;
});

var EVI=sgliEVICollection;

exports.NDVI=NDVI
exports.EVI=EVI

