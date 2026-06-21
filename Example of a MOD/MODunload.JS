(function() {
    console.log("🛠️ [Matrix Core] 無限再帰エラーの修正パッチを適用します...");

    // ==========================================
    // 1. api_151 〜 api_500 一括インジェクション (バッファ領域のみ安全に確保)
    // ==========================================
    for(let i = 151; i <= 500; i++) {
        // すでに存在している場合は上書きしないセーフティガード
        if (!window[`api_${i}`]) {
            window[`api_${i}`] = function() { return true; };
        }
        
        // 301〜500番のデータ読み書き関数（無限ループが起きない安全な設計）
        window[`api_${i}_setDynamicVariable`] = function(val) { window[`matrix_dyn_${i}`] = val; };
        window[`api_${i}_getDynamicVariable`] = function() { return window[`matrix_dyn_${i}`] || null; };
    }

    // 特徴的なメタAPIの再定義（無限ループを誘発する相互呼び出しをカット）
    window.api_204_clearAllOkubos = function() { 
        if(window.okubos && typeof scene !== 'undefined') { 
            window.okubos.forEach(o => scene.remove(o)); 
            window.okubos = []; 
        } 
    };
    window.api_400_executeSuperNovaClear = function() { 
        window.api_204_clearAllOkubos(); 
        window.gameScore = (window.gameScore || 0) + 5000; 
    };

    // ==========================================
    // 📂 2. 進捗（実績）レジストリの一括マウント
    // ==========================================
    if (window.api_15_addAdvancement) {
        const layers = [{ id: "", pre: "" }, { id: "_b", pre: "【真・" }, { id: "_c", pre: "【極・" }, { id: "_d", pre: "【神・" }, { id: "_e", pre: "【裏・" }, { id: "_f", pre: "【終焉・" }];
        for(let i = 151; i <= 500; i++) {
            layers.forEach(l => {
                window.api_15_addAdvancement(`m${i}${l.id}`, `${l.pre}システム回路${i}${l.pre ? '】' : ''}`, `API ${i} 稼働チェック`);
            });
        }
    }

    // ==========================================
    // 🔗 3. 【修正の要】安全なワンタイム・フック機構
    // ==========================================
    // 以前の、関数の中で関数を何度もラップする方式（再帰）を完全に廃止し、
    // 1度だけトリガーが引かれるフラグ管理方式に変更しました。
    window.MatrixHookTriggered = window.MatrixHookTriggered || {};

    const applySafeHook = (apiName, idNum) => {
        const originalMethod = window[apiName];
        if (!originalMethod || originalMethod.isHooked) return; // 既にフック済ならスキップ

        window[apiName] = function() {
            // まだこのAPIの実績が解除されていなければ解除する（1回のみ実行）
            if (!window.MatrixHookTriggered[idNum]) {
                window.MatrixHookTriggered[idNum] = true;
                if (window.api_16_triggerAdvancement) {
                    window.api_16_triggerAdvancement(`m${idNum}`);
                    window.api_16_triggerAdvancement(`m${idNum}_f`);
                }
            }
            return originalMethod.apply(this, arguments);
        };
        window[apiName].isHooked = true; // 二重ラップ防止フラグ
    };

    // 1〜500までの全APIに安全にフックをかける
    for(let i = 1; i <= 500; i++) {
        if (window[`api_${i}`]) applySafeHook(`api_${i}`, i);
        if (window[`api_${i}_setDynamicVariable`]) applySafeHook(`api_${i}_setDynamicVariable`, i);
    }

    console.log("✅ [Matrix Core] 無限再帰（too much recursion）を完全に修正しました。安全に動作可能です！");
})();