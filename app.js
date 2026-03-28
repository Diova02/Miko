document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Elementos do DOM
    const btnProfile = document.getElementById('btn-profile');
    const btnEnv = document.getElementById('btn-env');
    const btnSettings = document.getElementById('btn-settings');
    
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
    const closeButtons = document.querySelectorAll('.btn-close');

    // 2. Funções UI
    const openUIElement = (element) => {
        overlay.classList.add('active');
        element.classList.add('active');
    };

    const closeAllUIElements = () => {
        overlay.classList.remove('active');
        panelProfile.classList.remove('active');
        panelSettings.classList.remove('active');
        modalEnv.classList.remove('active');
        modalFilter.classList.remove('active');
    };

    // 3. Eventos de Modais e Painéis
    btnProfile.addEventListener('click', () => openUIElement(panelProfile));
    btnSettings.addEventListener('click', () => openUIElement(panelSettings));
    btnEnv.addEventListener('click', () => openUIElement(modalEnv));
    btnFilter.addEventListener('click', () => openUIElement(modalFilter));
    overlay.addEventListener('click', closeAllUIElements);

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-close');
            document.getElementById(targetId).classList.remove('active');
            overlay.classList.remove('active');
        });
    });

    // 4. Lógica de Troca de Abas
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Remove estado ativo de todos
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Adiciona estado ativo na aba clicada
            tab.classList.add('active');
            tabPanes[index].classList.add('active');
        });
    });

    // 5. Lógica da Tela de Detalhes (Abrir Card)
    speakerCards.forEach(card => {
        card.addEventListener('click', () => {
            // Pega o nome do card clicado e joga no título da tela
            const name = card.querySelector('.name').textContent;
            detailTitle.textContent = name;
            viewSpeakerDetail.classList.add('active');
        });
    });

    // 6. Lógica do Botão Adicionar
    btnAdd.addEventListener('click', () => {
        detailTitle.textContent = "Novo Palestrante";
        viewSpeakerDetail.classList.add('active');
    });

    // 7. Fechar Tela de Detalhes
    btnBackGrid.addEventListener('click', () => {
        viewSpeakerDetail.classList.remove('active');
    });

    // 8. Lógica dos Sliders do Equalizador (Preenchimento a partir do centro)
    const sliders = document.querySelectorAll('.center-slider');

    const updateSliderFill = (slider) => {
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        const val = parseFloat(slider.value);
        
        // Converte o valor atual para uma porcentagem de 0% a 100%
        const percent = ((val - min) / (max - min)) * 100;
        
        // Se o valor for positivo (acima de 0dB, que é o centro 50%)
        if (val > 0) {
            slider.style.setProperty('--fill-min', '50%');
            slider.style.setProperty('--fill-max', `${percent}%`);
        } else {
            // Se for negativo ou zero
            slider.style.setProperty('--fill-min', `${percent}%`);
            slider.style.setProperty('--fill-max', '50%');
        }

        // Atualiza o textinho (+4, -3, 0)
        const faderValueSpan = slider.closest('.fader-group').querySelector('.fader-value');
        if (faderValueSpan) {
            faderValueSpan.textContent = val > 0 ? `+${val}` : val;
        }
    };

    // Aplica a lógica em todos os sliders
    sliders.forEach(slider => {
        updateSliderFill(slider); // Atualiza no carregamento inicial
        slider.addEventListener('input', (e) => updateSliderFill(e.target)); // Atualiza ao arrastar
    });
});