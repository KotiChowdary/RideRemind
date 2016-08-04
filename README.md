Application : Ride Reminder App For Uber Users
Technologies Used : HTML5, CSS3, JQUERY, JQUERY AJAX

APIS USED :

Google API - To fetch the distance between source and destination.
Uber API - To fetch the data regarding the cabs near by and time they will reach to user location.
MailChimp API - To send mail to the users email.

What does the application do?

It is useful to create the ride reminder for the users who are planning to leave to some destination place. It will intimate the users regarding the time they should leave to reach the destination place at scheduled time.

Requirements:

Source - When the user start filling the source place autocomplete is enabled, user should choose place from the displayed places.
Destination :When the user start filling the destination place autocomplete is enabled, user should choose place from the displayed places.
Departure Time : When the webpage is loaded the current time is fetched and displayed in the dept. time field. User can adjust the time by incrementing the field. Time cannot be set less than current time.
Email Id: Users Email used to send mail at specific time.

How the Application Works?

When the user click the Remind Me Button, the source and destination is fetched form the corresponding fields and directions are displayed on the map, the distance,duration is caluculated and displayed on the webpage, the estimate time for the UberGO cab to reach the user location is caluculated.

How to know when the ride remainder sholud sent to the users mail?

I have designed an algorithm to caluculate the time at wich we have to send the ride remainder email to the user mail.

If we are requesting the google and uber API's for response regularly it is not optimistic when the difference between the current time and departure time is more. So, inorder to overcome it I have designed this alogorithm, it request the API's depending on the Time difference to reach the destination.

Explanation using Example:

Assume for first request :

Source : Koramangala
Destination : Electronic City
Current Time : 12:00PM
Departure Time : 18:00PM
Time Difference to reach destination : 6hours = 360min (Departure Time - Current Time)
Distance : 14 kms
Duration : 30min
UbercabEstimationTime : 10min
Remaning Time to send Ride Remaninder : TimeDifference - (Duration+UbercabEstimationTime) = 360-(30+10) = 320min

Now I will set the timer value to =(Remaning Time to send Ride Remaninder)/(Duration+UbercabEstimationTime) = round(320/40) = 8min

So, I will send request to Uber And Google Map API's after 8 min.

Assume for second request,

Source : Koramangala
Destination : Electronic City
Current Time : 12:08PM
Departure Time : 18:00PM
Time Difference to reach destination : 5hours 52min = 352min (Departure Time - Current Time)
Distance : 14 kms
Duration : 30min
UbercabEstimationTime : 10min
Remaning Time to send Ride Remaninder : TimeDifference - (Duration+UbercabEstimationTime) = 352-(30+10) = 312min

Now I will set the timer value to =(Remaning Time to send Ride Remaninder)/(Duration+UbercabEstimationTime) = round(352/40) = 7min

So, I will send request to Uber And Google Map API's after 7 min.

Assume request sent after 3 hours

Source : Koramangala
Destination : Electronic City
Current Time : 03:00PM
Departure Time : 18:00PM
Time Difference to reach destination : 3hours = 180min (Departure Time - Current Time)
Distance : 14 kms
Duration : 30min
UbercabEstimationTime : 10min
Remaning Time to send Ride Remaninder : TimeDifference - (Duration+UbercabEstimationTime) = 180-(30+10) = 140min

Now I will set the timer value to =(Remaning Time to send Ride Remaninder)/(Duration+UbercabEstimationTime) = round(140/40) = 3min

So, I will send request to Uber And Google Map API's after 3 min.

So, as the time difference decreases, the the time to make requests to API's decreases.



