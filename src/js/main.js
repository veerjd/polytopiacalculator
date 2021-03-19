var extinfo = [];
var tapcounter = 0;
var entries = 10;
var attackers = [];
var defenders = [];
var attackerselected = -1;
var defenderselected = -1;
var prevattackerselected = -2;
var prevdefenderselected = -2;
var deleteselected = false;
var healselected = false;
var backupattackers = [];
var backupdefenders = [];
var firstbackup = false;
var noretalswitch = true;
var answersexpanded = 0;
var refreshcounter = 0;
var refatthpcounter = 0;
var refdefhpcounter = 0;
var shortparameter = false;
var savednumber = 0;
var prevattshiphp = 10;
var prevdefshiphp = 10;
var freezecounter = 0;

function messageclear() {
  document.getElementById("resultatt").innerHTML = "";
  document.getElementById("resultdef").innerHTML = "";
  document.getElementById("resultsplash").innerHTML = "";
  document.getElementById("note").innerHTML = "";
  document.getElementById("frozennote").innerHTML = "";
}
function calculate(mode) {
  var attforce, defforce, totaldam, res, testdef, multitestdef;
  var astring, bstring, cstring, unit1, unit2, defbonus = "";
  var warning = false;

  if (mode == "Multi") {
    var att = attackers[attackerselected].a;
    var def = defenders[defenderselected].d;
    var atthp = parseInt(attackers[attackerselected].hp);
    var defhp = parseInt(defenders[defenderselected].hp);
    var attboosted = document.getElementById("attb").checked;
    var defpoisoned = document.getElementById("defp").checked;
    var splashhp = parseInt(defenders[defenderselected].hp);
    var attorighp = parseInt(attackers[attackerselected].originalhp);
    var attmaxhp = attackers[attackerselected].maxhp;
    var defmaxhp = defenders[defenderselected].maxhp;
    var attname = attackers[attackerselected].type;
    var defname = defenders[defenderselected].type;
  }
  else {
    var att = parseFloat(document.getElementById("attack").value);
    var def = parseFloat(document.getElementById("defense").value);
    var atthp = parseInt(document.getElementById("attackhp").value);
    var defhp = parseInt(document.getElementById("defensehp").value);
    var splashhp = parseInt(document.getElementById("defensehp").value);
    var attmaxhp = parseInt(document.getElementById("attackmaxhp").value);
    var defmaxhp = parseInt(document.getElementById("defensemaxhp").value);
    var attname = document.getElementById("selectattacker").value;
    var defname = document.getElementById("selectdefender").value;

    var attboosted = document.getElementById("attb").checked;
    var defpoisoned = document.getElementById("defp").checked;
  }

  if (attboosted) {
    att = att + 0.5
  }

  if (defpoisoned) {
    def = def * 0.8
  }

  resetcounters();
  if (atthp == 123) {
    messageclear();
    warning = true;
    defhp = parseInt(document.getElementById("defensehp").value);
    if (defhp == 0) {
      document.getElementById("resultatt").innerHTML = "Combat history must contain at least 1 entry!";
      scrollanchor.scrollIntoView(false);
    }
    else {
      if (defhp == 1) {
        document.getElementById("resultatt").innerHTML = "Combat history limit set to 1 entry!";
      }
      else {
        document.getElementById("resultatt").innerHTML = "Combat history limit set to " + defhp + " entries!";
      }
      extinfo.splice(defhp, (extinfo.length - 1));
      document.getElementById("extendedinfo").innerHTML = extinfo.join("");
      entries = defhp;
      if (extinfo.length == 0) {
        document.getElementById("extendedinfo").innerHTML = "<span style='border-top: 1px dashed black; padding-top: 10px; display: block; max-width: 350px;'></span><span class='ext'>Battle history does not contain any entries yet.</span>";
      }
      scrollanchor.scrollIntoView(false);
    }
  }
  if ((mode != "Multi") && (warning != true)) {
    if (isNaN(att) == true || isNaN(def) == true || isNaN(atthp) == true ||
      isNaN(defhp) == true || isNaN(attmaxhp) == true || isNaN(defmaxhp) == true) {
      warning = true;
      messageclear();
      document.getElementById("resultatt").innerHTML = "All of the fields have to be filled with numbers!";
      scrollanchor.scrollIntoView(false);
    }
    else if (att < 0 || def < 0 || atthp < 1 || defhp < 1 || attmaxhp < 5 || defmaxhp < 5 || atthp > attmaxhp || defhp > defmaxhp ||
      (document.getElementById("attackhp").value % atthp != 0) || (document.getElementById("defensehp").value % defhp != 0) ||
      (document.getElementById("attackmaxhp").value % attmaxhp != 0) || (document.getElementById("defensemaxhp").value % defmaxhp != 0)) {
      warning = true;
      messageclear();
      document.getElementById("resultatt").innerHTML = "One or more invalid inputs:<br/>";
      if (att < 0) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Attack value must be 0 or higher");
      }
      if (atthp < 1) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Attacker current HP can't be lower than 1");
      }
      else if (document.getElementById("attackhp").value % atthp != 0) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Attacker current HP must be a whole number");
      }
      else if (atthp > attmaxhp && atthp > 0 && attmaxhp >= 10) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Attacker current HP cannot exceed max HP");
      }
      if (attmaxhp < 5) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Attacker max HP must be 10 or higher");
      }
      else if (document.getElementById("attackmaxhp").value % attmaxhp != 0) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Attacker max HP must be a whole number");
      }
      if (def < 0) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Defense value must be 0 or higher");
      }
      if (defhp < 1) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Defender current HP can't be lower than 1");
      }
      else if (document.getElementById("defensehp").value % defhp != 0) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Defender current HP must be a whole number");
      }
      else if (defhp > defmaxhp && defhp > 0 && defmaxhp >= 10) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Defender current HP cannot exceed max HP");
      }
      if (defmaxhp < 5) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Defender max HP must be 10 or higher");
      }
      else if (document.getElementById("defensemaxhp").value % defmaxhp != 0) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Defender max HP must be a whole number");
      }
      scrollanchor.scrollIntoView(false);
    }
  }
  if (warning != true) {
    messageclear();
    testdef = false;
    if (mode == "Multi") {
      multitestdef = defenders[defenderselected].defbonus;
      if (multitestdef == "D") {
        testdef = true;
      }
    }
    else {
      testdef = document.getElementById("def1").checked;
    }
    if ((mode == "Multi") && (attname == "Fire Dragon") && (attackers[attackerselected].defendersattacked.length > 0)) {
      atthp = attorighp;
    }
    attforce = att * (atthp / attmaxhp);
    defforce = def * (defhp / defmaxhp);

    if (testdef == true) {
      if (defname == "Catapult") {
        document.getElementById("note").innerHTML = "Note: Catapults can't benefit any from defense bonuses due to their 0 defense value!";
      }
      else if (defname == "Mind Bender") {
        defforce = defforce * 1.5;
        document.getElementById("note").innerHTML = "Note: Mind Benders don't receive the defense bonus from cities!";
      }
      else if (defname == "Giant") {
        defforce = defforce * 1.5;
        document.getElementById("note").innerHTML = "Note: Giants don't receive the defense bonus from cities!";
      }
      else if (defname == "Navalon") {
        defforce = defforce * 1.5;
        document.getElementById("note").innerHTML = "Note: Navalons don't receive the defense bonus from cities!";
      }
      else if (defname == "Baby Dragon") {
        defforce = defforce * 1.5;
        document.getElementById("note").innerHTML = "Note: Baby Dragons don't receive the defense bonus from cities!";
      }
      else if (defname == "Fire Dragon") {
        defforce = defforce * 1.5;
        document.getElementById("note").innerHTML = "Note: Fire Dragons don't receive the defense bonus from cities!";
      }
      else if (defname == "Crab") {
        defforce = defforce * 1.5;
        document.getElementById("note").innerHTML = "Note: Crabs don't receive the defense bonus from cities!";
      }
      else if (defname == "Mooni") {
        defforce = defforce * 1.5;
        document.getElementById("note").innerHTML = "Note: Moonies don't receive the defense bonus from cities!";
      }
      else if (defname == "Battle Sled") {
        defforce = defforce * 1.5;
        document.getElementById("note").innerHTML = "Note: Battle Sleds don't receive the defense bonus from cities!";
      }
      else if (defname == "Ice Fortress") {
        defforce = defforce * 1.5;
        document.getElementById("note").innerHTML = "Note: Ice Fortresses don't receive the defense bonus from cities!";
      }
      else if (defname == "Gaami") {
        defforce = defforce * 1.5;
        document.getElementById("note").innerHTML = "Note: Gaamis don't receive the defense bonus from cities!";
      }
      else if (defname == "Nature Bunny") {
        document.getElementById("note").innerHTML = "Note: Nature Bunnies can't capture cities and don't have any defensive technologies! Defense bonus was disregarded in the result.";
      }
      else {
        defforce = defforce * 1.5;
        defbonus = "|D";
      }
    }
    testdef = false;
    if (mode == "Multi") {
      multitestdef = defenders[defenderselected].defbonus;
      if (multitestdef == "W") {
        testdef = true;
      }
    }
    else {
      testdef = document.getElementById("def2").checked;
    }
    if (testdef == true) {
      if (defname == "Boat" || defname == "Ship" || defname == "Battleship") {
        document.getElementById("note").innerHTML = "Note: Ships can't benefit from walls! Wall bonus was disregarded in the result.";
      }
      else if (defname == "Catapult") {
        document.getElementById("note").innerHTML = "Note: Catapults can't benefit from any defense bonuses due to their 0 defense value!";
      }
      else if (defname == "Mind Bender") {
        document.getElementById("note").innerHTML = "Note: Mind Benders don't receive the defense bonus from cities! Wall bonus was disregarded in the result.";
      }
      else if (defname == "Giant") {
        document.getElementById("note").innerHTML = "Note: Giants don't receive the defense bonus from cities! Wall bonus was disregarded in the result.";
      }
      else if (defname == "Navalon") {
        document.getElementById("note").innerHTML = "Note: Navalons don't receive the defense bonus from cities! Wall bonus was disregarded in the result.";
      }
      else if (defname == "Baby Dragon") {
        document.getElementById("note").innerHTML = "Note: Baby Dragons don't receive the defense bonus from cities! Wall bonus was disregarded in the result.";
      }
      else if (defname == "Fire Dragon") {
        document.getElementById("note").innerHTML = "Note: Fire Dragons don't receive the defense bonus from cities! Wall bonus was disregarded in the result.";
      }
      else if (defname == "Crab") {
        document.getElementById("note").innerHTML = "Note: Crabs don't receive the defense bonus from cities! Wall bonus was disregarded in the result.";
      }
      else if (defname == "Mooni") {
        document.getElementById("note").innerHTML = "Note: Moonies don't receive the defense bonus from cities! Wall bonus was disregarded in the result.";
      }
      else if (defname == "Battle Sled") {
        document.getElementById("note").innerHTML = "Note: Battle Sleds don't receive the defense bonus from cities! Wall bonus was disregarded in the result.";
      }
      else if (defname == "Ice Fortress") {
        document.getElementById("note").innerHTML = "Note: Ice Fortresses don't receive the defense bonus from cities! Wall bonus was disregarded in the result.";
      }
      else if (defname == "Gaami") {
        document.getElementById("note").innerHTML = "Note: Gaamis don't receive the defense bonus from cities! Wall bonus was disregarded in the result.";
      }
      else if (defname == "Nature Bunny") {
        document.getElementById("note").innerHTML = "Note: Nature Bunnies can't capture cities! Wall bonus was disregarded in the result.";
      }
      else {
        defforce = defforce * 4;
        defbonus = "|W";
      }
    }

    testdef = false;
    if (mode == "Multi") {
      multitestdef = defenders[defenderselected].defbonus;
      if (multitestdef == "P") {
        testdef = true;
      }
    }
    else {
      testdef = document.getElementById("defp").checked;
    }
    if (testdef == true) {
      defforce = defforce * 0.8;
      defbonus = "|P";
    }
  }

  unit1 = attname + " " + att + "|" + atthp + "|" + attmaxhp + " - ";
  unit2 = defname + " " + def + "|" + defhp + "|" + defmaxhp + defbonus;

  totaldam = attforce + defforce;
  res = Math.round(attforce / totaldam * att * 4.5);
  if (isNaN(res) == true) {
    res = 0;
  }
  if (attname == "Fire Dragon") {
    splashhp = splashhp - Math.floor(res / 2);
    if (splashhp > 0) {
      if (mode != "Multi") {
        cstring = document.getElementById("resultsplash").innerHTML = "<p><i>IF SPLASHED:</i></p>Defender survives! Remaining HP:  " + splashhp;
      }
      else if (attackers[attackerselected].defendersattacked.length > 0) {
        cstring = document.getElementById("resultsplash").innerHTML = "<i>Fire Dragon's splash attack.</i>";
      }
      else if (attackers[attackerselected].defendersattacked.length < 1) {
        if (document.getElementById("noretalbox").checked == true) {
          cstring = document.getElementById("resultsplash").innerHTML = "<i><p>Fire Dragon's main attack.</p>No enemy retaliation.</i>";
        }
        else {
          cstring = document.getElementById("resultsplash").innerHTML = "<i>Fire Dragon's main attack.</i>";
        }
      }
    }
    else {
      if (mode != "Multi") {
        cstring = document.getElementById("resultsplash").innerHTML = "<p><i>IF SPLASHED:</i></p>Defender is DESTROYED! Afterlife HP:  " + splashhp;
      }
      else if (attackers[attackerselected].defendersattacked.length > 0) {
        cstring = document.getElementById("resultsplash").innerHTML = "<i>Fire Dragon's splash attack.</i>";
      }
      else if (attackers[attackerselected].defendersattacked.length < 1) {
        if (document.getElementById("noretalbox").checked == true) {
          cstring = document.getElementById("resultsplash").innerHTML = "<i><p>Fire Dragon's main attack.</p>No enemy retaliation.</i>";
        }
        else {
          cstring = document.getElementById("resultsplash").innerHTML = "<i>Fire Dragon's main attack.</i>";
        }
      }
    }
  }
  if ((attname == "Fire Dragon") && (mode == "Multi")) {
    if (attackers[attackerselected].defendersattacked.length > 0) {
      defhp = splashhp;
    }
    else {
      defhp = defhp - res;
    }
  }
  else {
    defhp = defhp - res;
  }

  if (mode != "Multi") {
    if (defhp > 0) {
      if (attname == "Ice Archer") {
        bstring = document.getElementById("resultdef").innerHTML = "Defender is FROZEN! Remaining HP:  " + defhp;
        document.getElementById("frozennote").innerHTML = "Frozen units can't retaliate!";
      }
      else {
        bstring = document.getElementById("resultdef").innerHTML = "Defender survives! Remaining HP:  " + defhp;
        document.getElementById("defensehp").value = defhp;
      }
      res = Math.round(defforce / totaldam * def * 4.5);
      if (isNaN(res) == true) {
        res = 0;
      }
      if (attname == "Ice Archer" || defname == "Mind Bender" || defname == "Mooni" || defname == "Ice Archer") {
        res = 0;
        if (defname == "Mind Bender") {
          document.getElementById("frozennote").innerHTML = "Mind Bender can't retaliate!";
        }
        if (defname == "Mooni") {
          document.getElementById("frozennote").innerHTML = "Moonies can't retaliate!";
        }
        if (defname == "Ice Archer") {
          document.getElementById("frozennote").innerHTML = "Ice Archers can't retaliate!";
        }
      }
      atthp = atthp - res;
      if (atthp > 0) {
        astring = document.getElementById("resultatt").innerHTML = "Attacker survives! Remaining HP:  " + atthp;
      }
      else {
        astring = document.getElementById("resultatt").innerHTML = "Attacker is DESTROYED! Afterlife HP:  " + atthp;
      }
    }
    else {
      bstring = document.getElementById("resultdef").innerHTML = "Defender is DESTROYED! Afterlife HP:  " + defhp;
      egg(att);
    }
  }

  if (mode == "Multi") {
    if (defhp > 0) {
      if (attname == "Ice Archer") {
        bstring = document.getElementById("resultdef").innerHTML = "Defender is FROZEN! Remaining HP:  " + defhp;
        document.getElementById("frozennote").innerHTML = "Frozen units can't retaliate!";
        defenders[defenderselected].frozen = true;
      }

      else {
        if (defenders[defenderselected].frozen == true) {
          bstring = document.getElementById("resultdef").innerHTML = "Defender is FROZEN! Remaining HP:  " + defhp;
        }
        else {
          bstring = document.getElementById("resultdef").innerHTML = "Defender survives! Remaining HP:  " + defhp;
        }
        defenders[defenderselected].hp = defhp;
        res = Math.round(defforce / totaldam * def * 4.5);
        if (defenders[defenderselected].frozen == true) {
          res = 0;
          document.getElementById("frozennote").innerHTML = "Frozen units can't retaliate!";
        }
        else if (defname == "Mind Bender" || defname == "Mooni" || defname == "Ice Archer") {
          res = 0;
          if (defname == "Mind Bender" && attackers[attackerselected].defendersattacked.length == 0) {
            document.getElementById("note").innerHTML = "Mind Benders can't retaliate!";
          }
          if (defname == "Mooni" && attackers[attackerselected].defendersattacked.length == 0) {
            document.getElementById("note").innerHTML = "Moonies can't retaliate!";
          }
          if (defname == "Ice Archer" && attackers[attackerselected].defendersattacked.length == 0) {
            document.getElementById("note").innerHTML = "Ice Archers can't retaliate!";
          }
        }
      }
      if (isNaN(res) == true) {
        res = 0;
      }
      if (document.getElementById("noretalbox").checked == false) {
        if ((attname == "Fire Dragon") && (attackers[attackerselected].defendersattacked.length > 0)) {
        }
        else {
          atthp = atthp - res;
        }
      }
      if (atthp > 0) {
        if ((attname == "Fire Dragon") && (attackers[attackerselected].defendersattacked.length > 0)) {
        }
        else {
          astring = document.getElementById("resultatt").innerHTML = "Attacker survives! Remaining HP:  " + atthp;
          attackers[attackerselected].hp = atthp;
        }
      }
      else {
        if ((attname == "Fire Dragon") && (attackers[attackerselected].defendersattacked.length > 0)) {
        }
        else {
          astring = document.getElementById("resultatt").innerHTML = "Attacker is DESTROYED! Afterlife HP:  " + atthp;
          attackers[attackerselected].hp = atthp;
        }
      }
    }
    else {
      bstring = document.getElementById("resultdef").innerHTML = "Defender is DESTROYED! Afterlife HP:  " + defhp;
      defenders[defenderselected].hp = defhp;
    }

    if ((attackers[attackerselected].type != "Knight") && (attackers[attackerselected].type != "Navalon") && (attackers[attackerselected].type != "Fire Dragon")) {
      attackers[attackerselected].unavailable = true;
    }
    else if (attackers[attackerselected].type == "Fire Dragon") {
      attackers[attackerselected].defendersattacked.push(defenderselected);
      document.getElementById("noretaltext").style.visibility = "hidden";
    }
    else {
      if ((defhp > 0) || (atthp < 1)) {
        attackers[attackerselected].unavailable = true;
      }
      else {
        attackers[attackerselected].defendersattacked.push(defenderselected);
      }
    }

    var decshort = "";
    var color = "black";
    if (attackers[attackerselected].type == "Knight") {
      decshort = "<b>3</b>";
    }
    else {
      decshort = attackers[attackerselected].a;
    }
    if ((attackers[attackerselected].hp < 1) || (attackers[attackerselected].unavailable == true)) {
      color = "gray";
    }
    var splashindicator = ""
    if ((attackers[attackerselected].type == "Fire Dragon") && (attackers[attackerselected].defendersattacked.length > 0)) {
      splashindicator = "S";
    }
    document.getElementById("attacker" + attackerselected).innerHTML = "<img src='src/img/Attackers/" + attackers[attackerselected].type + ".png' height='55' width='55'><div id='splash" + attackerselected + "' style='position: absolute; top: 1px; right: 1px'><b>" + splashindicator + "</b></div><div style='position: absolute; width: 100%; bottom: 2px; text-align: center'>" + decshort + "/" + attackers[attackerselected].hp + "/" + attackers[attackerselected].maxhp + "</div>";
    document.getElementById("attacker" + attackerselected).style.borderColor = color;

    color = "black"
    if (defenders[defenderselected].hp < 1) {
      color = "gray";
    }
    else if (defenders[defenderselected].frozen == true) {
      color = "blue";
    }
    document.getElementById("defender" + defenderselected).innerHTML = "<img src='src/img/Defenders/" + defenders[defenderselected].type + ".png' height='55' width='55'><div style='position: absolute; top: 1px; right: 1px'><b>" + defenders[defenderselected].defbonus + "</b></div><div style='position: absolute; width: 100%; bottom: 2px; text-align: center'>" + defenders[defenderselected].d + "/" + defenders[defenderselected].hp + "/" + defenders[defenderselected].maxhp + "</div>";
    document.getElementById("defender" + defenderselected).style.borderColor = color;

  }
  if ((mode == "Multi") && (attackers[attackerselected].type != "Fire Dragon") && (document.getElementById("noretalbox").checked == true) && (defenders[defenderselected].hp > 0)) {
    cstring = document.getElementById("resultsplash").innerHTML = "<i>No enemy retaliation.</i>";
  }
  if (mode == "Multi") {
    if ((attackers[attackerselected].type == "Archer") || (attackers[attackerselected].type == "Catapult") || (attackers[attackerselected].type == "Boat") || (attackers[attackerselected].type == "Ship") || (attackers[attackerselected].type == "Battleship") || (attackers[attackerselected].type == "Tridention") || (attackers[attackerselected].type == "Ice Fortress")) {
      document.getElementById("noretalbox").checked = false;
      document.getElementById("noretaltext").style.visibility = "hidden";
    }
  }
  if (astring == null) {
    astring = "";
  }
  if (cstring == null) {
    cstring = "";
  }

  if (extinfo.length >= entries) {
    extinfo.pop();
  }
  extinfo.splice(0, 0, "<span style='border-top: 1px dashed black; display: block; max-width: 350px;'></span><p class='ext'>" + unit1 + unit2 + "</p><p class='ext'>" + astring + "</p><p class='ext'>" + bstring + "</p><p class='ext'>" + cstring + "</p>");
  document.getElementById("extendedinfo").innerHTML = extinfo.join("");

  if (mode != "Multi") {
    scrollanchor.scrollIntoView(false);
  }
}

