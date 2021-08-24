// https://observablehq.com/@ramirocampos/juntando-tudo-final@366
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Juntando Tudo Final`
)});
  main.variable(observer("viewof typeMaterial")).define("viewof typeMaterial", ["html"], function(html){return(
html`<select>
<option value=T5_LEATHER>T5_LEATHER
<option value=T5_LEATHER>T5_HIDE

<option value=T6_LEATHER>T6_LEATHER
<option value=T6_LEATHER>T6_HIDE

<option value=T7_LEATHER>T7_LEATHER
<option value=T7_LEATHER>T7_HIDE
</select>`
)});
  main.variable(observer("typeMaterial")).define("typeMaterial", ["Generators", "viewof typeMaterial"], (G, _) => G.input(_));
  main.variable(observer("buildvis")).define("buildvis", ["md","container","dc","cityDim","maxPrice","cityScale","colorScale","width","dateDim","xScale","avgPrice"], function(md,container,dc,cityDim,maxPrice,cityScale,colorScale,width,dateDim,xScale,avgPrice)
{
  let view = md`${container()}`;

  let lineChart = dc.seriesChart(view.querySelector("#time-chart"));
  let barChartMax = dc.barChart(view.querySelector("#bar-chart"));


  let lucroChart1 = dc.seriesChart(view.querySelector("#graf1"));
  let lucroChart2 = dc.seriesChart(view.querySelector("#graf2"));
  
  barChartMax // barChart
    .width(500)
    .height(400)
    .margins({ top: 10, right: 20, bottom: 20, left: 40 })
    .dimension(cityDim)
    .group(maxPrice)
    .gap(20)
    .x(cityScale)
    .centerBar(false)
    .renderHorizontalGridLines(true)
    .xUnits(dc.units.ordinal)
    .elasticY(true)
    .colors(colorScale)
    .colorAccessor((d) => d.key)
    
  
  lineChart //seriesChart
    .width(width)
    .height(500)
    .dimension(dateDim)
    .margins({ top: 30, right: 50, bottom: 25, left: 40 })
    .x(xScale)
    .legend(
      dc
        .legend()
        .x(width - 200)
        .y(10)
        .itemHeight(13)
        .gap(5)
    )
    .brushOn(false)
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
    .width(width)
    .height(500)
    .dimension(dateDim)
    .margins({ top: 30, right: 50, bottom: 25, left: 40 })
    .x(xScale)
    .legend(
      dc
        .legend()
        .x(width - 200)
        .y(10)
        .itemHeight(13)
        .gap(5)
    )
    .brushOn(false)
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

  
  lucroChart2 //lucroChart2
    .width(width)
    .height(500)
    .dimension(dateDim)
    .margins({ top: 30, right: 50, bottom: 25, left: 40 })
    .x(xScale)
    .legend(
      dc
        .legend()
        .x(width - 200)
        .y(10)
        .itemHeight(13)
        .gap(5)
    )
    .brushOn(false)
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
   circle.bindPopup(d[0] + "<br> Maior Preco: " + d[2] + "<br> Coordenadas: ("  + d[1][0] + ", "+ d[1][1] + ")")
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
          <div id='bar-chart'>
            <h5>Max Price by city</h5>
          </div>

        </div>
    </div>

    <div class = "row" >              
      <div id='time-chart' >
      <h5> Price Variation </h5>
      </div>
    </div>

    <div class = "row" >              
      <div id='graf1' >
      <h5> Gráfico 1 de Lucro </h5>
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
  main.variable(observer("datasetT5")).define("datasetT5", ["d3"], function(d3){return(
d3.json(
  "https://raw.githubusercontent.com/RamiroCampos/arquivosMiscelaneos/master/ArquivosFinais/T5_LEATHER.json"
).then(function(data) {
  let parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%S");
  data.forEach(function(d) {
    let max_price = d3.max(d.data,d => d.avg_price) 
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
)});
  main.variable(observer("datasetT6")).define("datasetT6", ["d3"], function(d3){return(
d3.json(
  "https://raw.githubusercontent.com/RamiroCampos/arquivosMiscelaneos/master/ArquivosFinais/T6_LEATHER.json"
).then(function(data) {
  let parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%S");
  data.forEach(function(d) {
    let max_price = d3.max(d.data,d => d.avg_price) 
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
)});
  main.variable(observer("datasetT7")).define("datasetT7", ["d3"], function(d3){return(
d3.json(
  "https://raw.githubusercontent.com/RamiroCampos/arquivosMiscelaneos/master/ArquivosFinais/T7_LEATHER.json"
).then(function(data) {
  let parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%S");
  data.forEach(function(d) {
    let max_price = d3.max(d.data,d => d.avg_price) 
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
)});
  main.variable(observer("choice")).define("choice", ["datasetT5","datasetT6","datasetT7"], function(datasetT5,datasetT6,datasetT7){return(
new Object({'T5_LEATHER': datasetT5, 'T6_LEATHER': datasetT6, 'T7_LEATHER': datasetT7})
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
  return main;
}
