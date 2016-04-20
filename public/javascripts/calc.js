var templateSelect = document.getElementById('template-select');
var templatePreview = document.getElementById('template-preview');
var templatePreviewRaw = document.getElementById('template-preview-raw');
var templatePreviewFormatted = document.getElementById('template-preview-formatted');

var getTemplateFilename = function(evt) {
  var templateFilename = templateSelect.value;
  console.log(templateFilename);
  general.makeRequest('/templates/' + templateFilename, 'GET').then(function(request) {
    var responseText = request.responseText;

    templatePreviewRaw.textContent = responseText;
    var vars = grabVariables(responseText);
    printVars(vars);

  });
}

templateSelect.onchange = getTemplateFilename;
document.addEventListener('DOMContentLoaded', getTemplateFilename);

var printVars = function(vars) {
  console.log(1)
  general.removeChildren(templatePreviewFormatted);
  console.log(2)
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
    templatePreviewFormatted.appendChild(outerElem);
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

var saveButtonClickEvent = function(e) {
  var value = file_picker.options[file_picker.selectedIndex].value;
  if(inputFileText !== input_file_text.value) {
    console.log("saving...");
    var r = new XMLHttpRequest();
    r.open('POST', '/get_file/' + value);
    r.onload = function(e) {
      console.log(r.response);
      input_file_text.value = r.responseText;
      inputFileText = r.responseText;
    };
    r.onerror = function(e) {
      alert("error! " + e);
    };
    r.send(input_file_text.value);
  
  } else {
    alert("no changes made");
  }
};
//save_button.addEventListener('click', saveButtonClickEvent);
//
var saveButtonListener = function(e) {
  console.log(e);
};

var saveButtonTemplate = document.getElementById('save-button-template');
var saveButtonScratch = document.getElementById('save-button-scratch');
