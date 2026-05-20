sap.ui.define([
    // 사용할 모듈들
    "sap/ui/core/ComponentContainer"
], function (
    // 모듈별 별칭
    CC
) {
    "use strict";
    // Component 생성
    var container = new CC({
        id: "ReuseComponentContainer",      // ComponentContainer의 id
        name: "com.sap.project204",         // Component의 이름
        manifest: true,                     // manifest.json을 사용할 때는 true로 설정
        async: true,                        // 비동기로 Component를 로드
        settings: {                         // Component에 전달할 설정값
            id: "com.sap.project204"        // Component의 id (중복 방지)
        }
    });
    // ComponentContainer를 View에 배치
    container.placeAt("content");
});