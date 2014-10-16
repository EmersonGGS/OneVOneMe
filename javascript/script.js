// Author: Emerson Stewart
// Version: 0.7.1
// id: 19487831
// summoner: EmersonGGS

// ** TO DO'S for V 0.7.2
// Alert for errors (Such as 404 from HTTP);
// Select between RANKED and NORMAL game modes;
// Alter HTTP Request for FULL stat list as opposed to the 10 most recent ranked games

//Please test in chrome, I haven't made it cross-browser compatible 

// Retrieving input, then calling API
function getStats () {

  var sumNameOne =  document.getElementById('sum1TxtBox').value;
  var sumNameTwo =  document.getElementById('sum2TxtBox').value;
  var inputPan   =  document.getElementById('inputPan');
  
  if(sumNameOne != sumNameTwo){
    httpGet(sumNameOne, sumNameTwo);
    inputPan.style.width    = "0%";
    inputPan.style.opacity  = "0.0";
    inputPan.style.padding  = "0px";
  }else{
    alert("You can't compare you to yourself, ya clown!");
  }
}

//Creation of Summoner class
//Pass call in and do the function within
function Summoner (parsedResp) {
  this.response       = parsedResp;
  this.kills          = 0;
  this.deaths         = 0;
  this.killDeath      = 0;
  this.towerKills     = 0;
  this.minKills       = 0;
  this.goldPerMin     = 0;
  this.assists        = 0;
  this.minionsKilled  = 0;
  this.wardsPlaced    = 0;
  this.visionBought   = 0;
  this.sightBought    = 0;
  this.neutMinions    = 0;
  this.damageDone     = 0;

  for (var i = 0; i< this.response.length; i++ ){

    //Compiling stats for respective summoner.
    this.kills          =  this.kills + this.response[i].participants[0].stats.kills;
    this.deaths         = this.deaths + this.response[i].participants[0].stats.deaths;
    this.killDeath      = (this.kills / this.deaths).toFixed(2);
    this.damageDone     = this.damageDone + this.response[i].participants[0].stats.totalDamageDealt / this.response.length;
    this.goldPerMin     = this.goldPerMin + this.response[i].participants[0].stats.goldEarned / this.response.length;
    this.towerKills     = this.towerKills + this.response[i].participants[0].stats.towerKills / this.response.length;
    this.minionsKilled  = this.minionsKilled + this.response[i].participants[0].stats.minionsKilled / this.response.length;
    this.assists        = this.assists + this.response[i].participants[0].stats.assists / this.response.length;
    this.wardsPlaced    = this.wardsPlaced + this.response[i].participants[0].stats.wardsPlaced / this.response.length;
    this.visionBought   = this.visionBought + this.response[i].participants[0].stats.visionWardsBoughtInGame / this.response.length;
    this.sightBought    = this.sightBought + this.response[i].participants[0].stats.sightWardsBoughtInGame / this.response.length;
    this.neutMinions    = this.neutMinions + this.response[i].participants[0].stats.neutralMinionsKilled / this.response.length;
  }
  
  //js functions like Math.round() used to help the comparison function, 
  //without them I was getting intermietently odd results when compared.
  this.carryStatsArray    = [this.killDeath, Math.round(this.goldPerMin), Math.round(this.damageDone), Math.round(this.minionsKilled)];
  this.topStatsArray      = [this.killDeath, Math.round(this.towerKills), Math.round(this.minionsKilled), Math.round(this.goldPerMin)];
  this.jungleStatsArray   = [this.killDeath, Math.round(this.neutMinions), Math.round(this.goldPerMin), Math.round(this.assists)];
  this.supportStatsArray  = [Math.round(this.assists), Math.round(this.wardsPlaced), Math.round(this.visionBought), Math.round(this.sightBought)];
};





