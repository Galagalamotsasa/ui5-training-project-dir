sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text"
], (Controller, MessageToast, Dialog, DialogType, Button, ButtonType, Text) => {
    "use strict";

    return Controller.extend("com.sap.project204.controller.Main", {
        onInit() {
        },

        onSayHello() { // Event Handler for Button Press
            MessageToast.show("Hello World! Suckers!");
        },

        onDialogPress: function () {
			if (!this.oApproveDialog) {
				this.oApproveDialog = new Dialog({
					type: DialogType.Message,
					title: "ㄹㅇ로다가?",
					content: new Text({ text: "진심?", wrapping: true, width: "100%", textAlign: "Center" }),
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "ㄹㅇ",
						press: function () {
							MessageToast.show("ㄹㅇ이네!!", { duration: 2000, my: "center top", at: "center top" });
							this.oApproveDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "ㄴㄴ",
						press: function () {
                            MessageToast.show("븅", { duration: 2000, my: "center top", at: "center top" });
							this.oApproveDialog.close();
						}.bind(this)
					})
				});
			}

			this.oApproveDialog.open();
		},
    });
});