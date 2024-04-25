var firstYear=require('users/corfobbppciren2023/Humedad_de_Suelo:0.firstYear');
var rep_y_geometria=require('users/corfobbppciren2023/Humedad_de_Suelo:2.rep_y_geometria');
var predictores=require('users/corfobbppciren2023/Humedad_de_Suelo:8.predictores');
var RandomForest=require('users/corfobbppciren2023/Humedad_de_Suelo:9.RandomForest');

function batchRename(image){
  var rename=image.bandNames().map(function(name){
    return ee.String("band_").cat(ee.String(name));
  });
  return image.rename(rename);
}

var SM=ee.ImageCollection(predictores.predictors.toList(366).slice(0,366)).map(function(img){
//  var SM=ee.ImageCollection(predictors.toList(13).slice(0,13)).map(function(img){
  return img.classify(RandomForest.clasificador).multiply(1000).round().toUint16();
});

SM=batchRename(SM.toBands()).divide(10);

exports.SM = SM;

