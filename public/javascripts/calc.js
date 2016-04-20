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
    var vars = inputFileProc.grabVariables(responseText);
    inputFileProc.printVars(vars, templatePreviewFormatted);

  });
}

templateSelect.onchange = getTemplateFilename;
document.addEventListener('DOMContentLoaded', getTemplateFilename);

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
var saveButtonTemplate = document.getElementById('save-button-template');
var saveButtonScratch = document.getElementById('save-button-scratch');
