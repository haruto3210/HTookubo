このゲームは楽しいゲームです

あなた達も、MODを作って遊びましょう。

写真
<img width="1279" height="719" alt="image" src="https://github.com/user-attachments/assets/1ba8b640-be17-4abf-9502-deaa13aa0824" />
<img width="1274" height="713" alt="image" src="https://github.com/user-attachments/assets/e895d94e-67f6-45e9-8006-fad3375c750e" />
<img width="1276" height="719" alt="image" src="https://github.com/user-attachments/assets/9681d0d4-9fb3-44b2-8629-1500b5f066ef" />

**API一覧**
＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // ==========================================
    // 🛠️ 拡張デベロッパーAPI 1〜75 (超増大版 前半)
    // ==========================================
    window.api_1_teleport = function(x, y, z) { camera.position.set(x, y, z); };
    window.api_2_setBlock = function(x, y, z, id, color) { let col = color || window.blockRegistry[id]?.color || 0xffffff; const bx = Math.round(x/2)*2, by = Math.round(y/2)*2, bz = Math.round(z/2)*2; window.worldBlocks.set(`${bx},${by},${bz}`, { type: id, color: col }); window.forceRenderChunkAt(bx, bz); };
    window.api_3_breakBlock = function(x, y, z) { const bx = Math.round(x/2)*2, by = Math.round(y/2)*2, bz = Math.round(z/2)*2; if(window.worldBlocks.has(`${bx},${by},${bz}`)) { window.worldBlocks.delete(`${bx},${by},${bz}`); window.forceRenderChunkAt(bx, bz); return true; } return false; };
    window.api_4_fillArea = function(x1,y1,z1,x2,y2,z2,id,color) { for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x+=2){ for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y+=2){ for(let z=Math.min(z1,z2);z<=Math.max(z1,z2);z+=2){ window.api_2_setBlock(x,y,z,id,color); } } } };
    window.api_5_clearAllBlocks = function() { window.worldBlocks.clear(); window.chunkInstances.forEach(m => { if(Array.isArray(m)) m.forEach(mesh => scene.remove(mesh)); }); window.chunkInstances.clear(); };
    window.api_6_spawnOkubo = function(x,y,z,hp=6,isBoss=false,size=1.0) { window.spawnCustomOkubo(x,y,z,hp,isBoss,size); };
    window.api_7_clearAllOkubos = function() { okubos.forEach(o => scene.remove(o)); okubos.length = 0; };
    window.api_8_getNearbyOkubos = function(r=50) { return okubos.filter(o=>camera.position.distanceTo(o.position)<=r); };
    window.api_9_damageOkubo = function(idx, dmg) { if(okubos[idx]) okubos[idx].userData.hp -= dmg; };
    window.api_10_setPlayerSpeed = function(s) { window.playerSpeed = s; };
    window.api_11_setJumpPower = function(j) { window.jumpPower = j; };
    window.api_12_setGravity = function(g) { window.gravity = g; };
    window.api_13_healPlayer = function(h) { window.health = Math.min(window.maxHealth, window.health + h); };
    window.api_14_damagePlayer = function(d) { if(window.isDead) return; window.health -= d; if(window.health<=0) { window.health = 0; window.triggerDeathSystem(); } };
    window.api_15_addAdvancement = function(id, name, desc) { window.advancements.push({id, name, desc, done:false}); };
    window.api_16_triggerAdvancement = function(id) { const a = window.advancements.find(v=>v.id===id); if(a && !a.done) { a.done = true; window.showAdvancementToast(a); } };
    window.api_17_getOkuboCount = function() { return okubos.length; };
    window.api_18_setRenderDistance = function(d) { window.renderDistance = d; };
    window.api_19_getBlockAt = function(x,y,z) { return window.worldBlocks.get(`${Math.round(x/2)*2},${Math.round(y/2)*2},${Math.round(z/2)*2}`); };
    window.api_20_getPlayerPosition = function() { return {x: camera.position.x, y: camera.position.y, z: camera.position.z}; };
    window.api_21_setSkyColor = function(c) { scene.background.setHex(c); if(scene.fog) scene.fog.color.setHex(c); };
    window.api_22_addScore = function(s) { window.gameScore += s; };
    window.api_23_getScore = function() { return window.gameScore; };
    window.api_24_setSunIntensity = function(i) { sun.intensity = i; };
    window.api_25_setAmbientIntensity = function(i) { ambientLight.intensity = i; };
    window.api_26_explodeAt = function(cx,cy,cz,r=6) { for(let x=cx-r;x<=cx+r;x+=2){ for(let y=cy-r;y<=cy+r;y+=2){ for(let z=cz-r;z<=cz+r;z+=2){ if(new THREE.Vector3(x,y,z).distanceTo(new THREE.Vector3(cx,cy,cz))<=r) window.api_3_breakBlock(x,y,z); } } } };
    window.api_27_getLoadedChunksCount = function() { return window.chunkInstances.size; };
    window.api_28_setOkuboSpeedMultiplier = function(m) { window.okuboSpeedMultiplier = m; };
    window.api_29_setHotbarSlot = function(s) { if(s>=0 && s<=8) { window.selectedSlot = s; if(window.updateHotbarUI) window.updateHotbarUI(); } };
    window.api_30_getInventoryList = function() { return window.blockRegistry; };
    window.api_31_toggleFlight = function() { window.isFlightEnabled = !window.isFlightEnabled; };
    window.api_32_setPlayerMaxHealth = function(m) { window.maxHealth = m; window.health = m; };
    window.api_33_broadcastMessage = function(m) { console.log(`[Matrix Core] ${m}`); };
    window.api_34_resetAllAdvancements = function() { window.advancements.forEach(a=>a.done=false); };
    window.api_35_freezeOkubos = function() { window.okubosFrozen = !window.okubosFrozen; };
    window.api_36_getBiomeAt = function(x,z) { return window.currentBiomeName; };
    window.api_37_setFogDensity = function(d) { if(scene.fog) scene.fog.density = d; };
    window.api_38_setBiomePattern = function(type) { window.biomePatternType = type; window.api_5_clearAllBlocks(); if(window.loadChunks) window.loadChunks(); };
    window.api_39_spawnGiantStructure = function(cx, cy, cz, size=1) { for(let y=0; y<30*size; y+=2){ for(let x=-4*size; x<=4*size; x+=2){ window.api_2_setBlock(cx+x, cy+y, cz, 7, 0x111111); } } };
    window.api_40_massSpawnOkubo = function(count=10) { const p = window.api_20_getPlayerPosition(); for(let i=0;i<count;i++) window.api_6_spawnOkubo(p.x+(Math.random()-0.5)*40, p.y+15, p.z+(Math.random()-0.5)*45); };
    window.api_41_generateMadaraHelix = function(cx, cy, cz) { for(let i=0; i<50; i++) { let r = i*0.4; window.api_2_setBlock(cx+Math.sin(i)*r, cy+i, cz+Math.cos(i)*r, i%15); } };
    window.api_42_setAllOkuboHP = function(hp) { window.okubos.forEach(o => o.userData.hp = hp); };
    window.api_43_spawnPyramid = function(cx, cy, cz, h=8) { for(let y=0; y<h; y++) { let r = h-y; window.api_4_fillArea(cx-r*2, cy+y*2, cz-r*2, cx+r*2, cy+y*2, cz+r*2, 5); } };
    window.api_44_instantlyClearLoadedOkubos = function() { window.okubos.forEach(o=>scene.remove(o)); window.okubos = []; };
    window.api_45_getKillCount = function() { return window.okuboKills; };
    window.api_46_addMaxHealth = function(amt) { window.maxHealth += amt; window.health = window.maxHealth; };
    window.api_47_strikeLightning = function(x, z) { window.api_4_fillArea(x, 0, z, x, 80, z, 3, 0xffffff); setTimeout(() => { for(let y=0; y<80; y+=2) window.api_3_breakBlock(x,y,z); }, 120); };
    window.api_48_setBlockName = function(id, newName) { if(window.blockRegistry[id]) window.blockRegistry[id].name = newName; };
    window.api_49_getPlayerVelocity = function() { return velocity; };
    window.api_50_forceUnlockAllAdvancements = function() { window.advancements.forEach(a=>window.api_16_triggerAdvancement(a.id)); };
    window.api_51_createValleyFloor = function(cx, cz, w=15) { window.api_4_fillArea(cx-w, -6, cz-w, cx+w, -4, 1, 0x6c757d); };
    window.api_52_setBiomePatternType = function(t) { window.biomePatternType = t; window.api_5_clearAllBlocks(); loadChunks(); };
    window.api_53_getClosestOkuboDistance = function() { if(window.okubos.length===0) return -1; return camera.position.distanceTo(window.okubos[0].position); };
    window.api_54_healToMax = function() { window.health = window.maxHealth; };
    window.api_55_spawnMeatShield = function() { const p = window.api_20_getPlayerPosition(); window.api_4_fillArea(p.x-2, p.y, p.z-4, p.x+2, p.y+4, p.z-4, 14); };
    window.api_56_getLoadedBlockCount = function() { return window.worldBlocks.size; };
    window.api_57_damageAllNearbyOkubos = function(r, dmg) { window.okubos.forEach(o => { if(camera.position.distanceTo(o.position)<=r) o.userData.hp -= dmg; }); };
    window.api_58_triggerSystemPanic = function() { camera.position.set(0,45,0); };
    window.api_59_registerMod = function(modName) { if(!window.activeMods.includes(modName)) { window.activeMods.push(modName); window.api_16_triggerAdvancement("file_load"); if(window.updateModPanelList) window.updateModPanelList(); } };
    window.api_60_getModList = function() { return window.activeMods; };
    window.api_61_setBlockColor = function(id, c) { if(window.blockRegistry[id]) window.blockRegistry[id].color = c; };
    window.api_62_getPlayerHeight = function() { return window.playerHeight; };
    window.api_63_setPlayerHeight = function(h) { window.playerHeight = h; };
    window.api_64_setPlacementReach = function(r) { window.placementReach = r; };
    window.api_65_spawnCyberRing = function(cx, cy, cz, r=10) { for(let i=0; i<360; i+=10) { let rad = i * Math.PI / 180; window.api_2_setBlock(cx+Math.sin(rad)*r, cy, cz+Math.cos(rad)*r, 3); } };
    window.api_66_getBuildLimit = function() { return 90; };
    window.api_67_setSwordColor = function(c) { if(blade) blade.material.color.setHex(c); };
    window.api_68_isPlayerGrounded = function() { return isGrounded; };
    window.api_69_setSwordDamage = function(d) { window.customSwordDmg = d; };
    window.api_70_forceDay = function() { sun.intensity = 1.0; ambientLight.intensity = 0.9; };
    window.api_71_forceNight = function() { sun.intensity = 0.1; ambientLight.intensity = 0.2; };
    window.api_72_getActiveSlotBlock = function() { return window.hotbarInventory[window.selectedSlot]; };
    window.api_73_spawnBlockTower = function(x, z, h=20, id=1) { for(let y=0; y<h; y++) window.api_2_setBlock(x, y*2, z, id); };
    window.api_74_makePlatform = function(cx, cy, cz, r=5, id=0) { window.api_4_fillArea(cx-r, cy, cz-r, cx+r, cy, cz+r, id); };
    window.api_75_setFov = function(f) { camera.fov = f; camera.updateProjectionMatrix(); };
