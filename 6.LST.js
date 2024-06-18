
var firstYear=require('users/corfobbppciren2023/firstYear:0.firstYear.js');

///////////////////////////***********************************
//LST
//var LST=ee.ImageCollection("users/qianrswaterAmerica/LSTEuropeMOD11A1");
//var dayLSTfilter = ee.String("MODIS_LST_Blended_Day_Europe").cat(ee.String(ee.Number(firstYear)));
//var nightLSTfilter = ee.String("MODIS_LST_Blended_Night_Europe").cat(ee.String(ee.Number(firstYear)));
//var dayLST = LST.filterMetadata("system:index","equals",dayLSTfilter).first().divide(100);
//var nightLST = LST.filterMetadata("system:index","equals",nightLSTfilter).first().divide(100);

var image = ee.Image('users/corfobbppciren2023/Humedad_de_Suelo_Auxiliares/LST_Day_Valparaiso_'+firstYear.firstYear);
var image2 = ee.Image('users/corfobbppciren2023/Humedad_de_Suelo_Auxiliares/LST_Night_Valparaiso_'+firstYear.firstYear);


//JV: Por qué divide en 100??
//var dayLST_2019 = ee.ImageCollection(image).first().divide(100);
//var nightLST_2019 = ee.ImageCollection(image2).first().divide(100);

var dayLST = ee.ImageCollection(image).first().divide(100);
var nightLST = ee.ImageCollection(image2).first().divide(100);

function batchRename_dailyLST(image){
  var rename=image.bandNames().map(function(name){
    return ee.String("band_").cat(ee.String(name).slice(-10)).cat(ee.String("_dailyLST"));
  });
  return image.rename(rename);
}

function batchRename_dailyLSTDiff(image){
  var rename=image.bandNames().map(function(name){
    return ee.String("band_").cat(ee.String(name).slice(-10)).cat(ee.String("_dailyLSTDiff"));
  });
  return image.rename(rename);
}

var dailyLST0=batchRename_dailyLST(dayLST.add(nightLST).divide(ee.Number(2)))
.reproject("EPSG:4326",null,1000);



function batchRename_dailyLSTDiff(image){
  var rename=image.bandNames().map(function(name){
    return ee.String("band_").cat(ee.String(name).slice(-10)).cat(ee.String("_dailyLSTDiff"));
  });
  return image.rename(rename);
}

var dailyLSTDiff0=batchRename_dailyLSTDiff(dayLST.subtract(nightLST))
.reproject("EPSG:4326",null,1000);



///dailyLST
var bandNamesdailyLST=dailyLST0.bandNames();
var dailyLST=ee.ImageCollection(bandNamesdailyLST.map(function(BandNameElement){
  var stringLength=ee.String(BandNameElement).length();
  var stryearBegin=ee.String(BandNameElement).slice(-19,-9);
  var startIndex=ee.String(BandNameElement).rindex(stryearBegin);
  var DateString=ee.String(BandNameElement).slice(startIndex,startIndex.add(10));
  var yearStr=ee.Number.parse(DateString.slice(0,4));
  var monthStr=ee.Number.parse(DateString.slice(5,7));
  var DayStr=ee.Number.parse(DateString.slice(8,10));
   
  return ee.Image(dailyLST0.select([BandNameElement])).rename(['dailyLST']).cast({"dailyLST": "double"}, ["dailyLST"])
.set('system:time_start', ee.Date.fromYMD(yearStr.int(), monthStr.int(), DayStr.int()).millis())
.set('bandName',BandNameElement)
.set("system:index",stryearBegin);
}));

////dailyLSTDiff
var bandNamesdailyLSTDiff=dailyLSTDiff0.bandNames();
var dailyLSTDiff=ee.ImageCollection(bandNamesdailyLSTDiff.map(function(BandNameElement){
  var stringLength=ee.String(BandNameElement).length();
  var stryearBegin=ee.String(BandNameElement).slice(-23,-13);
  var startIndex=ee.String(BandNameElement).rindex(stryearBegin);
  var DateString=ee.String(BandNameElement).slice(startIndex,startIndex.add(10));
  var yearStr=ee.Number.parse(DateString.slice(0,4));
  var monthStr=ee.Number.parse(DateString.slice(5,7));
  var DayStr=ee.Number.parse(DateString.slice(8,10));
   
  return ee.Image(dailyLSTDiff0.select([BandNameElement])).rename(['dailyLSTDiff']).cast({"dailyLSTDiff": "double"}, ["dailyLSTDiff"])
.set('system:time_start', ee.Date.fromYMD(yearStr.int(), monthStr.int(), DayStr.int()).millis())
.set('bandName',BandNameElement)
.set("system:index",stryearBegin);
}));

exports.dailyLST = dailyLST;
exports.dailyLSTDiff = dailyLSTDiff;


////////////////////////////////////////
///////////////
