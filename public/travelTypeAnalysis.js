/**
 * 여행 타입 분석 - backend-fastapi domain 기준 한글화
 * 선택된 관심사(3개)를 받아 여행 타입을 결정합니다.
 */
(function (global) {
    'use strict';

    // 관심사 → 여행 타입 매핑 (domain KEYWORD_TO_TYPE 기준)
    var KEYWORD_TO_TYPE = {
        '자전거': '액티브형', '등산': '액티브형', '수영': '액티브형', '서핑': '액티브형', '런닝': '액티브형', '트레킹': '액티브형',
        '카페': '힐링형', '독서': '힐링형', '온천': '힐링형', '스파': '힐링형', '요가': '힐링형', '명상': '힐링형',
        '쇼핑': '문화형', '미술': '문화형', '박물관': '문화형', '공연': '문화형', '전시': '문화형', '영화': '문화형',
        '캠핑': '자연형', '낚시': '자연형', '사진': '자연형', '별보기': '자연형',
        '맛집': '미식형', '요리': '미식형', '와인': '미식형', '디저트': '미식형', '푸드투어': '미식형',
        '번지점프': '모험형', '패러글라이딩': '모험형', '스쿠버다이빙': '모험형', '암벽등반': '모험형', '오프로드': '모험형',
        '일몰': '감성형', '야경': '감성형', '음악': '감성형'
    };

    var TRAVEL_TYPES = {
        '액티브형': { label: '액티브형', desc: '체력 소모가 많은 활동적인 여행을 즐기는 타입' },
        '힐링형': { label: '힐링형', desc: '느긋하게 쉬면서 재충전하는 여행을 선호하는 타입' },
        '문화형': { label: '문화형', desc: '도시의 문화와 예술을 즐기는 여행을 선호하는 타입' },
        '자연형': { label: '자연형', desc: '자연 속에서 시간을 보내는 것을 좋아하는 타입' },
        '미식형': { label: '미식형', desc: '맛집 탐방과 음식 경험을 중시하는 타입' },
        '모험형': { label: '모험형', desc: '새로운 경험과 도전을 즐기는 타입' },
        '감성형': { label: '감성형', desc: '분위기와 감성을 중시하는 여행을 선호하는 타입' },
        '복합형': { label: '복합형', desc: '여러 성향이 골고루 섞여 있는 균형잡힌 타입' }
    };

    function analyzeTravelType(selectedInterests) {
        var selected = Array.isArray(selectedInterests) ? selectedInterests.slice(0, 3) : [];
        var typeCounts = {};

        selected.forEach(function (name) {
            var t = KEYWORD_TO_TYPE[name] || '복합형';
            typeCounts[t] = (typeCounts[t] || 0) + 1;
        });

        var typeKey = '복합형';
        var maxCount = 0;
        for (var k in typeCounts) {
            if (typeCounts[k] > maxCount) {
                maxCount = typeCounts[k];
                typeKey = k;
            }
        }

        var info = TRAVEL_TYPES[typeKey] || TRAVEL_TYPES['복합형'];
        return {
            type: typeKey,
            label: info.label,
            description: info.desc,
            emoji: '✨',
            selected: selected
        };
    }

    global.analyzeTravelType = analyzeTravelType;
})(typeof window !== 'undefined' ? window : this);