// ==========================================
    // 🛠️ 拡張デベロッパーAPI 76〜150 (超増大版 後半)
    // ==========================================
    window.api_76_getFov = function() { return camera.fov; };
    window.api_77_setLinearVelocity = function(x, y, z) { velocity.set(x, y, z); };
    window.api_78_addLinearVelocity = function(x, y, z) { velocity.add(new THREE.Vector3(x, y, z)); };
    window.api_79_clearInventorySlot = function(s) { if(window.hotbarInventory[s]) window.hotbarInventory[s] = null; window.updateHotbarUI(); };
    window.api_80_setInventorySlotItem = function(s, id) { if(s>=0 && s<=8 && window.blockRegistry[id]) { window.hotbarInventory[s] = { ...window.blockRegistry[id] }; window.updateHotbarUI(); } };
    window.api_81_getSkyColorHex = function() { return scene.background.getHex(); };
    window.api_82_shakeCamera = function(amt=1.0) { camera.position.x += (Math.random()-0.5)*amt; camera.position.z += (Math.random()-0.5)*amt; };
    window.api_83_isFlightEnabled = function() { return window.isFlightEnabled; };
    window.api_84_setBordersVisible = function(v) { console.log("Border manipulation:", v); };
    window.api_85_getGameFpsPlaceholder = function() { return 60; };
    window.api_86_spawnCheckerPattern = function(cx, cy, cz, size=10) { for(let x=-size; x<=size; x+=2) { for(let z=-size; z<=size; z+=2) { if((x+z)%4===0) window.api_2_setBlock(cx+x, cy, cz+z, 3); } } };
    window.api_87_despawnDistantOkubos = function(maxDist=100) { window.okubos = window.okubos.filter(o => { let d = camera.position.distanceTo(o.position); if(d > maxDist) { scene.remove(o); return false; } return true; }); };
    window.api_88_setAmbientColor = function(c) { ambientLight.color.setHex(c); };
    window.api_89_setSunColor = function(c) { sun.color.setHex(c); };
    window.api_90_getRenderDistance = function() { return window.renderDistance; };
    window.api_91_getPlayerRadius = function() { return window.playerRadius; };
    window.api_92_setPlayerRadius = function(r) { window.playerRadius = r; };
    window.api_93_spawnWallX = function(x, y, z, len, h, id) { for(let l=0; l<len; l+=2) { for(let th=0; th<h; th+=2) window.api_2_setBlock(x, y+th, z+l, id); } };
    window.api_94_spawnWallZ = function(x, y, z, len, h, id) { for(let l=0; l<len; l+=2) { for(let th=0; th<h; th+=2) window.api_2_setBlock(x+l, y+th, z, id); } };
    window.api_95_createSphereAt = function(cx, cy, cz, r=4, id=9) { for(let x=-r;x<=r;x+=2){ for(let y=-r;y<=r;y+=2){ for(let z=-r;z<=r;z+=2){ if(x*x+y*y+z*z <= r*r) window.api_2_setBlock(cx+x, cy+y, cz+z, id); } } } };
    window.api_96_getCurrentTimeMillis = function() { return Date.now(); };
    window.api_97_logToScreen = function(txt) { console.warn("[Matrix ScreenLog]:", txt); };
    window.api_98_addCustomBlockType = function(id, name, color, type) { window.blockRegistry[id] = { id, name, color, type }; };
    window.api_99_triggerEasterEgg = function() { window.api_21_setSkyColor(0xff00ff); window.api_33_broadcastMessage("大久保マトリクスの深淵を覗いたな！"); };
    window.api_100_getApiCount = function() { return 150; };
    window.api_101_setSwordScale = function(s) { if(blade) blade.scale.set(s, s, s); };
    window.api_102_teleportToYUp = function() { camera.position.y += 30; };
    window.api_103_getHotbarLength = function() { return window.hotbarInventory.length; };
    window.api_104_damageAllOkubosInstantly = function(d) { window.okubos.forEach(o => o.userData.hp -= d); };
    window.api_105_setOkuboScaleAll = function(s) { window.okubos.forEach(o => o.scale.set(s,s,s)); };
    window.api_106_spawnStaircase = function(cx, cy, cz, count=10, id=1) { for(let i=0; i<count; i++) window.api_2_setBlock(cx+i*2, cy+i*2, cz, id); };
    window.api_107_getGroundTypeUnderPlayer = function() { return window.api_19_getBlockAt(camera.position.x, camera.position.y - 3.5, camera.position.z); };
    window.api_108_clearChatConsole = function() { console.clear(); };
    window.api_109_setPlacementReachLimit = function(r) { window.placementReach = r; };
    window.api_110_invertLookControls = function() { window.lookInverted = !window.lookInverted; };
    window.api_111_getBiomePatternType = function() { return window.biomePatternType; };
    window.api_112_spawnHollowBox = function(cx, cy, cz, size=6, id=7) { for(let x=-size;x<=size;x+=2){ for(let y=-size;y<=size;y+=2){ for(let z=-size;z<=size;z+=2){ if(Math.abs(x)===size||Math.abs(y)===size||Math.abs(z)===size) window.api_2_setBlock(cx+x, cy+y, cz+z, id); } } } };
    window.api_113_forceBlockRebuildAll = function() { window.api_5_clearAllBlocks(); loadChunks(); };
    window.api_114_getAdvancedAdvDoneCount = function() { return window.advancements.filter(a=>a.done).length; };
    window.api_115_setGravityZero = function() { window.gravity = 0.0; };
    window.api_116_resetGravityNormal = function() { window.gravity = 0.024; };
    window.api_117_getPlayerPitch = function() { return euler.x; };
    window.api_118_getPlayerYaw = function() { return euler.y; };
    window.api_119_spawnGiantOkubo = function(x,y,z) { window.api_6_spawnOkubo(x,y,z,500,true,4.5); };
    window.api_120_setFogColor = function(c) { if(scene.fog) scene.fog.color.setHex(c); };
    window.api_121_spawnTargetDummy = function() { const p = window.api_20_getPlayerPosition(); window.api_6_spawnOkubo(p.x, p.y+10, p.z-10, 9999, false, 1); };
    window.api_122_getLoadedChunkKeys = function() { return Array.from(window.chunkInstances.keys()); };
    window.api_123_saveChunkToMemoryCache = function() { console.log("Cache active chunks snapshot"); };
    window.api_124_setPlayerLookAt = function(x,y,z) { camera.lookAt(x,y,z); };
    window.api_125_spawnCactusColumn = function(x,z,h=3) { for(let y=0; y<h; y++) window.api_2_setBlock(x,y*2,z,4,0x228b22); };
    window.api_126_isMaxHealthReached = function() { return window.health === window.maxHealth; };
    window.api_127_setOkuboSpeedExtreme = function() { window.okuboSpeedMultiplier = 4.0; };
    window.api_128_setOkuboSpeedNormal = function() { window.okuboSpeedMultiplier = 1.0; };
    window.api_129_giveLegendarySword = function() { window.hotbarInventory[8] = { id: 99, name: "伝説の大剣", color: 0x00ffcc, type: "weapon" }; window.updateHotbarUI(); };
    window.api_130_getGlCanvasId = function() { return "glCanvas"; };
    window.api_131_isSaveMenuOpen = function() { return window.isSaveMenuOpen; };
    window.api_132_isAdvMenuOpen = function() { return window.isAdvOpen; };
    window.api_133_getModMenuState = function() { return window.modMenuState; };
    window.api_134_setChunkSize = function(s) { window.chunkSize = s; };
    window.api_135_getChunkSize = function() { return window.chunkSize; };
    window.api_136_setCubeSize = function(s) { window.cubeSize = s; };
    window.api_137_getCubeSize = function() { return window.cubeSize; };
    window.api_138_spawnObsidianCutter = function(x,y,z) { for(let i=0;i<10;i++) window.api_2_setBlock(x+i*2, y, z, 7); };
    window.api_139_spawnEnderPortalFrame = function(cx,cz) { window.api_4_fillArea(cx-3, 20, cz-3, cx+3, 20, cz+3, 13); window.api_4_fillArea(cx-1, 20, cz-1, cx+1, 20, cz+1, 0); };
    window.api_140_setAnisotropyMax = function() { console.log("Anisotropy max set"); };
    window.api_141_getSunIntensity = function() { return sun.intensity; };
    window.api_142_getAmbientIntensity = function() { return ambientLight.intensity; };
    window.api_143_setSwordSwingSpeed = function() { console.log("Swing speed max"); };
    window.api_144_addScoreMultiplier = function(m) { window.gameScore += 1000*m; };
    window.api_145_makeCubeStructure = function(x,y,z,id) { window.api_4_fillArea(x,y,z,x+2,y+2,z+2,id); };
    window.api_146_spawnCloudAtPlayer = function() { const p = window.api_20_getPlayerPosition(); window.api_4_fillArea(p.x-4, p.y+10, p.z-4, p.x+4, p.y+10, p.z+4, 8); };
    window.api_147_breakBlockUnderPlayer = function() { const p = window.api_20_getPlayerPosition(); window.api_3_breakBlock(p.x, p.y-4, p.z); };
    window.api_148_getCoreEngineName = function() { return "Okubo Matrix Ultimate Engine 2026"; };
    window.api_149_spawnCrossAt = function(cx,cy,cz,id=2) { window.api_2_setBlock(cx,cy,cz,id); window.api_2_setBlock(cx-2,cy,cz,id); window.api_2_setBlock(cx+2,cy,cz,id); window.api_2_setBlock(cx,cy-2,cz,id); window.api_2_setBlock(cx,cy+2,cz,id); };
    window.api_150_shutdownMatrixEngine = function() { window.api_5_clearAllBlocks(); window.api_7_clearAllOkubos(); document.body.innerHTML = "<h1 style='color:#00ffcc; background:#000; text-align:center; padding-top:20%; font-family:sans-serif;'>👑 Matrix Core Engine Shutdown Gracefully.</h1>"; };
