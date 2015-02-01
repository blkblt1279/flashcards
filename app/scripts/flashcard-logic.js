var fs = {
	"availMods" : {},  //contents of config file.
	"selectedMod" : "", //selects first mod.
	"availSub" : "", //lists availiable submods.
	"mode" : "",  //lists selected option Practice or test.
	"chosenSub" : "",  //selected substring.
	"cards" : {},  //contents of selected submod.
	"userinput" : "Pete",
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

				var select = "<select name='submod' id='selectSubMod'>";


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

		fs.loadCards();
	};

};



fs.loadCards = function(){
	if(fs.chosenSub == false){
		document.getElementById("cardDisplay").innerHTML = "<p> Ooops! There appears to be an error.  <b><u>" + fs.selectedMod + "</u></b> was selected, but no sub-module was loaded. Please select a sub-module from the second drop down list.  If there is no second drop down list, please contact the module's creator for help.</p>"
	}


	fs.cards = fs.availSub.submods[fs.chosenSub];


	alert(fs.chosenSub); //checks fs.chosenSub is is
	alert(typeof fs.cards); //ensures the type of fs.cards is an object.

	delete fs.cards.dog;  //deletes an object from an array.  Save val to var, then add to hit or miss and delete from fs.cards.


	var card = "";  //141 - 47 iterate through properties in fs.cards to check to see if delete works.  It did.  Good night. 

	for(prop in fs.cards){
		card += prop + " " + fs.cards[prop] + "<br>";
	}

		document.getElementById("cardDisplay").innerHTML = card;
}

fs.showCard = function(){

};


fs.setAvail();
fs.selectMod();
fs.setTest();

