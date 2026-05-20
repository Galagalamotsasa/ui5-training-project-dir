sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device"
], (UIComponent, Device) => {
    "use strict";

    return UIComponent.extend("com.sap.project204.Component", {
        metadata: {
            manifest: "json"
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
        },

        getDensity() {
            if (!this._sContentDensityClass) {
                // if (sap.ui.Device.support.touch) { <-- 위에서 Device 모듈을 불러왔으므로, Device.support.touch로 변경
                if (Device.support.touch) { // 터치 지원 여부를 분기로 Predefined CSS 클래스 설정
                    this._sContentDensityClass = "sapUiSizeCozy";
                } else {
                    this._sContentDensityClass = "sapUiSizeCompact";
                }
            }
            return this._sContentDensityClass;
        }
    });
});