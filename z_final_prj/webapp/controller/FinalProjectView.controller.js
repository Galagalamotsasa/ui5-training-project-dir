sap.ui.define([// 의존성 모듈 나열
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text",
	"sap/ui/model/json/JSONModel"
], (Controller, MessageToast, Dialog, DialogType, Button, ButtonType, Text, JSONModel) => { // 의존성 모듈이 콜백 함수의 매개변수로 전달됨
    "use strict";

    return Controller.extend("com.sap.ux01.zfinalprj.controller.FinalProjectView", {
        onInit() {
            
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
		},

        onUploadBusinessCard() {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment(
                    "com.sap.ux01.zfinalprj.view.AIDocUpload", // ← 이 ID 기준으로 Fragment.byId 동작
                    "com.sap.ux01.zfinalprj.view.AIDocUpload",
                    this
                );
                this.getView().addDependent(this._oDialog);
            }
            this._oDialog.open();
        },

        onUploadImage() {
            const oFileUploader = sap.ui.core.Fragment.byId("com.sap.ux01.zfinalprj.view.AIDocUpload", "imageUploader");
            oFileUploader.upload();
        },

        checkImageUpload(docid) {
            return new Promise((resolve, reject) => {
                jQuery.ajax({
                    url: "/sap/bc/aidoc/documents/job?docid=" + docid,
                    type: "GET",
                    contentType: "application/json",
                    dataType: "json",
                    success: (oData) => {
                        console.log("업로드된 이미지 정보:", oData);
                        resolve(oData);
                    },
                    error: () => reject(false)
                });
            });
        },

        onUploadComplete(oEvent) {
            // response 대신 responseRaw 사용
            const sRaw = oEvent.getParameter("responseRaw");
            
            if (!sRaw) {
                MessageToast.show("응답이 없습니다.");
                return;
            }

            const oJSON = JSON.parse(sRaw);
            const sDocId = oJSON.id; // docid가 아니라 "id" 키로 옴

            const oText = sap.ui.core.Fragment.byId(
                "com.sap.ux01.zfinalprj.view.AIDocUpload", "docid"
            );
            oText.setText(sDocId);
            MessageToast.show("업로드 완료! Doc ID: " + sDocId);
        },

        onSaveDocument() {
            const sDocId = sap.ui.core.Fragment.byId(
                "com.sap.ux01.zfinalprj.view.AIDocUpload", "docid"
            ).getText();

            if (!sDocId) {
                MessageToast.show("먼저 이미지를 업로드해주세요.");
                return;
            }

            this.checkImageUpload(sDocId)
                .then((docData) => {
                    console.log("이미지에서 추출된 데이터:", docData);

                    // status 체크
                    if (docData.status === "PENDING") {
                        MessageToast.show("AI 분석 중입니다. 잠시 후 다시 시도해주세요.");
                        return;
                    } else if (docData.status !== "DONE") {
                        MessageToast.show("분석 실패. 상태: " + docData.status);
                        return;
                    }

                    // extraction.headerFields 배열에서 name 기준으로 값 추출
                    const aFields = docData.extraction?.headerFields || [];
                    const getField = (name) => {
                        const oField = aFields.find(f => f.name === name);
                        return oField ? oField.value : "";
                    };

                    console.log("headerFields:", aFields); // 필드명 확인용

                    const oDataModel = this.getView().getModel();
                    oDataModel.createEntry("/UX_Customer", {
                        properties: {
                            CustomerName: (getField("FirstName") + " " + getField("LastName")).trim() || "N/A",
                            Form: getField("Title") || "N/A",
                            Street: getField("companyName") || getField("form") || "N/A"
                        }
                    });

                    oDataModel.submitChanges({
                        success: () => {MessageToast.show("고객 저장 성공!"); this.onCloseDialog();},
                        error: () => MessageToast.show("고객 저장 실패.")
                    });
                })
                .catch(() => {
                    MessageToast.show("이미지 정보 확인 실패.");
                });
        },

        onCloseDialog() {
            if (this._oDialog) {
                this._oDialog.close();
            }
        }
    });
});