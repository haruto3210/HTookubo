(function() {
    window.api_59_registerMod("OkuboRadarSystem2026");
    window.api_33_broadcastMessage("🛰️ [Radar Active] 右上に高精度『大久保索敵レーダー』が展開されました。");

    // --- 1. レーダーの土台（UI）を画面右上に強制インジェクション ---
    const radarContainer = document.createElement("div");
    radarContainer.id = "okubo-radar-ui";
    radarContainer.style = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 160px;
        height: 160px;
        background: rgba(10, 25, 15, 0.85);
        border: 2px solid #00ff66;
        border-radius: 50%;
        box-shadow: 0 0 15px rgba(0, 255, 102, 0.5);
        z-index: 999999;
        overflow: hidden;
        pointer-events: none;
        font-family: monospace;
    `;

    // 十字のレティクル（目盛り線）
    radarContainer.innerHTML = `
        <div style="position:absolute; top:50%; left:0; width:100%; height:1px; background:rgba(0,255,102,0.3);"></div>
        <div style="position:absolute; left:50%; top:0; width:1px; height:100%; background:rgba(0,255,102,0.3);"></div>
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:80px; height:80px; border:1px dashed rgba(0,255,102,0.2); border-radius:50%;"></div>
        <div id="radar-player-icon" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-bottom:12px solid #00ff66;"></div>
        <div id="radar-counter" style="position:absolute; bottom:8px; width:100%; text-align:center; color:#00ff66; font-size:10px; text-shadow:0 0 3px #000;">OKB: 0</div>
    `;
    document.body.appendChild(radarContainer);

    // ドットを描画するためのキャンバス層
    const dotContainer = document.createElement("div");
    dotContainer.id = "radar-dot-layer";
    dotContainer.style = "position:absolute; width:100%; height:100%; top:0; left:0;";
    radarContainer.appendChild(dotContainer);

    // --- 2. 毎フレーム（100ms周期）大久保の位置を計算してレーダーを更新 ---
    const radarRange = 40; // レーダーがカバーする半径マス数
    const radarRadius = 80; // UIの半径（ピクセル）

    setInterval(() => {
        // ① プレイヤーの現在位置と視線角度を取得
        const pPos = window.api_20_getPlayerPosition ? window.api_20_getPlayerPosition() : {x:0, y:0, z:0};
        
        // プレイヤーの向いている角度（Yaw）を取得（なければデフォルト0）
        // ※後半APIのPitch/Yaw情報、または内部変数を想定
        const pYaw = window.playerYaw !== undefined ? window.playerYaw : 0; 

        // レーダー中心の自アイコンの向きをプレイヤーのYawに合わせる
        const pIcon = document.getElementById("radar-player-icon");
        if (pIcon) pIcon.style.transform = `translate(-50%, -50%) rotate(${pYaw}deg)`;

        // ドットレイヤーを一旦クリア
        dotContainer.innerHTML = "";

        // ② ゲーム内の全大久保の配列をスキャン
        const okubos = window.okubos || [];
        document.getElementById("radar-counter").innerText = `OKB: ${okubos.length}`;

        okubos.forEach(okubo => {
            if (!okubo || !okubo.position) return;

            // プレイヤーと大久保の相対座標を計算
            const dx = okubo.position.x - pPos.x;
            const dz = okubo.position.z - pPos.z;
            const distance = Math.sqrt(dx * dx + dz * dz);

            // レーダーの範囲内（40マス以内）ならドットを表示
            if (distance <= radarRange) {
                // レーダーUI上のピクセル座標に変換
                const scale = radarRadius / radarRange;
                const screenX = radarRadius + (dx * scale);
                const screenY = radarRadius + (dz * scale); // Z軸がゲーム内の奥行き

                // 赤いエネミードットを生成
                const dot = document.createElement("div");
                dot.style = `
                    position: absolute;
                    left: ${screenX - 3}px;
                    top: ${screenY - 3}px;
                    width: 6px;
                    height: 6px;
                    background: #ff0055;
                    border-radius: 50%;
                    box-shadow: 0 0 6px #ff0055;
                `;
                dotContainer.appendChild(dot);
            }
        });

        // 💥 【おまけ連動】もし先ほどの広告が出現していたらレーダーにノイズが走る
        const adModal = document.getElementById("matrix-intrusive-ad");
        if (adModal) {
            radarContainer.style.borderColor = "#ff0055";
            radarContainer.style.boxShadow = "0 0 15px rgba(255, 0, 85, 0.5)";
            if (Math.random() < 0.3) {
                dotContainer.innerHTML = `<div style="color:#ff0055; font-size:9px; padding:20px; text-align:center; width:100%;">SIGNAL JAMMED BY AD</div>`;
            }
        } else {
            radarContainer.style.borderColor = "#00ff66";
            radarContainer.style.boxShadow = "0 0 15px rgba(0, 255, 102, 0.5)";
        }

    }, 100);

})();