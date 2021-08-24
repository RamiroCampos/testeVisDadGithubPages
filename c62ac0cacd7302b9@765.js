// https://observablehq.com/@alexeias/juntando-tudo-final@765
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`#### Análise de Preços e Lucros para materiais de refino do jogo Albion Online
##### Materias analisados: Couro(leather) e Pelego(hide), tier 5-7`
)});
  main.variable(observer("viewof typeMaterial")).define("viewof typeMaterial", ["html"], function(html){return(
html`<select>
<option value=T5_LEATHER>T5_LEATHER
<option value=T5_HIDE>T5_HIDE

<option value=T6_LEATHER>T6_LEATHER
<option value=T6_HIDE>T6_HIDE

<option value=T7_LEATHER>T7_LEATHER
<option value=T7_HIDE>T7_HIDE
</select>`
)});
  main.variable(observer("typeMaterial")).define("typeMaterial", ["Generators", "viewof typeMaterial"], (G, _) => G.input(_));
  main.variable(observer("buildvis")).define("buildvis", ["md","container","dc","cityDim","boxplotGroup","colorScale","dateDim","xScale","width","avgPrice","maxPrice2","cityScale"], function(md,container,dc,cityDim,boxplotGroup,colorScale,dateDim,xScale,width,avgPrice,maxPrice2,cityScale)
{
  let view = md`${container()}`;

  let lineChart = dc.seriesChart(view.querySelector("#time-chart"));
  let boxPlotMax = dc.boxPlot(view.querySelector("#boxplot"));


  let lucroChart1 = dc.barChart(view.querySelector("#graf1"));
  let lucroChart2 = dc.pieChart(view.querySelector("#graf2"));
  
  boxPlotMax // barChart
    .width(530)
    .height(430)
    .margins({top: 10, right: 80, bottom: 30, left: 40})
    .dimension(cityDim)
    .group(boxplotGroup)
    .colors(colorScale)
    .colorAccessor(d => d.key)
    .elasticY(true)
    .elasticX(true);
    
  
  lineChart //seriesChart
    .width(900)
    .height(500)
    .dimension(dateDim)
    .margins({ top: 30, right: 100, bottom: 25, left: 40})
    .x(xScale)
    .legend(
      dc
        .legend()
        .x(width - 400)
        .y(300)
        .itemHeight(13)
        .gap(5)
    )
    .brushOn(false)
    .renderHorizontalGridLines(true)
    .group(avgPrice)    
    .elasticY(true)
    .colors(colorScale)
    .colorAccessor((d) => d.key)
    .seriesAccessor(function (d) {
      return d.key[0];
    })
    .keyAccessor(function (d) {
      return +d.key[1];
    })
    .valueAccessor(function (d) {
      return +d.value;
    });

  
  lucroChart1 //lucroChart1
    .width(700)
    .height(400)
    .margins({ top: 10, right: 20, bottom: 20, left: 200 })
    .dimension(cityDim)
    .group(maxPrice2)
    .gap(20)
    .transitionDuration(500)
    .x(cityScale)
    .centerBar(false)
    .renderHorizontalGridLines(true)
    .xUnits(dc.units.ordinal)
    .elasticY(true)
    .colors(colorScale)
    .colorAccessor((d) => d.key)

  
  lucroChart2 //lucroChart2
    .width(width)
    .height(400)
    .slicesCap(5)
    .innerRadius(100)
    .dimension(cityDim)
    .group(maxPrice2)
    .colors(colorScale)
    .colorAccessor((d) => d.key)
    .legend(dc.legend().highlightSelected(true));
  
  dc.renderAll();
  // updateMarkers();

  return view;
}
);
  main.variable(observer("dataset")).define("dataset", ["choice","typeMaterial"], function(choice,typeMaterial){return(
choice[typeMaterial]
)});
  main.variable(observer("map")).define("map", ["buildvis","L"], function(buildvis,L)
{
  buildvis;
  let bounds = [[0,0], [800,1200]]
  let mapInstance = L.map("mapid", {
    crs: L.CRS.Simple,
    minZoom: -5
  });
  L.imageOverlay('./WorldMap.png' , bounds).addTo(mapInstance);
  mapInstance.fitBounds(bounds);
  
  mapInstance.setView( [400, 600], -1);
  return mapInstance;
}
);
  main.variable(observer("circlesLayer")).define("circlesLayer", ["L","map"], function(L,map){return(
L.layerGroup().addTo(map)
)});
  main.variable(observer("paint")).define("paint", function(){return(
new Object({
  Martlock: [418, 559],
  Thetford: [561, 220],
  "Fort Sterling": [886, 299],
  Lymhurst: [1090, 680],
  Bridgewatch: [687, 886]
})
)});
  main.variable(observer("mapping")).define("mapping", function(){return(
function mapping([x,y]) {
  // recebe (x,y) do paint, e retorna (y,x) do mapa do leaflet
  return [ Math.round( (1080 - y)*(800/1080) ), Math.round( x*(1200/1440) ) ]  
}
)});
  main.variable(observer("teste2")).define("teste2", ["maxPrice","mapping","paint"], function(maxPrice,mapping,paint){return(
[
  [maxPrice.all()[0].key, mapping(paint[maxPrice.all()[0].key]) , maxPrice.all()[0].value ],
  [maxPrice.all()[1].key, mapping(paint[maxPrice.all()[1].key]) , maxPrice.all()[1].value ],
  [maxPrice.all()[2].key, mapping(paint[maxPrice.all()[2].key]) , maxPrice.all()[2].value ],
  [maxPrice.all()[3].key, mapping(paint[maxPrice.all()[3].key]) , maxPrice.all()[3].value ],
  [maxPrice.all()[4].key, mapping(paint[maxPrice.all()[4].key]) , maxPrice.all()[4].value ],
]
)});
  main.variable(observer("circles")).define("circles", ["circlesLayer","teste2","L","colorScale"], function(circlesLayer,teste2,L,colorScale)
{
 circlesLayer.clearLayers()
 teste2.forEach( function(d) {
 let circle = L.circle(d[1], 20, {
 color: colorScale(d[0]),
 weight: 2,
 fillColor: colorScale(d[0]),
 fillOpacity: 0.5
 })
   circle.bindPopup(d[0] + "<br> Mediana dos preços: " + Math.round(d[2]) )
 circlesLayer.addLayer(circle) })
}
);
  main.variable(observer("container")).define("container", function(){return(
function container() {
  return `
<main role="main" class="container">
    <div class="row">
      <h3> Análise dos Preços</h3>
    </div>


    <div class='row'>
        <div id="mapid" class="col-6">
        </div>
        <div class = "col-6">
          <div id='boxplot'>
            <h5>Variação dos Preços</h5>
          </div>

        </div>
    </div>

    <div class = "row" >              
      <div id='time-chart' >
      <h5> Preços ao longo de 1 mês </h5>
      </div>
    </div>

    <div class = "row" >              
      <div id='graf1' >
      <h5> Lucro por pack(999 unidades) - retorno de 36,7%(sem foco) </h5>
      </div>
    </div>
    <div class = "row" >              
      <div id='graf2' >
      <h5> Gráfico 2 de Lucro </h5>
      </div>
    </div>

  </main>
 `;
}
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<code>css</code> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
<link rel="stylesheet" type="text/css" href="https://unpkg.com/dc@4/dist/style/dc.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>

<style>
  #mapid {
    width: 650px;
    height: 480px;
  }

.center {
  text-align: center;
}
</style>`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<link rel="stylesheet" type="text/css" href="https://unpkg.com/dc@4/dist/style/dc.css" />`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3")
)});
  main.variable(observer("L")).define("L", ["require"], function(require){return(
require("leaflet@1.6.0")
)});
  main.variable(observer("crossfilter")).define("crossfilter", ["require"], function(require){return(
require("crossfilter2")
)});
  main.variable(observer("dc")).define("dc", ["require"], function(require){return(
require("dc")
)});
  main.variable(observer("bootstrap")).define("bootstrap", ["require"], function(require){return(
require('bootstrap')
)});
  main.variable(observer("PATH")).define("PATH", function(){return(
["https://raw.githubusercontent.com/RamiroCampos/arquivosMiscelaneos/master/ArquivosFinais/T5_LEATHER.json",
       "https://raw.githubusercontent.com/RamiroCampos/arquivosMiscelaneos/master/ArquivosFinais/T5_HIDE.json",
       "https://raw.githubusercontent.com/RamiroCampos/arquivosMiscelaneos/master/ArquivosFinais/T6_LEATHER.json",
       "https://raw.githubusercontent.com/RamiroCampos/arquivosMiscelaneos/master/ArquivosFinais/T6_HIDE.json",
       "https://raw.githubusercontent.com/RamiroCampos/arquivosMiscelaneos/master/ArquivosFinais/T7_LEATHER.json",
       "https://raw.githubusercontent.com/RamiroCampos/arquivosMiscelaneos/master/ArquivosFinais/T7_HIDE.json"]
)});
  main.variable(observer("getDataset")).define("getDataset", ["d3"], function(d3){return(
function getDataset(path){
  let dataset =  d3.json(path).then(function(data) {
    let parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%S");
    data.forEach(function(d) {
      let max_price = d3.median(d.data,d => d.avg_price) 
      let leng = d.data.length
      d.data.forEach(function(item){
        item.leng = leng
        item.max_price = max_price
        item.dtg = parseDate(item.timestamp)
        item.location = d.location
        item.item_id = d.item_id
        if(item.avg_price > 10000){item.avg_price = 10000}
    
      })
    })
  let newdata = [].concat(data[0].data,data[1].data,data[2].data,data[3].data,data[4].data)
  return newdata
})
  return dataset
}
)});
  main.variable(observer("datasetT5_LEATHER")).define("datasetT5_LEATHER", ["getDataset","PATH"], function(getDataset,PATH){return(
getDataset(PATH[0])
)});
  main.variable(observer("datasetT5_HIDE")).define("datasetT5_HIDE", ["getDataset","PATH"], function(getDataset,PATH){return(
getDataset(PATH[1])
)});
  main.variable(observer("datasetT6_LEATHER")).define("datasetT6_LEATHER", ["getDataset","PATH"], function(getDataset,PATH){return(
getDataset(PATH[2])
)});
  main.variable(observer("datasetT6_HIDE")).define("datasetT6_HIDE", ["getDataset","PATH"], function(getDataset,PATH){return(
getDataset(PATH[3])
)});
  main.variable(observer("datasetT7_LEATHER")).define("datasetT7_LEATHER", ["getDataset","PATH"], function(getDataset,PATH){return(
getDataset(PATH[4])
)});
  main.variable(observer("datasetT7_HIDE")).define("datasetT7_HIDE", ["getDataset","PATH"], function(getDataset,PATH){return(
getDataset(PATH[5])
)});
  main.variable(observer("choice")).define("choice", ["datasetT5_LEATHER","datasetT5_HIDE","datasetT6_LEATHER","datasetT6_HIDE","datasetT7_LEATHER","datasetT7_HIDE"], function(datasetT5_LEATHER,datasetT5_HIDE,datasetT6_LEATHER,datasetT6_HIDE,datasetT7_LEATHER,datasetT7_HIDE){return(
new Object({'T5_LEATHER': datasetT5_LEATHER,'T5_HIDE': datasetT5_HIDE, 'T6_LEATHER': datasetT6_LEATHER,'T6_HIDE': datasetT6_HIDE,'T7_LEATHER': datasetT7_LEATHER,'T7_HIDE': datasetT7_HIDE})
)});
  main.variable(observer("facts")).define("facts", ["crossfilter","dataset"], function(crossfilter,dataset){return(
crossfilter(dataset)
)});
  main.variable(observer("dateDim")).define("dateDim", ["facts"], function(facts){return(
facts.dimension(function(d){ return [d.location,d.dtg]})
)});
  main.variable(observer("avgPrice")).define("avgPrice", ["dateDim"], function(dateDim){return(
dateDim.group().reduceSum(d => d.avg_price)
)});
  main.variable(observer("xScale")).define("xScale", ["d3","dataset"], function(d3,dataset){return(
d3.scaleTime()
  .domain(d3.extent(dataset, d => d.dtg ))
)});
  main.variable(observer("cities")).define("cities", function(){return(
["Bridgewatch", "Fort Sterling", "Lymhurst", "Martlock", "Thetford"]
)});
  main.variable(observer("colorScale")).define("colorScale", ["d3","cities"], function(d3,cities){return(
d3.scaleOrdinal()
                 .domain(cities)
                 .range(["#e6b800", "#00ccff", "#00cc00","#0000ff","#cc00cc"])
)});
  main.variable(observer("cityDim")).define("cityDim", ["facts"], function(facts){return(
facts.dimension(d => d.location)
)});
  main.variable(observer("maxPrice")).define("maxPrice", ["cityDim"], function(cityDim){return(
cityDim.group().reduceSum(d => d.max_price/d.leng)
)});
  main.variable(observer("cityScale")).define("cityScale", ["d3","cities"], function(d3,cities){return(
d3.scaleOrdinal().domain(cities)
)});
  main.variable(observer("boxplotGroup")).define("boxplotGroup", ["cityDim","d3"], function(cityDim,d3){return(
cityDim.group().reduce( function(p,v) {
          // keep array sorted for efficiency
          p.splice(d3.bisectLeft(p, v.avg_price), 0, v.avg_price);
          return p;
        },
        function(p,v) {
          p.splice(d3.bisectLeft(p, v.avg_price), 1);
          return p;
        },
        function() {
          return [];
        }
      )
)});
  main.variable(observer()).define(["md"], function(md){return(
md`#### Funções do Lucro`
)});
  main.variable(observer("calcReturn")).define("calcReturn", function(){return(
function calcReturn(n,p){
  let sum = n
  let value = n
  while(value > 1){
    let ret = value * p
    sum +=  ret
    value = ret
  }
  return parseInt(sum)
}
)});
  main.variable(observer("getMedianValues")).define("getMedianValues", ["cities"], function(cities){return(
function getMedianValues(dataset){
  let count = 0
  let array = new Array
  let iterator = dataset.map(function(item){
  if(item.location == cities[count] & count < cities.length){
    let obj = new Object
    obj.location = cities[count]
    obj.max_price = item.max_price
    array[count] = obj
    count ++
  }
})
  return array
  
}
)});
  main.variable(observer("createPricesArray")).define("createPricesArray", ["getMedianValues","datasetT5_LEATHER","datasetT5_HIDE","datasetT6_LEATHER","datasetT6_HIDE","datasetT7_LEATHER","datasetT7_HIDE"], function(getMedianValues,datasetT5_LEATHER,datasetT5_HIDE,datasetT6_LEATHER,datasetT6_HIDE,datasetT7_LEATHER,datasetT7_HIDE){return(
function createPricesArray(){
  let data = [getMedianValues(datasetT5_LEATHER),getMedianValues(datasetT5_HIDE),getMedianValues(datasetT6_LEATHER),
              getMedianValues(datasetT6_HIDE),getMedianValues(datasetT7_LEATHER),getMedianValues(datasetT7_HIDE)]
  let names = [['T5_LEATHER','product','t5'],['T5_HIDE','raw_material','t5'],['T6_LEATHER','product','t6'],
               ['T6_HIDE','raw_material','t6'],['T7_LEATHER','product','t7'],['T7_HIDE','raw_material','t7']]
  let array = new Array
  for(let i = 0; i<6;i++){
    let obj = new Object
    obj.material  = names[i][0]
    obj.prices = [data[i][0].max_price,data[i][1].max_price,data[i][2].max_price,data[i][3].max_price,
                  data[i][4].max_price]
    obj.material_type = names[i][1]
    obj.tier = names[i][2]
    array[i] = obj
    
  }
  return array
}
)});
  main.variable(observer("pricesDataset")).define("pricesDataset", ["createPricesArray"], function(createPricesArray){return(
createPricesArray()
)});
  main.variable(observer("createProfitObject")).define("createProfitObject", ["calcReturn","pricesDataset"], function(calcReturn,pricesDataset){return(
function createProfitObject(item,city,idx){
  let obj =  new Object
  let noFocusPack = calcReturn(999,0.367)
  obj.location = city
  if(item.material_type == "raw_material"){
    obj.gain = parseInt(999 * item.prices[idx])
    return obj
  }
  else{
    switch(item.tier){
      case 't5':
        obj.gain = parseInt(((noFocusPack/3)*item.prices[idx]) - (pricesDataset[1].prices[idx]*999))
        break;
      case 't6':
        obj.gain = parseInt( ((noFocusPack/4)*item.prices[idx])  - (pricesDataset[3].prices[idx]*999))
        break;
      case 't7':
        obj.gain = parseInt( ((noFocusPack/5)*item.prices[idx])  - (pricesDataset[5].prices[idx]*999) )
        break;
      default :
        obj.gain = 0
    }
  }
  return obj
}
)});
  main.variable(observer("createMaterialDataset")).define("createMaterialDataset", ["pricesDataset","createProfitObject","cities"], function(pricesDataset,createProfitObject,cities){return(
function createMaterialDataset(material){
  let array  = new Array
  let iterator = pricesDataset.forEach(function(item){
    if(item.material == material){
    array[0] = createProfitObject(item,cities[0],0)
    array[1] = createProfitObject(item,cities[1],1)
    array[2] = createProfitObject(item,cities[2],2)
    array[3] = createProfitObject(item,cities[3],3)
    array[4] = createProfitObject(item,cities[4],4)
    }
  })
  return array
}
)});
  main.variable(observer("datasetGainT5_LEATHER")).define("datasetGainT5_LEATHER", ["createMaterialDataset"], function(createMaterialDataset){return(
createMaterialDataset("T5_LEATHER")
)});
  main.variable(observer("datasetGainT5_HIDE")).define("datasetGainT5_HIDE", ["createMaterialDataset"], function(createMaterialDataset){return(
createMaterialDataset("T5_HIDE")
)});
  main.variable(observer("datasetGainT6_LEATHER")).define("datasetGainT6_LEATHER", ["createMaterialDataset"], function(createMaterialDataset){return(
createMaterialDataset("T6_LEATHER")
)});
  main.variable(observer("datasetGainT6_HIDE")).define("datasetGainT6_HIDE", ["createMaterialDataset"], function(createMaterialDataset){return(
createMaterialDataset("T6_HIDE")
)});
  main.variable(observer("datasetGainT7_LEATHER")).define("datasetGainT7_LEATHER", ["createMaterialDataset"], function(createMaterialDataset){return(
createMaterialDataset("T7_LEATHER")
)});
  main.variable(observer("datasetGainT7_HIDE")).define("datasetGainT7_HIDE", ["createMaterialDataset"], function(createMaterialDataset){return(
createMaterialDataset("T7_HIDE")
)});
  main.variable(observer("choice2")).define("choice2", ["datasetGainT5_LEATHER","datasetGainT5_HIDE","datasetGainT6_LEATHER","datasetGainT6_HIDE","datasetGainT7_LEATHER","datasetGainT7_HIDE"], function(datasetGainT5_LEATHER,datasetGainT5_HIDE,datasetGainT6_LEATHER,datasetGainT6_HIDE,datasetGainT7_LEATHER,datasetGainT7_HIDE){return(
new Object({'T5_LEATHER': datasetGainT5_LEATHER,'T5_HIDE': datasetGainT5_HIDE, 'T6_LEATHER': datasetGainT6_LEATHER,'T6_HIDE': datasetGainT6_HIDE,'T7_LEATHER': datasetGainT7_LEATHER,'T7_HIDE': datasetGainT7_HIDE})
)});
  main.variable(observer("gainDataset")).define("gainDataset", ["choice2","typeMaterial"], function(choice2,typeMaterial){return(
choice2[typeMaterial]
)});
  main.variable(observer("facts2")).define("facts2", ["crossfilter","gainDataset"], function(crossfilter,gainDataset){return(
crossfilter(gainDataset)
)});
  main.variable(observer("cityDim2")).define("cityDim2", ["facts2"], function(facts2){return(
facts2.dimension(d => d.location)
)});
  main.variable(observer("maxPrice2")).define("maxPrice2", ["cityDim2"], function(cityDim2){return(
cityDim2.group().reduceSum(d => d.gain)
)});
  return main;
}
