/**
 * Travel Type Analysis
 * 선택된 관심사(최대 3개)를 받아 여행 타입을 결정하는 임시 로직.
 */

(function (global) {
    'use strict';

    // 관심사 → 카테고리 매핑 (Activity / Culture / Healing)
    var INTEREST_CATEGORY = {
        'Hiking': 'activity',
        'Surfing': 'activity',
        'Skiing': 'activity',
        'Urban Exploration': 'activity',
        'Kayaking': 'activity',
        'Museums': 'culture',
        'Architecture': 'culture',
        'Local Festivals': 'culture',
        'History': 'culture',
        'Gourmet Food': 'culture',
        'Spa & Wellness': 'healing',
        'Beach Lounging': 'healing',
        'Nature Walks': 'healing',
        'Yoga Retreats': 'healing',
        'Hot Springs': 'healing'
    };

    // 관심사/카테고리 조합 → 여행 타입 라벨 (임시)
    var TRAVEL_TYPES = {
        adventure: { label: 'Adventure', desc: '액티비티와 탐험이 중심인 여행', emoji: '🏔️' },
        culture: { label: 'Culture & Art', desc: '문화·역사·미식 중심의 여행', emoji: '🎭' },
        healing: { label: 'Healing', desc: '휴식·힐링·웰니스 중심의 여행', emoji: '🌿' },
        balanced: { label: 'Balanced', desc: '액티비티·문화·휴식이 골고루 섞인 여행', emoji: '✨' }
    };

    /**
     * 선택된 관심사 배열(최대 3개)을 받아 여행 타입을 결정합니다.
     * @param {string[]} selectedInterests - 선택된 관심사 이름 배열 (예: ['Surfing', 'Museums', 'Beach Lounging'])
     * @returns {{ type: string, label: string, description: string, emoji: string, selected: string[], categoryCounts: object }}
     */
    function analyzeTravelType(selectedInterests) {
        var selected = Array.isArray(selectedInterests) ? selectedInterests.slice(0, 3) : [];
        var categoryCounts = { activity: 0, culture: 0, healing: 0 };

        selected.forEach(function (name) {
            var cat = INTEREST_CATEGORY[name];
            if (cat && categoryCounts.hasOwnProperty(cat)) {
                categoryCounts[cat]++;
            }
        });

        var typeKey = 'balanced';
        var maxCount = Math.max(categoryCounts.activity, categoryCounts.culture, categoryCounts.healing);
        if (maxCount >= 2) {
            if (categoryCounts.activity >= 2) typeKey = 'adventure';
            else if (categoryCounts.culture >= 2) typeKey = 'culture';
            else if (categoryCounts.healing >= 2) typeKey = 'healing';
        } else if (maxCount === 1) {
            if (categoryCounts.activity === 1 && !categoryCounts.culture && !categoryCounts.healing) typeKey = 'adventure';
            else if (categoryCounts.culture === 1 && !categoryCounts.activity && !categoryCounts.healing) typeKey = 'culture';
            else if (categoryCounts.healing === 1 && !categoryCounts.activity && !categoryCounts.culture) typeKey = 'healing';
        }

        var info = TRAVEL_TYPES[typeKey] || TRAVEL_TYPES.balanced;
        return {
            type: typeKey,
            label: info.label,
            description: info.description,
            emoji: info.emoji,
            selected: selected,
            categoryCounts: categoryCounts
        };
    }

    global.analyzeTravelType = analyzeTravelType;
})(typeof window !== 'undefined' ? window : this);
