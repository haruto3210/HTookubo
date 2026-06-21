(function() {
    console.log("🚀 [MOD] 『神羅万象・大久保崩壊パッチ』のコンパイルを開始...");

    // ==========================================
    // 🎛️ MOD専用内部設定・バッファ確保 (api_301〜305のメモリを使用)
    // ==========================================
    window.api_301_setDynamicVariable(true);    // 変数: プレイヤー無敵化フラグ
    window.api_302_setDynamicVariable(1.5);   // 変数: 刀の超スイング速度
    window.api_303_setDynamicVariable(50.0);  // 変数: 超リーチ長
    window.api_304_setDynamicVariable(0);     // 変数: 時間経過カウンタ

    // ==========================================
    // ⚡ 1. プレイヤーの肉体を「神の領域」へ（API適用）
    // ==========================================
    // 神モードON、重力を超低重力(月面)にし、ジャンプ力を強化
    window.api_151_setGodMode(true);
    window.api_220_setGravityValue(0.005); 
    window.api_223_setJumpPowerValue(0.7);
    window.api_250_setInfiniteJumpEnabled(true); // 空中無限ジャンプ許可
    
    // 刀の性能を天元突破させる
    window.api_213_setSwordSwingSpeed(window.api_302_getDynamicVariable());
    window.api_225_setSwordRange(window.api_303_getDynamicVariable());
    window.api_248_setSwordEmissiveIntensity(99.0); // 刀を太陽並みに発光
    window.api_182_setSwordName("🪓 終焉を刻むデバッグ・ブレード");

    // ==========================================
    // 👹 2. 大久保エネミーの「生態系ハック」
    // ==========================================
    window.api_207_setBossSpawnThreshold(30);   // 最大同時出現数を30体に爆増
    window.api_208_setOkuboSpawnRate(0.35);     // スポーン確率を通常の20倍以上に設定
    window.api_177_setOkuboScaleMultiplier(2.5); // 敵のサイズを2.5倍の巨人に変更
    window.api_237_setOkuboDeathScoreReward(5000); // 討伐スコアを5000に跳ね上げる
    window.api_276_setOkuboVelocityYOnSpawn(1.5); // スポーン時に大久保が空高くぶっ飛ぶ

    // ==========================================
    // 🔄 3. リアルタイム・カオスループの構築 (api_241のフックを使用)
    // ==========================================
    // 毎フレーム実行されるゲームのメインループに、このMOD独自のハックを挟み込みます
    window.api_241_setAnimateCallbackHook(function() {
        let ticks = window.api_304_getDynamicVariable() + 1;
        window.api_304_setDynamicVariable(ticks);

        // 🟢 200フレーム（約3秒）毎に、自動で「スーパーノヴァ（全画面即死）」を炸裂させる
        if (ticks % 200 === 0) {
            if (window.api_203_getOkuboCount() > 0) {
                console.log("🌌 [MOD EFFECT] 空間が歪む！スーパーノヴァ発動！");
                window.api_400_executeSuperNovaClear(); // 全滅させてスコア+5000
                
                // メテオをプレイヤーの近くに降らせて地形を破壊
                if (typeof camera !== 'undefined') {
                    window.api_156_spawnMeteor(
                        camera.position.x + (Math.random() - 0.5) * 20,
                        camera.position.z + (Math.random() - 0.5) * 20
                    );
                }
            }
        }

        // 🟢 500フレーム毎に空の色（環境光）をサイケデリックに反転させる
        if (ticks % 500 === 0) {
            const randomColor = Math.floor(Math.random() * 16777215);
            window.api_189_isOkuboFrozen(Math.random() > 0.5); // ランダムで敵の時間を止める
            if (window.api_188_setAmbientLightColorHex) {
                window.api_188_setAmbientLightColorHex(randomColor);
            }
        }

        // 🟢 画面が敵で埋め尽くされて「15体以上」になったら緊急一斉排除
        if (window.api_203_getOkuboCount() >= 15) {
            window.api_204_clearAllOkubos();
            console.log("🚨 [MOD SECURITY] 危険数を検知。空間崩壊を防ぐため大久保を強制消滅させました。");
        }
    });

    // ==========================================
    // 🎉 4. MOD起動アナウンスと実績解放の連動
    // ==========================================
    if (window.api_33_broadcastMessage) {
        window.api_33_broadcastMessage("💀 MOD『神羅万象・大久保崩壊パッチ』がマウントされました！世界がバグり始めます。");
    }
    
    // MODが読み込まれた記念に、進捗第500系統までの裏実績レイヤーに電気を流す
    for(let i=151; i<=500; i+=10) {
        if(window.api_16_triggerAdvancement) window.api_16_triggerAdvancement(`m${i}_f`);
    }

    console.log("✅ [MOD] 常駐完了。ジャンプボタンを連打して空を飛び、大久保共が自動で爆散していく様をお楽しみください。");
})();