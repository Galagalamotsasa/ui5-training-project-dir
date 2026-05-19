sap.ui.define([
    // 사용할 모듈들
    "sap/ui/core/mvc/XMLView"
], function (
    // 모듈별 별칭
    XMLView
) {
    "use strict";
    XMLView.create({
        id: "ViewDefine",
        viewName: "com.sap.project204.view.Main"
    }).then(function (oView) {
        oView.placeAt("content");
    });
});