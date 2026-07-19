/**
 * TRAI Bot — Floating Support Agent
 * Injects a floating action button and an expanding chat window with 3D character and TTS.
 */
(function () {
    'use strict';

    let widgetEl, chatWindowEl, canvasContainerEl;
    let scene, camera, renderer, clock, mixer;
    let model, animationId;
    let isOpen = false;
    
    // AI Chat & Voice
    let chatHistoryEl, chatInputEl;
    let isSpeaking = false;
    let headMesh = null;
    let mouthMorphIndex = -1;

    // We need to store the base scale of the model so we can revert it in the idle animation
    let baseScale = 1; 

    function init() {
        // --- 1. BUILD WIDGET UI ---
        const style = document.createElement('style');
        style.innerHTML = `
            #trai-floating-agent {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 9999;
                font-family: 'Inter', sans-serif;
            }
            #trai-agent-fab {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #ff8c42, #ff3b00);
                box-shadow: 0 10px 25px rgba(255, 106, 0, 0.4);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: absolute;
                bottom: 0;
                right: 0;
                z-index: 10;
            }
            #trai-agent-fab:hover {
                transform: scale(1.1);
            }
            #trai-agent-fab svg {
                width: 30px;
                height: 30px;
                fill: white;
            }
            #trai-agent-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 360px;
                height: 500px;
                background: rgba(15, 15, 15, 0.85);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 106, 0, 0.3);
                border-radius: 20px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transform-origin: bottom right;
                transform: scale(0);
                opacity: 0;
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
                pointer-events: none;
            }
            #trai-agent-window.open {
                transform: scale(1);
                opacity: 1;
                pointer-events: all;
            }
            #trai-agent-header {
                padding: 15px 20px;
                background: rgba(0,0,0,0.5);
                border-bottom: 1px solid rgba(255,255,255,0.05);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            #trai-agent-title {
                margin: 0;
                font-size: 15px;
                color: #fff;
                display: flex;
                align-items: center;
                font-weight: 600;
            }
            .status-dot {
                display: inline-block;
                width: 8px;
                height: 8px;
                background: #ff6a00;
                border-radius: 50%;
                margin-right: 10px;
                box-shadow: 0 0 10px #ff6a00;
            }
            #trai-agent-close {
                background: none;
                border: none;
                color: rgba(255,255,255,0.5);
                cursor: pointer;
                font-size: 24px;
                line-height: 1;
                padding: 0;
            }
            #trai-agent-close:hover { color: #fff; }
            #trai-agent-3d {
                height: 200px;
                width: 100%;
                position: relative;
                background: radial-gradient(circle at center, rgba(255,106,0,0.1) 0%, transparent 70%);
                border-bottom: 1px solid rgba(255,255,255,0.05);
            }
            #trai-agent-chat {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .chat-msg {
                padding: 10px 14px;
                border-radius: 12px;
                font-size: 13.5px;
                line-height: 1.4;
                max-width: 85%;
            }
            .chat-msg.user {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
            }
            .chat-msg.bot {
                background: rgba(255, 106, 0, 0.15);
                color: #fff;
                align-self: flex-start;
                border-bottom-left-radius: 4px;
                border: 1px solid rgba(255, 106, 0, 0.3);
            }
            #trai-agent-input-area {
                padding: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.05);
                display: flex;
                gap: 10px;
                background: rgba(0,0,0,0.3);
            }
            #trai-agent-input {
                flex: 1;
                padding: 10px 15px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 8px;
                color: #fff;
                outline: none;
                font-family: inherit;
            }
            #trai-agent-input:focus {
                border-color: rgba(255,106,0,0.5);
            }
            #trai-agent-send {
                background: #ff6a00;
                color: #fff;
                border: none;
                padding: 0 15px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: background 0.2s;
            }
            #trai-agent-send:hover { background: #e65c00; }
        `;
        document.head.appendChild(style);

        widgetEl = document.createElement('div');
        widgetEl.id = 'trai-floating-agent';
        
        // FAB Button (Chat Icon)
        const fab = document.createElement('div');
        fab.id = 'trai-agent-fab';
        fab.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>';
        
        // Chat Window
        chatWindowEl = document.createElement('div');
        chatWindowEl.id = 'trai-agent-window';
        
        chatWindowEl.innerHTML = `
            <div id="trai-agent-header">
                <h3 id="trai-agent-title"><span class="status-dot"></span> Support Agent</h3>
                <button id="trai-agent-close">&times;</button>
            </div>
            <div id="trai-agent-3d"></div>
            <div id="trai-agent-chat"></div>
            <div id="trai-agent-input-area">
                <input type="text" id="trai-agent-input" placeholder="Type your message..." />
                <button id="trai-agent-send">Send</button>
            </div>
        `;
        
        widgetEl.appendChild(chatWindowEl);
        widgetEl.appendChild(fab);
        document.body.appendChild(widgetEl);
        
        canvasContainerEl = document.getElementById('trai-agent-3d');
        chatHistoryEl = document.getElementById('trai-agent-chat');
        chatInputEl = document.getElementById('trai-agent-input');
        const sendBtn = document.getElementById('trai-agent-send');
        const closeBtn = document.getElementById('trai-agent-close');
        
        // --- EVENTS ---
        fab.addEventListener('click', toggleWindow);
        closeBtn.addEventListener('click', toggleWindow);
        
        const handleSend = () => {
            const text = chatInputEl.value.trim();
            if (!text) return;
            appendMessage('user', text);
            chatInputEl.value = '';
            
            // AI confirms and opens WhatsApp
            setTimeout(() => {
                agentReply("Opening WhatsApp! Our engineers will reply to you shortly.");
                const waUrl = "https://wa.me/917905495478?text=" + encodeURIComponent(text);
                setTimeout(() => {
                    window.open(waUrl, '_blank');
                }, 1500); // Give AI a moment to speak
            }, 600);
        };
        
        sendBtn.addEventListener('click', handleSend);
        chatInputEl.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleSend(); });

        // --- 2. SETUP 3D SCENE ---
        init3D();
    }
    
    function toggleWindow() {
        isOpen = !isOpen;
        if (isOpen) {
            chatWindowEl.classList.add('open');
            // Greet on first open
            if (chatHistoryEl.children.length === 0) {
                setTimeout(() => {
                    agentReply("Hello! I am TRAI Bot, your AI Engineering Partner. How can I assist you with your project today?");
                }, 500);
            }
        } else {
            chatWindowEl.classList.remove('open');
        }
    }

    function init3D() {
        scene = new THREE.Scene();
        clock = new THREE.Clock();

        const aspect = canvasContainerEl.clientWidth / canvasContainerEl.clientHeight;
        camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 100);
        camera.position.set(0, 1.5, 5);

        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(canvasContainerEl.clientWidth, canvasContainerEl.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.outputEncoding = THREE.sRGBEncoding;
            canvasContainerEl.appendChild(renderer.domElement);
        } catch (e) {
            canvasContainerEl.innerHTML = '<div style="color:red; padding:20px; text-align:center;">WebGL disabled.</div>';
            return;
        }

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(3, 10, 10);
        scene.add(dirLight);

        const loader = new THREE.GLTFLoader();
        loader.load('/assets/traibot/model.glb', function (gltf) {
            model = gltf.scene;
            
            // Shadows & Morph Targets Check
            model.traverse(function (object) {
                if (object.isMesh && object.morphTargetDictionary) {
                    const dict = object.morphTargetDictionary;
                    const mouthOpenKeys = ['mouthOpen', 'viseme_O', 'viseme_aa'];
                    for (let key of mouthOpenKeys) {
                        if (dict[key] !== undefined) {
                            headMesh = object;
                            mouthMorphIndex = dict[key];
                            break;
                        }
                    }
                }
            });
            
            // Auto-scale & center for the small widget window
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            const maxDim = Math.max(size.x, size.y, size.z);
            // Scale up significantly so we see a portrait (chest up) instead of full body
            baseScale = 7.0 / maxDim; 
            model.scale.set(baseScale, baseScale, baseScale);
            
            model.position.x = -center.x * baseScale;
            // Lower significantly so the head/chest is in the center of the 200px canvas
            model.position.y = (-center.y * baseScale) - 3.5;
            model.position.z = -center.z * baseScale;
            
            scene.add(model);

            mixer = new THREE.AnimationMixer(gltf.scene);
            if (gltf.animations && gltf.animations.length > 0) {
                mixer.clipAction(gltf.animations[0]).play();
            }
            
        });

        animate();
    }
    
    function appendMessage(sender, text) {
        const msg = document.createElement('div');
        msg.className = 'chat-msg ' + sender;
        msg.innerText = text;
        chatHistoryEl.appendChild(msg);
        chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
    }
    
    function agentReply(text) {
        appendMessage('bot', text);
        
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
            if (preferredVoice) utterance.voice = preferredVoice;
            
            utterance.pitch = 1.1;
            utterance.rate = 1.0;
            
            utterance.onstart = () => { isSpeaking = true; };
            utterance.onend = () => { isSpeaking = false; };
            utterance.onerror = () => { isSpeaking = false; };
            
            window.speechSynthesis.speak(utterance);
        } else {
            isSpeaking = true;
            setTimeout(() => { isSpeaking = false; }, text.length * 50);
        }
    }

    function animate() {
        animationId = requestAnimationFrame(animate);
        if (!clock) return;
        
        const delta = clock.getDelta();
        const time = clock.elapsedTime;
        
        if (mixer) mixer.update(delta);
        
        if (model) {
            // Very slow idle rotation
            model.rotation.y = Math.sin(time * 0.5) * 0.1;
            
            if (isSpeaking) {
                if (headMesh && mouthMorphIndex !== -1) {
                    const mouthOpen = (Math.sin(time * 15) + 1) * 0.4 + (Math.random() * 0.2);
                    headMesh.morphTargetInfluences[mouthMorphIndex] = mouthOpen;
                } else {
                    const talkScale = baseScale + (Math.sin(time * 20) * (baseScale * 0.02));
                    model.scale.set(talkScale, talkScale, talkScale);
                    model.rotation.x = Math.sin(time * 10) * 0.05;
                }
            } else {
                if (headMesh && mouthMorphIndex !== -1) {
                    headMesh.morphTargetInfluences[mouthMorphIndex] *= 0.8;
                } else {
                    // Smoothly revert to base scale and rotation
                    model.scale.x += (baseScale - model.scale.x) * 0.1;
                    model.scale.y += (baseScale - model.scale.y) * 0.1;
                    model.scale.z += (baseScale - model.scale.z) * 0.1;
                    model.rotation.x *= 0.9;
                }
                
                // Keep the Y position breathing relative to the base offset
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.y = (-center.y * baseScale) - 3.5 + (Math.sin(time * 1.5) * 0.02);
            }
        }

        if (renderer && scene && camera && isOpen) {
            renderer.render(scene, camera);
        }
    }

    // Initialize globally
    window.addEventListener('load', () => {
        // Delay slightly to ensure Three.js is loaded
        const check = setInterval(() => {
            if (window.THREE && window.THREE.GLTFLoader) {
                clearInterval(check);
                init();
            }
        }, 100);
        
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
        }
    });

})();
