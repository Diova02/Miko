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
    // 6. BOTÃO ADICIONAR NOVO PALESTRANTE
    // ==========================================
    btnAdd.addEventListener('click', () => {
        detailTitle.textContent = "Novo Palestrante";
        viewSpeakerDetail.classList.add('active');
        // Aqui você pode adicionar lógica para limpar a Dashboard para criar do zero
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
});