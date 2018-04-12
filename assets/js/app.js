// Configure Firebase
var config = {
  apiKey: "AIzaSyB4v2RN26j85m5k6zALkX-s9VdY1ndIzJ8",
  authDomain: "bart-trainscheduler.firebaseapp.com",
  databaseURL: "https://bart-trainscheduler.firebaseio.com",
  projectId: "bart-trainscheduler",
  storageBucket: "",
  messagingSenderId: "475011439667"
};
  firebase.initializeApp(config);

//Installize Firebase
var database = firebase.database();

// Display current time on jumbotron
function displayClock() {
  var clock = moment().format("h:mm:ss a");
  var c = $("<h1>");
  var c2 = c.append(clock);
  $("#clock").html(c2);
};  setInterval(displayClock, 1000);

// Variables
var trainName, destination, firstTrainTime, frequency = 0;

// New train button
$("#addTrainBtn").on("click", add);
    function add (){event.preventDefault()

// Creates/pushes newTrain object from input values 
var newTrain = {
  trainName: $("#trainName").val(),
  destination: $("#destination").val(),
  firstTrainTime: $("#firstTrainTime").val(),
  frequency: $("#frequency").val()
};
  database.ref().push(newTrain);
};
    

// Child added
database.ref().on("child_added", function(snapshot){
    var trainObj = snapshot.val()
    
    // Calculating minutesAway
    var firstTimeConverted = moment(trainObj.firstTrainTime, "HH:mm").subtract(1, "years");
    // Current Time
    var currentTime = moment();
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // Time apart 
    var remainder = diffTime % trainObj.frequency;
    // Minute Until Train
    var minutesAway = trainObj.frequency - remainder;
    // Next Arrival
    var nextArrival = moment().add(minutesAway, "minutes");
    nextArrival = moment(nextArrival).format("hh:mm")

// Create train rows from input
var trainRow = "<tr>" + 
    "<td>" + snapshot.val().trainName + "</td>" +
    "<td>" + snapshot.val().firstTrainTime + "</td>" +
    "<td>" + snapshot.val().destination + "</td>" +
    "<td>" + snapshot.val().frequency + "</td>" +
    "<td>" + nextArrival + "</td>" +
    "<td>" + minutesAway + "</td>" +


    "</tr>";    

// Display rows
    $("#trainContainer").append(trainRow);   

// Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