//API Calls, and generation of variables
function httpGet (summonerName1, summonerName2) {

  //Changing the input to lower-case to use in API call
  lowerSumName1 = summonerName1.toLowerCase();
  lowerSumName2 = summonerName2.toLowerCase();

  //CALLS For First Summoner
  //General information call, Level, Name, and ID
  var xmlHttp = null;
  xmlHttp     = new XMLHttpRequest();
  xmlHttp.open( "GET", "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + summonerName1 + "?api_key=1b189142-ceae-4d82-9c80-7802f6d4881f", false );
  xmlHttp.send( null );
  
  //error checking if user puts information with no statistics.
  if (xmlHttp.status != 200){
    alert("Whoops! Check your names, make sure they're right.");
  }

  var jsontext1   = xmlHttp.responseText;
  var parsedResp1 = JSON.parse(jsontext1);
  var sumID1      = parsedResp1[lowerSumName1].id;
  //setting display values
  document.getElementById("sumName1").innerHTML = parsedResp1[lowerSumName1].name + " - " + "level: " + parsedResp1[lowerSumName1].summonerLevel;

  //General information call, Level, Name, and ID
  var xmlHttp = null;
  xmlHttp     = new XMLHttpRequest();
  xmlHttp.open( "GET", "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + lowerSumName2 + "?api_key=1b189142-ceae-4d82-9c80-7802f6d4881f", false );
  xmlHttp.send( null );

  var jsontext2   = xmlHttp.responseText;
  var parsedResp2 = JSON.parse(jsontext2);
  var sumID2      = parsedResp2[lowerSumName2].id;

  //Stats call
  var xmlHttpStats = null;
  xmlHttpStats     = new XMLHttpRequest();
  xmlHttpStats.open( "GET", "https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/" + sumID1 + "?rankedQueues=RANKED_SOLO_5x5&api_key=1b189142-ceae-4d82-9c80-7802f6d4881f", false );
  xmlHttpStats.send( null );

  // Parsing the response text
  var jsontext1   = xmlHttpStats.responseText;
  var parsedResp1 = JSON.parse(jsontext1);

  //CALLS For Second Summoner
  //setting display values
  document.getElementById("sumName2").innerHTML = parsedResp2[lowerSumName2].name + " - " + "level: " + parsedResp2[lowerSumName2].summonerLevel;

  var xmlHttpStats = null;
  xmlHttpStats     = new XMLHttpRequest();
  xmlHttpStats.open( "GET", "https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/" + sumID2 + "?rankedQueues=RANKED_SOLO_5x5&api_key=1b189142-ceae-4d82-9c80-7802f6d4881f", false );
  xmlHttpStats.send( null );

  // Parsing the response text
  var jsontext2   = xmlHttpStats.responseText;
  var parsedResp2 = JSON.parse(jsontext2);

  var summoner1 = new Summoner(parsedResp1.matches);
  var summoner2 = new Summoner(parsedResp2.matches);
  
  
	//init statistic title arrays
	var carryTitlesArray    = [" Kill / Death", " Gold Per Minute", " Damage Done", " Minions Killed"];
	var topTitlesArray      = [" Kill / Death", " Tower Kills", " Minions Killed", " Gold Per Minute"];
	var jungleTitlesArray   = [" Kill / Death", " Neutrals Killed", " Gold Per Minute", " Assists"];
	var supportTitlesArray  = [" Assists", " Wards Placed", " Vision Wards Bought", " Sight Wards Bought"];


  //pass the two summoner objects into compare function
  compareStats (
    summoner1.carryStatsArray, 
    summoner2.carryStatsArray, 
    carryTitlesArray,
    "Carry"
  );
  compareStats (
    summoner1.topStatsArray, 
    summoner2.topStatsArray, 
    topTitlesArray,
    "Top"
  );
  compareStats (
    summoner1.jungleStatsArray, 
    summoner2.jungleStatsArray, 
    jungleTitlesArray,
    "Jungle"
  );
  compareStats (
    summoner1.supportStatsArray, 
    summoner2.supportStatsArray, 
    supportTitlesArray,
    "Support"
  );
}


//Function that runs through stats and compares summoner 1 to summoner 2

function compareStats (statArray1, statArray2, titles,section) {

  var summonerCont1 = document.getElementById(section+"1");
  var summonerCont2 = document.getElementById(section+"2");

  //init score vars
  var sumScore1 = 0;
  var sumScore2 = 0;

  //Figures summoners score, places stats in html
  for (var i = 0; i < statArray1.length; i++) {

    var fixedOutputs1 = Number(statArray1[i]);
    var fixedOutputs2 = Number(statArray2[i]);
    
    //Create outputs under each heading
    var sumElem1 = document.createElement("p");
    var sumStat1 = document.createTextNode(fixedOutputs1 + titles[i]);
    sumElem1.appendChild(sumStat1);
    summonerCont1.appendChild(sumElem1);

    var sumElem2 = document.createElement("p");
    var sumStat2 = document.createTextNode(fixedOutputs2 + titles[i]);
    sumStat2     = sumStat2
    sumElem2.appendChild(sumStat2);
    summonerCont2.appendChild(sumElem2);


    if (statArray1[i] > statArray2[i]){
      sumScore1++;
      sumElem1.style.backgroundColor = "#208c4e";
      sumElem2.style.backgroundColor = "#b63d31";
    } else if (statArray1[i] < statArray2[i]) {
      sumScore2++;
      sumElem2.style.backgroundColor = "#208c4e";
      sumElem1.style.backgroundColor = "#b63d31";
    } else {
      sumElem2.style.backgroundColor = "#282828";
      sumElem1.style.backgroundColor = "#282828";
    }
  }

  if (sumScore1 > sumScore2) {

    document.getElementById(String(section) + "Head1").innerHTML = "Better " + String(section);
    document.getElementById(String(section) + "Head1").style.backgroundColor = "#27ae60";

    document.getElementById(String(section) + "Head2").innerHTML = "Worse " + String(section);
    document.getElementById(String(section) + "Head2").style.backgroundColor = "#c0392b";

  } else if (sumScore1 < sumScore2) {

    document.getElementById(String(section) + "Head2").innerHTML = "Better " + String(section);
    document.getElementById(String(section) + "Head2").style.backgroundColor = "#27ae60";

    document.getElementById(String(section) + "Head1").innerHTML = "Worse " + String(section);
    document.getElementById(String(section) + "Head1").style.backgroundColor = "#c0392b";
  } else {

    document.getElementById(String(section) + "Head2").innerHTML = "Even at " + String(section);
    document.getElementById(String(section) + "Head1").innerHTML = "Even at " + String(section);
  }
}

//opens the window to make a new comparison.
function expCompWindow (){
  var inputPan = document.getElementById('inputPan');
  inputPan.style.width = "100%";
  inputPan.style.opacity = "1.0";
  inputPan.style.padding = "20px";
  
  //clear previous comparison
  var carry1Cont = document.getElementById("Carry1");
  var carry2Cont = document.getElementById("Carry2");
  var top1Cont = document.getElementById("Top1");
  var top2Cont = document.getElementById("Top2");  
  var jungle1Cont = document.getElementById("Jungle1");
  var jungle2Cont = document.getElementById("Jungle2");
  var support1Cont = document.getElementById("Support1");
  var support2Cont = document.getElementById("Support2");
  
  //Calls function to clear all the child elements that need to be removed
  clearContent(carry1Cont, carry2Cont, top1Cont, top2Cont, jungle1Cont, jungle2Cont, support1Cont, support2Cont);
}

//Function that clears out old comparisons
function clearContent (div1, div2, div3, div4, div5, div6, div7, div8) {
  
  for( var i = 0; i < 4; i++){
    div1.removeChild( div1.firstChild );
    div2.removeChild( div2.firstChild );
    div3.removeChild( div3.firstChild );
    div4.removeChild( div4.firstChild );
    div5.removeChild( div5.firstChild );
    div6.removeChild( div6.firstChild );
    div7.removeChild( div7.firstChild );
    div8.removeChild( div8.firstChild );
  }
}