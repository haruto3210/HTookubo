(function() {
    window.api_59_registerMod("OkuboDropItemSystem2026");
    window.api_33_broadcastMessage("🍖 [Drop System] 大久保の生命結晶（回復アイテム）ドロッププロトコルが有効化されました。");

    // 地面に落ちているドロップアイテムを管理する配列
    const droppedItems = [];

    // --- 1. 効果音生成（アイテム排出音 ＆ 回復吸収音） ---
    function playDropSound(type) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            if (type === 'pop') {
                // マイクラの「ポロッ」という軽いドロップ音
                osc.type = "sine";
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
            } else if (type === 'heal') {
                // レベルアップ、あるいはアイテムを吸収した時の綺麗な音
                osc.type = "triangle";
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.setValueAtTime(600, ctx.currentTime + 0.08);
                osc.frequency.setValueAtTime(900, ctx.currentTime + 0.16);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            }
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch(e) {}
    }

    // --- 2. 物理ドロップアイテムを画面（DOM）に生成する関数 ---
    window.spawnRecoveryItem = function(x, y, z) {
        // 3D座標から2D画面座標への簡易マッピング（または固定位置からの射出）
        // ここではプレイヤーの画面上に物理シミュレーションされるHTML要素として生成
        const itemEl = document.createElement("div");
        itemEl.className = "matrix-drop-item";
        itemEl.style = `
            position: fixed;
            width: 24px;
            height: 24px;
            background: #ff0055;
            border: 2px solid #ffffff;
            box-shadow: 0 0 10px #ff0055, inset 0 0 5px #fff;
            border-radius: 4px;
            z-index: 99999;
            pointer-events: none;
            font-size: 10px;
            color: white;
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
            transform-origin: center;
        `;
        itemEl.innerText = "🍖";
        document.body.appendChild(itemEl);

        // マイクラのような「ポロッ」と飛び出す初速度の計算（3D風に散らす）
        // 画面中央付近（プレイヤーの前方）から左右上下にランダムに弾け飛ばす
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        let posX = screenWidth / 2 + (Math.random() * 60 - 30);
        let posY = screenHeight / 2 - 50; // ちょっと上から
        
        let vx = (Math.random() * 8 - 4);  // 左右の飛び散り
        let vy = -(Math.random() * 6 + 6); // 上方向への跳ね上がり速度
        const gravity = 0.5;               // 重力
        const bounce = -0.4;               // 地面のバウンド係数
        const groundY = screenHeight * 0.75; // 簡易的な画面内の「地面」の高さ
        let rotation = 0;
        const rotSpeed = Math.random() * 10 - 5;

        // アイテム個別の物理データを保持
        const itemData = {
            element: itemEl,
            x: posX, y: posY,
            vx: vx, vy: vy,
            rotation: rotation,
            rotSpeed: rotSpeed,
            groundY: groundY,
            gravity: gravity,
            bounce: bounce,
            isGrounded: false,
            age: 0
        };

        droppedItems.push(itemData);
        playDropSound('pop');
    };

    // --- 3. 物理演算 ＆ プレイヤーとの当たり判定ループ (秒間60回) ---
    setInterval(() => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const playerX = screenWidth / 2; // プレイヤーは基本画面中央（FP目線）
        const playerY = screenHeight / 2 + 50; 

        // 例のブラウザ広告が表示されてロックされている間は、アイテムがプレイヤーに吸い込まれないデバフ
        const isAdActive = !!document.getElementById("matrix-intrusive-ad");

        for (let i = droppedItems.length - 1; i >= 0; i--) {
            const item = droppedItems[i];
            item.age++;

            // 1. 重力と物理移動の計算
            if (!item.isGrounded) {
                item.vy += item.gravity;
                item.x += item.vx;
                item.y += item.vy;
                item.rotation += item.rotSpeed;

                // 地面との衝突（バウンド処理）
                if (item.y >= item.groundY) {
                    item.y = item.groundY;
                    item.vy *= item.bounce;
                    item.vx *= 0.6; // 摩擦で減速
                    
                    if (Math.abs(item.vy) < 1) {
                        item.vy = 0;
                        item.isGrounded = true;
                    }
                }
            } else {
                // 地面に落ちた後はマイクラのように「ふわふわ」と浮き沈み回転する
                item.y = item.groundY + Math.sin(item.age * 0.1) * 3;
                item.rotation += 1;
            }

            // 2. プレイヤーへの「自動吸い込み（ホーミング）」処理
            // 広告表示中でなければ、落ちてから一定時間後、または近づくと吸引開始
            const dx = playerX - item.x;
            const dy = playerY - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (!isAdActive && (item.isGrounded || dist < 150)) {
                // プレイヤーに向かって加速して吸い込まれる
                item.isGrounded = false;
                item.x += dx * 0.15;
                item.y += dy * 0.15;
            }

            // 3. 触れた（当たり判定：距離が近い）時の回復処理
            if (dist < 25) {
                // アイテム消去
                item.element.remove();
                droppedItems.splice(i, 1);

                // 【回復効果発動】
                playHealEffect();
                continue;
            }

            // 4. あまりにも放置されたら消滅（負荷対策：60秒）
            if (item.age > 3600) {
                item.element.remove();
                droppedItems.splice(i, 1);
                continue;
            }

            // DOMの位置を更新して描画
            item.element.style.left = `${item.x}px`;
            item.element.style.top = `${item.y}px`;
            item.element.style.transform = `rotate(${item.rotation}deg)`;
        }
    }, 1000 / 60);

    // 回復時のステータス＆エフェクト反映
    function playHealEffect() {
        playDropSound('heal');
        
        // 150個のAPIからHP回復を実行 (api_54 または直接変数操作)
        if (window.api_54_healToMax) {
            // フル回復だとぬるいので、5ポイントずつ加算するカスタム処理
            window.health = Math.min((window.maxHealth || 20), (window.health || 15) + 5);
            window.api_33_broadcastMessage(`🍖 【生命結晶】を吸収した！体力が 5 回復。 (HP: ${window.health})`);
        } else {
            window.health = (window.health || 15) + 5;
        }

        // 画面を一瞬緑色にフラッシュさせるマイクラ風の演出
        const flash = document.createElement("div");
        flash.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,255,100,0.15); pointer-events:none; z-index:999999; transition: opacity 0.3s;";
        document.body.appendChild(flash);
        setTimeout(() => { flash.style.opacity = 0; setTimeout(() => flash.remove(), 300); }, 50);
    }

    // --- 4. 大久保へのダメージ・討伐APIにフックしてドロップさせる ---
    const orig_damageOkubo = window.api_9_damageOkubo;
    window.api_9_damageOkubo = function() {
        // 大久保を攻撃した際、一定確率（またはHPが0になった瞬間）でドロップ
        // ここでは攻撃するたびに25%の確率でポロッと落ちる仕様に
        if (Math.random() < 0.25) {
            const pPos = window.api_20_getPlayerPosition ? window.api_20_getPlayerPosition() : {x:0, y:0, z:0};
            window.spawnRecoveryItem(pPos.x, pPos.y, pPos.z);
        }
        return orig_damageOkubo.apply(this, arguments);
    };

    // デバッグ用コマンド（コンソールから手動でバラまける）
    window.cheatScatterItems = function(count = 5) {
        for(let i=0; i<count; i++) {
            setTimeout(() => window.spawnRecoveryItem(0,0,0), i * 100);
        }
    };

})();