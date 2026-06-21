(function() {
    window.api_59_registerMod("NewEnemyAndSoundInjection2026");
    window.api_33_broadcastMessage("👾 [Matrix Core] 警告：未知のバグエネミー『エラーバグ』及び専用音響がインジェクトされました。");

    // --- 1. 新エネミー「エラーバグ」のデータ管理 ---
    window.errorBugs = []; // 新しい敵の配列

    // シンセサイザーによる特殊効果音の生成関数
    function playCustomSound(type) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            if (type === 'glitch_spawn') {
                // エラーバグ誕生時のデジタルバグ音
                osc.type = "square";
                osc.frequency.setValueAtTime(100, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            } else if (type === 'bug_cry') {
                // エラーバグが迫ってくるときのみじかい警告音
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(600, ctx.currentTime);
                osc.frequency.setValueAtTime(300, ctx.currentTime + 0.05);
                gain.gain.setValueAtTime(0.05, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            } else if (type === 'bug_death') {
                // エラーバグを撃破した時の電子的な消滅音
                osc.type = "triangle";
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.4);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            }
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + 0.5);
        } catch(e) {}
    }

    // エラーバグを画面上に物理生成（HTML要素として視覚化）
    window.spawnErrorBug = function() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const bugEl = document.createElement("div");
        bugEl.className = "matrix-error-bug";
        bugEl.style = `
            position: fixed; width: 30px; height: 30px;
            background: #ffea00; border: 2px solid #000;
            box-shadow: 0 0 15px #ffea00; border-radius: 50%;
            z-index: 99998; color: #000; font-weight: bold;
            display: flex; justify-content: center; align-items: center;
            font-size: 14px; font-family: monospace; pointer-events: none;
        `;
        bugEl.innerText = "⚠";
        document.body.appendChild(bugEl);

        // プレイヤー（画面中央）の周囲にランダムに配置
        const angle = Math.random() * Math.PI * 2;
        const distance = 300 + Math.random() * 200; // 画面外から迫ってくる
        const startX = screenWidth / 2 + Math.cos(angle) * distance;
        const startY = screenHeight / 2 + Math.sin(angle) * distance;

        const bugData = {
            element: bugEl,
            x: startX, y: startY,
            health: 20,
            speed: 1.8 + Math.random() * 1.5, // 大久保より少し素早い
            age: 0
        };

        window.errorBugs.push(bugData);
        playCustomSound('glitch_spawn');
    };

    // --- 2. 新エネミーの行動AI ＆ プレイヤーへの襲撃ループ (秒間60回) ---
    setInterval(() => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const playerX = screenWidth / 2;
        const playerY = screenHeight / 2;

        for (let i = window.errorBugs.length - 1; i >= 0; i--) {
            const bug = window.errorBugs[i];
            bug.age++;

            // プレイヤーに向かって直線的に突き進むAI
            const dx = playerX - bug.x;
            const dy = playerY - bug.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // 接近している時に不気味な鳴き声/駆動音をランダムに鳴らす
            if (bug.age % 80 === 0 && Math.random() < 0.4) {
                playCustomSound('bug_cry');
            }

            if (dist > 10) {
                bug.x += (dx / dist) * bug.speed;
                bug.y += (dy / dist) * bug.speed;
            }

            // プレイヤーに到達（接触）したらダメージを与えて自爆
            if (dist < 30) {
                bug.element.remove();
                window.errorBugs.splice(i, 1);
                
                // プレイヤー自傷APIを実行
                if (window.api_14_damagePlayer) {
                    window.api_14_damagePlayer();
                } else {
                    window.health = Math.max(0, (window.health || 20) - 4);
                }
                window.api_33_broadcastMessage("💥 エラーバグが自爆！ 4ポイントのダメージを受けました。");
                continue;
            }

            // 位置の描画更新
            bug.element.style.left = `${bug.x}px`;
            bug.element.style.top = `${bug.y}px`;
            // バグっぽく常に小刻みに震えさせる
            bug.element.style.transform = `translate(${(Math.random()-0.5)*4}px, ${(Math.random()-0.5)*4}px)`;
        }
    }, 1000 / 60);

    // 15秒ごとに新しいエラーバグが自動で2体スポーン
    setInterval(() => {
        if (window.errorBugs.length < 5) {
            window.spawnErrorBug();
            window.spawnErrorBug();
        }
    }, 15000);

    // --- 3. 前回の「対大久保レーザー」をハックして、新エネミーも狙撃可能にする ---
    window.addEventListener("mousedown", function(e) {
        // 前回の銃が装備されている状態で左クリックされたら、一番近いエラーバグを射撃
        if (e.button === 0 && window.errorBugs && window.errorBugs.length > 0) {
            // 現在のメニュー開閉やリロード状態をチェック（前回の変数に依存）
            const oldHud = document.getElementById("matrix-no-inv-hud");
            if (oldHud && oldHud.style.display !== "none") {
                
                // 最も近くにいるエラーバグにダメージを与える
                const targetBug = window.errorBugs[0]; 
                targetBug.health -= 10; // 2発で倒せる

                if (targetBug.health <= 0) {
                    playCustomSound('bug_death');
                    targetBug.element.remove();
                    window.errorBugs.shift();
                    window.api_33_broadcastMessage("🎯 エラーバグを撃破！ 空間の脆弱性が修正されました。");
                    
                    // マイクラ風物理ドロップ（前回の関数）とも連動
                    if (window.spawnRecoveryItem) {
                        window.spawnRecoveryItem();
                    }
                }
            }
        }
    });

    // --- 4. 【おまけ】右上のレーダーにエラーバグを「黄色いドット」で表示させる割り込み ---
    // 前回のレーダーループに干渉するためのオーバーライド
    const oldRadarLayer = document.getElementById("radar-dot-layer");
    if (oldRadarLayer) {
        setInterval(() => {
            // エラーバグのドットをレーダーに強制同期表示
            window.errorBugs.forEach(bug => {
                const radarUi = document.getElementById("okubo-radar-ui");
                if (!radarUi) return;
                
                // 画面上の相対位置から簡易的にレーダー内の位置へマッピング
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;
                const rx = ((bug.x - screenWidth/2) / 5) + 80;
                const ry = ((bug.y - screenHeight/2) / 5) + 80;

                if (rx >= 0 && rx <= 160 && ry >= 0 && ry <= 160) {
                    const yellowDot = document.createElement("div");
                    yellowDot.style = `
                        position: absolute; left: ${rx}px; top: ${ry}px;
                        width: 5px; height: 5px; background: #ffea00;
                        border-radius: 50%; box-shadow: 0 0 5px #ffea00;
                    `;
                    oldRadarLayer.appendChild(yellowDot);
                }
            });
        }, 100);
    }

})();