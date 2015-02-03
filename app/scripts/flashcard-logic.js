(function(){ 

var fs = {
	'availMods' : {},  //contents of config file.
	'selectedMod' : '', //selects first mod.
	'availSub' : '', //lists availiable submods.
	'mode' : '',  //lists selected option Practice or test.
	'chosenSub' : '',  //selected substring.
	'cards' : {},  //contents of selected submod.
	'tempCard' : '', //holds temporary card.
	'answer' : '', //holds answer to check against input
	'props': [], //holds list of properties
	'userInput' : '', //holds user input
	'tempRand' : 0, //holds temp random number
	'correct' : 0,  //holds correct count
	'incorrect' : 0,  //holds incorrect count -- test only.
	'missed': {},  //holds array of 'missed' cards
	'guessed': {}  //holds array of 'guessed' cards
};

fs.init = function (){ //initializes required functions
	fs.setAvail();
	fs.selectMod();
	fs.setTest();
	fs.checkInput(); 
};

fs.setAvail = function(){  //loads config &  populates select box.
	
	var xmlhttp;
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
	  }
	xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState===4 && xmlhttp.status===200)
	    {
	    	var resp = xmlhttp.responseText;
			var update = JSON.parse(resp);
			fs.availMods = update;

			if(fs.availMods.mods.length !== 0){
				fs.selectedMod = fs.availMods.mods[0];
			}

			var doc = document.getElementById('selectMod');
			var select = '<option value="" disabled selected style="display:none;">Please Select</option>';
			for (var i = 0; i <= fs.availMods.mods.length - 1; i++) {
				select += '<option value="' + fs.availMods.mods[i].toString() + '">' + fs.availMods.mods[i].toString() + '</option>';
			}
			doc.innerHTML = select;
			fs.subSelect();
	    }
	  };
	xmlhttp.open('get','scripts/config.json',true);
	xmlhttp.send();

};

fs.selectMod = function(){  //gets user input for selected Module.

	var doc = document.getElementById('selectMod');
	doc.onchange = function(){
		fs.selectedMod = doc.options[doc.selectedIndex].value; //repeated fix this....

		fs.subSelect();
};

fs.subSelect = function(){ //gets user input for submodule
	var xmlhttp;
		var openFile = 'scripts/' + fs.selectedMod;

		if (window.XMLHttpRequest)
		  {// code for IE7+, Firefox, Chrome, Opera, Safari
		  xmlhttp=new XMLHttpRequest();
		  }
		else
		  {// code for IE6, IE5
		  xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
		  }
		xmlhttp.onreadystatechange=function()
		  {

		  	document.getElementById('subMod').innerHTML = '';
		  if (xmlhttp.readyState===4 && xmlhttp.status===200){	

		    
		    	var resp = xmlhttp.responseText;
				var update = JSON.parse(resp);
				fs.availSub = update;
				 //good to here...

				var select = '<select name="submod" class="btn btn-default" id="selectSubMod">' + '<option value="" disabled selected style="display:none;">Please Select</option>';


				for (var prop in fs.availSub.submods){
					select += '<option value="' + prop + '">' + prop + '</option>';
				}
				select += '</select><br><br>';
				document.getElementById('subMod').innerHTML = select;
		    }
		  };

		xmlhttp.open('get', openFile, true);
		xmlhttp.send();
		}; 
};

fs.setTest = function(){//sets the test variables  //
	document.getElementById('setTest').onclick = function(){
		
		var doc = document.getElementById('selectSubMod');

		if(doc !== null || doc !== undefined){
		fs.chosenSub = doc.options[doc.selectedIndex].value; 
		} else {fs.chosenSub = false;}

		var checked = '';  
		if(document.getElementById('flip').checked === true){
			checked += 'flip';
		} else if (document.getElementById('practice').checked === true){
			checked += 'practice';
		} else if(document.getElementById('test').checked === true){
			checked += 'test';
		}

		fs.mode = checked;
		fs.clearSettings();

	}; 

};

fs.clearSettings = function(){//reset to factory defaults otherwise unpredictable results!
		fs.correct = 0;  
		fs.incorrect = 0;
		fs.missed = {};
		fs.guessed = {};
		fs.props = [];
		fs.cards = {};
		document.getElementById('userInput').value = '';

		fs.setFlip();  //sets or clears flip click function
		fs.loadCards(); //clears settins to prevent unintended bugs
};

fs.loadCards = function(){//loads up the selected subdeck of cards.
	if(fs.chosenSub === false){
		document.getElementById('cardDisplay').innerHTML = '<p> Ooops! There appears to be an error.  <b><u>' + fs.selectedMod + '</u></b> was selected, but no sub-module was loaded. Please select a sub-module from the second drop down list.  If there is no second drop down list, please contact the module\'s creator for help.</p>';
	}

	fs.cards = fs.availSub.submods[fs.chosenSub];
	
	for(var prop in fs.cards){ 
		fs.props.push(prop.toString());
	}

	if (fs.mode === 'flip'){  //shows & hides 'no-flip' div based on fs.mode.
		document.getElementById('no-flip').style.display = 'none';
	} else {
		document.getElementById('no-flip').style.display = 'block';

	}

	fs.showCard(); 
};

