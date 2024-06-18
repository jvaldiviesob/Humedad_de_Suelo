
var firstYear=require('users/corfobbppciren2023/firstYear:0.firstYear.js');
var predictores=require('users/corfobbppciren2023/Humedad_de_Suelo:8.predictores.js');

// Make a Random Forest classifier and train it
var clasificador = ee.Classifier.smileRandomForest({
  numberOfTrees:20,
  minLeafPopulation:1, 
  bagFraction:0.5,
  seed:0
}).setOutputMode('REGRESSION')
    .train({
      features: predictores.training,
      classProperty: 'soil moisture',
      inputProperties: [
                      "apei",
                      "Preci",
                      'Tair',
                      'Evapo',
                      'LST_DAILY','LST_Diff',
                      'EVI_SG_linear','NDVI_SG_linear',
                      'clay','sand','silt',
                      'TI','elevation',
                      "lat","lon",
                      'porosity',
                      "omc"
                      ,'WTD'
                      ,'DTB'
                      ]
    });
//calculate the importance of every land surface feature
var importance=clasificador.explain();

print("importance",importance)

exports.clasificador = clasificador;

//print("random forest")
