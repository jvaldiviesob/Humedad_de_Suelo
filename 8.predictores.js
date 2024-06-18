
var firstYear=require('users/corfobbppciren2023/firstYear:0.firstYear.js'),
    coleccion_imagenes=require('users/corfobbppciren2023/Humedad_de_Suelo:1.coleccion_imagenes.js'),
    rep_y_geometria=require('users/corfobbppciren2023/Humedad_de_Suelo:2.rep_y_geometria.js'),
    NDVI_EVI=require('users/corfobbppciren2023/Humedad_de_Suelo:3.NDVI_EVI.js'),
    API=require('users/corfobbppciren2023/Humedad_de_Suelo:4.API.js'),
    Tair_Evapo_Precip=require('users/corfobbppciren2023/Humedad_de_Suelo:5.Tair_Evapo_Precip.js'),
    LST=require('users/corfobbppciren2023/Humedad_de_Suelo:6.LST.js'),
    soil_texture_geographic=require('users/corfobbppciren2023/Humedad_de_Suelo:7.soil_texture_geographic.js');

var Boundary = rep_y_geometria.Boundary;

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

//print(ee.DateRange(firstYear.firstYear+'-04-10', firstYear.firstYear+'-07-18'));

//predictors=predictors.filter(ee.Filter.date((ee.DateRange(firstYear.firstYear+'-01-09', firstYear.firstYear+'-04-09'))));
predictors=predictors.filter(ee.Filter.date((ee.DateRange(firstYear.firstYear+'-04-10', firstYear.firstYear+'-07-18'))));
//predictors=predictors.filter(ee.Filter.date((ee.DateRange(firstYear.firstYear+'-07-18', firstYear.firstYear+'-10-25'))));
//predictors=predictors.filter(ee.Filter.date((ee.DateRange(firstYear.firstYear+'-10-25', firstYear.firstYear+'-12-31'))));


//print('Preci1',Tair_Evapo_Precip.precipCollection);
//print('APILand1',API.APILand);
//print('Tair1',Tair_Evapo_Precip.TairCollection);
//print('Evapo1',Tair_Evapo_Precip.evapoCollection);
//print('NDVI1',ee.ImageCollection(NDVI_EVI.NDVI));
//print('EVI1',NDVI_EVI.EVI);
//print('soil_texture_geographic.TI',soil_texture_geographic.TI);
//print('soil_texture_geographic.soilProper.select("porosity")',soil_texture_geographic.soilProper.select("porosity"));
//print('soil_texture_geographic.soilProper.select("omc")',soil_texture_geographic.soilProper.select("omc"));
//print('soil_texture_geographic.soilProper.select("clay")',soil_texture_geographic.soilProper.select("clay"));
//print('soil_texture_geographic.soilProper.select("sand")',soil_texture_geographic.soilProper.select("sand"));
//print('soil_texture_geographic.soilProper.select("silt")',soil_texture_geographic.soilProper.select("silt"));
//print('soil_texture_geographic.longitude',soil_texture_geographic.longitude);
//print('soil_texture_geographic.latitude',soil_texture_geographic.latitude);
//print('soil_texture_geographic.elevation',soil_texture_geographic.elevation);
//print('rep_y_geometria.WTD',rep_y_geometria.WTD);
//print('rep_y_geometria.DTB',rep_y_geometria.DTB);
//print('predictors.first()',predictors.first());

//Map.addLayer(Boundary,{min:0,max:100},'Boundary');
//Map.addLayer(LST.dailyLST,{min:0,max:100},'dailyLST');
//Map.addLayer(LST.dailyLSTDiff,{min:0,max:100},'dailyLSTDiff1');
//Map.addLayer(Tair_Evapo_Precip.precipCollection,{min:0,max:100},'Preci1');
//Map.addLayer(API.APILand,{min:0,max:100},'API.APILand');
//Map.addLayer(Tair_Evapo_Precip.TairCollection,{min:0,max:100},'Tair1');
//Map.addLayer(Tair_Evapo_Precip.evapoCollection,{min:0,max:100},'Evapo1');
//Map.addLayer(ee.ImageCollection(NDVI_EVI.NDVI),{min:0,max:100},'NDVI1');
//Map.addLayer(soil_texture_geographic.TI,{min:0,max:100},'soil_texture_geographic.TI');
//Map.addLayer(soil_texture_geographic.soilProper.select("porosity"),{min:0,max:100},'soil_texture_geographic.soilProper.select("porosity")');
//Map.addLayer(soil_texture_geographic.soilProper.select("omc"),{min:0,max:100},'soil_texture_geographic.soilProper.select("omc")');
//Map.addLayer(soil_texture_geographic.soilProper.select("clay"),{min:0,max:100},'soil_texture_geographic.soilProper.select("clay")');
//Map.addLayer(soil_texture_geographic.soilProper.select("sand"),{min:0,max:100},'soil_texture_geographic.soilProper.select("sand")');
//Map.addLayer(soil_texture_geographic.soilProper.select("silt"),{min:0,max:100},'soil_texture_geographic.soilProper.select("silt")');
//Map.addLayer(soil_texture_geographic.longitude,{min:0,max:100},'soil_texture_geographic.longitude');
//Map.addLayer(soil_texture_geographic.latitude,{min:0,max:100},'soil_texture_geographic.latitude');
//Map.addLayer(rep_y_geometria.WTD,{min:0,max:100},'rep_y_geometria.WTD');
//Map.addLayer(rep_y_geometria.DTB,{min:0,max:100},'rep_y_geometria.DTB');
//Map.addLayer(predictors.first(),{min:0,max:100},'predictors.first()');

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

//print("predictores")
