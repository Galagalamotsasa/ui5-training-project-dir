sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("projectsicf.controller.Main", {
      onInit() {
        },

        callGet: function() {
                jQuery.ajax({
                    url: "/sap/bc/aidoc/documents/job?docid=" + this.getView().byId("docid").getValue(),
                    type: "GET", 
                    contentType: "application/json", 
                    dataType: "json",
                    success: function (oData) {
                        //oData로 분석될 결과과 전달됨....
                       sap.m.MessageToast.show(oData.upload_user + "/" + 
                                               oData.upload_date + "/" + 
                                               oData.upload_time + "/" + 
                                               oData.upload_file 
                       );
                    },
                    error: function () {
                        sap.m.MessageToast.show("Error during AJAX call.");
                    }
                })              
        },

        callPost:function() {
            const oFileUploader = this.byId("fileUploader");
            oFileUploader.upload();
        },

        onFileUploadComplete: function(oEvent) {            
            var oJSON = JSON.parse(oEvent.getParameter("response"));
            MessageToast.show(oJSON.docid);
        }     
    });
});