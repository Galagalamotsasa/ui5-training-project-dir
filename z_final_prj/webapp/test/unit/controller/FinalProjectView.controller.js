/*global QUnit*/

sap.ui.define([
	"com/sap/ux01/zfinalprj/controller/FinalProjectView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("FinalProjectView Controller");

	QUnit.test("I should test the FinalProjectView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
