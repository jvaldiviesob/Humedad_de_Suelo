var firstYear=require('users/corfobbppciren2023/Humedad_de_Suelo:0.firstYear');
var Producto_SM=require('users/corfobbppciren2023/Humedad_de_Suelo:10.Producto_SM');
var coleccion_imagenes=require('users/corfobbppciren2023/Humedad_de_Suelo:1.coleccion_imagenes');

Export.image.toAsset({
  image: Producto_SM.SM,
  region: coleccion_imagenes.tabla,
  crs: 'EPSG:4326',
  description: ee.String("SM").cat(ee.String(ee.Number(firstYear.firstYear))).cat("Chile").getInfo(),
  scale:1000,
  pyramidingPolicy: {'.default': 'sample'}
});

