var map,directionsService,directionsDisplay,sourceMarker=null,destinationMarker=null,destinationinfoWindow,sourceinfowindow,source,destination,timer=60000,
    uberGoTimeEstimate=0,duration=0,setinterval;

$(document).ready(function(){
	
   $('#duration,#distance').hide();
   
   setInterval(function(){
       if($('#source').val().length!=0&$('#destination').val().length!=0&$('#email').val().length!=0){
           $('#submit').removeAttr('disabled');
       }
   },1000);
   
   initMap();
   
   var options = {
                      
		   componentRestrictions: {country: "in"}

                 };
   var source = document.getElementById('source');

   var destination = document.getElementById('destination');

   var autocomplete_source = new google.maps.places.Autocomplete(source,options);
   google.maps.event.addListener(autocomplete_source, 'place_changed', function() {
         var place = autocomplete_source.getPlace();
         document.getElementById('source').value = place.geometry.location.lat()+","+place.geometry.location.lng();
   });

   var autocomplete_destination = new google.maps.places.Autocomplete(destination,options);
   google.maps.event.addListener(autocomplete_destination, 'place_changed', function() {
         var place = autocomplete_destination.getPlace();
         document.getElementById('destination').value = place.geometry.location.lat()+","+place.geometry.location.lng();
   });
   
   setcurrentTime();

});

function setcurrentTime(){
   
   var d =  new Date();
  
   var currTime = addZero(d.getHours())+":"+addZero(d.getMinutes());

   document.getElementById('time').setAttribute("value",currTime);

   document.getElementById('time').setAttribute("min",d.getHours()+":00");
   
   return currTime;
}


function addZero(i) {

 if (i < 10) {

   i = "0" + i;

 }

 return i;

}

function initMap(){
  var currentLocation;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  
  if(navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(function(position){
	currentLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        var mapProperties = {
            center: currentLocation,
            zoom:15,
	    draggable:true,
	    disableDefaultUI:false,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        };
        map=new google.maps.Map(document.getElementById("map_container"),mapProperties);
        var marker = new google.maps.Marker({ 
                   position:currentLocation,
	           animation:google.maps.Animation.BOUNCE,
        });
        marker.setMap(map);
        var infoWindow = new google.maps.InfoWindow({
	       content:"Your Location"
        });
        infoWindow.open(map,marker);
    },function(){
	    alert("Browser Do Not Support GeoLocation Feature");
      });
  }
}


function caluculateDistance(source,destination){

  if(sourceMarker!=null){
    sourceMarker.setMap(null);
  }

  if(destinationMarker!=null){
    destinationMarker.setMap(null);
  }

  var latlng = source.split(",");
  sourceMarker = new google.maps.Marker({ 
    position:new google.maps.LatLng(latlng[0],latlng[1])
  });

  latlng = destination.split(",");

  destinationMarker = new google.maps.Marker({ 
    position:new google.maps.LatLng(latlng[0],latlng[1])
  });
  sourceMarker.setMap(map);
  destinationMarker.setMap(map);
  sourceinfoWindow = new google.maps.InfoWindow({
	content:"Source"
  });
  destinationinfoWindow = new google.maps.InfoWindow({
	content:"Destination"
  });
  sourceinfoWindow.open(map,sourceMarker);
  destinationinfoWindow.open(map,destinationMarker);

  map.setZoom(12);
  map.setCenter(sourceMarker.getPosition());

  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
  {
    origins: [source],
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
    avoidHighways: false,
    avoidTolls: false
  }, callback);

  function callback(response, status) {
  if (status == google.maps.DistanceMatrixStatus.OK) 
  {
        $('.response_container .container').append("<h6><li>Status Code : <b>"+google.maps.DistanceMatrixStatus.OK+"</b> Got Response From <b>Google API</b> at <b>"
        +addZero(new Date().getHours())+" : "+addZero(new Date().getMinutes())+"</b></li></h6>");
	$('#distance').text("Distance : "+response.rows[0].elements[0].distance.text);
			
        $('#duration').text("Duration : "+response.rows[0].elements[0].duration.text);
			
	$('#distance,#duration').slideDown("slow");
        
        var data = response.rows[0].elements[0].duration.text.split(" ");
        
        duration = parseInt(data[0].trim());
        
        latlng = source.split(",");
        
        getTimeEstimates(latlng[0],latlng[1]);
  }

  else {
           
         console.log("Error :"+status);

       }
  }  
}

