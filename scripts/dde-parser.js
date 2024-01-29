function parseEquations() {
	var xdotText = document.getElementById('xdotText').value;
	var ydotText = document.getElementById('ydotText').value;
	var modelText = 'model = [' + replaceTerms(xdotText) + 
					',\n\t' + replaceTerms(ydotText) + ']';

	return modelText;
}

function copyToClipboard() {
	var outputText = document.getElementById('outputText');
	outputText.select();
	navigator.clipboard.writeText(outputText.value);
}

// Parser function (adapted from previous Python code)
function replaceTerms(inputText) {
	inputText = inputText.replace(
		/(x|y)\s*\(\s*t\s*-\s*[\w\/]+\s*\)/g,
		function(match, p1) {

		var varIndex = p1 === 'x' ? '0' : '1';
		var delayPart = match.split('-')[1];
		return 'y(' + varIndex + ', t-' + delayPart.trim() ;
	});

	inputText = inputText.replace(/\bx(?!\()\b/g, 'y(0, t)');
	inputText = inputText.replace(/\by(?!\()\b/g, 'y(1, t)');
	return inputText.trim();
}

function parseParameters(inputText) {
	var potentialParams = inputText.match(/\b[a-zA-Z_]\w*(?!\s*\()/g) || [];
	var params = potentialParams.filter(function(value, index, self) {
		return self.indexOf(value) === index && value !== 'x' && value !== 'y' && value !== 't' && value !== 'model';
	});
	return params;
}

function parameterDeclaration(inputText) {
	// Add parameter declarations to the output
	var paramDeclarations = parseParameters(inputText).map(function(param) {
		return param + ' = Symbol("' + param + '")\n';
	}).join('');

	return paramDeclarations;
}

function loadAndProcessTemplate() {
	var fileInput = document.getElementById('templateFile');
	var file = fileInput.files[0];
	if (file) {
		var reader = new FileReader();
		reader.onload = function(e) {
			var templateContent = e.target.result;

			var parsedEquations = parseEquations()

			var paramsText = parseParameters(parsedEquations);
			var ddeModelText = "\n\nDDE = jitcdde(model, control_pars=[" + paramsText + "])"


			var finalOutput = templateContent.replace('{parameters block}', parameterDeclaration(parsedEquations));
			var finalOutput = finalOutput.replace('{model block}', parsedEquations + ddeModelText);
			document.getElementById('outputText').value = finalOutput;
		};
		reader.readAsText(file);
	} else {
		alert("Please upload a template file.");
	}
}