function defcheck() {
  var test = document.getElementById("def2").checked;
  if (test == true) {
    document.getElementById("def2").checked = false;
  }
}
function wallcheck() {
  var test = document.getElementById("def1").checked;
  if (test == true) {
    document.getElementById("def1").checked = false;
  }
}
function setdefbonus() {
  var test = document.getElementById("def1").checked;
  if (test == true) {
    document.getElementById("def1").checked = false;
  }
  else {
    document.getElementById("def1").checked = true;
    document.getElementById("defp").checked = false;
  }
  defcheck();
}
function setwallbonus() {
  var test = document.getElementById("def2").checked;
  if (test == true) {
    document.getElementById("def2").checked = false;
  }
  else {
    document.getElementById("def2").checked = true;
    document.getElementById("defp").checked = false;
  }
  wallcheck();
}
function setdefpoison() {
  var test = document.getElementById("defp").checked;
  if (test == true) {
    document.getElementById("defp").checked = false;
  }
  else {
    document.getElementById("defp").checked = true;
    document.getElementById("def1").checked = false;
    document.getElementById("def2").checked = false;
  }
}
function setdefboost() {
  var test = document.getElementById("defb").checked;
  if (test == true) {
    document.getElementById("defb").checked = false;
  }
  else {
    document.getElementById("defb").checked = true;
  }
}
function setattpoison() {
  var test = document.getElementById("attp").checked;
  if (test == true) {
    document.getElementById("attp").checked = false;
  }
  else {
    document.getElementById("attp").checked = true;
  }
}
function setattboost() {
  var test = document.getElementById("attb").checked;
  if (test == true) {
    document.getElementById("attb").checked = false;
  }
  else {
    document.getElementById("attb").checked = true;
  }
}
function attackerfill() {
  var getattacker = document.getElementById("selectattacker").value;
  switch (getattacker) {
    case "Warrior":
      document.getElementById("attack").value = "2";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Rider":
      document.getElementById("attack").value = "2";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Defender":
      document.getElementById("attack").value = "1";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Swordsman":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Archer":
      document.getElementById("attack").value = "2";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Catapult":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Knight":
      document.getElementById("attack").value = "3.5";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Giant":
      document.getElementById("attack").value = "5";
      document.getElementById("attackhp").value = "40";
      document.getElementById("attackmaxhp").value = "40";
      break;
    case "Boat":
      document.getElementById("attack").value = "1";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Ship":
      document.getElementById("attack").value = "2";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Battleship":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Amphibian":
      document.getElementById("attack").value = "2";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Crab":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "40";
      document.getElementById("attackmaxhp").value = "40";
      break;
    case "Tridention":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Polytaur":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Navalon":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "30";
      document.getElementById("attackmaxhp").value = "30";
      break;
    case "Baby Dragon":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Fire Dragon":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "20";
      document.getElementById("attackmaxhp").value = "20";
      break;
    case "Ice Archer":
      document.getElementById("attack").value = "0";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Battle Sled":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Ice Fortress":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "20";
      document.getElementById("attackmaxhp").value = "20";
      break;
    case "Gaami":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "30";
      document.getElementById("attackmaxhp").value = "30";
      break;
    case "Shaman":
      document.getElementById("attack").value = "1";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Hexapod":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "5";
      document.getElementById("attackmaxhp").value = "5";
      break;
    case "Kiton":
      document.getElementById("attack").value = "1";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Phychi":
      document.getElementById("attack").value = "1";
      document.getElementById("attackhp").value = "5";
      document.getElementById("attackmaxhp").value = "5";
      break;
    case "Exida":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Raychi":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Doomux":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "20";
      document.getElementById("attackmaxhp").value = "20";
      break;
    case "Centipede":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "20";
      document.getElementById("attackmaxhp").value = "20";
      break;
    case "Segment":
      document.getElementById("attack").value = "2";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
  }
  document.getElementById("shortatt").innerText = "(" + document.getElementById("attack").value + ")";
  if (getattacker == "Warrior" || getattacker == "Rider" || getattacker == "Defender" || getattacker == "Swordsman" || getattacker == "Archer" || getattacker == "Catapult" || getattacker == "Knight" || getattacker == "Amphibian" || getattacker == "Tridention" || getattacker == "Battle Sled" || getattacker == "Ice Fortress" || getattacker == "Hexapod" || getattacker == "Kiton" || getattacker == "Phychi" || getattacker == "Exida" || getattacker == "Raychi" || getattacker == "Domux") {
    document.getElementById("attvetbox").checked = false;
    document.getElementById("attveterancy").style.display = 'inline-block';
    document.getElementById("attshiphp").style.display = 'none';
  }
  else if (getattacker == "Boat" || getattacker == "Ship" || getattacker == "Battleship") {
    document.getElementById("attshiphp").style.display = 'inline-block';
    document.getElementById("attveterancy").style.display = 'none';
    document.getElementById("attshiphp" + prevattshiphp).style.border = "1px solid #A9A9A9";
    document.getElementById("attshiphp" + prevattshiphp).style.backgroundColor = "";
    document.getElementById("attshiphp10").style.border = "1px solid black";
    document.getElementById("attshiphp10").style.backgroundColor = "#eee";
    prevattshiphp = 10;
  }
  else {
    document.getElementById("attveterancy").style.display = 'none';
    document.getElementById("attshiphp").style.display = 'none';
  }
}
function defenderfill() {
  var getdefender = document.getElementById("selectdefender").value;
  switch (getdefender) {
    case "Warrior":
      document.getElementById("defense").value = "2";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Rider":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Defender":
      document.getElementById("defense").value = "3";
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case "Swordsman":
      document.getElementById("defense").value = "3";
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case "Archer":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Catapult":
      document.getElementById("defense").value = "0";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Knight":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case "Giant":
      document.getElementById("defense").value = "4";
      document.getElementById("defensehp").value = "40";
      document.getElementById("defensemaxhp").value = "40";
      break;
    case "Boat":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Ship":
      document.getElementById("defense").value = "2";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Battleship":
      document.getElementById("defense").value = "3";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Mind Bender":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Amphibian":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Crab":
      document.getElementById("defense").value = "4";
      document.getElementById("defensehp").value = "40";
      document.getElementById("defensemaxhp").value = "40";
      break;
    case "Tridention":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case "Polytaur":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case "Navalon":
      document.getElementById("defense").value = "4";
      document.getElementById("defensehp").value = "30";
      document.getElementById("defensemaxhp").value = "30";
      break;
    case "Dragon Egg":
      document.getElementById("defense").value = "2";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Baby Dragon":
      document.getElementById("defense").value = "3";
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case "Fire Dragon":
      document.getElementById("defense").value = "3";
      document.getElementById("defensehp").value = "20";
      document.getElementById("defensemaxhp").value = "20";
      break;
    case "Mooni":
      document.getElementById("defense").value = "2";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Ice Archer":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Battle Sled":
      document.getElementById("defense").value = "2";
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case "Ice Fortress":
      document.getElementById("defense").value = "3";
      document.getElementById("defensehp").value = "20";
      document.getElementById("defensemaxhp").value = "20";
      break;
    case "Gaami":
      document.getElementById("defense").value = "4";
      document.getElementById("defensehp").value = "30";
      document.getElementById("defensemaxhp").value = "30";
      break;
    case "Nature Bunny":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "20";
      document.getElementById("defensemaxhp").value = "20";
      break;
    case "Shaman":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Hexapod":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "5";
      document.getElementById("defensemaxhp").value = "5";
      break;
    case "Kiton":
      document.getElementById("defense").value = "3";
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case "Phychi":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "5";
      document.getElementById("defensemaxhp").value = "5";
      break;
    case "Exida":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Raychi":
      document.getElementById("defense").value = "2";
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case "Doomux":
      document.getElementById("defense").value = "2";
      document.getElementById("defensehp").value = "20";
      document.getElementById("defensemaxhp").value = "20";
      break;
    case "Centipede":
      document.getElementById("defense").value = "3";
      document.getElementById("defensehp").value = "20";
      document.getElementById("defensemaxhp").value = "20";
      break;
    case "Segment":
      document.getElementById("defense").value = "2";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
  }
  document.getElementById("shortdef").innerText = "(" + document.getElementById("defense").value + ")";
  if (getdefender == "Warrior" || getdefender == "Rider" || getdefender == "Defender" || getdefender == "Swordsman" || getdefender == "Archer" || getdefender == "Catapult" || getdefender == "Knight" || getdefender == "Amphibian" || getdefender == "Tridention" || getdefender == "Battle Sled" || getdefender == "Ice Fortress" || getdefender == "Hexapod" || getdefender == "Kiton" || getdefender == "Phychi" || getdefender == "Exida" || getdefender == "Raychi" || getdefender == "Domux") {
    document.getElementById("defvetbox").checked = false;
    document.getElementById("defveterancy").style.display = 'inline-block';
    document.getElementById("defshiphp").style.display = 'none';
  }
  else if (getdefender == "Boat" || getdefender == "Ship" || getdefender == "Battleship") {
    document.getElementById("defshiphp").selectedIndex = "0";
    document.getElementById("defshiphp").style.display = 'inline';
    document.getElementById("defveterancy").style.display = 'none';
    document.getElementById("defshiphp" + prevdefshiphp).style.border = "1px solid #A9A9A9";
    document.getElementById("defshiphp" + prevdefshiphp).style.backgroundColor = "";
    document.getElementById("defshiphp10").style.border = "1px solid black";
    document.getElementById("defshiphp10").style.backgroundColor = "#eee";
    prevdefshiphp = 10;
  }
  else {
    document.getElementById("defveterancy").style.display = 'none';
    document.getElementById("defshiphp").style.display = 'none';
  }
}
function egg(attack) {
  if (attack > 9000) {
    document.getElementById("resultatt").innerHTML = "It's over 9000!!!";
    document.getElementById("note").innerHTML = "There's no way that can be right!";
  }
}
function attackerveteran() {
  var getattacker = document.getElementById("selectattacker").value;
  var getattveterancy = document.getElementById("attvetbox").checked;
  switch (getattacker) {
    case "Warrior":
      document.getElementById("attack").value = "2";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Rider":
      document.getElementById("attack").value = "2";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Defender":
      document.getElementById("attack").value = "1";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Swordsman":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Archer":
      document.getElementById("attack").value = "2";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Catapult":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Knight":
      document.getElementById("attack").value = "3.5";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Amphibian":
      document.getElementById("attack").value = "2";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Tridention":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Battle Sled":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Ice Fortress":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "20";
      document.getElementById("attackmaxhp").value = "20";
      break;
    case "Shaman":
      document.getElementById("attack").value = "1";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Hexapod":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "5";
      document.getElementById("attackmaxhp").value = "5";
      break;
    case "Kiton":
      document.getElementById("attack").value = "1";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Phychi":
      document.getElementById("attack").value = "1";
      document.getElementById("attackhp").value = "5";
      document.getElementById("attackmaxhp").value = "5";
      break;
    case "Exida":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Raychi":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Doomux":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "20";
      document.getElementById("attackmaxhp").value = "20";
      break;
    case "Centipede":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "20";
      document.getElementById("attackmaxhp").value = "20";
      break;
    case "Segment":
      document.getElementById("attack").value = "2";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
  }
  var atthp = parseInt(document.getElementById("attackhp").value);
  var attmaxhp = parseInt(document.getElementById("attackmaxhp").value);
  if (getattveterancy == true) {
    document.getElementById("attackhp").value = atthp + 5;
    document.getElementById("attackmaxhp").value = attmaxhp + 5;
  }
}
function defenderveteran() {
  var getdefender = document.getElementById("selectdefender").value;
  var getdefveterancy = document.getElementById("defvetbox").checked;
  switch (getdefender) {
    case "Warrior":
      document.getElementById("defense").value = "2";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Rider":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Defender":
      document.getElementById("defense").value = "3";
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case "Swordsman":
      document.getElementById("defense").value = "3";
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case "Archer":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Catapult":
      document.getElementById("defense").value = "0";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Knight":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case "Amphibian":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Tridention":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case "Battle Sled":
      document.getElementById("defense").value = "2";
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case "Ice Fortress":
      document.getElementById("defense").value = "3";
      document.getElementById("defensehp").value = "20";
      document.getElementById("defensemaxhp").value = "20";
      break;
    case "Shaman":
      document.getElementById("attack").value = "1";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Hexapod":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "5";
      document.getElementById("attackmaxhp").value = "5";
      break;
    case "Kiton":
      document.getElementById("attack").value = "1";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Phychi":
      document.getElementById("attack").value = "1";
      document.getElementById("attackhp").value = "5";
      document.getElementById("attackmaxhp").value = "5";
      break;
    case "Exida":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Raychi":
      document.getElementById("attack").value = "3";
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case "Doomux":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "20";
      document.getElementById("attackmaxhp").value = "20";
      break;
    case "Centipede":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "20";
      document.getElementById("attackmaxhp").value = "20";
      break;
    case "Segment":
      document.getElementById("attack").value = "2";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
  }
  var defhp = parseInt(document.getElementById("defensehp").value);
  var defmaxhp = parseInt(document.getElementById("defensemaxhp").value);
  if (getdefveterancy == true) {
    document.getElementById("defensehp").value = defhp + 5;
    document.getElementById("defensemaxhp").value = defmaxhp + 5;
  }
}
function attackershiphp(selectattshiphp) {
  var getattacker = document.getElementById("selectattacker").value;
  var getattshiphp = selectattshiphp;

  document.getElementById("attshiphp" + prevattshiphp).style.border = "1px solid #A9A9A9";
  document.getElementById("attshiphp" + prevattshiphp).style.backgroundColor = "";
  document.getElementById("attshiphp" + selectattshiphp).style.border = "1px solid black";
  document.getElementById("attshiphp" + prevattshiphp).style.backgroundColor = "";
  document.getElementById("attshiphp" + selectattshiphp).style.backgroundColor = "#eee";
  prevattshiphp = selectattshiphp;

  switch (getattacker) {
    case "Boat":
      document.getElementById("attack").value = "1";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Ship":
      document.getElementById("attack").value = "2";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
    case "Battleship":
      document.getElementById("attack").value = "4";
      document.getElementById("attackhp").value = "10";
      document.getElementById("attackmaxhp").value = "10";
      break;
  }

  switch (getattshiphp) {
    case 15:
      document.getElementById("attackhp").value = "15";
      document.getElementById("attackmaxhp").value = "15";
      break;
    case 20:
      document.getElementById("attackhp").value = "20";
      document.getElementById("attackmaxhp").value = "20";
      break;
    case 40:
      document.getElementById("attackhp").value = "40";
      document.getElementById("attackmaxhp").value = "40";
      break;
  }
}
function defendershiphp(selectdefshiphp) {
  var getdefender = document.getElementById("selectdefender").value;
  var getdefshiphp = selectdefshiphp;

  document.getElementById("defshiphp" + prevdefshiphp).style.border = "1px solid #A9A9A9";
  document.getElementById("defshiphp" + prevdefshiphp).style.backgroundColor = "";
  document.getElementById("defshiphp" + selectdefshiphp).style.border = "1px solid black";
  document.getElementById("defshiphp" + selectdefshiphp).style.backgroundColor = "#eee";
  prevdefshiphp = selectdefshiphp;

  switch (getdefender) {
    case "Boat":
      document.getElementById("defense").value = "1";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Ship":
      document.getElementById("defense").value = "2";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
    case "Battleship":
      document.getElementById("defense").value = "3";
      document.getElementById("defensehp").value = "10";
      document.getElementById("defensemaxhp").value = "10";
      break;
  }
  switch (getdefshiphp) {
    case 15:
      document.getElementById("defensehp").value = "15";
      document.getElementById("defensemaxhp").value = "15";
      break;
    case 20:
      document.getElementById("defensehp").value = "20";
      document.getElementById("defensemaxhp").value = "20";
      break;
    case 40:
      document.getElementById("defensehp").value = "40";
      document.getElementById("defensemaxhp").value = "40";
      break;
  }
}
function refreshatthp() {
  refatthpcounter++;
  if (refatthpcounter > 1) {
    refatthpcounter = 0;
    document.getElementById("attackhp").value = document.getElementById("attackmaxhp").value;
  }
}
function refreshdefhp() {
  refdefhpcounter++;
  if (refdefhpcounter > 1) {
    refdefhpcounter = 0;
    document.getElementById("defensehp").value = document.getElementById("defensemaxhp").value;
  }
}
function numberfocus(focusid) {
  resetcounters();
  savednumber = document.getElementById(focusid).value;
  document.getElementById(focusid).value = "";
  if ((shortparameter == true) || (document.getElementById("multibutton").innerText == "Single")) {
    if (focusid == "attackhp") {
      document.getElementById("attackhprem").innerText = "(" + savednumber + "/" + document.getElementById("attackmaxhp").value + ")";
    }
    else {
      document.getElementById("defensehprem").innerText = "(" + savednumber + "/" + document.getElementById("defensemaxhp").value + ")";
    }
  }
  else {
    document.getElementById(focusid + "rem").innerText = "(" + savednumber + ")";
  }
  document.getElementById(focusid + "rem").style.visibility = "visible";
}
function numberfocusout(focusoutid) {
  if (document.getElementById(focusoutid).value == "") {
    document.getElementById(focusoutid).value = savednumber;
  }
  document.getElementById(focusoutid + "rem").style.visibility = "hidden";
}
function show(shown, hidden) {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  document.getElementById(shown).style.display = 'block';
  document.getElementById(hidden).style.display = 'none';
  resetcounters();
  if ((document.getElementById("multibutton").innerText == "Single") && (deleteselected == true)) {
    messageclear();
    deleteselected = false;
    document.getElementById("deletebutton").innerText = "Delete Units";
  }
  if ((document.getElementById("multibutton").innerText == "Single") && (healselected == true)) {
    messageclear();
    healselected = false;
    document.getElementById("healbutton").innerText = "+2";
  }
  return false;
}
function displayextinfo() {
  tapcounter++;
  if ((tapcounter > 2) && (document.getElementById("extendedinfo").style.display == 'none')) {
    tapcounter = 0;
    document.getElementById("extendedinfo").style.display = 'block';
    if (document.getElementById("multibutton").innerText == "Single") {
      states.scrollIntoView();
    }
    else {
      submitbutton.scrollIntoView();
    }
  }
  if ((tapcounter > 2) && (document.getElementById("extendedinfo").style.display == 'block')) {
    tapcounter = 0;
    document.getElementById("extendedinfo").style.display = 'none';
    scrollanchor.scrollIntoView(false);
  }
}
function resetcounters() {
  tapcounter = 0;
  refreshcounter = 0;
  refatthpcounter = 0;
  refdefhpcounter = 0;
  freezecounters = 0;
  prevdefenderselected = -1;
}
function choosetype() {
  if (document.getElementById("unitselect").innerText == "Create Attacker") {
    document.getElementById("unitselect").innerText = "Create Defender";
    document.getElementById("switch1").style.visibility = "hidden";
    document.getElementById("switch2").style.visibility = "visible";
  }
  else {
    document.getElementById("unitselect").innerText = "Create Attacker";
    document.getElementById("switch1").style.visibility = "visible";
    document.getElementById("switch2").style.visibility = "hidden";
  }

  var unittype = document.getElementById("unitselect").innerText;
  if (unittype == "Create Attacker") {
    document.getElementById("attvalues").style.display = 'block';
    document.getElementById("attack").style.display = 'none';
    document.getElementById("attvaluetext").style.display = 'none';
    document.getElementById("attackmaxhp").style.display = 'none';
    document.getElementById("attmaxhptext").style.display = 'none';
    document.getElementById("defvalues").style.display = 'none';
  }
  else if (unittype == "Create Defender") {
    document.getElementById("defvalues").style.display = 'block';
    document.getElementById("defense").style.display = 'none';
    document.getElementById("defvaluetext").style.display = 'none';
    document.getElementById("defensemaxhp").style.display = 'none';
    document.getElementById("defmaxhptext").style.display = 'none';
    document.getElementById("attvalues").style.display = 'none';
    document.getElementById("def1").checked = false;
    document.getElementById("def2").checked = false;
  }
}
function multiswitch() {
  alert('There are known bugs with Multi. No need to report them just yet 😉')
  if (document.getElementById("multibutton").innerText == "Multi") {
    document.getElementById("submitbutton").style.display = 'none';
    document.getElementById("createbutton").style.display = 'inline-block';
    document.getElementById("multibutton").innerText = "Single";
    document.getElementById("deletebutton").style.display = 'inline-block';
    document.getElementById("healbutton").style.display = 'inline-block';
    document.getElementById("singlefaq").style.display = 'none';
    document.getElementById("result").innerText = "Feedback:";
    document.getElementById("createunitbutton").style.display = 'inline-block';
    document.getElementById("attackerlist").style.display = 'block';
    document.getElementById("defenderlist").style.display = 'block';
    document.getElementById("attackersheader").style.display = 'block';
    document.getElementById("defendersheader").style.display = 'block';
    document.getElementById("states").style.display = 'block';
    document.getElementById("def1").checked = false;
    document.getElementById("def2").checked = false;
    document.getElementById("selectattacker").selectedIndex = 0;
    document.getElementById("attshiphp" + prevattshiphp).style.border = "1px solid #A9A9A9";
    document.getElementById("attshiphp" + prevattshiphp).style.backgroundColor = "";
    prevattshiphp = 10;
    document.getElementById("defshiphp" + prevdefshiphp).style.border = "1px solid #A9A9A9";
    document.getElementById("defshiphp" + prevdefshiphp).style.backgroundColor = "";
    prevdefshiphp = 10;
    attackerfill();
    document.getElementById("selectdefender").selectedIndex = 0;
    defenderfill();
    document.getElementById("unitselect").innerText = "Create Defender";
    choosetype();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    resetcounters();
  }
  else {
    document.getElementById("submitbutton").style.display = 'inline-block';
    document.getElementById("createbutton").style.display = 'none';
    document.getElementById("multibutton").innerText = "Multi";
    document.getElementById("deletebutton").style.display = 'none';
    document.getElementById("healbutton").style.display = 'none';
    document.getElementById("singlefaq").style.display = 'inline-block';
    document.getElementById("result").innerText = "Result:";
    document.getElementById("createunitbutton").style.display = 'none';
    document.getElementById("attvalues").style.display = 'block';
    document.getElementById("defvalues").style.display = 'block';
    document.getElementById("attvalues").style.display = 'block';
    document.getElementById("attackerlist").style.display = 'none';
    document.getElementById("defenderlist").style.display = 'none';
    document.getElementById("attackersheader").style.display = 'none';
    document.getElementById("defendersheader").style.display = 'none';
    document.getElementById("states").style.display = 'none';
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (shortparameter == false) {
      document.getElementById("attvaluetext").style.display = 'block';
      document.getElementById("attack").style.display = 'block';
      document.getElementById("attmaxhptext").style.display = 'block';
      document.getElementById("attackmaxhp").style.display = 'block';
      document.getElementById("defvaluetext").style.display = 'block';
      document.getElementById("defense").style.display = 'block';
      document.getElementById("defmaxhptext").style.display = 'block';
      document.getElementById("defensemaxhp").style.display = 'block';
    }
    resetcounters();
    if (deleteselected == true) {
      messageclear();
      deleteselected = false;
      document.getElementById("deletebutton").innerText = "Delete Units";
    }
    if (healselected == true) {
      messageclear();
      healselected = false;
      document.getElementById("healbutton").innerText = "+2";
    }
  }
}
function createunit() {
  resetcounters();
  warning = false;
  if (deleteselected == true) {
    deleteselected = false;
    document.getElementById("deletebutton").innerText = "Delete Units";
  }
  if (healselected == true) {
    messageclear();
    healselected = false;
    document.getElementById("healbutton").innerText = "+2";
  }
  if (document.getElementById("unitselect").innerText == "Create Attacker") {
    var att = parseFloat(document.getElementById("attack").value);
    var atthp = parseInt(document.getElementById("attackhp").value);
    var attorighp = parseInt(document.getElementById("attackhp").value);
    var attmaxhp = parseInt(document.getElementById("attackmaxhp").value);
    var attname = document.getElementById("selectattacker").value;
    var attboosted = document.getElementById("attb").checked;

    if ((atthp < 1) || ((document.getElementById("attackhp").value % atthp) != 0) || (atthp > attmaxhp)) {
      warning = true;
      messageclear();
      document.getElementById("resultatt").innerHTML = "One or more invalid inputs:<br/>";
      if (atthp < 1) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Attacker current HP can't be lower than 1");
      }
      else if (document.getElementById("attackhp").value != atthp) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Attacker current HP must be a whole number");
      }
      else if (atthp > attmaxhp) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Attacker current HP cannot exceed max HP");
      }
      scrollanchor.scrollIntoView(false);
    }
  }
  else if (document.getElementById("unitselect").innerText == "Create Defender") {
    var def = parseFloat(document.getElementById("defense").value);
    var defhp = parseInt(document.getElementById("defensehp").value);
    var defmaxhp = parseInt(document.getElementById("defensemaxhp").value);
    var defname = document.getElementById("selectdefender").value;
    var defpoisoned = document.getElementById("defp").checked;

    if ((defhp < 1) || ((document.getElementById("defensehp").value % defhp) != 0) || (defhp > defmaxhp)) {
      warning = true;
      messageclear();
      document.getElementById("resultatt").innerHTML = "One or more invalid inputs:<br/>";
      if (defhp < 1) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Defender current HP can't be lower than 1");
      }
      else if (document.getElementById("defensehp").value != defhp) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Defender current HP must be a whole number");
      }
      else if (defhp > defmaxhp) {
        resultatt.insertAdjacentHTML("beforeend", "<br/>- Defender current HP cannot exceed max HP");
      }
      scrollanchor.scrollIntoView(false);
    }
  }

  if ((document.getElementById("unitselect").innerText == "Create Attacker") && (warning != true)) {
    attackers.push({ type: attname, a: att, hp: atthp, maxhp: attmaxhp, unavailable: false, defendersattacked: [], originalhp: attorighp, attboosted: attboosted });
    var i = attackers.length - 1;
    var decshort = "";
    color = "black";

    if (attackers[i].type == "Knight") {
      decshort = "<b>3</b>";
    }
    else {
      decshort = attackers[i].a;
    }
    if (attackers[i].attboosted)
      var attindicator = 'B'
    else
      var attindicator = ''

    attackerlist.insertAdjacentHTML("beforeend", "<div class ='c' id='attacker" + i + "' style='width: 56px; height: 80px; border-style: solid; border-color: " + color + "; display: inline-block; position: relative' onclick='attackselector(" + i + ")'><img src='src/img/Attackers/" + attackers[i].type + ".png' height='55' width='55'><div style='position: absolute; top: 1px; right: 1px'><b>" + attindicator + "</b></div><div style='position: absolute; width: 100%; bottom: 2px; text-align: center'>" + decshort + "/" + attackers[i].hp + "/" + attackers[i].maxhp + "</div></div>");
    messageclear();
    document.getElementById("resultatt").innerHTML = "Attacker created!";
  }
  else if ((document.getElementById("unitselect").innerText == "Create Defender") && (warning != true)) {
    var defindicator = "";
    var color = "black";
    messageclear();

    if (document.getElementById("def1").checked == true) {
      defindicator = "D";
    }
    else if (document.getElementById("def2").checked == true) {
      defindicator = "W";
    }
    else if (document.getElementById("defp").checked == true) {
      defindicator = "P";
    }

    if ((defname == "Boat") || (defname == "Ship") || (defname == "Battleship")) {
      if (defindicator == "W") {
        document.getElementById("note").innerHTML = "Note: " + defname + "s can't benefit from walls! Wall bonus was disregarded.";
        defindicator = "";
      }
    }
    else if ((defname == "Catapult") || (defname == "Mind Bender") || (defname == "Giant") || (defname == "Navalon") || (defname == "Crab") || (defname == "Baby Dragon") || (defname == "Fire Dragon") || (defname == "Mooni") || (defname == "Battle Sled") || (defname == "Ice Fortress") || (defname == "Gaami")) {
      if (defindicator == "W") {
        if (defname == "Catapult") {
          document.getElementById("note").innerHTML = "Note: Catapults can't benefit any from defense bonuses due to their 0 defense value!";
          defindicator = "";
        }
        else if ((defname == "Mooni") || (defname == "Ice Fortress")) {
          document.getElementById("note").innerHTML = "Note: " + defname + "es don't receive the defense bonus from cities! Wall bonus was disregarded.";
          defindicator = "";
        }
        else {
          document.getElementById("note").innerHTML = "Note: " + defname + "s don't receive the defense bonus from cities! Wall bonus was disregarded.";
          defindicator = "";
        }
      }
      else if (defindicator == "D") {
        if (defname == "Catapult") {
          document.getElementById("note").innerHTML = "Note: Catapults can't benefit any from defense bonuses due to their 0 defense value!";
          defindicator = "";
        }
        else if ((defname == "Mooni") || (defname == "Ice Fortress")) {
          document.getElementById("note").innerHTML = "Note: " + defname + "es don't receive the defense bonus from cities!";
        }
        else {
          document.getElementById("note").innerHTML = "Note: " + defname + "s don't receive the defense bonus from cities!";
        }
      }
    }
    else if (defname == "Nature Bunny") {
      if (defindicator == "W") {
        document.getElementById("note").innerHTML = "Nature bunnies can't capture cities! Wall bonus was disregarded.";
        defindicator = "";
      }
      else if (defindicator == "D") {
        document.getElementById("note").innerHTML = "Nature bunnies can't capture cities and don't have any defensive technologies! Defense bonus was disregarded.";
        defindicator = "";
      }
    }
    defenders.push({ type: defname, d: def, hp: defhp, maxhp: defmaxhp, defbonus: defindicator, frozen: false, defpoisoned: defpoisoned });
    var i = defenders.length - 1;
    defenderlist.insertAdjacentHTML("beforeend", "<div class ='c' id='defender" + i + "' style='width: 56px; height: 80px; border-style: solid; border-color: " + color + "; display: inline-block; position: relative' onclick='defenseselector(" + i + ")'><img src='src/img/Defenders/" + defenders[i].type + ".png' height='55' width='55'><div style='position: absolute; top: 1px; right: 1px'><b>" + defenders[i].defbonus + "</b></div><div style='position: absolute; width: 100%; bottom: 2px; text-align: center'>" + defenders[i].d + "/" + defenders[i].hp + "/" + defenders[i].maxhp + "</div></div>");
    document.getElementById("resultatt").innerHTML = "Defender created!";
  }
}
function deleteunitprompt() {
  resetcounters();
  if (healselected == true) {
    healselected = false;
    document.getElementById("healbutton").innerText = "+2";
  }
  if ((attackers.length < 1) && (defenders.length < 1) && (deleteselected == false)) {
    messageclear();
    document.getElementById("resultatt").innerHTML = "There are no units to delete!";
    scrollanchor.scrollIntoView(false);
  }
  else if (deleteselected == false) {
    deleteselected = true;
    messageclear();
    document.getElementById("resultatt").innerHTML = "Select units to delete them. Tap or click the Delete Units button again to stop deleting.";
    document.getElementById("deletebutton").innerText = "Delete Units(x)";
    if (attackerselected >= 0) {
      var divselected = "attacker" + attackerselected;
      if (attackers[attackerselected].unavailable != true) {
        if ((attackers[attackerselected].type == "Fire Dragon") && (attackers[attackerselected].defendersattacked.length > 0)) {
          var splashindicator = "";
          var decshort = attackers[attackerselected].a;
          attackers[attackerselected].unavailable = true;
          document.getElementById(divselected).style.borderColor = "gray";
          document.getElementById("attacker" + attackerselected).innerHTML = "<img src='src/img/Attackers/" + attackers[attackerselected].type + ".png' height='55' width='55'><div id='splash" + attackerselected + "' style='position: absolute; top: 1px; right: 1px'><b>" + splashindicator + "</b></div><div style='position: absolute; width: 100%; bottom: 2px; text-align: center'>" + decshort + "/" + attackers[attackerselected].hp + "/" + attackers[attackerselected].maxhp + "</div>";
        }
        else {
          document.getElementById(divselected).style.borderColor = "black";
          if (document.getElementById("noretaltext").style.visibility == "visible") {
            document.getElementById("noretalbox").checked = false;
            document.getElementById("noretaltext").style.visibility = "hidden";
          }
        }
      }
      else {
        document.getElementById(divselected).style.borderColor = "gray";
        if (document.getElementById("noretaltext").style.visibility == "visible") {
          document.getElementById("noretalbox").checked = false;
          document.getElementById("noretaltext").style.visibility = "hidden";
        }
      }
      attackerselected = -1;
      defenderselected = -1;
      prevattackerselected = -2;
      prevdefenderselected = -1;
    }
  }
  else {
    deleteselected = false;
    messageclear();
    document.getElementById("resultatt").innerHTML = "Unit deletion deactivated.";
    document.getElementById("deletebutton").innerText = "Delete Units";
  }
}
function deleteunit(type) {
  var selectedelement = "";
  var elementid = "";
  var test = "";
  resetcounters();
  if (type == "Attacker") {
    attackers.splice(attackerselected, 1);
    selectedelement = "attacker" + attackerselected;
    elementid = document.getElementById(selectedelement);
    elementid.parentNode.removeChild(elementid);
    for (i = attackerselected; i < attackers.length; i++) {
      selectedelement = "attacker" + (i + 1);
      elementid = "attacker" + i;
      document.getElementById(selectedelement).setAttribute("onclick", "attackselector(" + i + ")");
      document.getElementById(selectedelement).setAttribute("id", elementid);
    }
  }
  if (type == "Defender") {
    defenders.splice(defenderselected, 1);
    selectedelement = "defender" + defenderselected;
    elementid = document.getElementById(selectedelement);
    elementid.parentNode.removeChild(elementid);
    for (i = defenderselected; i < defenders.length; i++) {
      selectedelement = "defender" + (i + 1);
      elementid = "defender" + i;
      document.getElementById(selectedelement).setAttribute("onclick", "defenseselector(" + i + ")");
      document.getElementById(selectedelement).setAttribute("id", elementid);
    }
  }
  if ((attackers.length == 0) && (defenders.length == 0)) {
    deleteselected = false;
    messageclear();
    document.getElementById("resultatt").innerHTML = "All units deleted. Unit deletion deactivated.";
    document.getElementById("deletebutton").innerText = "Delete Units";
  }
  attackerselected = -1;
  defenderselected = -1;
  prevattackerselected = -2;
  prevdefenderselected = -1;
}
function healunitprompt() {
  resetcounters();
  if (deleteselected == true) {
    deleteselected = false;
    document.getElementById("deletebutton").innerText = "Delete Units";
  }
  if ((attackers.length < 1) && (defenders.length < 1) && (healselected == false)) {
    messageclear();
    document.getElementById("resultatt").innerHTML = "There are no units to heal!";
    scrollanchor.scrollIntoView(false);
  }
  else if (healselected == false) {
    healselected = true;
    messageclear();
    document.getElementById("resultatt").innerHTML = "Select units to heal them for +2 HP. You can select the same unit any number of times. Tap or click the +2 button again to stop healing.";
    document.getElementById("healbutton").innerText = "+2(x)";
    if (attackerselected >= 0) {
      var divselected = "attacker" + attackerselected;
      if (attackers[attackerselected].unavailable != true) {
        if ((attackers[attackerselected].type == "Fire Dragon") && (attackers[attackerselected].defendersattacked.length > 0)) {
          var splashindicator = "";
          var decshort = attackers[attackerselected].a;
          attackers[attackerselected].unavailable = true;
          document.getElementById(divselected).style.borderColor = "gray";
          document.getElementById("attacker" + attackerselected).innerHTML = "<img src='src/img/Attackers/" + attackers[attackerselected].type + ".png' height='55' width='55'><div id='splash" + attackerselected + "' style='position: absolute; top: 1px; right: 1px'><b>" + splashindicator + "</b></div><div style='position: absolute; width: 100%; bottom: 2px; text-align: center'>" + decshort + "/" + attackers[attackerselected].hp + "/" + attackers[attackerselected].maxhp + "</div>";
        }
        else {
          document.getElementById(divselected).style.borderColor = "black";
          if (document.getElementById("noretaltext").style.visibility == "visible") {
            document.getElementById("noretalbox").checked = false;
            document.getElementById("noretaltext").style.visibility = "hidden";
          }
        }
      }
      else {
        document.getElementById(divselected).style.borderColor = "gray";
        if (document.getElementById("noretaltext").style.visibility == "visible") {
          document.getElementById("noretalbox").checked = false;
          document.getElementById("noretaltext").style.visibility = "hidden";
        }
      }
      attackerselected = -1;
      defenderselected = -1;
      prevattackerselected = -2;
      prevdefenderselected = -1;
    }
  }
  else {
    healselected = false;
    messageclear();
    document.getElementById("resultatt").innerHTML = "Heal deactivated.";
    document.getElementById("healbutton").innerText = "+2";
  }
}
function healunit(type) {
  var selectedelement = "";
  var elementid = "";
  var test = "";
  resetcounters();
  if (type == "Attacker") {
    var decshort = attackers[attackerselected].a;
    if (attackers[attackerselected].type == "Knight") {
      decshort = "<b>3</b>";
    }
    selectedelement = "attacker" + attackerselected;
    elementid = document.getElementById(selectedelement);
    if (attackers[attackerselected].hp == attackers[attackerselected].maxhp) {
      messageclear();
      document.getElementById("resultatt").innerHTML = "Attacker already at max HP!";
    }
    else {
      attackers[attackerselected].hp = attackers[attackerselected].hp + 2;
      if (attackers[attackerselected].hp > attackers[attackerselected].maxhp) {
        attackers[attackerselected].hp = attackers[attackerselected].maxhp;
      }
      document.getElementById(selectedelement).innerHTML = "<img src='src/img/Attackers/" + attackers[attackerselected].type + ".png' height='55' width='55'><div style='position: absolute; width: 100%; bottom: 2px; text-align: center'>" + decshort + "/" + attackers[attackerselected].hp + "/" + attackers[attackerselected].maxhp + "</div>";
      messageclear();
      document.getElementById("resultatt").innerHTML = "Attacker " + attackers[attackerselected].type + " [" + (attackerselected + 1) + "] healed. New HP: " + attackers[attackerselected].hp + "/" + attackers[attackerselected].maxhp;
    }
  }
  if (type == "Defender") {
    var decshort = defenders[defenderselected].d;
    selectedelement = "defender" + defenderselected;
    elementid = document.getElementById(selectedelement);
    if (defenders[defenderselected].hp == defenders[defenderselected].maxhp) {
      messageclear();
      document.getElementById("resultatt").innerHTML = "Defender already at max HP!";
    }
    else {
      defenders[defenderselected].hp = defenders[defenderselected].hp + 2;
      if (defenders[defenderselected].hp > defenders[defenderselected].maxhp) {
        defenders[defenderselected].hp = defenders[defenderselected].maxhp;
      }
      document.getElementById(selectedelement).innerHTML = "<img src='src/img/Defenders/" + defenders[defenderselected].type + ".png' height='55' width='55'><div style='position: absolute; top: 1px; right: 1px'><b>" + defenders[defenderselected].defbonus + "</b></div><div style='position: absolute; width: 100%; bottom: 2px; text-align: center'>" + decshort + "/" + defenders[defenderselected].hp + "/" + defenders[defenderselected].maxhp + "</div>";
      messageclear();
      document.getElementById("resultatt").innerHTML = "Defender " + defenders[defenderselected].type + " [" + (defenderselected + 1) + "] healed. New HP: " + defenders[defenderselected].hp + "/" + defenders[defenderselected].maxhp;
    }
    if ((defenders[defenderselected].hp == 1) || (defenders[defenderselected].hp == 2)) {
      document.getElementById(selectedelement).style.borderColor = "black";
    }
  }
  attackerselected = -1;
  defenderselected = -1;
  prevattackerselected = -2;
  prevdefenderselected = -1;
}
function attackselector(attackernumber) {
  attackerselected = attackernumber;
  if (deleteselected == true) {
    deleteunit("Attacker");
  }
  else if (healselected == true) {
    healunit("Attacker");
  }
  else {
    if ((attackers[attackerselected].type == "Archer") || (attackers[attackerselected].type == "Catapult") || (attackers[attackerselected].type == "Boat") || (attackers[attackerselected].type == "Ship") ||
      (attackers[attackerselected].type == "Battleship") || (attackers[attackerselected].type == "Tridention") || (attackers[attackerselected].type == "Fire Dragon") || (attackers[attackerselected].type == "Ice Fortress")) {
      if ((attackers[attackerselected].type == "Fire Dragon") && (attackers[attackerselected].defendersattacked.length > 0)) {
        document.getElementById("noretalbox").checked = true;
        document.getElementById("noretaltext").style.visibility = "hidden";
      }
      else {
        if (attackers[attackerselected].unavailable == true) {
          document.getElementById("noretalbox").checked = false;
          document.getElementById("noretaltext").style.visibility = "hidden";
        }
        else {
          if (noretalswitch == true) {
            document.getElementById("noretalbox").checked = true;
          }
          else {
            document.getElementById("noretalbox").checked = false;
          }
          document.getElementById("noretaltext").style.visibility = "visible";
        }
      }
    }
    else {
      document.getElementById("noretalbox").checked = false;
      document.getElementById("noretaltext").style.visibility = "hidden";
    }
    divselected = "";
    divselected = "attacker" + attackerselected;
    if (attackers[attackerselected].unavailable != true) {
      document.getElementById(divselected).style.borderColor = "green";
    }
    if ((prevattackerselected != -2) && (prevattackerselected != attackerselected)) {
      divselected = "attacker" + prevattackerselected;
      if (attackers[prevattackerselected].unavailable == true) {
        document.getElementById(divselected).style.borderColor = "gray";
      }
      else if ((attackers[prevattackerselected].type == "Fire Dragon") && (attackers[prevattackerselected].defendersattacked.length > 0)) {
        var splashindicator = "";
        var decshort = attackers[prevattackerselected].a;
        attackers[prevattackerselected].unavailable = true;
        document.getElementById(divselected).style.borderColor = "gray";
        document.getElementById("attacker" + prevattackerselected).innerHTML = "<img src='src/img/Attackers/" + attackers[prevattackerselected].type + ".png' height='55' width='55'><div id='splash" + prevattackerselected + "' style='position: absolute; top: 1px; right: 1px'><b>" + splashindicator + "</b></div><div style='position: absolute; width: 100%; bottom: 2px; text-align: center'>" + decshort + "/" + attackers[prevattackerselected].hp + "/" + attackers[prevattackerselected].maxhp + "</div>";
      }
      else {
        document.getElementById(divselected).style.borderColor = "black";
      }
    }
    else if ((prevattackerselected != -2) && (prevattackerselected == attackerselected)) {
      divselected = "attacker" + prevattackerselected;
      if (attackers[prevattackerselected].unavailable == true) {
        document.getElementById(divselected).style.borderColor = "gray";
        document.getElementById("noretalbox").checked = false;
        document.getElementById("noretaltext").style.visibility = "hidden";
      }
      else if (attackers[prevattackerselected].defendersattacked.length > 0) {
        document.getElementById(divselected).style.borderColor = "gray";
        attackers[prevattackerselected].unavailable = true;
        document.getElementById("noretalbox").checked = false;
        document.getElementById("noretaltext").style.visibility = "hidden";
        if (attackers[prevattackerselected].type == "Fire Dragon") {
          var splashindicator = "";
          var decshort = attackers[prevattackerselected].a;
          document.getElementById("attacker" + prevattackerselected).innerHTML = "<img src='src/img/Attackers/" + attackers[prevattackerselected].type + ".png' height='55' width='55'><div id='splash" + prevattackerselected + "' style='position: absolute; top: 1px; right: 1px'><b>" + splashindicator + "</b></div><div style='position: absolute; width: 100%; bottom: 2px; text-align: center'>" + decshort + "/" + attackers[prevattackerselected].hp + "/" + attackers[prevattackerselected].maxhp + "</div>";
        }
      }
      else {
        document.getElementById(divselected).style.borderColor = "black";
        document.getElementById("noretalbox").checked = false;
        document.getElementById("noretaltext").style.visibility = "hidden";
      }
    }
    if (prevattackerselected == attackerselected) {
      attackerselected = -1;
      prevattackerselected = -2;
    }
    else {
      prevattackerselected = attackerselected;
    }
  }
}
function noretalboxcheck() {
  var test = document.getElementById("noretalbox").checked;
  if (test == true) {
    document.getElementById("noretalbox").checked = false;
  }
  else {
    document.getElementById("noretalbox").checked = true;
  }
}
function defenseselector(defendernumber) {
  defenderselected = defendernumber;
  if (deleteselected == true) {
    deleteunit("Defender");
  }
  else if (healselected == true) {
    healunit("Defender");
  }
  else {
    if (attackerselected == -1 && defenders[defenderselected].hp > 0 && defenders[defenderselected].frozen == false) {
      if (prevdefenderselected != defenderselected) {
        freezecounter = 0;
      }
      freezecounter = freezecounter + 1;
      if (freezecounter == 1) {
        messageclear();
        document.getElementById("resultatt").innerHTML = 'Opting to freeze ' + defenders[defenderselected].type + ' [' + (defenderselected + 1) + ']. Press on the same defender two more times to confirm.';
      }
      else if (freezecounter == 2) {
        messageclear();
        document.getElementById("resultatt").innerHTML = 'Opting to freeze ' + defenders[defenderselected].type + ' [' + (defenderselected + 1) + ']. Press on the same defender one more time to confirm.';
      }
      else if (freezecounter == 3) {
        messageclear();
        freezecounter = 0;
        document.getElementById("resultatt").innerHTML = 'Defender ' + defenders[defenderselected].type + ' [' + (defenderselected + 1) + '] frozen!';
        defenders[defenderselected].frozen = true;
        document.getElementById("defender" + defenderselected).style.borderColor = "blue";
      }
      prevdefenderselected = defenderselected;
    }
    else if (attackerselected == -1 && defenders[defenderselected].hp > 0 && defenders[defenderselected].frozen == true) {
      if (prevdefenderselected != defenderselected) {
        freezecounter = 0;
      }
      freezecounter = freezecounter + 1;
      if (freezecounter == 1) {
        messageclear();
        document.getElementById("resultatt").innerHTML = 'Opting to unfreeze ' + defenders[defenderselected].type + ' [' + (defenderselected + 1) + ']. Press on the same defender two more times to confirm.';
      }
      else if (freezecounter == 2) {
        messageclear();
        document.getElementById("resultatt").innerHTML = 'Opting to unfreeze ' + defenders[defenderselected].type + ' [' + (defenderselected + 1) + ']. Press on the same defender one more time to confirm.';
      }
      else if (freezecounter == 3) {
        messageclear();
        freezecounter = 0;
        document.getElementById("resultatt").innerHTML = 'Defender ' + defenders[defenderselected].type + ' [' + (defenderselected + 1) + '] unfrozen!';
        defenders[defenderselected].frozen = false;
        document.getElementById("defender" + defenderselected).style.borderColor = "black";
      }
      prevdefenderselected = defenderselected;
    }
    if (attackerselected != -1) {
      if ((defenders[defenderselected].hp > 0) && (attackers[attackerselected].unavailable == false)) {
        if ((attackers[attackerselected].type == "Fire Dragon") && (attackers[attackerselected].defendersattacked.length > 0)) {
          var alreadyattacked = false;
          for (i = 0; i < attackers[prevattackerselected].defendersattacked.length; i++) {
            if (defenderselected == attackers[attackerselected].defendersattacked[i]) {
              alreadyattacked = true;
            }
          }
          if (alreadyattacked == false) {
            calculate("Multi");
          }
        }
        else {
          calculate("Multi");
        }
        if ((attackers[attackerselected].type != "Knight") && (attackers[attackerselected].type != "Navalon") && (attackers[attackerselected].type != "Fire Dragon")) {
          attackerselected = -1;
          prevattackerselected = -2;
          prevdefenderselected = -1;
        }
        else if (attackers[attackerselected].type == "Fire Dragon") {
          if (attackers[attackerselected].unavailable == false) {
            var divselected = "attacker" + attackerselected;
            document.getElementById(divselected).style.borderColor = "green";
          }
          else {
            attackerselected = -1;
            prevattackerselected = -2;
            prevdefenderselected = -1;
          }
        }
        else {
          if (attackers[attackerselected].unavailable == false) {
            var divselected = "attacker" + attackerselected;
            document.getElementById(divselected).style.borderColor = "green";
          }
          else {
            attackerselected = -1;
            prevattackerselected = -2;
            prevdefenderselected = -1;
          }
        }
      }
    }
  }
}
function createbackup() {
  resetcounters();
  if (deleteselected == true) {
    deleteselected = false;
    document.getElementById("deletebutton").innerText = "Delete Units";
  }
  if (healselected == true) {
    healselected = false;
    document.getElementById("healbutton").innerText = "+2";
  }
  if ((attackers.length < 1) && (defenders.length < 1)) {
    messageclear();
    document.getElementById("resultatt").innerHTML = "At least one unit must be created before saving a state!";
    scrollanchor.scrollIntoView(false);
  }
  else {
    if ((attackerselected >= 0) && (attackers[attackerselected].type == "Fire Dragon") && (attackers[attackerselected].defendersattacked.length > 0)) {
      var splashindicator = "";
      var decshort = attackers[attackerselected].a;
      var divselected = "attacker" + attackerselected;
      attackers[attackerselected].unavailable = true;
      document.getElementById(divselected).style.borderColor = "gray";
      document.getElementById("attacker" + attackerselected).innerHTML = "<img src='src/img/Attackers/" + attackers[attackerselected].type + ".png' height='55' width='55'><div id='splash" + attackerselected + "' style='position: absolute; top: 1px; right: 1px'><b>" + splashindicator + "</b></div><div style='position: absolute; width: 100%; bottom: 2px; text-align: center'>" + decshort + "/" + attackers[attackerselected].hp + "/" + attackers[attackerselected].maxhp + "</div>";
      attackerselected = -1;
      prevattackerselected = -2;
    }
    backupattackers = [];
    backupdefenders = [];
    if (firstbackup == false) {
      firstbackup = true;
    }
    for (i = 0; i < attackers.length; i++) {
      backupattackers.push({ type2: attackers[i].type, a2: attackers[i].a, hp2: attackers[i].hp, maxhp2: attackers[i].maxhp, unavailable2: attackers[i].unavailable, defendersattacked2: attackers[i].defendersattacked.slice(), originalhp2: attackers[i].originalhp, attpoisoned2: attackers[i].attpoisoned, attboosted2: attackers[i].attboosted });
    }
    for (i = 0; i < defenders.length; i++) {
      backupdefenders.push({ type2: defenders[i].type, d2: defenders[i].d, hp2: defenders[i].hp, maxhp2: defenders[i].maxhp, defbonus2: defenders[i].defbonus, frozen2: defenders[i].frozen, defpoisoned2: defenders[i].attpoisoned, defboosted2: defenders[i].attboosted });
    }
    messageclear();
    document.getElementById("resultatt").innerHTML = "State saved!";
    scrollanchor.scrollIntoView(false);
  }
}
function loadbackup() {
  resetcounters();
  if (deleteselected == true) {
    deleteselected = false;
    document.getElementById("deletebutton").innerText = "Delete Units";
  }
  if (healselected == true) {
    healselected = false;
    document.getElementById("healbutton").innerText = "+2";
  }
  if (firstbackup == false) {
    messageclear();
    document.getElementById("resultatt").innerHTML = "No data available. A state must be saved first!";
    scrollanchor.scrollIntoView(false);
  }
  else {
    attackers = [];
    defenders = [];
    attackerselected = -1;
    prevattackerselected = -2;
    for (i = 0; i < backupattackers.length; i++) {
      attackers.push({ type: backupattackers[i].type2, a: backupattackers[i].a2, hp: backupattackers[i].hp2, maxhp: backupattackers[i].maxhp2, unavailable: backupattackers[i].unavailable2, defendersattacked: backupattackers[i].defendersattacked2.slice(), originalhp: backupattackers[i].originalhp2, attpoisoned2: backupattackers[i].attpoisoned2, attboosted2: backupattackers[i].attboosted2 });
    }
    for (i = 0; i < backupdefenders.length; i++) {
      defenders.push({ type: backupdefenders[i].type2, d: backupdefenders[i].d2, hp: backupdefenders[i].hp2, maxhp: backupdefenders[i].maxhp2, defbonus: backupdefenders[i].defbonus2, frozen: backupdefenders[i].frozen2, defpoisoned2: backupdefenders[i].defpoisoned2, defboosted2: backupdefenders[i].defboosted2 });
    }
    document.getElementById("attackerlist").innerHTML = "";
    var decshort = "";
    var splashindicator = ""
    color = "";
    for (i = 0; i < attackers.length; i++) {
      color = "black";
      if (attackers[i].type == "Knight") {
        decshort = "<b>3</b>";
      }
      else {
        decshort = attackers[i].a;
      }
      if ((attackers[i].hp < 1) || (attackers[i].unavailable == true)) {
        color = "gray";
      }
      splashindicator = ""
      if ((attackers[i].type == "Fire Dragon") && (attackers[i].defendersattacked.length > 0) && (attackers[i].unavailable != true)) {
        splashindicator = "S";
      }
      attackerlist.insertAdjacentHTML("beforeend", "<div class='c' id='attacker" + i + "' style='width: 56px; height: 80px; border-style: solid; border-color: " + color + "; display: inline-block; position: relative' onclick='attackselector(" + i + ")'><img src='src/img/Attackers/" + attackers[i].type + ".png' height='55' width='55'><div id='splash" + i + "' style='position: absolute; top: 1px; right: 1px'><b>" + splashindicator + "</b></div><div style='position: absolute; width: 100%; bottom: 2px; text-align: center'>" + decshort + "/" + attackers[i].hp + "/" + attackers[i].maxhp + "</div></div>");
    }
    document.getElementById("defenderlist").innerHTML = "";
    for (i = 0; i < defenders.length; i++) {
      color = "black"
      if (defenders[i].hp < 1) {
        color = "gray";
      }
      else if (defenders[i].frozen == true) {
        color = "blue";
      }
      defenderlist.insertAdjacentHTML("beforeend", "<div class='c' id='defender" + i + "' style='width: 56px; height: 80px; border-style: solid; border-color: " + color + "; display: inline-block; position: relative' onclick='defenseselector(" + i + ")'><img src='src/img/Defenders/" + defenders[i].type + ".png' height='55' width='55'><div style='position: absolute; top: 1px; right: 1px'><b>" + defenders[i].defbonus + "</b></div><div style='position: absolute; width: 100%; bottom: 2px; text-align: center'>" + defenders[i].d + "/" + defenders[i].hp + "/" + defenders[i].maxhp + "</div></div>");
    }
    messageclear();
    document.getElementById("resultatt").innerHTML = "State loaded!";
    scrollanchor.scrollIntoView(false);
  }
}
function noretaldefault() {
  if (noretalswitch == true) {
    noretalswitch = false;
    messageclear();
    document.getElementById("resultatt").innerHTML = "Setting changed. Enemy units WILL retaliate on your ranged attacks by default.";
  }
  else {
    noretalswitch = true
    messageclear();
    document.getElementById("resultatt").innerHTML = "Setting changed. Enemy units WON'T retaliate on your ranged attacks by default.";
  }
}
function loadelements() {
  attackerfill();
  defenderfill();
  document.getElementById("main").style.visibility = "visible";
  var hiddenelements = document.getElementsByClassName("shorthide");
  var i;
  for (i = 0; i < hiddenelements.length; i++) {
    hiddenelements[i].style.display = "none";
  }
  shortparameter = true;
  document.getElementById("shortatt").style.display = "inline";
  document.getElementById("shortdef").style.display = "inline";
  document.getElementById("shortlink").innerHTML = '[<a href="?full">Full version</a>]'
  // document.getElementById("fulllink").style.display = "";

  var queryStr = window.location.search;
  if (queryStr == "?full") {
    var hiddenelements = document.getElementsByClassName("shorthide");
    var i;
    for (i = 0; i < hiddenelements.length; i++) {
      hiddenelements[i].style.display = "";
    }
    shortparameter = false;
    document.getElementById("shortatt").style.display = "none";
    document.getElementById("shortdef").style.display = "none";
    document.getElementById("shortlink").innerHTML = '[<a href="?short">Short version</a>]'
    // document.getElementById("fulllink").style.display = "none";
  }
}
function expandcontainer(identifier) {
  var expandindicator = "expandindicator" + identifier;
  var answercontainer = "answercontainer" + identifier;

  if (document.getElementById(expandindicator).innerHTML == "+") {
    document.getElementById(expandindicator).innerHTML = "-";
    document.getElementById(answercontainer).style.display = "block";
    answersexpanded++;
    if (answersexpanded == 18) {
      document.getElementById("expandallindicator1").innerHTML = "- Collapse all";
      document.getElementById("expandallindicator2").innerHTML = "- Collapse all";
    }
  }
  else {
    document.getElementById(expandindicator).innerHTML = "+";
    document.getElementById(answercontainer).style.display = "none";
    answersexpanded--;
    if (answersexpanded > 0) {
      document.getElementById("expandallindicator1").innerHTML = "+ Expand all";
      document.getElementById("expandallindicator2").innerHTML = "+ Expand all";
    }
  }
}
function expandall(indicator) {
  if (document.getElementById("expandallindicator1").innerHTML == "+ Expand all") {
    var expandindicator = "";
    var answercontainer = "";

    for (i = 0; i < 20; i++) {
      expandindicator = "expandindicator" + i;
      answercontainer = "answercontainer" + i;
      if (document.getElementById(expandindicator).innerHTML == "+") {
        document.getElementById(expandindicator).innerHTML = "-";
        document.getElementById(answercontainer).style.display = "block";
      }
    }
    answersexpanded = 20;
    document.getElementById("expandallindicator1").innerHTML = "- Collapse all";
    document.getElementById("expandallindicator2").innerHTML = "- Collapse all";
    if (indicator == 2) {
      expandallindicator2.scrollIntoView(false);
    }
  }
  else {
    var expandindicator = "";
    var answercontainer = "";

    for (i = 0; i < 20; i++) {
      expandindicator = "expandindicator" + i;
      answercontainer = "answercontainer" + i;
      if (document.getElementById(expandindicator).innerHTML == "-") {
        document.getElementById(expandindicator).innerHTML = "+";
        document.getElementById(answercontainer).style.display = "none";
      }
    }
    answersexpanded = 0;
    document.getElementById("expandallindicator1").innerHTML = "+ Expand all";
    document.getElementById("expandallindicator2").innerHTML = "+ Expand all";
    if (indicator == 2) {
      expandallindicator2.scrollIntoView(false);
    }
  }
}
function refreshattackers() {
  var availabilitycheck = false;
  if (refreshcounter == 0) {
    for (i = 0; i < attackers.length; i++) {
      if ((attackers[i].unavailable == true) && (attackers[i].hp > 0)) {
        availabilitycheck = true;
        break;
      }
      if ((attackers[i].type == "Fire Dragon") && (attackers[i].unavailable == false) && (attackers[i].defendersattacked.length > 0)) {
        availabilitycheck = true;
        break;
      }
    }
  }
  if ((availabilitycheck == false) && (refreshcounter == 0)) {
    messageclear();
    document.getElementById("resultatt").innerHTML = "There are no valid attackers that can be refreshed.";
  }
  else if ((availabilitycheck == true) || (refreshcounter > 0)) {
    refreshcounter++;
    if (refreshcounter == 1) {
      messageclear();
      document.getElementById("resultatt").innerHTML = 'Opting to refresh all valid attackers. Press "Attackers:" two more times to confirm.';
    }
    else if (refreshcounter == 2) {
      messageclear();
      document.getElementById("resultatt").innerHTML = 'Opting to refresh all valid attackers. Press "Attackers:" one more time to confirm.';
    }
    else if (refreshcounter == 3) {
      for (i = 0; i < attackers.length; i++) {
        if ((attackers[i].unavailable == true) && (attackers[i].hp > 0)) {
          attackers[i].unavailable = false;
          attackers[i].defendersattacked = [];
          document.getElementById("attacker" + i).style.borderColor = "black";
        }
        if (document.getElementById("attacker" + i).style.borderColor == "green") {
          document.getElementById("attacker" + i).style.borderColor = "black";
          attackers[i].defendersattacked = [];
          if (attackers[i].type == "Fire Dragon") {
            document.getElementById("splash" + i).innerHTML = "<b> </b>";
            attackers[i].originalhp = attackers[i].hp;
          }
        }
      }
      if (deleteselected == true) {
        deleteselected = false;
        document.getElementById("deletebutton").innerText = "Delete Units";

      }
      attackerselected = -1;
      prevattackerselected = -2;
      refreshcounter = 0;
      messageclear();
      document.getElementById("resultatt").innerHTML = 'Attackers refreshed!';
    }
  }
}