function directionsdisplayonMap(){
	source = $('#source').val();
        destination = $('#destination').val();
	directionsDisplay.setMap(map);
	directionsService.route({
          origin: source,
          destination: destination,
          travelMode: 'DRIVING'
        }, function(response, status) {
             if (status === 'OK') {
                directionsDisplay.setDirections(response);
                
                caluculateDistance(source,destination);
                
                setinterval = setInterval(function(){
                                  settimer();
                              },timer);
                 
             } 
             else {
               window.alert('Directions request failed due to ' + status);
             }
        });
}

function getTimeEstimates(latitude,longitude){
  $.ajax({
    url: "https://api.uber.com/v1/estimates/time",
    headers: {
        Authorization: "Token BPehDhjfmMaomcn2ZbnWuyaqRzrZoTS1ezAMlZs1"
    },
    data: {
        start_latitude: latitude,
        start_longitude:longitude
    },
    success: function(result) {
        $('.response_container .container').append("<h6><li>Status Code :<b> 200 OK </b> Got Response From <b>UBER API</b> at <b>"
        +addZero(new Date().getHours())+" : "+addZero(new Date().getMinutes())+ "</b></li></h6>");
        var listofcabs = result["times"];
        var html ="";
        for(var i=0;i<listofcabs.length;i++){
            html += "<tr class=\"success\">\n"+
                    "<td>"+listofcabs[i].display_name+"</td>\n"+
                    "<td>"+(listofcabs[i].estimate)/60+" mins</td>\n"+
                    "</tr>";
            if(listofcabs[i].display_name == "uberGO"){
                uberGoTimeEstimate = listofcabs[i].estimate;
            }
        }
        $(".cab_datacontainer").html(html);
        console.log(result);
    }
  });  
}

function settimer(){
    var d = new Date();
    var destinationreachTime = $('#time').val();
    var data = destinationreachTime.split(":");
    var currdeptTime = new Date(d.getFullYear(),d.getMonth(),d.getDate(),data[0],data[1]);
    var timedifference = Math.round((currdeptTime.getTime() - d.getTime()));
    var remainingTime = (timedifference)-((duration*60*1000)+(uberGoTimeEstimate*1000));
    //window.alert("Time remain : "+remainingTime);
    if(timedifference > ((duration*60*1000)+(uberGoTimeEstimate*1000))){
         timer = Math.round((remainingTime)/((duration*60*1000)+(uberGoTimeEstimate*1000)));
               if(timer==0){
                timer=1;
               }
                timer = timer*1000*100;
               // window.alert(timer);
                clearInterval(setinterval);
                setinterval = setInterval(function()
                              { 
                                caluculateDistance(source,destination); 
                           
                                settimer();
                   
                              }, timer);
    }
    else{
        
        clearInterval(setinterval);
        sendEmail();
        window.alert("Remainder Sent To The Mail"+new Date());
    }
}

function sendEmail(){
     var recepientemail = $('#email').val();
     $.ajax({
           type: 'POST',
           url: 'https://mandrillapp.com/api/1.0/messages/send.json',
           data: {
                key: '2216d84d54a3d9aea3554810ab8ce379-us1',
                message:{
                    from_email: 'myteknikmay12@gmail.com',
                    to: [
                          {
                              email: recepientemail,
                              name: 'KotiChowdary',
                              to: 'to',
                              html:'<h5>Time to bbok the Cab</h5>'
                          }
                        ],
                   autotext: 'true',
                   subject: 'YOUR SUBJECT HERE!',
                   html: 'YOUR EMAIL CONTENT HERE! YOU CAN USE HTML!'
                }
           }
     }).done(function(response) {
            console.log(response); // if you're into that sorta thing
        });
}