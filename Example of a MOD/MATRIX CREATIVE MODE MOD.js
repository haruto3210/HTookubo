(function() {
    console.log("🛠️ [MOD] 『無限の創造主（クリエ手部）MOD』をインジェクトします...");

    // ==========================================
    // 🧰 クリエイティブ手部・内部メモリバッファ設定 (api_310〜315を使用)
    // ==========================================
    window.api_310_setDynamicVariable(true);      // クリエイティブモード有効化フラグ
    window.api_311_setDynamicVariable(99);        // 現在手に持っているブロックID (デフォルト:石)
    window.api_312_setDynamicVariable(0);         // 一撃破壊カウンター
    window.api_313_setDynamicVariable(8.0);       // クリエ用拡張リーチ（通常より長く届く）

    // ==========================================
    // ⚡ 1. クリエイティブ専用の「物理・環境ハック」
    // ==========================================
    window.api_151_setGodMode(true);              // クリエなので当然無敵
    window.api_274_setBlockPlacementReachOverride(window.api_313_getDynamicVariable()); // 建築リーチを8マスに
    window.api_244_setBlockBreakingDelay(0);      // ブロックの破壊遅延を「0」に（一撃即破壊）
    window.api_250_setInfiniteJumpEnabled(true);  // 空中飛行（無限ジャンプ）を完全許可
    window.api_220_setGravityValue(0.0);          // 飛行の挙動を安定させるため重力を一時ゼロに

    // ==========================================
    // 🖐️ 2. マイクラ式「クリエ手部」の動作ロジック（右クリック設置 / 左クリック一撃破壊）
    // ==========================================
    
    // マウス入力イベントをクリエイティブ用にオーバーライド
    window.addEventListener('mousedown', (e) => {
        if (!window.api_310_getDynamicVariable()) return; // クリエOFFならスルー
        if (!isLocked) return; // ポインターロックされてないメニュー時はスルー

        // 左クリック：一撃破壊（クリエイティブ・ブレイク）
        if (e.button === 0) {
            // 本来のapi_25_breakTargetBlock やレイキャストをトリガー
            if (typeof window.api_25_breakTargetBlock === 'function') {
                window.api_25_breakTargetBlock();
                window.api_269_setBlockBreakParticleCount(30); // 破壊パーティクルを大量に散らす
                console.log("🪓 [クリエ手部] ブロックを一撃破壊しました。");
                
                // 実績レイヤーを駆動
                window.api_16_triggerAdvancement("m312_b");
            }
        }
        
        // 右クリック：無限ブロック設置（クリエイティブ・プレイス）
        if (e.button === 2) {
            const currentBlockId = window.api_311_getDynamicVariable();
            if (typeof window.api_24_placeBlockAt === 'function') {
                // レイキャスト先の座標を計算して設置（モック・擬似設置トリガー）
                window.api_24_placeBlockAt(currentBlockId);
                console.log(`🧱 [クリエ手部] アイテムを消費せずにブロック(ID:${currentBlockId})を無限設置しました。`);
                
                window.api_16_triggerAdvancement("m310_c");
            }
        }
    });

    // ==========================================
    // 🔄 3. マウスホイールで手元のアイテムを瞬時に切り替え
    // ==========================================
    window.addEventListener('wheel', (e) => {
        if (!window.api_310_getDynamicVariable()) return;

        // ホイールを回すと手元のブロックIDが1〜5の間でループ切り替え
        let currentId = window.api_311_getDynamicVariable();
        if (e.deltaY > 0) {
            currentId = currentId >= 5 ? 1 : currentId + 1;
        } else {
            currentId = currentId <= 1 ? 5 : currentId - 1;
        }
        
        window.api_311_setDynamicVariable(currentId);
        console.log(`🎒 [クリエ手部] 手に持っているアイテムを切り替えました ➔ ブロックID: ${currentId}`);
        
        // ホットバーUIの同期APIがあれば叩く
        if (window.api_280_setHotbarQuickCycleEnabled) {
            window.api_280_setHotbarQuickCycleEnabled(true);
        }
    });

    // ==========================================
    // ⚙️ 4. 常駐監視ループ (api_241のメインループフック)
    // ==========================================
    window.api_241_setAnimateCallbackHook(function() {
        // クリエイティブ飛行中の慣性減衰を高めてピタッと止まれるようにする（マイクラ特有のあのピタッと止まる操作感）
        window.api_259_setInertiaDampingFactor(0.4); 

        // 飛行中にシフトキーや上昇キーが押された時の上下移動疑似物理
        if (window.keys?.[' ']) {
            camera.position.y += 0.15; // 上昇
        }
    });

    // ==========================================
    // 🎉 5. 導入完了通知
    // ==========================================
    if (window.api_33_broadcastMessage) {
        window.api_33_broadcastMessage("🟩 [CREATIVE] クリエイティブモード（手部システム）がアクティブになりました。左クリックで一撃破壊、右クリックで無限設置、ホイールでアイテム切り替え！");
    }
    console.log("✅ [MOD] クリエ手部パッチの適用が成功しました。");
})();