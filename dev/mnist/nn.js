
function param_init(x,y){

  var p = {};

  p.layers = 2;

  p.layer = [];

  p.layer[0] = x; //[200, 50];

  p.layer[1] = y; //[50, 10];

  p.w1 = matrix_init(p.layer[0][0], p.layer[0][1]);

  p.w2 = matrix_init(p.layer[1][0], p.layer[1][1]);

  matrix_random(p.w1, 0.2, -0.1);

  matrix_random(p.w2, 0.2, -0.1);

  return p;

  }


function data_init(x,y){

  var d = {};

  d.inp = matrix_init(x[0], x[1]);

  d.targ = matrix_init(y[0], y[1]);

  matrix_random(d.inp);

  matrix_random(d.targ);

  return d;

  }



function matrix_init(a,b){

  var m = new Float32Array(a*b);

  var mobj = {val: m, size: [a,b], stride: [b, 1]};

  return mobj;

  }

function matrix_random(m1, xscale=1, xoffset=0){

  var m = m1.size[0] * m1.size[1];

  for (var i=0; i<m; i++){ m1.val[i] = Math.random() * xscale + xoffset;}

  }


function matrix_sum(m1){

  var m = m1.size[0] * m1.size[1];

  var n=0;

  for (var i=0; i<m; i++){ n+= m1.val[i]; }

  return n;

  }


function matrix_squaremean(m1){

  var m = m1.size[0] * m1.size[1];

  var n=0;

  for (var i=0; i<m; i++){ n+= (m1.val[i]**2) * (1/m); }

  return n;

  }


/*

function matrix_mult(m1, m2, t){

  console.log(m1.size, " x", m2.size);

//  console.log("output shape expected", m1.size[0], " x", m2.size[1], "!!");

  stride_Mode(m1, t[0]);

  stride_Mode(m2, t[1]+1);

  var n1 = m1.size;

  var n2 = m2.size;

  var s1 = n1[1]; //m1.stride[1];

  var s2 = m2.stride[1];

  var s1b = 1; //n1[0]; //m1.stride[0];

  var s2b = m2.stride[0];


  if ((s1b ==1) & (s2b==1)){

    console.log("Normal mode!");

    if (n1[1] != n2[0]){ console.log("size err: matmul?", n1, n2);} // return; }

    }

  if ((s1 ==1) || (s2==1)){

    console.log("Transposed modes!!");

    if (s1==1) n1 = [m1.size[1], m1.size[0]];

    if (s2==1) n2 = [m2.size[1], m2.size[0]];

    if (n1[1] != n2[0]){ console.log("size err: matmul?", n1[1], n2[0]);}

    }

  var m3 = matrix_init(n1[0], n2[1]);

//  console.log("output (Real:)", m3.size);

  console.log("loop checks?", n1, n2);

  console.log("stride checks?", m1.stride, m2.stride);

  var s3 = m3.stride[1];

  var maxi1 = n1[0]*n1[1];

  var maxi2 = n2[0]*n2[1];

  for (var i=0; i<n1[0]; i++){

    for (var j=0; j<n2[1]; j++){

      var xtemp = 0;

      for (var k=0; k<n1[1]; k++){

        if ((i*s1 + k*s1b) >= maxi1) console.log("mat1 Index Err!");

        if ((j*s2 + k*s2b) >= maxi2) console.log("mat2 Index Err!");

        xtemp += m1.val[i*s1 + k*s1b] * m2.val[j*s2 + k*s2b];

//        console.log(xtemp);

        if (isNaN(xtemp)){

          console.log("NaNs occurred!");

          console.log("index ", i*s1 + k*s1b, j*s2 + k*s2b, ", iter", i, j, k, "loop ", n1[0], n2[1], n1[1]);

          console.log("stride ", s1, s1b, s2, s2b);

          return m3;}

//        console.log(i, j, k);

//        console.log(i*s1 + k, j*s2 + k, i*s3 +j);

        }

      m3.val[i*s3 +j] = xtemp;

      }

    }

  return m3;

  }



function matrix_multB(m1, m2, t){

  console.log(m1.size, " x", m2.size);

//  console.log("output shape expected", m1.size[0], " x", m2.size[1], "!!");

  stride_Mode(m1, t[0]);

  stride_Mode(m2, t[1]+1);

  var n1 = m1.size;

  var n2 = m2.size;

  var v1 = n1[0 + (t[0]%2) ];

  var v2 = n2[(1 + t[1])%2];

  var v3 = n1[(1 + t[0])%2 ];

  var v3b = n2[(0 + t[0])%2 ];

  console.log("v_seq:", v1, v2, v3, v3b);

  var s1 = m1.stride[1];

  var s2 = m2.stride[1];

  var s1b = m1.stride[0];

  var s2b = m2.stride[0];


  var m3 = matrix_init(v1, v2);

  console.log("output (Real:)", m3.size);

  console.log("loop checks?", n1, n2);

  console.log("stride checks?", m1.stride, m2.stride);

  var s3 = m3.size[1];

  var maxi1 = n1[0]*n1[1];

  var maxi2 = n2[0]*n2[1];

  for (var i=0; i<n1[0]; i++){

    for (var j=0; j<n2[1]; j++){

      var xtemp = 0;

      for (var k=0; k<n1[1]; k++){

        if ((i*s1 + k*s1b) >= maxi1) console.log("mat1 Index Err!");

        if ((j*s2 + k*s2b) >= maxi2) console.log("mat2 Index Err!");

        xtemp += m1.val[i*s1 + k*s1b] * m2.val[j*s2 + k*s2b];

        console.log("coords", i,k, i*s1, k*s1b, i*s1+ k*s1b);

        console.log("coordsB", j,k, j*s2, k*s2b, j*s2+ k*s2b);

//        console.log(xtemp);

        if (isNaN(xtemp)){

          console.log("NaNs occurred!");

          console.log("index ", i*s1 + k*s1b, j*s2 + k*s2b, ", iter", i, j, k, "loop ", n1[0], n2[1], n1[1]);

          console.log("stride ", s1, s1b, s2, s2b);

          return m3;}

//        console.log(i, j, k);

//        console.log(i*s1 + k, j*s2 + k, i*s3 +j);

        }

      m3.val[i*s3 +j] = xtemp;

      }

    }

  return m3;

  }






function transpose_stride(m1){

  if (m1.stride[0] == 1){

    m1.stride = [m1.size[1], 1];

    return; }

  m1.stride = [1, m1.size[0]];

  }

function stride_Mode(m1, c){

  if ((c%2)==0) m1.stride = [m1.size[1], 1];

  if ((c%2)==1) m1.stride = [1, m1.size[0]];

  }


*/

