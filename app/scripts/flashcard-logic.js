var fs = {
	"availMods" : {},  //contents of config file.
	"selectedMod" : "", //selects first mod.
	"availSub" : "", //lists availiable submods.
	"mode" : "",  //lists selected option Practice or test.
	"chosenSub" : "",  //selected substring.
	"cards" : {},  //contents of selected submod.
	"tempCard" : "", //holds temporary card.
	"answer" : " ", //holds answer to check against input
	"props": [], //holds list of properties
	"userInput" : "", //holds user input
	"tempRand" : 0, //holds temp random number
	"correct" : 0,
	"incorrect" : 0,
	"missed": {},
	"guessed": {}
};

fs.setAvail = function(){  //loads config &  populates select box.
	var xmlhttp;
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
	    {
	    	var resp = xmlhttp.responseText;
			update = JSON.parse(resp);
			fs.availMods = update;

			if(fs.availMods.mods.length != 0){
				fs.selectedMod = fs.availMods.mods[0];
			};

			var doc = document.getElementById("selectMod");
			var select = "";
			for (var i = 0; i <= fs.availMods.mods.length - 1; i++) {
				select += "<option value='" + fs.availMods.mods[i].toString() + "'>" + fs.availMods.mods[i].toString() + "</option>";
			};
			doc.innerHTML = select;
			fs.subSelect();
	    };
	  };
	xmlhttp.open("get","scripts/config.json",true);
	xmlhttp.send();

};

fs.selectMod = function(){  //gets user input for selected Module.

	var doc = document.getElementById("selectMod");
	doc.onchange = function(){
		fs.selectedMod = doc.options[doc.selectedIndex].value; //repeated fix this....
		console.log(fs.selectedMod);

		fs.subSelect();
}

fs.subSelect = function(){
	var xmlhttp;
		var openFile = "scripts/" + fs.selectedMod;
		console.log(openFile);
		if (window.XMLHttpRequest)
		  {// code for IE7+, Firefox, Chrome, Opera, Safari
		  xmlhttp=new XMLHttpRequest();
		  }
		else
		  {// code for IE6, IE5
		  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		  }
		xmlhttp.onreadystatechange=function()
		  {

		  	document.getElementById("subMod").innerHTML = " ";
		  if (xmlhttp.readyState==4 && xmlhttp.status==200){	

		    
		    	var resp = xmlhttp.responseText;
				update = JSON.parse(resp);
				fs.availSub = update;
				 //good to here...

				var select = "<select name='submod' class='btn btn-default' id='selectSubMod'>";


				for (var prop in fs.availSub.submods){
					select += "<option value='" + prop + "'>" + prop + "</option>";
				}
				select += "</select> <p class='help-block'>use drop down list to change sub modules.</p><br>";
				document.getElementById("subMod").innerHTML = select;
		    }
		  }

		xmlhttp.open("get", openFile, true);
		xmlhttp.send();
		}
}

fs.setTest = function(){
	document.getElementById("setTest").onclick = function(e){
		
		var doc = document.getElementById("selectSubMod");

		if(doc != null || doc != undefined){
		fs.chosenSub = doc.options[doc.selectedIndex].value; 
		} else {fs.chosenSub = false;}

		var checked = "";
		if(document.getElementById("practice").checked == true){
			checked += "practice";
		} else if(document.getElementById("test").checked == true){
			checked += "test";
		}

		fs.mode = checked;
		fs.clearSettings();

	};

};

fs.clearSettings = function(){
		fs.correct = 0;
		fs.incorrect = 0;
		fs.missed = {};
		fs.guessed = {};
		fs.props = [];
		fs.cards = {};

		console.log(fs.cards.prop + fs.missed + fs.guessed + fs.cards)
		fs.loadCards();
}

fs.loadCards = function(){
	if(fs.chosenSub == false){
		document.getElementById("cardDisplay").innerHTML = "<p> Ooops! There appears to be an error.  <b><u>" + fs.selectedMod + "</u></b> was selected, but no sub-module was loaded. Please select a sub-module from the second drop down list.  If there is no second drop down list, please contact the module's creator for help.</p>"
	}


	fs.cards = fs.availSub.submods[fs.chosenSub];
	
	for(prop in fs.cards){ 
		fs.props.push(prop.toString());
	}

	fs.showCard();
}

fs.showCard = function(){

		var color = document.getElementById("inputColor").className = "form-group has-feedback";
		var glyph = document.getElementById("glyphSpan").className = "glyphicon form-control-feedback";

	fs.tempRand = Math.floor(Math.random() * fs.props.length); //generate random number

	fs.tempCard = fs.cards[fs.props[fs.tempRand]];
	fs.answer = "<" + fs.props[fs.tempRand].slice(4,-4) + ">";

	document.getElementById("cardDisplay").innerHTML = fs.tempCard;

	//delete fs.cards['&lt;p&gt;'];  //deletes an object from an array.  Save val to var, then add to hit or miss and delete from fs.cards.


};

fs.checkInput = function(){
	var doc = document.getElementById("check");
	doc.onclick=function(){
		var user = document.getElementById("userInput");

		fs.userInput = user.value;
		

		alert(fs.props.length);

		if(fs.userInput == fs.answer){
		var color = document.getElementById("inputColor").className = "form-group has-success has-feedback";
		var glyph = document.getElementById("glyphSpan").className = "glyphicon glyphicon-ok form-control-feedback";


			alert("Pumpkin squeezie!");  // *** INSTEAD I WANT to turn green with a check mark ***
			fs.correct += 1; //add 1 to correct count.
			fs.guessed[fs.props[fs.tempRand]] = fs.cards[fs.props[fs.tempRand]]; //add prop to guessed 
			fs.props.splice(fs.tempRand, 1); //remove from fs.props array since no longer needed. 

			//wait 3 seconds then 		user.value="";

		} else {
		document.getElementById("inputColor").className = "form-group has-error has-feedback";
		document.getElementById("glyphSpan").className = "glyphicon glyphicon-remove form-control-feedback";
			alert("No good."); // *** TURN RED W/ X ***
			if(fs.mode === "practice"){
				fs.showCard();
			} else if (fs.mode === "test"){
				fs.incorrect += 1;
				fs.missed[fs.props[fs.tempRand]] = fs.cards[fs.props[fs.tempRand]];  
				fs.props.splice(fs.tempRand, 1);
			}
		}

		setTimeout(function(){
					if(fs.props.length > 0){
			fs.showCard();} else {
				document.getElementById("cardDisplay").innerHTML = "No more cards. number correct = " + fs.correct + " . Number incorrect = " + fs.incorrect + " .";
			}
		},1500);



	}


};

fs.showResults = function(){

}


fs.setAvail();
fs.selectMod();
fs.setTest();
fs.checkInput();
