var express = require('express');					
var MySQL = require('sync-mysql');
var app = express();								
app.use(express.urlencoded({extended:false}));      
app.use(express.json());                            

var connection = new MySQL({
  host: "helloworld.cklzhvgx6s17.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "opensesame",
  database: "tollschedule"
});

app.use(function(req, res, next){
    express.urlencoded({extended:false});
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

app.get('/Interchange', function(req,res){
	var enter = req.query.InterchangeOn;
    var exit = req.query.InterchangeOff;
    var paysss = req.query.Payment; 
    console.log ("Received request for toll from " + enter + " to " + exit + " paying with " + paysss);
    //console.log(enter);

    var interchange_cash = connection.query("SELECT toll FROM tollschedule.cashtollschedule WHERE interchangeEnter="+
    enter+ " AND interchangeExit="+exit);

    var interchange_ezpass = connection.query("SELECT toll FROM tollschedule.ezpasstollschedule WHERE interchangeEnter="+
    enter+ " AND interchangeExit="+exit);

    //var cash = interchange_cash[0]['toll'];
    //var pass = interchange_ezpass[0]['toll'];

    var long = connection.query("SELECT longitude FROM tollschedule.interchangeinfo WHERE interchange="+enter);
    var longsss = long[0]['longitude'];

    var lat = connection.query("SELECT latitude FROM tollschedule.interchangeinfo WHERE interchange="+enter);
    var latsss = lat[0]['latitude'];
    //console.log(longsss);
    //console.log(latsss);
    var long_2 = connection.query("SELECT longitude FROM tollschedule.interchangeinfo WHERE interchange="+exit);
    var longsss_2 = long_2[0]['longitude'];
    var lat_2 = connection.query("SELECT latitude FROM tollschedule.interchangeinfo WHERE interchange="+exit);
    var latsss_2 = lat_2[0]['latitude'];
    if (paysss == "Cash"){
        //var payment_method = ("The toll from " + enter + " to " + exit + " paying with cash is $"+cash);
        var final_toll = interchange_cash[0]['toll'];
    }
	else {
        //var payment_method = ("The toll from " + enter + " to " + exit + " paying with E-ZPass is $"+pass);
        var final_toll = interchange_ezpass[0]['toll'];
    } 
    //if (InterChangeOn == "320" || InterchangeOff == "320" || InterchangeOn == "340" || InterchangeOff == "340" || InterchangeOn == "352" || InterchangeOff == "352"){
       // var payment_method = ("The toll from " + enter + " to " + exit + " paying with E-ZPass is $"+pass);
   // }

    //console.log("hello")
//res.json(payment_method)
//var myObj = {"interchange_cash":cash, "interchange_ezpass":pass, "lat": lat, "long_2": long_2, "lat_2": lat_2, "paysss": paysss };
var myObj = {"enter" : enter, "exit": exit, "paysss" : paysss, "final_toll" : final_toll, "lat_1": latsss, "lat_2": latsss_2, "long_1": longsss, "long_2": longsss_2 }
console.log("Returning Entrance Interchange: " + enter + " Exit Interchange: " + exit + " Payment Method: "+ paysss + " Toll: "+ final_toll + 
" Entrance Latitude: "+ latsss + " Entrance Longitude: "+ longsss + " Exit Latitude: " + latsss_2 + " Exit Longitude: " + longsss_2);
res.json(myObj);

});
console.log("Listening on port 8080");
app.listen(8080);									