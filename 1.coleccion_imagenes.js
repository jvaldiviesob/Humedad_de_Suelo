var MERIT = ee.Image("MERIT/Hydro/v1_0_1"),
    MOD13A2 = ee.ImageCollection("MODIS/061/MOD13A2"),
    ERA5Land = ee.ImageCollection("ECMWF/ERA5_LAND/DAILY_AGGR"),
    WTD=ee.Image("users/ccalvocm/WTD"),
    DTB = ee.Image("users/ccalvocm/DTB"),
    trainTest = ee.FeatureCollection("users/ccalvocm/GlobalSSM2022/trainTestFinal2022-0509coor"),
    valiEva = ee.FeatureCollection("users/ccalvocm/GlobalSSM2022/valiEvaFinal2022-0509coor"),
    NLsamples = ee.FeatureCollection("users/ccalvocm/NLsamples/trainTestNL2022-0509coor"),
    TIele = ee.Image("users/ccalvocm/GlobalSSM2022/TIele1000resample0709"),
    ERA5LandHour = ee.ImageCollection("ECMWF/ERA5_LAND/HOURLY");
    
var tabla = ee.FeatureCollection('projects/ee-corfobbppciren2023/assets/Geometrias/Coquimbo_sur');
    
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
