
var coleccion_imagenes=require('users/corfobbppciren2023/Humedad_de_Suelo:1.coleccion_imagenes.js');

var Boundary=ee.FeatureCollection(coleccion_imagenes.tabla);
var WTD = coleccion_imagenes.WTD.reproject("EPSG:4326",null,1000).rename('WTD').clip(Boundary);
var DTB = coleccion_imagenes.DTB.reproject("EPSG:4326",null,1000).rename('DTB').clip(Boundary);

exports.WTD = WTD;
exports.DTB = DTB;
exports.Boundary = Boundary;
