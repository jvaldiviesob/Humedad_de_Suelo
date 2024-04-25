var coleccion_imagenes=require('users/corfobbppciren2023/Humedad_de_Suelo:1.coleccion_imagenes');
var rep_y_geometria=require('users/corfobbppciren2023/Humedad_de_Suelo:2.rep_y_geometria');
var NDVI_EVI=require('users/corfobbppciren2023/Humedad_de_Suelo:3.NDVI_EVI');
var API=require('users/corfobbppciren2023/Humedad_de_Suelo:4.API');
var Tair_Evapo_Precip=require('users/corfobbppciren2023/Humedad_de_Suelo:5.Tair_Evapo_Precip');
var LST=require('users/corfobbppciren2023/Humedad_de_Suelo:6.LST');
var soil_texture_geographic=require('users/corfobbppciren2023/Humedad_de_Suelo:7.soil_texture_geographic');

////////////////////////combine all predictors
var predictors=LST.dailyLST.map(function(img){
    var time=img.get("system:time_start");
    var dailyLSTDiff1=LST.dailyLSTDiff.filterMetadata("system:time_start","equals",time).first().rename("LST_Diff");
    var NDVI1=ee.ImageCollection(NDVI_EVI.NDVI).filterMetadata("system:time_start","equals",time).first().rename("NDVI_SG_linear").divide(10000);
    var EVI1=NDVI_EVI.EVI.filterMetadata("system:time_start","equals",time).first().rename("EVI_SG_linear").divide(10000);
    var Preci1=Tair_Evapo_Precip.precipCollection.filterMetadata("system:time_start","equals",time).first().rename("Preci").multiply(1000);
    var APILand1=API.APILand.filterMetadata("system:time_start","equals",time).first().rename("apei").multiply(1000);
    var Tair1=Tair_Evapo_Precip.TairCollection.filterMetadata("system:time_start","equals",time).first().rename("Tair").subtract(273.15);
    var Evapo1=Tair_Evapo_Precip.evapoCollection.filterMetadata("system:time_start","equals",time).first().rename("Evapo").multiply(-1000);
  return img.rename("LST_DAILY").addBands(dailyLSTDiff1)
              .addBands(Preci1)
              .addBands(APILand1)
              .addBands(Tair1)
              .addBands(Evapo1)
              .addBands(NDVI1)
              .addBands(EVI1)
              .addBands(soil_texture_geographic.TI)
              .addBands(soil_texture_geographic.soilProper.select("porosity")).addBands(soil_texture_geographic.soilProper.select("omc"))
              .addBands(soil_texture_geographic.soilProper.select("clay")).addBands(soil_texture_geographic.soilProper.select("sand")).addBands(soil_texture_geographic.soilProper.select("silt"))
              .addBands(soil_texture_geographic.longitude).addBands(soil_texture_geographic.latitude).addBands(soil_texture_geographic.elevation)
              .addBands(rep_y_geometria.WTD)
              .addBands(rep_y_geometria.DTB);
})
.map(function(img){
  return img.clip(rep_y_geometria.Boundary).reproject("EPSG:4326",null,1000);
});

////////////

/////////select a certain number of training and testing samples
var sample=coleccion_imagenes.trainTest;
var station=sample.toList(556443).map(function(a){
  return ee.Feature(a).get('station');
});

sample=sample.randomColumn();
var sampleSplit = 0.6; 
//var sampleSplit = 0.5;
sample=sample.filter(ee.Filter.lt('random', sampleSplit));

//Map.addLayer(sample,{},'samples')
var station=sample.toList(556443).map(function(a){
  return ee.Feature(a).get('station');
});

var NLsamples = coleccion_imagenes.NLsamples.randomColumn();
var trainingNL = NLsamples.filter(ee.Filter.lt('random', 0.75));



sample = sample.merge(trainingNL)

// //////////split training and testing samples
sample = sample.randomColumn();

var split = 0.75;  // Roughly 75% training, 25% testing.
var training = sample.filter(ee.Filter.lt('random', split));

exports.training = training;
exports.predictors = predictors;


