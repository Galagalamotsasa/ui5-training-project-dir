sap.ui.define([
    // 사용할 모듈들
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller"
], function (
    // 모듈별 별칭
    Button, Text, MessageToast, Controller
) {
    "use strict";
    var oButton = new Button({
        text: "Press Me",
        press: function () {
            MessageToast.show("Button Pressed!");
        }
    });
    var oText = new Text({
        text: "Hello, World!"
    });
    var oUI = [oButton, oText];

    oUI.forEach(function (oControl) {
        oControl.placeAt("content");
    });
    
    // return Controller.extend("com.sap.project204.controller.Main", {
    //     onInit: function () {
    //         oUI.forEach(function (oControl) {
    //             oControl.placeAt("content");
    //         });
    //     }
    // });
});