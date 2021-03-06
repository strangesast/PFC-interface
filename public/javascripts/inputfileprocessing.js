var inputFileProc = function() {
  var printVars = function(vars, parentElement) {
    general.removeChildren(parentElement);
    for(var prop in vars) {
      var outerElem = general.createElementWithProp('form', {'name': prop, 'type':'outerblock'});
      var headingElem = general.createElementWithProp('h1', {}, prop[0].toUpperCase() + prop.slice(1));
      outerElem.appendChild(headingElem);
  
      for(var subProp in vars[prop].loners) {
        var val = vars[prop].loners[subProp];
        var groupElem = general.createElementWithProp('div', {'class': 'form-group'});
        var propId = String(subProp) + Math.round(Math.random()*100);
        var innerLabel = general.createElementWithProp('label', {'for':propId}, subProp);
        var innerInpt = general.createElementWithProp('input', {
          'id': propId,
          'var':subProp,
          'initval':val,
          'type':'text',
          'value': val,
          'class':'form-control'
        });
        groupElem.appendChild(innerLabel);
        groupElem.appendChild(innerInpt);
        outerElem.appendChild(groupElem);
      }
  
      for(var subProp in vars[prop].smalls) {
        var smallHead = general.createElementWithProp('h2', {}, subProp);
        var smallElem = general.createElementWithProp('div', {});
        smallElem.appendChild(smallHead);
  
        for(var micProp in vars[prop].smalls[subProp]) {
          var val = vars[prop].smalls[subProp][micProp];
          var groupElem = general.createElementWithProp('div', {'class':'form-group'});
  
          var propId = String(micProp) + Math.round(Math.random()*100);
          var micElem = general.createElementWithProp('label', {'for':propId}, micProp);
          var micInpt = general.createElementWithProp('input', {'id':propId, 'var':micProp, 'initval':val, 'class':'form-control', 'type':'text', 'value': val});
          groupElem.appendChild(micElem);
          groupElem.appendChild(micInpt);
          smallElem.appendChild(groupElem);
        }
        outerElem.appendChild(smallElem);
      }
  
      var saveButton = general.createElementWithProp('button', {'class':'btn btn-default'}, 'Save');
      saveButton.addEventListener('click', saveButtonListener);
      outerElem.appendChild(saveButton);
      parentElement.appendChild(outerElem);
    }
  };
  
  var getMatches = function(text, re, extras) {
    var match,
        results = [],
        indicies = [0],
        extra_text = "";
    
    do {
      match = re.exec(text);
      if (match) {
        results.push(match.slice(1));
        indicies.push(match.index);
        indicies.push(match.index + match[1].length);
      }
    } while (match);
    if(extras) {
      for(var i=0; i < indicies.length; i+=2) {
        extra_text += text.slice(indicies[i], indicies[i+1]);
      }
    }
    return [results, extra_text];
  };
  
  // get ready for some shit
  var grabVariables = function(text) {
    // get large groups
    //var re1 = /(\[\w+\][\s\S]*?\[\])/g;
    var re1 = /(\[(\w+)\][\s\S]*?\[\])/g;
    var both1 = getMatches(text, re1, false);
    var round1 = both1[0];
  
    //var re2 = /(\[\.\/\w+\][\s\S]*?\[\.\.\/\])/g;
    var re2 = /(\[\.\/(\w+)\][\s\S]*?\[\.\.\/\])/g;
    var re3 = /(\w+)\s*=\s*(.+)/g;
  
    // get small groups
    var round2;
    var defs = {};
    var smallMatches;
    var defName;
    var orderedDefNames = [];
    round1.forEach(function(each) {
      defName = each[1];
      var loners = {};
      // if trailing defs are present, grab those
      both2 = getMatches(each, re2, true);
  
      if(both2[1]) {
        smallMatches = getMatches(both2[1], re3, false)[0];
        smallMatches.forEach(function(subLoner) {
          for(var i=0; i < smallMatches.length; i+=2) {
            loners[subLoner[0]] = subLoner[1];
          }
        });
      }
  
      // grab defs in small groups
      var smalls = {};
      round2 = both2[0];
      round2.forEach(function(sub) {
        var subelementName = sub[1];
        var smallLoners = {};
        smallMatches = getMatches(sub, re3, false)[0];
        smallMatches.forEach(function(subSmall) {
          smallLoners[subSmall[0]] = subSmall[1];
        });
        smalls[subelementName] = smallLoners;
      });
  
      defs[defName] = {
       'smalls' : smalls,
        'loners' : loners
      };
      orderedDefNames.push(defName);
    });
  
    return defs;
  };
  
  var saveButtonListener = function(e) {
    console.log(e);
  };

  var re1 = /(\[(\w+)\][\s\S]*?\[\])/g;
  //var re2 = /(\[\.\/(\w+)\][\s\S]*?\[\.\.\/\])/g;
  var re2 = /(\[\.\/(\w+)\][\s\S]*?(\[\.\/(\w+)\][\s\S]*?[\s\S]*?\[\.\.\/\][\s\S]*?)*\[\.\.\/\])/g;
  var re3 = /(\w+)\s*=\s*(.+)/g;

  var cops = function(ar) {
    ar.forEach(function(both) {
      var varName = both[1];
      console.log(varName + '=======');
      var text = both[0];

      var both = getMatches(text, re2, true)
      var groups = both[0];
      groups.forEach(function(both) {
        var varName = both[1];
        console.log(varName + ':' + '{}')
        var text = both[0];

        var both = getMatches(text, re2, true);
        var groups = both[0];
        groups.forEach(function(both) {
          var varName = both[1];
          console.log(varName + ':' + '{}')
          var text = both[0];
          var both = getMatches(text, re2, true);
          var groups = both[0];
          // etc
          var defs = getMatches(both[1], re3, true);
          defs[0].forEach(function(pair) {
            console.log(pair[0] + ':' + pair[1]);
          });
        });
        var defs = getMatches(both[1], re3, true);
        defs[0].forEach(function(pair) {
          console.log(pair[0] + ':' + pair[1]);
        });
      })
      var defs = getMatches(both[1], re3, true);
      defs[0].forEach(function(pair) {
        console.log(pair[0] + ':' + pair[1]);
      });
    });
  };

  var grabVariables2 = function(text) {
    // get large groups
    //var re1 = /(\[\w+\][\s\S]*?\[\])/g;

    let both = getMatches(text, re1, true);
    var outerVars = both[0];
    var ob = {}

    cops(outerVars)

  };
 
  return {
    printVars: printVars,
    grabVariables: grabVariables,
    grabVariables2: grabVariables2
  }
}();
