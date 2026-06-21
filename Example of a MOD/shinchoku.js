(function() {
    // MODの登録と覚醒アナウンス
    window.api_59_registerMod("UltimateAdvancement600Master");
    window.api_33_broadcastMessage("👑 [Matrix Core 2026] 150全API完全対応『600大進捗マスターパック』が神話級進化を遂げて覚醒！");

    // ==========================================
    // 📂 1. 600大進捗の動的ビルド構造定義
    // ==========================================
    
    // 進捗のベースとなる100のコア系統（ゲーム要素・APIフックに対応）
    const baseTemplates = [
        { id: 1,   name: "マトリクスへようこそ", desc: "進捗マスターパックがシステムに展開される" },
        { id: 2,   name: "二足歩行の証明", desc: "初期位置からプレイヤーの座標が変化する" },
        { id: 3,   name: "無傷の跳躍", desc: "HP満タン状態で空中への跳躍を検知する" },
        { id: 4,   name: "ログの断捨離", desc: "api_108を実行し、チャットコンソールをクリアする" },
        { id: 5,   name: "スコア発生", desc: "ゲーム内のスコアが加算される" },
        { id: 6,   name: "最初の大久保狩り", desc: "オオクボの討伐数がカウントされる" },
        { id: 7,   name: "カタログスペック", desc: "api_30によってインベントリリストが覗き見られる" },
        { id: 8,   name: "現在地ロケーター", desc: "api_20によりプレイヤーの三次元座標を取得する" },
        { id: 9,   name: "生態調査", desc: "api_36から現在地のバイオーム名が読み取られる" },
        { id: 10,  name: "描画領域の計算", desc: "api_27が呼び出され、ロードされたチャンク数を算出する" },
        { id: 11,  name: "脱・鈍足", desc: "プレイヤーの移動速度が変更される" },
        { id: 12,  name: "引力への挑戦", desc: "プレイヤーのジャンプ力が変更される" },
        { id: 13,  name: "サイボーグ化", desc: "最大体力が150を超える" },
        { id: 14,  name: "不老不死のトランス", desc: "最大体力が500を超える" },
        { id: 15,  name: "神の器", desc: "最大体力が1000の領域に達する" },
        { id: 16,  name: "ファーストエイド", desc: "api_13によってプレイヤーの体力が回復する" },
        { id: 17,  name: "虫の息", desc: "体力が残り1以下の絶望的状況になる" },
        { id: 18,  name: "奇跡の全快", desc: "api_54によって瀕死から最大まで全回復する" },
        { id: 19,  name: "高みの見物", desc: "api_102によって上空へ強制テレポートする" },
        { id: 20,  name: "ガリバーの悪夢", desc: "プレイヤーの身体スケールが変更される" },
        { id: 21,  name: "クイックドロー", desc: "api_80によって特定のインベントリスロットにアイテムが充填される" },
        { id: 22,  name: "選ばれし勇者", desc: "api_129によりスロット8に「伝説の大剣」を授かる" },
        { id: 23,  name: "サイバーブレード", desc: "api_67によって剣の色がデフォルト以外に書き換えられる" },
        { id: 24,  name: "大剣の目覚め", desc: "api_101によって剣のスケールが拡大される" },
        { id: 25,  name: "星を砕く超大剣", desc: "剣のスケールが極限サイズまで巨大化する" },
        { id: 26,  name: "なまくら刃", desc: "剣の攻撃力が1以下に設定される" },
        { id: 27,  name: "一撃必殺の理", desc: "剣の攻撃力が50以上に設定される" },
        { id: 28,  name: "概念を斬る剣", desc: "剣の攻撃力が999に到達する" },
        { id: 29,  name: "神速の居合い", desc: "api_143によって剣の振りの速度が極限化される" },
        { id: 30,  name: "無手の境地", desc: "api_79によってインベントリスロットがクリアされる" },
        { id: 31,  name: "調光師", desc: "api_24によって太陽の光の強さが操作される" },
        { id: 32,  name: "漆黒の黙示録", desc: "太陽の強さが0.1以下になり、世界が暗黒に包まれる" },
        { id: 33,  name: "白夜の奇跡", desc: "api_70によって強制的に昼（Day）に固定される" },
        { id: 34,  name: "サバトの生誕", desc: "api_71によって強制的に夜（Night）に固定される" },
        { id: 35,  name: "アンビエント調整", desc: "api_25によって環境光の強さが変更される" },
        { id: 36,  name: "サイケデリック・スカイ", desc: "api_21によって空の色が異次元の色に染まる" },
        { id: 37,  name: "ディープ・フォグ", desc: "霧の濃度が0.05を超える" },
        { id: 38,  name: "絶対零度の視界", desc: "霧の濃度が0.1以上の絶望的視界に突入する" },
        { id: 39,  name: "ミスト・プランナー", desc: "api_120によって霧の色が変更される" },
        { id: 40,  name: "環境光の乱れ", desc: "api_88によって環境光の色が変更される" },
        { id: 41,  name: "ブロック・ジェネシス", desc: "api_2によって世界に任意のブロックを配置する" },
        { id: 42,  name: "デモリッションマン", desc: "api_3によってブロックが1個破壊される" },
        { id: 43,  name: "カラフルマトリクス", desc: "api_61によってレジストリ内のブロック色が上書きされる" },
        { id: 44,  name: "名付け親", desc: "api_48によってブロックのレジストリ名が書き換えられる" },
        { id: 45,  name: "一括塗りつぶし", desc: "api_4によって指定範囲が塗りつぶし（FillArea）される" },
        { id: 46,  name: "更地大戦", desc: "api_5によって世界中のブロックが全消去される" },
        { id: 47,  name: "バベルの塔", desc: "api_73によって垂直のブロックタワーが建築される" },
        { id: 48,  name: "足場の確保", desc: "api_74によって足元にプラットフォームが生成される" },
        { id: 49,  name: "足元ご用心", desc: "api_147によってプレイヤーの真下のブロックが破壊される" },
        { id: 50,  name: "テラフォーミング", desc: "api_52によってバイオームパターンが変更され世界が再構築される" },
        { id: 51,  name: "大いなる遺産", desc: "api_39によって巨大構造物（GiantStructure）が生成される" },
        { id: 52,  name: "螺旋の呪縛", desc: "api_41によってマダラヘリックス（遺伝子構造）が生成される" },
        { id: 53,  name: "ファラオの目覚め", desc: "api_43によって砂漠のピラミッドが建築される" },
        { id: 54,  name: "黒曜石の刃", desc: "api_138によって黒曜石のカッターが召喚される" },
        { id: 55,  name: "終焉の門", desc: "api_139によってエンドポータルフレームが構築される" },
        { id: 56,  name: "市松模様の結界", desc: "api_86によってチェッカーパターンの床が生成される" },
        { id: 57,  name: "パノプティコン", desc: "api_112によってホロウボックス（空洞の箱）が生成される" },
        { id: 58,  name: "サイバー・リング", desc: "api_65によってサイバーリングが地面に展開される" },
        { id: 59,  name: "雲の絨毯", desc: "api_146によって頭上に雲のブロックが出現する" },
        { id: 60,  name: "天界の限界", desc: "プレイヤーの座標が建築限界（高さ90）に到達する" },
        { id: 61,  name: "生命創造", desc: "api_6によってオオクボがこの世界にスポーンする" },
        { id: 62,  name: "軍勢の襲来", desc: "api_40によって一気に大量のオオクボが出現する" },
        { id: 63,  name: "オオクボ・フェス", desc: "存在するオオクボの総数が20体を突破する" },
        { id: 64,  name: "人口爆発", desc: "存在するオオクボの総数が50体を突破する" },
        { id: 65,  name: "ピンポイント痛撃", desc: "api_9によって特定のオオクボにダメージが与えられる" },
        { id: 66,  name: "広域破砕", desc: "api_57によって周囲のすべてのオオクボに一斉ダメージが通る" },
        { id: 67,  name: "抹殺シークエンス", desc: "api_44によってロードされているすべてのオオクボが消去される" },
        { id: 68,  name: "肉の盾", desc: "api_55によって緊急用の肉の壁（MeatShield）が召喚される" },
        { id: 69,  name: "棘の洗礼", desc: "api_125によってカクタスカラム（サボテンの柱）が}$,生やされる" },
        { id: 70,  name: "不死身の実験台", desc: "api_121によってターゲットダミー（HP9999）が召喚される" },
        { id: 71,  name: "体力調整", desc: "api_42によってすべてのオオクボのHPが一括変更される" },
        { id: 72,  name: "極小オオクボ", desc: "すべてのオオクボのサイズが0.5倍以下に縮小される" },
        { id: 73,  name: "進撃の巨獣", desc: "すべてのオオクボのサイズが3倍以上に巨大化される" },
        { id: 74,  name: "ネオ・オオクボ", desc: "api_119によってHP500の巨大ボスオオクボが召喚される" },
        { id: 75,  name: "百鬼夜行", desc: "同時に巨大ボスオオクボが3体以上世界に顕現する" },
        { id: 76,  name: "時間凍結", desc: "api_35によってオオクボの動きがフリーズ（静止）される" },
        { id: 77,  name: "韋駄天の血", desc: "オオクボの速度倍率が通常（1.0）より高速に設定される" },
        { id: 78,  name: "神速オオクボ", desc: "api_127によってオオクボの速度倍率が極限（4.0）に達する" },
        { id: 79,  name: "ディスタンス・清掃員", desc: "api_87によって遠く離れたオオクボがデスポーンされる" },
        { id: 80,  name: "ゼロディスタンス", desc: "api_53の測定により、最寄りのオオクボとの距離が5マス以内になる" },
        { id: 81,  name: "無重力空間", desc: "api_115によって世界の重力がゼロ（0）に設定される" },
        { id: 82,  name: "大地の引力", desc: "api_116によって重力が通常（0.024）へと差し戻される" },
        { id: 83,  name: "クロノス・クロック", desc: "api_96によって現在のゲーム内システムミリ秒が抽出される" },
        { id: 84,  name: "デベロッパー・アイ", desc: "api_97によって画面へのログ出力（LogToScreen）が走る" },
        { id: 85,  name: "エンジンの魂", desc: "api_148からコアエンジンの正式名称が読み取られる" },
        { id: 86,  name: "フィッシュアイ", desc: "api_75によって視野角（FOV）が100以上の超広角になる" },
        { id: 87,  name: "慣性制御", desc: "api_77によってリニア速度が強引に上書き設定される" },
        { id: 88,  name: "ブースター・オン", desc: "api_78によって現在のリニア速度に数値がアドオン（加算）される" },
        { id: 89,  name: "天変地異の視界", desc: "api_110によってマウスの上下左右の操作が反転する" },
        { id: 90,  name: "強制パニック", desc: "api_58のシステムパニックにより原点上空（0,45,0）へ強制移動させられる" },
        { id: 91,  name: "裁きの神雷", desc: "api_47が発動し、指定座標に垂直のライトニングストライクが突き刺さる" },
        { id: 92,  name: "カタストロフィ", desc: "api_26が発動し、指定座標を中心とした球形大爆発でブロックが崩壊する" },
        { id: 93,  name: "世界の境界線", desc: "api_84によってゲームの境界表示（BordersVisible）が操作される" },
        { id: 94,  name: "巨漢プレイヤー", desc: "api_92によってプレイヤーのコリジョン半径が3倍以上に拡張される" },
        { id: 95,  name: "パーフェクト・スフィア", desc: "api_95によって指定位置に綺麗な球体ブロック構造が生成される" },
        { id: 96,  name: "全知全能のバグ", desc: "api_50により全実績が強制的に一斉全解除される" },
        { id: 97,  name: "深淵の覗き窓", desc: "api_99を実行し、大久保マトリクスの深淵（EasterEgg）に接触する" },
        { id: 98,  name: "プラグイン・コレクター", desc: "MODシステム（activeMods）の登録数が累計で増加する" },
        { id: 99,  name: "外部アドオン接続", desc: "executeLocalModFileScriptによって外部ファイルからJSコードをロードする" },
        { id: 100, name: "マトリクス崩壊", desc: "api_150が実行され、世界のすべてがクリアされ完全終了する" }
    ];

    // 進行深度（ランク）を定義する6つのレイヤー。これにより100個の系統が600個の完全独立進捗へと多次元拡張される
    const layers = [
        { suffixId: "",    namePre: "",         descPre: "【Normal】" },
        { suffixId: "_b",  namePre: "【真・",   descPre: "【Hard】" },
        { suffixId: "_c",  namePre: "【極・",   descPre: "【Expert】" },
        { suffixId: "_d",  namePre: "【神・",   descPre: "【Master】" },
        { suffixId: "_e",  namePre: "【裏・",   descPre: "【Abyss】" },
        { suffixId: "_f",  namePre: "【終焉・", descPre: "【Omega】" }
    ];

    // 全600個のレジストリ用フラット配列を生成
    const fullAdvancements = [];
    layers.forEach((layer, lIdx) => {
        baseTemplates.forEach(base => {
            // IDは m1〜m100, m1_b〜m100_b 形式で1対1で完全に独立定義
            const fullId = `m${base.id}${layer.suffixId}`;
            const fullName = `${layer.namePre}${base.name}${layer.namePre ? '】' : ''}`;
            const fullDesc = `${layer.descPre} ${base.desc}`;
            
            fullAdvancements.push({ id: fullId, name: fullName, desc: fullDesc });
        });
    });

    // ゲームエンジン（api_15）に600個すべてを一括レジスト
    fullAdvancements.forEach(adv => window.api_15_addAdvancement(adv.id, adv.name, adv.desc));
    
    // ロード完了時に始まりの進捗をトリガー
    setTimeout(() => {
        window.api_16_triggerAdvancement("m1");
        window.api_16_triggerAdvancement("m1_b");
        window.api_16_triggerAdvancement("m1_c");
        window.api_16_triggerAdvancement("m1_d");
        window.api_16_triggerAdvancement("m1_e");
        window.api_16_triggerAdvancement("m1_f");
    }, 300);

    // ==========================================
    // 🔍 2. 超高速リアルタイム常駐スキャナー（500ms周期・600系統完全追従）
    // ==========================================
    setInterval(() => {
        try {
            const pos = window.api_20_getPlayerPosition();
            const hp = window.health;
            const maxHp = window.maxHealth;
            const score = window.gameScore;
            const kills = window.okuboKills;

            // 各レイヤーのトリガー条件を多段階判定する内部ヘルパー
            const cascadeTrigger = (coreId, intensity = 1) => {
                if (intensity >= 1) window.api_16_triggerAdvancement(`m${coreId}`);
                if (intensity >= 2) window.api_16_triggerAdvancement(`m${coreId}_b`);
                if (intensity >= 3) window.api_16_triggerAdvancement(`m${coreId}_c`);
                if (intensity >= 4) window.api_16_triggerAdvancement(`m${coreId}_d`);
                if (intensity >= 5) window.api_16_triggerAdvancement(`m${coreId}_e`);
                if (intensity >= 6) window.api_16_triggerAdvancement(`m${coreId}_f`);
            };

            // m2: 移動検知（座標の大きさで深度変化）
            if (pos && (pos.x !== 0 || pos.z !== 0)) {
                const distFromOrigin = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
                let lv = 1;
                if (distFromOrigin > 10)  lv = 2;
                if (distFromOrigin > 50)  lv = 3;
                if (distFromOrigin > 200) lv = 4;
                if (distFromOrigin > 500) lv = 5;
                if (distFromOrigin > 1000) lv = 6;
                cascadeTrigger(2, lv);
            }

            // m3: ジャンプ検知
            if (window.api_68_isPlayerGrounded && !window.api_68_isPlayerGrounded() && hp === maxHp) {
                cascadeTrigger(3, 1);
            }

            // m5: スコア判定（値に応じて6階層の進捗を全解放）
            if (score > 0) {
                let lv = 1;
                if (score >= 100)  lv = 2;
                if (score >= 1000) lv = 3;
                if (score >= 5000) lv = 4;
                if (score >= 20000) lv = 5;
                if (score >= 99999) lv = 6;
                cascadeTrigger(5, lv);
            }

            // m6: オオクボ討伐数判定
            if (kills >= 1) {
                let lv = 1;
                if (kills >= 5)   lv = 2;
                if (kills >= 20)  lv = 3;
                if (kills >= 50)  lv = 4;
                if (kills >= 100) lv = 5;
                if (kills >= 500) lv = 6;
                cascadeTrigger(6, lv);
            }

            // m11, m12: 速度・ジャンプ力
            if (window.playerSpeed >= 2) cascadeTrigger(11, Math.min(6, Math.floor(window.playerSpeed)));
            if (window.jumpPower >= 1.5) cascadeTrigger(12, Math.min(6, Math.floor(window.jumpPower * 2)));

            // m13〜m15: 最大体力限界突破
            if (maxHp >= 150)  cascadeTrigger(13, 1);
            if (maxHp >= 500)  cascadeTrigger(14, 2);
            if (maxHp >= 1000) cascadeTrigger(15, 3);
            if (maxHp >= 3000) cascadeTrigger(13, 6); // 最高ランク上書き

            // m17: 瀕死
            if (hp > 0 && hp <= 1) cascadeTrigger(17, 1);

            // m20: プレイヤー身長
            if (window.playerHeight >= 3) cascadeTrigger(20, Math.min(6, Math.floor(window.playerHeight)));

            // m24, m25: 大剣スケール
            if (typeof blade !== 'undefined' && blade && blade.scale) {
                if (blade.scale.x >= 2) cascadeTrigger(24, 2);
                if (blade.scale.x >= 5) cascadeTrigger(25, 5);
            }

            // m26〜m28: 剣の攻撃力
            if (window.customSwordDmg <= 1) cascadeTrigger(26, 1);
            if (window.customSwordDmg >= 50) cascadeTrigger(27, 3);
            if (window.customSwordDmg >= 999) cascadeTrigger(28, 6);

            // m32: 太陽強度（暗黒）
            if (typeof sun !== 'undefined' && sun.intensity <= 0.1) cascadeTrigger(32, 2);

            // m37, m38: 霧濃度
            if (typeof scene !== 'undefined' && scene.fog) {
                if (scene.fog.density >= 0.05) cascadeTrigger(37, 2);
                if (scene.fog.density >= 0.1)  cascadeTrigger(38, 5);
            }

            // m60: 限界高度
            if (pos && pos.y >= 90) cascadeTrigger(60, 6);

            // m61, m63, m64: オオクボ生存数カウント
            if (window.okubos) {
                const count = window.okubos.length;
                if (count >= 1)  cascadeTrigger(61, 1);
                if (count >= 10) cascadeTrigger(61, 2);
                if (count >= 20) cascadeTrigger(63, 4);
                if (count >= 50) cascadeTrigger(64, 6);

                // ボス（ネオ・オオクボ）のカウント
                let bCount = window.okubos.filter(o => o.userData && o.userData.hp >= 500).length;
                if (bCount >= 1) cascadeTrigger(74, 3);
                if (bCount >= 3) cascadeTrigger(75, 6);

                if (window.okubos[0] && window.okubos[0].scale) {
                    if (window.okubos[0].scale.x <= 0.5) cascadeTrigger(72, 2);
                    if (window.okubos[0].scale.x >= 3)   cascadeTrigger(73, 4);
                }
            }

            // m76〜m78: オオクボのステータス変化
            if (window.okubosFrozen) cascadeTrigger(76, 2);
            if (window.okuboSpeedMultiplier > 1.0) cascadeTrigger(77, 2);
            if (window.okuboSpeedMultiplier >= 4.0) cascadeTrigger(78, 6);

            // m80: 距離測定
            const dist = window.api_53_getClosestOkuboDistance ? window.api_53_getClosestOkuboDistance() : -1;
            if (dist > 0 && dist <= 5) cascadeTrigger(80, 3);

            // m81: 重力ゼロ
            if (window.gravity === 0) cascadeTrigger(81, 4);

            // m86: FOV判定
            if (typeof camera !== 'undefined' && camera.fov >= 100) cascadeTrigger(86, 3);

            // m94: コリジョン半径
            if (window.playerRadius >= 3) cascadeTrigger(94, 4);

            // m98: アクティブMOD数
            if (window.activeMods && window.activeMods.length >= 3) {
                cascadeTrigger(98, Math.min(6, window.activeMods.length));
            }

        } catch(e) {}
    }, 500);

    // ==========================================
    // 🔗 3. 動的APIインターセプト（全150系統フック自動化）
    // ==========================================
    const hook = (apiName, coreIdNum) => {
        if (!window[apiName]) return;
        const orig = window[apiName];

        window[apiName] = function() {
            // APIが叩かれた瞬間に、対応するコア系統のNormal〜Omega(全6スロット)に対してフックシグナルを発信
            window.api_16_triggerAdvancement(`m${coreIdNum}`);
            window.api_16_triggerAdvancement(`m${coreIdNum}_b`);
            window.api_16_triggerAdvancement(`m${coreIdNum}_c`);
            window.api_16_triggerAdvancement(`m${coreIdNum}_d`);
            window.api_16_triggerAdvancement(`m${coreIdNum}_e`);
            window.api_16_triggerAdvancement(`m${coreIdNum}_f`);
            
            return orig.apply(this, arguments);
        };
    };

    // --- 150すべてのデベロッパーAPIへの厳密な直接バインド ---
    hook("api_1_teleport", 2); hook("api_2_setBlock", 41); hook("api_3_breakBlock", 42);
    hook("api_4_fillArea", 45); hook("api_5_clearAllBlocks", 46); hook("api_6_spawnOkubo", 61);
    hook("api_7_clearAllOkubos", 67); hook("api_8_getNearbyOkubos", 80); hook("api_9_damageOkubo", 65);
    hook("api_10_setPlayerSpeed", 11); hook("api_11_setJumpPower", 12); hook("api_12_setGravity", 82);
    hook("api_13_healPlayer", 16); hook("api_14_damagePlayer", 17); hook("api_15_addAdvancement", 1);
    hook("api_16_triggerAdvancement", 96); hook("api_17_getOkuboCount", 63); hook("api_18_setRenderDistance", 10);
    hook("api_19_getBlockAt", 9); hook("api_20_getPlayerPosition", 8); hook("api_21_setSkyColor", 36);
    hook("api_22_addScore", 5); hook("api_23_getScore", 5); hook("api_24_setSunIntensity", 31);
    hook("api_25_setAmbientIntensity", 35); hook("api_26_explodeAt", 92); hook("api_27_getLoadedChunksCount", 10);
    hook("api_28_setOkuboSpeedMultiplier", 77); hook("api_29_setHotbarSlot", 21); hook("api_30_getInventoryList", 7);
    hook("api_31_toggleFlight", 12); hook("api_32_setPlayerMaxHealth", 15); hook("api_33_broadcastMessage", 84);
    hook("api_34_resetAllAdvancements", 96); hook("api_35_freezeOkubos", 76); hook("api_36_getBiomeAt", 9);
    hook("api_37_setFogDensity", 37); hook("api_38_setBiomePattern", 50); hook("api_39_spawnGiantStructure", 51);
    hook("api_40_massSpawnOkubo", 62); hook("api_41_generateMadaraHelix", 52); hook("api_42_setAllOkuboHP", 71);
    hook("api_43_spawnPyramid", 53); hook("api_44_instantlyClearLoadedOkubos", 67); hook("api_45_getKillCount", 6);
    hook("api_46_addMaxHealth", 13); hook("api_47_strikeLightning", 91); hook("api_48_setBlockName", 44);
    hook("api_49_getPlayerVelocity", 87); hook("api_50_forceUnlockAllAdvancements", 96); hook("api_51_createValleyFloor", 48);
    hook("api_52_setBiomePatternType", 50); hook("api_53_getClosestOkuboDistance", 80); hook("api_54_healToMax", 18);
    hook("api_55_spawnMeatShield", 68); hook("api_56_getLoadedBlockCount", 10); hook("api_57_damageAllNearbyOkubos", 66);
    hook("api_58_triggerSystemPanic", 90); hook("api_59_registerMod", 98); hook("api_60_getModList", 98);
    hook("api_61_setBlockColor", 43); hook("api_62_getPlayerHeight", 20); hook("api_63_setPlayerHeight", 20);
    hook("api_64_setPlacementReach", 41); hook("api_65_spawnCyberRing", 58); hook("api_66_getBuildLimit", 60);
    hook("api_67_setSwordColor", 23); hook("api_68_isPlayerGrounded", 3); hook("api_69_setSwordDamage", 27);
    hook("api_70_forceDay", 33); hook("api_71_forceNight", 34); hook("api_72_getActiveSlotBlock", 21);
    hook("api_73_spawnBlockTower", 47); hook("api_74_makePlatform", 48); hook("api_75_setFov", 86);
    
    // 後半拡張デベロッパーAPIへの厳密な直接バインド
    hook("api_76_getFov", 86); hook("api_77_setLinearVelocity", 87); hook("api_78_addLinearVelocity", 88);
    hook("api_79_clearInventorySlot", 30); hook("api_80_setInventorySlotItem", 21); hook("api_81_getSkyColorHex", 36);
    hook("api_82_shakeCamera", 90); hook("api_83_isFlightEnabled", 12); hook("api_84_setBordersVisible", 93);
    hook("api_85_getGameFpsPlaceholder", 85); hook("api_86_spawnCheckerPattern", 56); hook("api_87_despawnDistantOkubos", 79);
    hook("api_88_setAmbientColor", 40); hook("api_89_setSunColor", 31); hook("api_90_getRenderDistance", 10);
    hook("api_91_getPlayerRadius", 94); hook("api_92_setPlayerRadius", 94); hook("api_93_spawnWallX", 45);
    hook("api_94_spawnWallZ", 45); hook("api_95_createSphereAt", 95); hook("api_96_getCurrentTimeMillis", 83);
    hook("api_97_logToScreen", 84); hook("api_98_addCustomBlockType", 44); hook("api_99_triggerEasterEgg", 97);
    hook("api_100_getApiCount", 85); hook("api_101_setSwordScale", 24); hook("api_102_teleportToYUp", 19);
    hook("api_103_getHotbarLength", 21); hook("api_104_damageAllOkubosInstantly", 66); hook("api_105_setOkuboScaleAll", 73);
    hook("api_106_spawnStaircase", 47); hook("api_107_getGroundTypeUnderPlayer", 9); hook("api_108_clearChatConsole", 4);
    hook("api_109_setPlacementReachLimit", 41); hook("api_110_invertLookControls", 89); hook("api_111_getBiomePatternType", 50);
    hook("api_112_spawnHollowBox", 57); hook("api_113_forceBlockRebuildAll", 46); hook("api_114_getAdvancedAdvDoneCount", 96);
    hook("api_115_setGravityZero", 81); hook("api_116_resetGravityNormal", 82); hook("api_117_getPlayerPitch", 89);
    hook("api_118_getPlayerYaw", 89); hook("api_119_spawnGiantOkubo", 74); hook("api_120_setFogColor", 39);
    hook("api_121_spawnTargetDummy", 70); hook("api_122_getLoadedChunkKeys", 10); hook("api_123_saveChunkToMemoryCache", 10);
    hook("api_124_setPlayerLookAt", 89); hook("api_125_spawnCactusColumn", 69); hook("api_126_isMaxHealthReached", 18);
    hook("api_127_setOkuboSpeedExtreme", 78); hook("api_128_setOkuboSpeedNormal", 77); hook("api_129_giveLegendarySword", 22);
    hook("api_130_getGlCanvasId", 85); hook("api_131_isSaveMenuOpen", 84); hook("api_132_isAdvMenuOpen", 1);
    hook("api_133_getModMenuState", 98); hook("api_134_setChunkSize", 10); hook("api_135_getChunkSize", 10);
    hook("api_136_setCubeSize", 41); hook("api_137_getCubeSize", 41); hook("api_138_spawnObsidianCutter", 54);
    hook("api_139_spawnEnderPortalFrame", 55); hook("api_140_setAnisotropyMax", 85); hook("api_141_getSunIntensity", 31);
    hook("api_142_getAmbientIntensity", 35); hook("api_143_setSwordSwingSpeed", 29); hook("api_144_addScoreMultiplier", 5);
    hook("api_145_makeCubeStructure", 41); hook("api_146_spawnCloudAtPlayer", 59); hook("api_147_breakBlockUnderPlayer", 49);
    hook("api_148_getCoreEngineName", 85); hook("api_149_spawnCrossAt", 41);

    // --- 特殊割り込みコアフック (m99系統・外部ファイルマウント) ---
    if (window.executeLocalModFileScript) {
        const origMount = window.executeLocalModFileScript;
        window.executeLocalModFileScript = function(fileContent, fileName) {
            layers.forEach(layer => window.api_16_triggerAdvancement(`m99${layer.suffixId}`));
            return origMount.apply(this, arguments);
        };
    }

    // --- 終焉のシャットダウンフック (m100系統・マトリクス崩壊) ---
    if (window.api_150_shutdownMatrixEngine) {
        const origShutdown = window.api_150_shutdownMatrixEngine;
        window.api_150_shutdownMatrixEngine = function() {
            layers.forEach(layer => window.api_16_triggerAdvancement(`m100${layer.suffixId}`));
            setTimeout(() => { origShutdown.apply(this, arguments); }, 1000);
        };
    }
})();