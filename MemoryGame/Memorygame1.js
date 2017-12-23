PicturesAnimals = ['./images/1.jpg','./images/1.jpg','./images/2.jpg','./images/2.jpg','./images/3.jpg','./images/3.jpg','./images/4.jpg','./images/4.jpg','./images/5.jpg','./images/5.jpg','./images/6.jpg','./images/6.jpg'];
PicturesTravel = ['./images/7.jpg','./images/7.jpg','./images/8.jpg','./images/8.jpg','./images/9.jpg','./images/9.jpg','./images/10.jpg','./images/10.jpg','./images/11.jpg','./images/11.jpg','./images/12.jpg','./images/12.jpg'];
PicturesHollywood = ['./images/13.jpg','./images/13.jpg','./images/14.jpg','./images/14.jpg','./images/15.jpg','./images/15.jpg','./images/16.jpg','./images/16.jpg','./images/17.jpg','./images/17.jpg','./images/18.jpg','./images/18.jpg'];
PicturesBakery = ['./images/19.jpg','./images/19.jpg','./images/20.jpg','./images/20.jpg','./images/21.jpg','./images/21.jpg','./images/22.jpg','./images/22.jpg','./images/23.jpg','./images/23.jpg','./images/24.jpg','./images/24.jpg'];


///global variables 
var cardobject;
var myArrayofpictures;
var picture;
var mytime;
var score;
var count=0;
var numberofwrong;
var card1;
var card2;
var guess1;
var guess2;
var play=false;


function randomize(myarray) {
  var currentIndex = myarray.length;
  var memoryValue;
  var randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex --;

    memoryValue = myarray[currentIndex];
    myarray[currentIndex] = myarray[randomIndex];
    myarray[randomIndex] = memoryValue;
  }

  return myarray;
}


function attribute(newarray) {
	var match = {};
	for (var i = 0; i < newarray.length; i++) {
		var name = "card" + i;
		match[name] = newarray[i];
		match['clickable'] = true;

	}
	return match;

}

function choose(){
	var themevalue = document.getElementById('theme').value;

	if (themevalue=="Hollywood") {
		myArrayofpictures=PicturesHollywood;
	}
	else if (themevalue=="Travel") {
		myArrayofpictures=PicturesTravel;
	}
	else if (themevalue=="Bakery") {
		myArrayofpictures=PicturesBakery;
	}
	else {
		myArrayofpictures=PicturesAnimals;
	}
}


function go(){
	play = true;
	choose();
	var newarray = randomize(myArrayofpictures);
	cardobject = attribute(newarray);
	alert("Now you can play!!");
}

function resetgame(myArrayofpictures){
	var answer = confirm('Are you sure you want to reset the game ?');
	if (answer) {
		for (var i = 0; i < myArrayofpictures.length; i++) {
		document.getElementById('card'+i).style.backgroundImage = "url('./images/back2.jpg')";
		}
		clearInterval(mytime);
		document.getElementById('thetime').textContent = "0:0";
		document.getElementById('theguess').textContent = "0";
		cardobject={};
	}
}

function timer(){

	var minutes = 0;
	var seconds=0
	var condi;

	mytime = setInterval(function() {
		if (minutes<60) {
			seconds++;
				if (seconds>60) {
					minutes++;
					seconds=0;
		 		}
		 }

	document.getElementById('thetime').innerHTML = minutes + ":" + seconds;
	},1000);
}

function printguess (numberofwrong){
	document.getElementById('theguess').textContent = numberofwrong ; 
}

function change(e){
	var source = e.srcElement;
	var idsource = source.id;
	
	for (var prop in cardobject) {
		if (prop==idsource) {
			picture = cardobject[prop];
			source.style.backgroundImage = "url("+picture+")";
		}
	
	}

}

function deletepicture(guess2) {

	for (var prop in cardobject) {
		if (cardobject[prop]==guess2) {
				delete cardobject[prop];
		}
	}
}

function changeback(firstcard, secondcard) {
	firstcard.style.backgroundImage = "url('./images/back2.jpg')";
	secondcard.style.backgroundImage = "url('./images/back2.jpg')";
}


function checkwin (){
	if (score===6) {
		console.log("Congratulations");
		clearTimeout(mytime);
		setTimeout(function(){
			document.getElementById('myModal').style.display="block";
			document.getElementById('textinit').innerHTML = 'Congratulations !!!! It took you '+ document.getElementById('thetime').textContent+ ' minutes with '+numberofwrong+' wrong guess to figure it out.'
		},3000);

	}

}

function playgame(e){
	if (play) {

		if ((cardobject.hasOwnProperty(e.srcElement.id))&&(cardobject["clickable"]==true)) { //add eventlistener only relative to cards
			count++;

			if (count==1) { //guess1 
				card1=e.srcElement;
				change(e);
				guess1=picture;
			}

			else if((count==2)&&(card1.id==e.srcElement.id))  { //double click on the same card
				count = 1;
			}  
				
			else if ((count==2)&&(card1.id!=e.srcElement.id)) { //guess2 on a different card 
				change(e);
				cardobject["clickable"]=false;
				guess2= picture;
				card2=e.srcElement;

				if (guess1===guess2) { //same pictures and different cards
					console.log("good job!");
					score++;
					deletepicture(guess2);
					cardobject["clickable"]=true;

					if (score==6) {
						checkwin();
					}
				}

				else if(guess1!=guess2){ //different pictures and different cards
					console.log("too bad");
					numberofwrong++;
					printguess(numberofwrong);
					setTimeout(function() {
								changeback(card1,card2);
								cardobject["clickable"]=true;
							},1000);
					}
					count=0;  
			}    	
        }
    }
}


/// Event Listener on button Start :

document.getElementById('buttongo').addEventListener('click',function(){
	go();
	timer();
	score = 0;
	count = 0;
	numberofwrong = 0;

});

//Event Listener on button reset : 
document.getElementById('buttonreset').addEventListener('click',function(){resetgame(myArrayofpictures);})

///Event Listener on each card: 

var container = document.getElementById('containerCards');
container.addEventListener('click', function(e) {playgame(e);} );

//about the modal 

    // When the user clicks on <span> (x), close the modal
document.getElementsByClassName("close")[0].addEventListener('click',function() {
document.getElementById('myModal').style.display = "none";})

	//button new game

document.getElementById('mybutton').addEventListener('click',function(){location.reload();})
