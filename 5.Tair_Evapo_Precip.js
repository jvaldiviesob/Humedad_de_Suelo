
var coleccion_imagenes=require('users/corfobbppciren2023/Humedad_de_Suelo:1.coleccion_imagenes.js');
var rep_y_geometria=require('users/corfobbppciren2023/Humedad_de_Suelo:2.rep_y_geometria.js');
var firstYear=require('users/corfobbppciren2023/firstYear:0.firstYear.js');
/////////////////////*****************************
//air temperature
// var preImgCol = ERA5LandHour.filterDate(firstDay.cat("T01"),lastDay.cat("T01")).select("temperature_2m").map(function(col){
//   //0102T00(equals to 0101T24) -> 0101T23
//   //0101T01+0101T02+...+0102T00(equals to 0101T24)
//   var system_time_start = ee.Number(col.get('system:time_start')).subtract(3600000)
//   var system_time_end = ee.Number(col.get('system:time_end')).subtract(3600000)
//   var date=ee.Date(ee.Number(col.get('system:time_start')).subtract(3600000)).format("YYYY-MM-dd")
//   var preImgCol=col.set('date',date).set('system:time_start',system_time_start).set('system:time_end',system_time_end);
//   return preImgCol
// })

// // //merge data from hourly into daily with join function
// var join = ee.Join.saveAll("matches");
// var filter = ee.Filter.equals({ 
//   leftField: "date", 
//   rightField: "date" 
// }); 
// var joinImgs = join.apply(preImgCol.filterMetadata("hour","equals",1), preImgCol, filter); 
// var TairCollection = joinImgs.map(function(image) { 
//   var _imgList = ee.List(image.get("matches")); 
//   var _tempCol = ee.ImageCollection.fromImages(_imgList); 
//   //due to it is hourly, so we need to calculate the average of everyday
//   //Temperature measured in kelvin can be converted to degrees Celsius (°C) by subtracting 273.15.
//   var _dayImg = _tempCol.mean().subtract(273.15); 
//   var _date = image.get("date"); 
//   _dayImg = _dayImg.set("system:time_start", ee.Date.parse("yyyy-MM-dd", _date).millis())
//                   .set('date',_date)
//   return _dayImg.rename("Tair")//.reproject("EPSG:4326",null,1000); 
// }); 
// TairCollection=ERA5Land

var ERA5Land=coleccion_imagenes.ERA5Land.filterBounds(rep_y_geometria.Boundary);
var firstYear=firstYear.firstYear;
var firstDay = ee.String(firstYear.toString()).cat('-01-01');
var lastDay  = ee.String(ee.Number(firstYear).add(1)).cat('-01-01');

var TairCollection=ee.ImageCollection("ECMWF/ERA5_LAND/DAILY_AGGR")
                    .map(function(img){return img.select("temperature_2m").rename('Tair')})
                    .filterDate(firstDay,lastDay);

////evaporation

var evapoCollection=ERA5Land
                    .map(function(img){return img.select("total_evaporation_sum").rename('Evapo')})
                    .filterDate(firstDay,lastDay);


////precipitacion
var precipCollection=ERA5Land
                    .map(function(img){return img.select("total_precipitation_sum").rename('Preci')})
                    .filterDate(firstDay,lastDay);
                    
                    ////precipitacion

exports.TairCollection = TairCollection;
exports.evapoCollection = evapoCollection;
exports.precipCollection = precipCollection;
