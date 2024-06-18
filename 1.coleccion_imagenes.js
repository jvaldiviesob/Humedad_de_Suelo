
var tabla = ee.FeatureCollection('projects/ee-corfobbppciren2023/assets/Geometrias/Valparaiso_1km'),
    MERIT = ee.Image("MERIT/Hydro/v1_0_1").clip(tabla),
    MOD13A2 = ee.ImageCollection("MODIS/061/MOD13A2").filterBounds(tabla),
    ERA5Land = ee.ImageCollection("ECMWF/ERA5_LAND/DAILY_AGGR").filterBounds(tabla),
    WTD = ee.Image("users/corfobbppciren2023/Humedad_de_Suelo_Auxiliares/WTD_v2").clip(tabla),
    DTB = ee.Image("users/corfobbppciren2023/Humedad_de_Suelo_Auxiliares/DTB").clip(tabla),
    trainTest = ee.FeatureCollection("users/corfobbppciren2023/Humedad_de_Suelo_Auxiliares/trainTestFinal2022-0509coor"),
    valiEva = ee.FeatureCollection("users/corfobbppciren2023/Humedad_de_Suelo_Auxiliares/valiEvaFinal2022-0509coor"),
    NLsamples = ee.FeatureCollection("users/corfobbppciren2023/Humedad_de_Suelo_Auxiliares/trainTestNL2022-0509coor"),
    TIele = ee.Image("users/corfobbppciren2023/Humedad_de_Suelo_Auxiliares/TIele1000resample0709").clip(tabla),
    ERA5LandHour = ee.ImageCollection("ECMWF/ERA5_LAND/HOURLY").filterBounds(tabla);


// Export.table.toAsset({
//   collection: trainTest,
//   description:'trainTestFinal2022-0509coor',
//   assetId: 'trainTestFinal2022-0509coor',
// });

//Export.table.toDrive({
//  collection: trainTest,
//  description: 'trainTestFinal2022-0509coor',
//  folder: 'LST',
//  fileFormat: 'SHP'
//});
 
//  Export.table.toAsset({
//   collection: valiEva,
//   description:'valiEvaFinal2022-0509coor',
//   assetId: 'valiEvaFinal2022-0509coor',
// });
 
//  Export.table.toAsset({
//   collection: NLsamples,
//   description:'trainTestNL2022-0509coor',
//   assetId: 'trainTestNL2022-0509coor',
// });
 
// Export.image.toAsset({
//  image: WTD,
//  description: 'WTD',
//  assetId: 'WTD',  // <> modify these
//  maxPixels: 1e13,
//  crs: 'EPSG:4326'
//});

// Export.image.toAsset({
//  image: DTB,
//  description: 'DTB',
//  assetId: 'DTB',  // <> modify these
//  maxPixels: 1e13,
//  crs: 'EPSG:4326'
//});

// Export.image.toAsset({
//  image: TIele,
//  description: 'TIele1000resample0709',
//  assetId: 'TIele1000resample0709',  // <> modify these
//  maxPixels: 1e13,
//  crs: 'EPSG:4326'
//});
 
exports.MERIT = MERIT;
exports.MOD13A2  = MOD13A2;
exports.ERA5Land = ERA5Land;
exports.WTD = WTD;
exports.DTB = DTB;
exports.trainTest = trainTest;
exports.valiEva = valiEva;
exports.NLsamples = NLsamples;
exports.TIele = TIele;
exports.ERA5LandHour = ERA5LandHour;
exports.tabla = tabla;

//Map.addLayer(tabla,{min:0,max:100},'Boundary');
//Map.addLayer(MERIT,{min:0,max:100},'MERIT');
//Map.addLayer(MOD13A2,{min:0,max:100},'MOD13A2');
//Map.addLayer(ERA5Land,{min:0,max:100},'ERA5Land');
//Map.addLayer(DTB,{min:0,max:100},'DTB');
//Map.addLayer(WTD,{min:0,max:100},'WTD');
//Map.addLayer(TIele,{min:0,max:100},'TIele');
//Map.addLayer(ERA5LandHour,{min:0,max:100},'ERA5LandHour');

