# Humedad_de_Suelo
Repositorio de scripts para obtener en __Google Earth Engine__ el producto de humedad de suelo de la Región de Valparaíso para cierta temporada. Necesita como input los assets LST que se obtienen con los scripts del repositorio LST de esta cuenta.

Incluye _require_ al script **0.firstYear.js** alojado en _Google Earth Engine_ (**'users/corfobbppciren2023/firstYear:0.firstYear.js'**) y en el repositorio **firstYear** de esta cuenta.

Basado en el repositorio:
__https://github.com/QianqianHan96/GSSM1km__.

El script **3.NDVI_EVI.js** incluye un _require_ a la _Open Earth Engine Library (OEEL)_ a través de la línea de código:
**var oeel=require('users/OEEL/lib:loadAll');**

Repositorio LST de esta cuenta:
__https://github.com/jvaldiviesob/LST__,
el cual, a su vez, se basa en el repositorio:
__https://github.com/shilosh/ContinuousLST__.
