sap.ui.define([

], () => {
    "use strict";

    return {
        formatDiscount: (discount) => {
            if (discount == 0 || discount == null || discount == undefined) {
                return "No Discount";
            } else {
                return `${discount*100}%`;
            }
        }
    }
});