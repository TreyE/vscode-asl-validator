//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {

	test("Activate the extension and ensure the command it is registered", function() {
	    var extension = vscode.extensions.getExtension("TreyE.vscode-asl-validator");
	    if (extension) {
		    extension.activate().then( () => {
			    vscode.commands.getCommands().then((commands) => { assert(commands.indexOf("extension.vscode-asl-validator") > -1) });
		    });
	    }
    });

    test("Activate the extension and run it against a newly-open editor", async function() {
	    var extension = vscode.extensions.getExtension("TreyE.vscode-asl-validator");
	    assert(extension);
	    if (extension) {
				await extension.activate();
				var doc = await vscode.workspace.openTextDocument();
				await vscode.window.showTextDocument(doc);
				assert(vscode.window.activeTextEditor);
				await vscode.commands.executeCommand("extension.vscode-asl-validator");
			}
		});
});
