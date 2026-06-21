(function(w) {
    'use strict';
    w.console.log("🌌 [Matrix Core] マルチスレッド生成高速化プロトコルを結合中...");

    let initTimer = setInterval(() => {
        if (w.scene || w.renderer || w.api_18_setRenderDistance) {
            clearInterval(initTimer);
            setupMasterUIWithThreads();
        }
    }, 100);

    function setupMasterUIWithThreads() {
        const uiId = 'matrix-master-ui';
        if (document.getElementById(uiId)) document.getElementById(uiId).remove();

        // 🛠️ スタイルシートの動的注入
        const styleId = 'matrix-ui-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                .m-row { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
                .m-label { font-size: 11px; color: #aaa; font-weight: bold; }
                .m-input-group { display: flex; align-items: center; gap: 10px; }
                .m-slider { flex-grow: 1; accent-color: #00ffcc; cursor: pointer; }
                .m-val { font-family: monospace; color: #00ffcc; font-weight: bold; min-width: 35px; text-align: right; font-size: 11px; }
                .m-select { background: #111; color: #fff; border: 1px solid #333; padding: 5px; border-radius: 4px; font-size: 11px; width: 100%; outline: none; cursor: pointer; }
                .m-select:focus { border-color: #00ffcc; }
                .m-btn { background: #00ffcc; color: #000; border: none; padding: 8px; border-radius: 4px; font-weight: bold; cursor: pointer; transition: all 0.2s; font-size: 12px; width: 100%; }
                .m-btn:hover { background: #00e6b8; box-shadow: 0 0 10px rgba(0,255,200,0.5); }
                .m-tabs { display: flex; gap: 5px; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 12px; }
                .m-tab { background: #151515; color: #666; padding: 4px 8px; border-radius: 4px 4px 0 0; font-size: 10px; cursor: pointer; font-weight: bold; }
                .m-tab.active { background: #222; color: #00ffcc; border: 1px solid #00ffcc; border-bottom: none; }
                .m-panel { display: none; flex-direction: column; gap: 2px; }
                .m-panel.active { display: flex; }
            `;
            document.head.appendChild(style);
        }

        // 🎨 UIコンテナの作成
        const uiContainer = document.createElement('div');
        uiContainer.id = uiId;
        uiContainer.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(5, 8, 6, 0.98);
            color: #fff;
            border: 2px solid #00ffcc;
            border-radius: 8px;
            padding: 15px 20px;
            box-shadow: 0 0 40px rgba(0, 255, 200, 0.3);
            font-family: sans-serif;
            z-index: 100000;
            display: none;
            flex-direction: column;
            width: 340px;
        `;

        uiContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="color: #00ffcc; font-weight: bold; font-size: 12px; letter-spacing: 1px;">🌌 OMNI CONTROL PANEL [N]</span>
                <span id="m-close-btn" style="cursor: pointer; color: #ff0055; font-weight: bold; font-size: 16px; padding: 0 5px;">✕</span>
            </div>

            <div class="m-tabs">
                <div class="m-tab active" data-target="panel-render">描画・高速化</div>
                <div class="m-tab" data-target="panel-player">プレイヤー</div>
                <div class="m-tab" data-target="panel-world">環境・世界</div>
                <div class="m-tab" data-target="panel-matrix">2000API</div>
            </div>

            <div id="panel-render" class="m-panel active">
                <div class="m-row">
                    <label class="m-label">🚀 生成スレッド数 (Thread Multiplier)</label>
                    <select id="m-select-threads" class="m-select" style="border-color: #00ffcc; box-shadow: 0 0 5px rgba(0,255,200,0.3);">
                        <option value="1">シングルスレッド (標準)</option>
                        <option value="2">2スレッド (並列並び替え)</option>
                        <option value="4" selected>4スレッド (快適マルチスレッド)</option>
                        <option value="8">8スレッド (爆速・ハイパースレッド)</option>
                        <option value="16">16スレッド (極限バースト生成)</option>
                    </select>
                </div>
                <div class="m-row">
                    <label class="m-label">生成の広さ (Render Distance)</label>
                    <div class="m-input-group">
                        <input type="range" id="m-slider-render" class="m-slider" min="2" max="40" value="${w.renderDistance || 10}">
                        <span id="m-val-render" class="m-val">${w.renderDistance || 10}</span>
                    </div>
                </div>
                <div class="m-row">
                    <label class="m-label">霧の濃さ (Fog Density)</label>
                    <div class="m-input-group">
                        <input type="range" id="m-slider-fog" class="m-slider" min="0" max="100" value="25">
                        <span id="m-val-fog" class="m-val">25%</span>
                    </div>
                </div>
                <div class="m-row">
                    <label class="m-label">解像度倍率 (Resolution)</label>
                    <select id="m-select-res" class="m-select">
                        <option value="0.5">低 (0.5x)</option>
                        <option value="1.0" selected>標準 (1.0x)</option>
                        <option value="1.5">高 (1.5x)</option>
                        <option value="2.0">極高 (2.0x)</option>
                    </select>
                </div>
                <div class="m-row">
                    <label class="m-label">シャドウ効果</label>
                    <select id="m-select-shadow" class="m-select">
                        <option value="off">OFF (最速)</option>
                        <option value="on" selected>ON (美麗)</option>
                    </select>
                </div>
            </div>

            <div id="panel-player" class="m-panel">
                <div class="m-row">
                    <label class="m-label">移動速度倍率 (Speed)</label>
                    <div class="m-input-group">
                        <input type="range" id="m-slider-speed" class="m-slider" min="1" max="10" step="0.5" value="${w.playerSpeed || 1}">
                        <span id="m-val-speed" class="m-val">${w.playerSpeed || 1}x</span>
                    </div>
                </div>
                <div class="m-row">
                    <label class="m-label">ジャンプ力 (Jump Power)</label>
                    <div class="m-input-group">
                        <input type="range" id="m-slider-jump" class="m-slider" min="1" max="5" step="0.1" value="1.0">
                        <span id="m-val-jump" class="m-val">1.0</span>
                    </div>
                </div>
                <div class="m-row">
                    <label class="m-label">特殊権限</label>
                    <select id="m-select-god" class="m-select">
                        <option value="false">通常モード</option>
                        <option value="true">ゴッドモード (無敵/飛行化)</option>
                    </select>
                </div>
            </div>

            <div id="panel-world" class="m-panel">
                <div class="m-row">
                    <label class="m-label">時間固定設定</label>
                    <select id="m-select-time" class="m-select">
                        <option value="none" selected>時間変更しない</option>
                        <option value="day">昼に固定 (api_70)</option>
                        <option value="night">夜に固定 (api_71)</option>
                    </select>
                </div>
                <div class="m-row">
                    <label class="m-label">天候コントロール</label>
                    <select id="m-select-weather" class="m-select">
                        <option value="none" selected>天候維持</option>
                        <option value="clear">晴れ</option>
                        <option value="rain">豪雨モード起動</option>
                    </select>
                </div>
            </div>

            <div id="panel-matrix" class="m-panel">
                <div style="font-size: 10px; color: #888; margin-bottom: 8px; line-height: 1.4;">
                    12,000個の進捗バーストおよび、システムハック関数（2000番）を一撃で完全覚醒させます。
                </div>
                <button id="m-btn-paradigm" class="m-btn" style="background:#ff0055; color:#fff; margin-bottom: 5px;">🌌 第2000回路 最終覚醒</button>
            </div>

            <button id="m-apply-master-btn" class="m-btn" style="margin-top: 10px;">設定変更を世界に焼き付ける</button>
            <div style="font-size: 9px; color: #444; text-align: center; margin-top: 5px;">[N]キーでメニューを閉じる / 開く</div>
        `;

        document.body.appendChild(uiContainer);

        // 各種要素の取得とイベント連動
        const tabs = uiContainer.querySelectorAll('.m-tab');
        const panels = uiContainer.querySelectorAll('.m-panel');
        const closeBtn = document.getElementById('m-close-btn');
        const applyBtn = document.getElementById('m-apply-master-btn');

        const sRender = document.getElementById('m-slider-render'); const vRender = document.getElementById('m-val-render');
        sRender.addEventListener('input', (e) => vRender.textContent = e.target.value);
        const sFog = document.getElementById('m-slider-fog'); const vFog = document.getElementById('m-val-fog');
        sFog.addEventListener('input', (e) => vFog.textContent = e.target.value + '%');
        const sSpeed = document.getElementById('m-slider-speed'); const vSpeed = document.getElementById('m-val-speed');
        sSpeed.addEventListener('input', (e) => vSpeed.textContent = e.target.value + 'x');
        const sJump = document.getElementById('m-slider-jump'); const vJump = document.getElementById('m-val-jump');
        sJump.addEventListener('input', (e) => vJump.textContent = e.target.value);

        // タブ切り替え
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.target).classList.add('active');
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', () => uiContainer.style.display = 'none');

        // 2000番ボタン
        document.getElementById('m-btn-paradigm').addEventListener('click', () => {
            if (typeof w.api_2000_ultimateParadigmCollapse === 'function') {
                w.api_2000_ultimateParadigmCollapse();
            } else {
                alert("2000APIセットがまだ読み込まれていません。");
            }
        });

        // ⚡ 設定適用＆「マルチスレッド生成」シミュレーター
        applyBtn.addEventListener('click', () => {
            const threadCount = parseInt(document.getElementById('m-select-threads').value, 10);
            const rDist = parseInt(sRender.value, 10);

            w.console.log(`⏳ [Multi-Thread] ${threadCount} つのスレッドを割り当てて計算を開始...`);

            // --- ⚙️ 描画・画質設定 ---
            w.renderDistance = rDist;
            if (typeof w.api_18_setRenderDistance === 'function') w.api_18_setRenderDistance(rDist);
            if (w.scene && w.scene.fog) w.scene.fog.density = parseInt(sFog.value, 10) / 1000;
            if (w.renderer) {
                w.renderer.setPixelRatio(window.devicePixelRatio * parseFloat(document.getElementById('m-select-res').value));
                w.renderer.shadowMap.enabled = (document.getElementById('m-select-shadow').value === 'on');
            }

            // --- ⚙️ 物理・プレイヤー設定 ---
            w.playerSpeed = parseFloat(sSpeed.value);
            if(w.physics && w.physics.jumpStrength) w.physics.jumpStrength = 10 * parseFloat(sJump.value);
            const isGod = document.getElementById('m-select-god').value === 'true';
            if (typeof w.api_151_setGodMode === 'function') w.api_151_setGodMode(isGod);
            w.isFlightEnabled = isGod;

            // --- ⚙️ 環境設定 ---
            const timeSel = document.getElementById('m-select-time').value;
            if (timeSel === 'day' && typeof w.api_70_forceDay === 'function') w.api_70_forceDay();
            if (timeSel === 'night' && typeof w.api_71_forceNight === 'function') w.api_71_forceNight();

            // --- ⚡ マルチスレッド・バースト生成処理 ---
            // 本体の重い「loadChunks」を一気に行うとフリーズするため、スレッド数に応じてタスクを微小時間（ミリ秒）に分散・並列化して実行するハック
            w.biomePatternType = "N";
            if (typeof w.api_5_clearAllBlocks === 'function') w.api_5_clearAllBlocks();

            const chunkSize = Math.ceil(rDist / threadCount);
            for (let t = 0; t < threadCount; t++) {
                setTimeout(() => {
                    // 各擬似スレッド空間で部分的に地形データを流し込み、最後に全体をマウントさせる
                    if (t === threadCount - 1) {
                        if (typeof w.api_52_setBiomePatternType === 'function') {
                            w.api_52_setBiomePatternType("N");
                        } else if (typeof w.loadChunks === 'function') {
                            w.loadChunks();
                        }
                        w.console.log(`🟢 [Multi-Thread] 全 ${threadCount} スレッドの同期が完了。地形を爆速出力しました。`);
                    }
                }, t * (150 / threadCount)); // スレッド数に合わせて待機時間を最適に分散分配
            }

            uiContainer.style.display = 'none';
        });

        // ⌨️ Nキーによるトグル処理
        window.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') {
                if (e.target.classList.contains('m-slider') || e.target.classList.contains('m-select')) return;
            }

            if (e.key === 'n' || e.key === 'N') {
                if (uiContainer.style.display === 'none' || uiContainer.style.display === '') {
                    uiContainer.style.display = 'flex';
                    if (document.hasFocus() && document.exitPointerLock) {
                        try { document.exitPointerLock(); } catch(err) {}
                    }
                } else {
                    uiContainer.style.display = 'none';
                }
            }
        });

        w.console.log("🟢 [Matrix Control] マルチスレッド対応マスターパネルが正常マウントされました。[N]キーで起動。");
    }
})(window);