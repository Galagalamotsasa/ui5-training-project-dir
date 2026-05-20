sap.ui.define([// 의존성 모듈 나열
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text",
	"sap/ui/model/json/JSONModel"
], (Controller, MessageToast, Dialog, DialogType, Button, ButtonType, Text, JSONModel) => {// 의존성 모듈이 콜백 함수의 매개변수로 전달됨
    "use strict";

    return Controller.extend("com.sap.project204.controller.Main", {
        onInit() {
			// 1. Component에서 Content Density Class 가져오기
			var sDensityClass = this.getOwnerComponent().getDensity();

			// 2. View에 Content Density Class 적용하기
			if (sDensityClass) {
				this.getView().addStyleClass(sDensityClass);
			}

			// 3. JSON 모델 생성 및 데이터 바인딩
			var sPath = sap.ui.require.toUrl("com/sap/project204/model/data.json"); // JSON 파일의 경로
			var oJSONModel = new JSONModel(sPath); // JSON 파일에서 데이터 로드
			this.getView().setModel(oJSONModel, "sampleJSONModel"); // 모델을 View에 설정 (이름은 "myModel")
        },

        onSayHello() { // Event Handler for Button Press
            MessageToast.show("Hello World! Suckers!");
        },

        onDialogPress() {
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

		onNavigate(to) {
			// 1. App 객체 취득하기
			const oApp = this.byId("defaultApp");

			// 2. 화면 이동하기
			const oPage = this.byId(to || "page02");
			oApp.to(oPage);
		},

		onF4Country() {
			// 1. 팝업창 Load 하기(Fragment 활용)
			if (!this._oCountryDialog) {
				this._oCountryDialog = this.loadFragment({
					name: "com.sap.project204.view.Dialog", // Fragment의 이름
					type: "XML" // Fragment의 타입
				});
				// this.getView().addDependent(this._oCountryDialog); // View에 Fragment를 종속시켜서 라이프사이클 관리
			}

			// 2. 팝업창 띄우기
			this._oCountryDialog.then(oDialog => oDialog.open());
		},

		onCloseDialog() {
			// 사용자가 선택한 국가를 메인 화면으로 전달 (예시에서는 KR로 고정)
			this.byId("AddrInput4").setValue("KR");

			this._oCountryDialog.then(oDialog => oDialog.close());
		}
    });
});