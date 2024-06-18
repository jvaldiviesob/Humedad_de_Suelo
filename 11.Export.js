
var firstYear=require('users/corfobbppciren2023/firstYear:0.firstYear.js');
var Producto_SM=require('users/corfobbppciren2023/Humedad_de_Suelo:10.Producto_SM.js');
var coleccion_imagenes=require('users/corfobbppciren2023/Humedad_de_Suelo:1.coleccion_imagenes.js');

Export.image.toDrive({
image: Producto_SM.SM,
  description: ee.String("SM").cat(ee.String(ee.Number(firstYear.firstYear))).cat("Valparaiso_2").getInfo(),
  folder: 'Humedad de suelo',
  scale:1000,
  region: coleccion_imagenes.tabla,
  crs: 'EPSG:4326',
  maxPixels: 1e13,
});

Export.image.toAsset({
  image: Producto_SM.SM,
  description: ee.String("SM").cat(ee.String(ee.Number(firstYear.firstYear))).cat("Valparaiso_2").getInfo(),
  assetId: 'SM'+firstYear.firstYear+'Valparaiso_101_200',
  scale: 1000,
  crs: "EPSG:4326",
  maxPixels: 1e13,
});

//print("exportando");