function matrix_sub(m1, m2){

  if (m1.size[0] != m2.size[0]){ console.log("size err: matsub"); return; }

  if (m1.size[1] != m2.size[1]){ console.log("size err: matsub"); return; }

  var m3 = matrix_init(m1.size[0], m1.size[1]);

  var nx = m1.size[0] * m1.size[1];

  for (var k=0; k<nx; k++){

    m3.val[k] = m1.val[k] - m2.val[k];}

  return m3;

  }


function matrix_add(m1, m2, scale=1){

  if (m1.size[0] != m2.size[0]){ console.log("size err: matsub"); return; }

  if (m1.size[1] != m2.size[1]){ console.log("size err: matsub"); return; }

  var m3 = matrix_init(m1.size[0], m1.size[1]);

  var nx = m1.size[0] * m1.size[1];

  for (var k=0; k<nx; k++){

    m3.val[k] = m1.val[k] + (m2.val[k] * scale);}

  return m3;

  }


/*
function network_step(xdata, model){

  var w1 = model.w1;

  var w2 = model.w2;

  var inp = xdata.inp;

  var targets = xdata.targ;


  console.log("layer1");
  var l1 = matrix_multB(inp, w1, [0,0]);
  console.log(l1.size);

  console.log("layer2");
  var l2 = matrix_multB(l1, w2, [0,0]);
  console.log(l2.size);

  console.log("resid");
  var resid = matrix_sub(l2, targets); // l2 - targets;
  console.log(resid.size);

  console.log("weight delta II");

  //transpose_stride(resid);
  //transpose_stride(l1);
  var w2_d = matrix_multB(l1, resid, [1,0]);
  console.log(w2_d.size);


  //transpose_stride(resid);
  console.log("layer delta");
  var l2_d = matrix_multB(w2, resid, [0,1]);
  console.log(l2_d.size);

  console.log("weight delta I");
  //transpose_stride(inp)
  //transpose_stride(l2_d);
  var w1_d = matrix_multB(l2_d, inp, [0,0]);
  console.log(w1_d.size);

  return [w1_d, w2_d];

  }


function net_tests(m1, m2){

  return matrix_mult(m1,m2, [0,0]);

  }

*/

function matrix_readout(m1, t){

  var n1 = m1.size[t];

  var n2 = m1.size[(t+1)%2];

  var s1 = n2; //m1.size[0];

  var s2 = n1; //m1.size[1];

  if (t==0) {s2=1;}
  if (t==1) {s1=1;}

  console.log(n1, n2, s1, s2);

  for(var i=0;i<n1;i++){
    for(var j=0;j<n2;j++){
      console.log(i*s1 + j*s2);
      }

    }

  }


