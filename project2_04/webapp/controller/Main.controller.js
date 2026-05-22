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
			this.getView().setModel(oJSONModel, "ui"); // 모델을 ui라는 별칭으로 View에 설정
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
		},

		onSelectionChange(oEvent) {
			// 1. 선택된 항목의 컨텍스트 가져오기
			const oItem = oEvent.getParameter("listItem"); // 선택된 항목 가져오기
			const oContext = oItem.getBindingContext(); // 선택된 항목의 바인딩 컨텍스트 가져오기
			
			// 2. 컨텍스트에서 데이터 가져오기
			const oData = oContext.getObject();

			// 3. 가져온 데이터를 SimpleForm에 바인딩하기
			const oSimpleForm = this.byId("simForm");
			oSimpleForm.bindElement(oContext.getPath());
		},

		onSearchCustomer(oEvent) {
			// 1. 검색어 가져오기
			const sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue"); // 검색어 가져오기 (search 이벤트에서는 query, liveChange 이벤트에서는 newValue)

			// 2. 테이블의 바인딩 가져오기
			const oTable = this.byId("customerList");
			const oBinding = oTable.getBinding("items");

			// 3. 필터 생성하기 (CustomerName 필드에 대해 검색)
			const aFilters = [];
			if (sQuery) {
				aFilters.push(new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sQuery));
			}

			// 4. 필터 적용하기
			oBinding.filter(aFilters);
		},

		onButtonPress() {
			// 1. getValue()로 직접 읽기 (컨텍스트 없어도 동작)
			const sForm = this.byId("GenInput1").getValue();
			const sName = this.byId("GenInput2").getValue();
			const sStreet = this.byId("AddrInput1").getValue();
			const sPostCode = this.byId("AddrInput2").getValue();
			const sCity = this.byId("AddrInput3").getValue();
			const sCountry = this.byId("AddrInput4").getValue();

			// 2. 값 확인 (디버깅용)
			console.log("CustomerName:", sName, "Form:", sForm);

			var oDataModel = this.getView().getModel();
			oDataModel.createEntry("/UX_Customer", {
				properties: {           // ← properties 키 필수
					CustomerName: sName,
					Form: sForm,
					Street: sStreet,
					PostCode: sPostCode,
					City: sCity,
					Country: sCountry
				}
			});

			oDataModel.submitChanges({
				success: () => MessageToast.show("고객 생성 성공!"),
				error: () => MessageToast.show("고객 생성 실패.")
			});
			
			// MessageToast.show(`Hello ${sName}!`);
		}
    });
});