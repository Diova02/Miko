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
        comp: document.getElementById('card-comp')
    };
    
    const editModals = {
        profile: document.getElementById('modal-profile'),
        alerts: document.getElementById('modal-alerts'),
        eq: document.getElementById('modal-eq'),
        comp: document.getElementById('modal-comp')
    };

    // ==========================================
    // 2. FUNÇÕES UI (GERENCIAMENTO DE CAMADAS)
    // ==========================================
    const openUIElement = (element) => {
        if (!element) return;
        overlay.classList.add('active');
        element.classList.add('active');
    };

    const closeAllUIElements = () => {
        overlay.classList.remove('active');
        // Método escalável: acha qualquer painel ou modal aberto e fecha
        document.querySelectorAll('.side-panel.active, .modal.active').forEach(el => {
            el.classList.remove('active');
        });
    };

    // ==========================================
    // 3. EVENTOS GERAIS DE MODAIS E PAINÉIS
    // ==========================================
    btnProfile.addEventListener('click', () => openUIElement(panelProfile));
    btnSettings.addEventListener('click', () => openUIElement(panelSettings));
    btnEnv.addEventListener('click', () => openUIElement(modalEnv));
    btnFilter.addEventListener('click', () => openUIElement(modalFilter));
    
    // Clicar fora (no fundo escuro) fecha tudo que estiver sobreposto
    overlay.addEventListener('click', closeAllUIElements);

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Requer que o HTML do botão tenha data-close="id-do-modal"
            const targetId = btn.getAttribute('data-close'); 
            if(targetId) {
                document.getElementById(targetId).classList.remove('active');
            } else {
                // Fallback caso não tenha o atributo: fecha quem é o pai dele
                btn.closest('.modal, .side-panel').classList.remove('active');
            }
            overlay.classList.remove('active');
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

});