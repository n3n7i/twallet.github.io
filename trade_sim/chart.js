
//chart data
// var xurls = 'https://api.coingecko.com/api/v3/coins/solana/contract/'+starter_ca[1]+'/market_chart?vs_currency=usd&days=30'

//[1,2,3,4].reduce((x,y)=>Math.max(x, y))
//[1,2,3,4].reduce((x,y)=>Math.min(x, y))

//[1,2,3,4].reduce((x,y)=> x+y) / [1,2,3,4].length;

var canv;

var chart_init = false;


function initChart(){

  if (chart_init) return;

  chart_init = true;  
  canv = chart1.getContext("2d");
  
  }


async function fetchChartdata(mint1, timex = 30){

  var xurls = 'https://api.coingecko.com/api/v3/coins/solana/contract/'+mint1+'/market_chart?vs_currency=usd&days='+timex;
  
  var resp = await fetch(xurls);
  
  if (resp.ok){
  
    resp = await resp.json();
    
    return resp.prices.map(x=>x[1]);}
  
  return [];

  }

  

function mapY(i, H){

  return (1-i)*H;
  }
  
function mapX(j, l, W){

  return (j/l)*W;
  }




function chartData(d){

  var dhigh = d.reduce((x,y)=>Math.max(x, y));

  var dlow = d.reduce((x,y)=>Math.min(x, y));
  
  var dmap = d.map(x => (x-dlow) / (dhigh-dlow));
  
//  console.log(dmap);
  
  var n = d.length;
  
  canv.beginPath();
  
  canv.moveTo(mapX(0,n, 400), mapY(dmap[0], 200));
  
  for (var i=1;i<n; i++){
  
    canv.lineTo(mapX(i,n, 400), mapY(dmap[i], 200));
    
//    console.log(mapX(i,n, 400), mapY(dmap[i], 200));
  
    }
 
  canv.stroke();
  
  canv.fillText("high:"+dhigh, 20,10);

  canv.fillText("low:"+dlow, 20,200);
  
  }
    
    
function clearChart(){

  canv.clearRect(0,0,400,200);
  }
  


async function fetchchart_draw(mint, period){

  var p = await fetchChartdata(mint, period);
  
  initChart();
  clearChart();

  chartData(p);

}