function matrix_multC(m1, m2, t){

  var n1 = m1.size[t[0]];
  var n2 = m1.size[(t[0]+1)%2];
  var s1 = n2; //m1.size[0];
  var s2 = n1; //m1.size[1];

  if (t[0]==0) {s2=1;}
  if (t[0]==1) {s1=1;}


  var n1B = m2.size[t[1]];
  var n2B = m2.size[(t[1]+1)%2];
  var s1B = n2B; //m1.size[0];
  var s2B = n1B; //m1.size[1];

  if (t[1]==0) {s2B=1;}
  if (t[1]==1) {s1B=1;}

  var m3 = matrix_init(n1, n1B);

  //console.log("Shapes: ", m1.size, m2.size, t);
  //console.log("Loops: ", n1, n1B, n2, "=", n2B);
  //console.log("Strides: ", s1, s1B, s2, s2B);

  if (n2!= n2B){  console.log("Shape Error! (loop mismatch)", n2, n2B); }
  for (var i=0; i<n1; i++){

    for (var j=0; j<n1B; j++){

       //console.log("Matrix A:", i*s1 + (n2-1)*s2);
       //console.log("Matrix B:", j*s1B + (n2-1)*s2B);

      var tempx = 0;

      for (var k=0; k<n2; k++){

        //console.log("Matrix A:", i,k, (i*s1) + (k*s2));
        //console.log("Matrix B:", j,k, s1B, s2B, (j*s1B) + (k*s2B));

        tempx += m1.val[(i*s1) + (k*s2)] * m2.val[(j*s1B) + (k*s2B)];


        }

      m3.val[i*n1B + j] = tempx;

      }

    }

  return m3;
  }


function network_stepC(xdata, model){

  var w1 = model.w1;

  var w2 = model.w2;

  var inp = xdata.inp;

  var targets = xdata.targ;


  //console.log("layer1");
  var l1 = matrix_multC(inp, w1, [0,1]);
  //console.log(l1.size);

  //console.log("layer2");
  var l2 = matrix_multC(l1, w2, [0,1]);
  //console.log(l2.size);

  //console.log("resid");

  var l2s = matrix_Sigmoid(l2);
  var resid = matrix_sub(l2s, targets); // l2 - targets;
  //console.log(resid.size);

  var mse = matrix_squaremean(resid);

  console.log("mse: ", mse);

  //console.log("weight delta II");

  //transpose_stride(resid);
  //transpose_stride(l1);
  var w2_d = matrix_multC(l1, resid, [1,1]);
  //console.log(w2_d.size);


  //transpose_stride(resid);
  //console.log("layer delta II");
  var l2_d = matrix_multC(resid, w2, [0,0]);
  //console.log(l2_d.size);

  //console.log("weight delta I");
  //transpose_stride(inp)
  //transpose_stride(l2_d);
  var w1_d = matrix_multC(inp, l2_d, [1,1]);
  //console.log(w1_d.size);

  return [w1_d, w2_d];

  }

function elem_Sigmoid(x){
  return 1.0 / (1.0 + Math.E ** -x);
  }

function matrix_Sigmoid(m1){  
  var m2 = matrix_init(m1.size[0], m1.size[1]);
  var nx = m1.size[0] * m1.size[1];
  for (var k=0; k<nx; k++){
    m2.val[k] = elem_Sigmoid(m1.val[k]);
    }
  return m2;
  }

function matrix_Poly(m1, a, c){  
  var m2 = matrix_init(m1.size[0], m1.size[1]);
  var nx = m1.size[0] * m1.size[1];
  for (var k=0; k<nx; k++){
    m2.val[k] = m1.val[k] * a + c;
    }
  return m2;
  }



function network_runC(data, p, iters, alpha){

  for (var i=0; i<iters; i++){

    var xup = network_stepC(data, p);

    p.w1 = matrix_add(p.w1, xup[0], -alpha);

    p.w2 = matrix_add(p.w2, xup[1], -alpha);

    console.log("Step ", i);

    }

  return p;
  }




function network_predictC(xdata, model){

  var w1 = model.w1;

  var w2 = model.w2;

  var inp = xdata.inp;

  //var targets = xdata.targ;


  //console.log("layer1");
  var l1 = matrix_multC(inp, w1, [0,1]);
  //console.log(l1.size);

  //console.log("layer2");
  var l2 = matrix_multC(l1, w2, [0,1]);

  var l2s = matrix_Sigmoid(l2);
  //console.log(l2.size);

  return l2s;

  }


function hotDecode(mat, wid){

  m = mat.size;

  var r = [];

  for (var i=0; i<m[0]; i++){

    var maxid=-1; 
    var maxval=0; // 

    for (var j=0; j<m[1]; j++){

      var t=mat.val[i*m[1]+j];
      if (t>maxval){ maxval=t; maxid=j;}
      }

    r.push(maxid);
    }

  return r;
 
  }

