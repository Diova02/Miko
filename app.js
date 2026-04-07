document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ELEMENTOS DO DOM
    // ==========================================
    const btnProfile = document.getElementById('btn-profile');
    const btnEnv = document.getElementById('btn-env');
    const btnSettings = document.getElementById('btn-settings');
    
    // Overlay principal (usado para painéis e todos os modais)
    const overlay = document.getElementById('ui-overlay'); 
    
    const panelProfile = document.getElementById('panel-profile');
    const panelSettings = document.getElementById('panel-settings');
    const modalEnv = document.getElementById('modal-env');
    const modalFilter = document.getElementById('modal-filter');
    
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    const viewSpeakerDetail = document.getElementById('view-speaker-detail');
    const btnBackGrid = document.getElementById('btn-back-grid');
    const detailTitle = document.getElementById('detail-title');
    
    const speakerCards = document.querySelectorAll('.speaker-card');
    const btnAdd = document.getElementById('btn-add');
    const btnFilter = document.getElementById('btn-filter');
    const closeButtons = document.querySelectorAll('.btn-close'); // Usado em botões de fechar (X)

    // Elementos da Dashboard do Palestrante (Cards de Leitura e Modais de Edição)
    const dashboardCards = {
        profile: document.getElementById('card-profile'),
        alerts: document.getElementById('card-alerts'),
        eq: document.getElementById('card-eq'),
        comp: document.getElementById('card-comp'),
        baseinfo: document.getElementById('card-base-info'),
    };
    
    const editModals = {
        profile: document.getElementById('modal-profile'),
        alerts: document.getElementById('modal-alerts'),
        eq: document.getElementById('modal-eq'),
        comp: document.getElementById('modal-comp'),
        baseinfo: document.getElementById('modal-baseinfo'),
    };

    // ==========================================
    // 2. FUNÇÕES UI (GERENCIAMENTO DE CAMADAS)
    // ==========================================
    const openUIElement = (element) => {
        if (!element) return;
        overlay.classList.add('active');
        element.classList.add('active');
        // Trava a rolagem do fundo
        document.body.classList.add('modal-open'); 
    };

    const closeAllUIElements = () => {
        overlay.classList.remove('active');
        document.querySelectorAll('.side-panel.active, .modal.active').forEach(el => {
            el.classList.remove('active');
        });
        // Destrava a rolagem do fundo
        document.body.classList.remove('modal-open'); 
    };

    // ==========================================
    // 3. EVENTOS GERAIS DE MODAIS E PAINÉIS
    // ==========================================
    btnProfile.addEventListener('click', () => openUIElement(panelProfile));
    btnSettings.addEventListener('click', () => openUIElement(panelSettings));
    btnEnv.addEventListener('click', () => openUIElement(modalEnv));
    btnFilter.addEventListener('click', () => openUIElement(modalFilter));
    
    // Clicar fora (no overlay) fecha tudo
    overlay.addEventListener('click', closeAllUIElements);

    // Botões de fechar (X)
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-close'); 
            if (targetId) {
                document.getElementById(targetId).classList.remove('active');
            } else {
                btn.closest('.modal, .side-panel').classList.remove('active');
            }
            
            // Verifica se ainda sobrou algum modal/painel aberto na tela
            const anyOpen = document.querySelectorAll('.modal.active, .side-panel.active').length > 0;
            
            // Se nenhum modal estiver aberto, remove o overlay e libera o scroll
            if (!anyOpen) {
                overlay.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    });
    
    // ==========================================
    // 4. LÓGICA DE TROCA DE ABAS
    // ==========================================
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            tabPanes[index].classList.add('active');
        });
    });

    // ==========================================
    // 5. ABRIR TELA DE DETALHES (DETAIL VIEW)
    // ==========================================
    speakerCards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('.name').textContent;
            detailTitle.textContent = name;
            viewSpeakerDetail.classList.add('active');
        });
    });

    // ==========================================
    // 6. BOTÃO ADICIONAR (NOVO FORMULÁRIO)
    // ==========================================
    const viewAddSpeaker = document.getElementById('view-add-speaker');
    const btnCancelAdd = document.getElementById('btn-cancel-add');

    btnAdd.addEventListener('click', () => {
        // Abre o formulário contínuo
        viewAddSpeaker.classList.add('active');
        document.body.classList.add('modal-open'); // Trava rolagem do fundo
    });

    // Cancelar/Fechar o formulário de adição
    btnCancelAdd.addEventListener('click', () => {
        viewAddSpeaker.classList.remove('active');
        document.body.classList.remove('modal-open');
    });

    // ==========================================
    // 7. FECHAR TELA DE DETALHES
    // ==========================================
    btnBackGrid.addEventListener('click', () => {
        viewSpeakerDetail.classList.remove('active');
    });

    // ==========================================
    // 8. LÓGICA DO EQUALIZADOR E SINCRONIZAÇÃO
    // ==========================================
    const sliders = document.querySelectorAll('.center-slider');

    const updateSliderFill = (slider) => {
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        const val = parseFloat(slider.value);
        
        const percent = ((val - min) / (max - min)) * 100;
        
        if (val > 0) {
            slider.style.setProperty('--fill-min', '50%');
            slider.style.setProperty('--fill-max', `${percent}%`);
        } else {
            slider.style.setProperty('--fill-min', `${percent}%`);
            slider.style.setProperty('--fill-max', '50%');
        }

        const displayVal = val > 0 ? `+${val}` : val;

        // 1. Atualiza o texto DENTRO do modal
        const faderValueSpan = slider.closest('.fader-group').querySelector('.fader-value');
        if (faderValueSpan) {
            faderValueSpan.textContent = displayVal;
        }

        // 2. Atualiza o texto LÁ NO CARD de visualização (Tela principal)
        // Isso requer que o <input> tenha um atributo data-sync="id-do-span-no-card"
        const syncTargetId = slider.getAttribute('data-sync');
        if (syncTargetId) {
            const displaySpan = document.getElementById(syncTargetId);
            if (displaySpan) displaySpan.textContent = displayVal;
        }
    };

    sliders.forEach(slider => {
        updateSliderFill(slider); 
        slider.addEventListener('input', (e) => updateSliderFill(e.target)); 
    });

    // ==========================================
    // 9. LÓGICA DA DASHBOARD (CARDS -> MODAIS)
    // ==========================================
    // Só abre a edição se o usuário clicar no card específico
    
    if(dashboardCards.profile) {
        dashboardCards.profile.addEventListener('click', () => openUIElement(editModals.profile));
    }
    
    if(dashboardCards.alerts) {
        dashboardCards.alerts.addEventListener('click', () => openUIElement(editModals.alerts));
    }
    
    if(dashboardCards.eq) {
        dashboardCards.eq.addEventListener('click', () => openUIElement(editModals.eq));
    }
    
    if(dashboardCards.comp) {
        dashboardCards.comp.addEventListener('click', () => openUIElement(editModals.comp));
    }

    if(dashboardCards.baseinfo) {
        dashboardCards.baseinfo.addEventListener('click', () => openUIElement(editModals.baseinfo));
    }

    // ==========================================
    // 10. BOTÕES DE PRECISÃO (+ E -) DO EQ
    // ==========================================
    const precisionButtons = document.querySelectorAll('.fader-btn');
    
    precisionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Acha qual fader pertence a este botão
            const faderGroup = btn.closest('.fader-group');
            const slider = faderGroup.querySelector('.center-slider');
            
            if (!slider) return;

            let currentValue = parseFloat(slider.value);
            const step = parseFloat(slider.step) || 1;
            const max = parseFloat(slider.max);
            const min = parseFloat(slider.min);
            
            const action = btn.getAttribute('data-action'); // Lê se é 'plus' ou 'minus'
            
            // Faz a conta respeitando o limite do fader
            if (action === 'plus' && currentValue < max) {
                slider.value = currentValue + step;
            } else if (action === 'minus' && currentValue > min) {
                slider.value = currentValue - step;
            }

            // O pulo do gato: Dispara o evento 'input' manualmente. 
            // Isso faz a Seção 8 entrar em ação, atualizando as cores, o número do modal e o número da dashboard lá atrás de uma vez só!
            slider.dispatchEvent(new Event('input'));
        });
    });

    // ==========================================
    // 11. LÓGICA DOS KNOBS (COMPRESSOR)
    // ==========================================
    const knobs = document.querySelectorAll('.knob-container');

    knobs.forEach(knob => {
        const dial = knob.querySelector('.knob-dial');
        const valueDisplay = knob.nextElementSibling; // O span .knob-value
        const syncTargetId = knob.getAttribute('data-sync');
        const syncTarget = syncTargetId ? document.getElementById(syncTargetId) : null;
        
        // Coleta as configurações do HTML
        const min = parseFloat(knob.getAttribute('data-min'));
        const max = parseFloat(knob.getAttribute('data-max'));
        const step = parseFloat(knob.getAttribute('data-step')) || 1;
        const unit = knob.getAttribute('data-unit') || '';
        
        let currentValue = parseFloat(knob.getAttribute('data-value'));
        
        // Função para atualizar o visual e os números
        const updateKnob = (val) => {
            // Trava nos limites
            if (val < min) val = min;
            if (val > max) val = max;
            currentValue = val;
            
            // Converte o valor para graus (De -135º até +135º)
            const percent = (currentValue - min) / (max - min);
            const degrees = (percent * 270) - 135;
            
            dial.style.transform = `rotate(${degrees}deg)`;
            
            // Formatação bonita do texto
            let displayStr = currentValue.toString();
            // Adiciona o sinal de + no Gain/Thresh se for maior que zero, por padrão estético
            if (currentValue > 0 && unit === 'dB') displayStr = '+' + displayStr;
            
            displayStr += unit;
            
            // Atualiza no Modal e na Dashboard
            valueDisplay.textContent = displayStr;
            if (syncTarget) syncTarget.textContent = displayStr;
        };
        
        // Inicializa com o valor padrão do HTML
        updateKnob(currentValue);
        
        // Variáveis de interação
        let isDragging = false;
        let startY = 0;
        let startValue = 0;
        
        const startDrag = (e) => {
            isDragging = true;
            // Pega a posição Y do Mouse ou do Dedo
            startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            startValue = currentValue;
        };
        
        const doDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Evita qualquer scroll fantasma
            
            const currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            const deltaY = startY - currentY; // Movimento para CIMA gera número positivo
            
            // Sensibilidade: 150 pixels de arrasto percorrem 100% do botão
            const range = max - min;
            const change = (deltaY / 150) * range; 
            
            // Aplica o "Step" (ex: pular de 0.5 em 0.5)
            let newVal = startValue + change;
            newVal = Math.round(newVal / step) * step;
            
            updateKnob(newVal);
        };
        
        const stopDrag = () => {
            isDragging = false;
        };
        
        // Eventos para Desktop (Mouse)
        knob.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', doDrag);
        window.addEventListener('mouseup', stopDrag);
        
        // Eventos para Mobile (Toque)
        knob.addEventListener('touchstart', startDrag, { passive: false });
        window.addEventListener('touchmove', doDrag, { passive: false });
        window.addEventListener('touchend', stopDrag);
    });
});