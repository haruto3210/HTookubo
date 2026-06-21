(function() {
    window.api_59_registerMod("UltimateSurvivalMOD");

    function startSurvivalGame() {
        window.api_108_clearChatConsole();
        window.api_33_broadcastMessage("🔥 [Matrix Core 2026] アルティメット・サバイバルが起動しました。");

        // --- 1. 世界の完全初期化とプレイヤーリセット ---
        window.api_54_healToMax();                     // HP全回復
        window.api_34_resetAllAdvancements();           // 実績リセット
        window.api_44_instantlyClearLoadedOkubos();     // 既存のOkuboを消去
        window.api_116_resetGravityNormal();            // 重力を通常に戻す
        
        // 既存のバイオームを取得して世界を完全再構築
        const currentBiome = window.api_111_getBiomePatternType() || "default";
        window.api_52_setBiomePatternType(currentBiome); 

        // 安全のためにプレイヤーを上空へテレポート、視界FOVを少し広げて緊張感を演出
        window.api_1_teleport(0, 30, 0);
        window.api_75_setFov(85);

        // --- 2. プレイヤーへの初期装備配布 ---
        // 武器を最強に設定し、スロット8に「伝説の大剣」を支給
        window.api_69_setSwordDamage(50);              // 攻撃力を大幅UP
        window.api_67_setSwordColor(0x00ffcc);          // 剣の色をサイバーグリーンに
        window.api_129_giveLegendarySword();            // 伝説の大剣を付与
        window.api_29_setHotbarSlot(8);                 // 強制的に大剣を持たせる

        // --- 3. 敵（Okubo）の絶望的強化 ＆ 環境演出 ---
        window.api_127_setOkuboSpeedExtreme();          // おおくぼの移動速度を4.0倍（極限状態）に
        window.api_21_setSkyColor(0x1a0033);            // 空を不気味な深紫色へ
        window.api_120_setFogColor(0x1a0033);           // 霧の色も同期
        window.api_37_setFogDensity(0.06);              // 霧をさらに濃く

        // 3秒ごとに大久保が大量に降ってくる
        const spawnInterval = setInterval(() => {
            window.api_40_massSpawnOkubo(4);            // 通常の奴らを4体
            
            // 15%の確率で「超巨大なボス大久保（HP500）」がプレイヤーの近くに降臨
            if (Math.random() < 0.15) {
                const p = window.api_20_getPlayerPosition();
                window.api_119_spawnGiantOkubo(p.x + (Math.random() - 0.5) * 20, p.y + 10, p.z + (Math.random() - 0.5) * 20);
                window.api_33_broadcastMessage("⚠️ 警告: 巨大オオクボ（HP 500）が接近中！");
            }
            
            // スポーンしたすべてのオオクボのHPを100以上に底上げ＆巨大化
            window.api_42_setAllOkuboHP(120);
            window.api_105_setOkuboScaleAll(1.8);       // 通常サイズも1.8倍に
        }, 3000);

        // --- 4. 画面中央上のタイマーUI設置 ---
        const oldTimer = document.getElementById('survival-timer');
        if (oldTimer) oldTimer.remove();
        
        const timerElement = document.createElement('div');
        timerElement.id = 'survival-timer';
        Object.assign(timerElement.style, {
            position: 'fixed', top: '25px', left: '50%', transform: 'translateX(-50%)',
            padding: '14px 28px', background: 'rgba(10, 0, 20, 0.85)', color: '#00ffcc',
            fontFamily: '\'Courier New\', monospace', fontSize: '38px', fontWeight: 'bold',
            borderRadius: '10px', border: '3px solid #00ffcc',
            boxShadow: '0 0 25px rgba(0, 255, 204, 0.7)', zIndex: '9999', pointerEvents: 'none'
        });
        document.body.appendChild(timerElement);

        // --- 5. カウントダウン＆生存判定判定ループ ---
        let timeLeft = 60;
        
        const timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.innerText = `⏱️ TIME LEFT: ${timeLeft}s`;

            // ラスト15秒から画面を激しく揺らし、危機感を煽る
            if (timeLeft <= 15) {
                window.api_82_shakeCamera(0.8);
                timerElement.style.color = '#ff0055';
                timerElement.style.borderColor = '#ff0055';
                timerElement.style.boxShadow = '0 0 25px rgba(255, 0, 85, 0.9)';
            }

            // 【ゲームオーバー判定】
            if (window.health <= 0) {
                clearInterval(timerInterval);
                clearInterval(spawnInterval);
                timerElement.remove();
                window.api_33_broadcastMessage("💀 ライフが尽きました。");
                showEndScreen(false);
                return;
            }

            // 【ゲームクリア判定】1分間逃げ切り
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                clearInterval(spawnInterval);
                timerElement.remove();
                
                window.api_128_setOkuboSpeedNormal(); // 速度を戻す
                window.api_44_instantlyClearLoadedOkubos(); // 敵を全消去
                window.api_144_addScoreMultiplier(10); // クリアボーナススコア
                
                showEndScreen(true);
            }
        }, 1000);
    }

    // --- 6. ゲームクリア / ゲームオーバーのオーバーレイUI表示 ---
    function showEndScreen(isClear) {
        const oldScreen = document.getElementById('end-game-screen');
        if (oldScreen) oldScreen.remove();

        const screen = document.createElement('div');
        screen.id = 'end-game-screen';
        Object.assign(screen.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            background: isClear ? 'rgba(5, 20, 15, 0.95)' : 'rgba(20, 5, 5, 0.95)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            zIndex: '10000', fontFamily: 'sans-serif'
        });

        // タイトルテキスト
        const title = document.createElement('h1');
        title.innerText = isClear ? '👑 SURVIVAL COMPLETE 👑' : '❌ MISSION FAILED ❌';
        title.style.color = isClear ? '#00ffcc' : '#ff3355';
        title.style.fontSize = '72px';
        title.style.letterSpacing = '2px';
        title.style.marginBottom = '10px';
        title.style.textShadow = isClear ? '0 0 30px rgba(0,255,204,0.6)' : '0 0 30px rgba(255,51,85,0.6)';
        screen.appendChild(title);

        // サブテキスト
        const sub = document.createElement('p');
        sub.innerText = isClear ? 'あなたはマトリクスの猛攻に耐え抜いた。' : '大久保の軍勢に圧倒されました。';
        sub.style.color = '#888';
        sub.style.fontSize = '18px';
        sub.style.marginBottom = '30px';
        screen.appendChild(sub);

        // 今回の最終戦績スコア
        const scoreText = document.createElement('div');
        scoreText.innerText = `TOTAL SCORE: ${window.api_23_getScore()}`;
        scoreText.style.color = '#fff';
        scoreText.style.fontSize = '28px';
        scoreText.style.fontFamily = 'monospace';
        scoreText.style.marginBottom = '40px';
        screen.appendChild(scoreText);

        // 「もう一度チャレンジ」ボタン（世界の完全リセットスイッチ）
        const button = document.createElement('button');
        button.innerText = isClear ? 'もう一度チャレンジ（世界リセット）' : '世界をリセットしてリベンジ';
        Object.assign(button.style, {
            padding: '18px 45px', fontSize: '22px', fontWeight: 'bold',
            color: '#000', background: isClear ? '#00ffcc' : '#ff3355',
            border: 'none', borderRadius: '4px', cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0,0,0,0.4)', transition: '0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
        });
        
        button.onmouseover = () => {
            button.style.transform = 'scale(1.05) translateY(-2px)';
            button.style.boxShadow = '0 12px 25px rgba(0,0,0,0.5)';
        };
        button.onmouseout = () => {
            button.style.transform = 'scale(1) translateY(0)';
            button.style.boxShadow = '0 8px 20px rgba(0,0,0,0.4)';
        };
        
        // 再びリセット関数を発火して即時リスタート
        button.onclick = () => {
            screen.remove();
            startSurvivalGame();
        };

        screen.appendChild(button);
        document.body.appendChild(screen);
    }

    // MOD発動
    startSurvivalGame();
})();