fs.showCard = function(){ //shows the card in the browser  

	if(fs.mode === 'test' || fs.mode === 'practice'){  //resets 'no-flip' for practice & test mode.
		document.getElementById('inputColor').className = 'form-group has-feedback';
		document.getElementById('glyphSpan').className = 'glyphicon form-control-feedback';
	} 

	fs.tempRand = Math.floor(Math.random() * fs.props.length); //generate random number

	fs.tempCard = fs.cards[fs.props[fs.tempRand]];


	if(fs.props[fs.tempRand][0] === '&'){  //checks to see if prop starts with & as a code check.
		fs.answer = '<' + fs.props[fs.tempRand].slice(4,-4) + '>'; 
	} else {
		fs.answer = fs.props[fs.tempRand];
	}

	document.getElementById('cardDisplay').innerHTML = '<h2>' + fs.tempCard + '</h2>';

};

fs.setFlip = function(){ //sets or clears flip function based on fs.mode
	var doc = document.getElementById('cardBox');
	var span = document.getElementById('cardDisplay');

	if(fs.mode === 'flip'){
		doc.onclick = function(){

			var propsCheck = '<h2>' + fs.props[fs.tempRand] + '</h2>';

			 if(span.innerHTML === propsCheck){
				fs.props.splice(fs.tempRand, 1);

				if(fs.props.length === 0){
					fs.showResults();
				} else { 
					fs.showCard();
				}
						
			} else if (fs.props.length !== 0){
				span.innerHTML = '<h2>' + fs.props[fs.tempRand] + '</h2>';
			}
		};
	} else {
		doc.onclick = null;
	} 
};

fs.verifyInput = function(){//contains the code that checks user input
		var user = document.getElementById('userInput');

		if(fs.props.length === 0){  //checks to see if fs.props has content.  If no content exit function.
			return;
		}

		fs.userInput = user.value;
		
		if(fs.userInput === fs.answer){
		document.getElementById('inputColor').className = 'form-group has-success has-feedback';
		document.getElementById('glyphSpan').className = 'glyphicon glyphicon-ok form-control-feedback';

			fs.correct += 1; //add 1 to correct count.
			fs.guessed[fs.props[fs.tempRand]] = fs.cards[fs.props[fs.tempRand]]; //add prop to guessed 
			fs.props.splice(fs.tempRand, 1); //remove from fs.props array since no longer needed. 

		} else {

		document.getElementById('inputColor').className = 'form-group has-error has-feedback';
		document.getElementById('glyphSpan').className = 'glyphicon glyphicon-remove form-control-feedback';
		
			if(fs.mode === 'test'){
				fs.incorrect += 1;
				fs.missed[fs.props[fs.tempRand]] = fs.cards[fs.props[fs.tempRand]];  
				fs.props.splice(fs.tempRand, 1);
			}
		}

			var next = function(){ //allows visual for user feedback
				setTimeout(function(){ 
					user.value='';

					if(fs.props.length > 0){
						fs.showCard();
					} else {
						fs.showResults();
					}
				},1500);
			};

			if(fs.mode === 'practice' && fs.userInput !== fs.answer){
				document.getElementById('cardDisplay').innerHTML =  '<h2>' + fs.tempCard + '</h2><br><p>' + fs.props[fs.tempRand] + '</p>';
				next();
			} else {
				next();
			}


};

fs.checkInput = function(){  //contains the events to trigger checking user input...
	var doc = document.getElementById('check');
	doc.onclick=function(){
		fs.verifyInput();
	};

	document.getElementById('userInput').onkeypress = function(e){
		if(e.which === 13 || e.keyCode === 13){
			fs.verifyInput();
		}
	};

};

fs.showResults = function(){  //displays the results at the end of test or practice mode.
	var doc = document.getElementById('cardDisplay');
	document.getElementById('no-flip').style.display = 'none';

	if(fs.mode === 'test'){
		var temp = '<ol>';
		for(var prop in fs.missed){
			temp += '<li>' + prop + ' : ' + fs.missed[prop] + '</li>';
		}
		temp += '</ol>';

		doc.innerHTML = '<h2>Test Mode Results:' + fs.correct + '/' + (fs.correct + fs.incorrect) + ' correct</h2>' + temp;

	} else if (fs.mode === 'practice'){
		doc.innerHTML = '<p>Practice deck completed!  Please use the Select Options menu to select a new deck</p>';
	} else if (fs.mode === 'flip'){
		doc.innerHTML = '<p>All cards reviewed!  Please use the Select Options menu to select a new deck</p>';
	}


	//.innerHTML = 'No more cards. number correct = ' + fs.correct + ' . Number incorrect = ' + fs.incorrect + ' .';
};


fs.init(); //triggers fs.init() to run.

}());