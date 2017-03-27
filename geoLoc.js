/* geoLoc variables */
    var debug=false;
	var pageEnCours = "intro";
    var ref = 0;
    previous =[0,0];
    var allText= undefined;
    
var jbleba = [
[ 3.0728614,50.6211474], 
[ 3.0730739,50.6212086], 
[3.0732114,50.6210172], 
[ 3.0729861,50.6209568] 
];
var lamaison = [
[3.0726629,50.621101], 
[3.0728533,50.6211499], 
[3.0729807,50.6209547], 
[3.0727668,50.6209117] 
];
var iej = [
[3.072459,50.6210546], 
[3.0726562,50.6210993], 
[3.0727635,50.62091], 
[3.0725442,50.6208657] 
];
/* additional functions */
function build_text(result){
    eval(result);
    to_html = texte.replace(/\[(\/?[a-z0-9]*\/?)\/?\]/gi, "<$1>");
    alert(titre);
    document.getElementById("title").innerHTML = titre;
    document.getElementById("content").innerHTML = to_html;
}
function load_d1(){
	pageEnCours = "d1";
    alert(pageEnCours);
    read_infos_text("craie");
    document.getElementById('left_bttn').style.visibility = "hidden";
    document.getElementById('right_bttn').onclick = function () { load_d2() };
}
function load_d2(){
	pageEnCours = "d2";
    alert(pageEnCours);
    read_infos_text("exploitation");
    document.getElementById('left_bttn').style.visibility = "visible";
    document.getElementById('left_bttn').onclick = function () { load_d1() };
    document.getElementById('right_bttn').onclick = function () { load_d3() };
}
function load_d3(){
	pageEnCours = "d3";
    read_infos_text("chateau");
    document.getElementById('right_bttn').style.visibility = "hidden";
    document.getElementById('left_bttn').onclick = function () { load_d2() };
}
function errorCallback(error){
    switch(error.code){
        case error.PERMISSION_DENIED:
            alert("L'utilisateur n'a pas autorisé l'accès à sa position");
            break;          
        case error.POSITION_UNAVAILABLE:
            alert("L'emplacement de l'utilisateur n'a pas pu être déterminé");
            break;
        case error.TIMEOUT:
            alert("Le service n'a pas répondu à temps");
            break;
        }
};
function stopWatch(){
    navigator.geolocation.clearWatch(watchId);
} 
function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

function read_infos_text (path) 
	{
        var allText = undefined;
        alert(path);
        var txtFile = new XMLHttpRequest();
		var date = Date.now();
		txtFile.open("GET", path + ".txt?t=" + date, true);
		txtFile.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
		
		txtFile.onreadystatechange = function()
		{
		  if (txtFile.readyState === 4) {  // document is ready to parse.
			if (txtFile.status === 200) {  // file is found
			  allText = txtFile.responseText;
			  build_text(allText);
			}
		  }
		}
		txtFile.send(null);
	}
/* geolocation main function*/
function successCallback(position){
    //alert("Latitude : " + position.coords.latitude + ", longitude : " + position.coords.longitude);
	ref++;
    var lat = position.coords.latitude;
    var longi = position.coords.longitude;
    /*
    // si on veut couper dans les decimales des coords, parce que c'est illisible tout ces chiffres gps
    var variableLa = position.coords.latitude*1000;
    var dizainesLa =  Math.floor(((variableLa%100)/10)*1000);
    var variableLo = position.coords.longitude*1000;
    var dizainesLo =  Math.floor(((variableLo%100)/10)*1000);
    //var unites = variable%10;
    //document.write("La: "+ dizainesLa +"<br>");
    //document.write("Lo: "+ dizainesLo +"<br><br>");
    */	
    // efface tout, affiche le nouveau gps
    document.getElementById('log').innerHTML = "ref: "+ ref;
    //affiche les coords
    document.getElementById('log').innerHTML += "<br>"+ lat+"<br>";
    document.getElementById('log').innerHTML += longi +"<br>";

    if (previous[0] != lat && previous[1] != longi) {
        if ( inside([longi, lat], jbleba))
        {
            document.getElementById('log').innerHTML += "t'es a JBlebas mec ";
            if (pageEnCours !="d1")	load_d1();
        }
        else if ( inside([longi, lat], lamaison))
        {
            document.getElementById('log').innerHTML += "t'es a la maison mec ";
            if (pageEnCours !="d2")	load_d2();
        }
        else if ( inside([longi, lat], iej))
        {
            document.getElementById('log').innerHTML += "t'es a l'iej mec ";
            if (pageEnCours !="d3")	load_d3();
        }
        else {
            if (pageEnCours !="d1")	{ load_d1(); }
            document.getElementById('log').innerHTML += "t'es perdu mec ! ";
        }
        previous =[lat,longi];
    }
    else{  document.getElementById('log').innerHTML += "t'as pas bougé, buddy ! "; }

}; 