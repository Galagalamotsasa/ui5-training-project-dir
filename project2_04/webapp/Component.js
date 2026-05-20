sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/sap/project204/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("com.sap.project204.Component", {
        metadata: {
            manifest: "json"
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);


        }
    });
});