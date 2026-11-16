document.addEventListener('DOMContentLoaded', () => {
    const medicos = [
        {
            id: 1,
            nome: 'Dra. Marina Lima',
            iniciais: 'ML',
            corAvatar: 'doctor-a',
            especialidade: 'Clínica geral',
            disponibilidade: 'Disponível hoje',
            corPill: 'pill-green',
            nota: '4,9',
            avaliacoes: '120',
            duracao: '30 min',
            convenios: ['Saúde Plus', 'BemViver'],
            horarios: ['14:30', '15:30', '16:00'],
            local: 'Centro Médico Vida · Sala 204',
            dataPadrao: '2026-10-11'
        },
        {
            id: 2,
            nome: 'Dr. Rafael Costa',
            iniciais: 'RC',
            corAvatar: 'doctor-b',
            especialidade: 'Cardiologia',
            disponibilidade: 'Amanhã',
            corPill: 'pill-blue',
            nota: '4,8',
            avaliacoes: '96',
            duracao: '45 min',
            convenios: ['Saúde Plus', 'Particular'],
            horarios: ['09:00', '10:15', '11:00'],
            local: 'Clínica Horizonte · Sala 08',
            dataPadrao: '2026-10-15'
        },
        {
            id: 3,
            nome: 'Dra. Ana Ferreira',
            iniciais: 'AF',
            corAvatar: 'doctor-c',
            especialidade: 'Dermatologia',
            disponibilidade: 'Amanhã',
            corPill: 'pill-blue',
            nota: '4,9',
            avaliacoes: '84',
            duracao: '30 min',
            convenios: ['BemViver', 'Particular'],
            horarios: ['08:30', '09:30', '13:00'],
            local: 'Instituto Pele & Saúde · Sala 12',
            dataPadrao: '2026-10-16'
        }
    ];

    const consultasIniciais = [
        {
            id: 101,
            medico: 'Dra. Marina Lima',
            especialidade: 'Clínica geral',
            tipo: 'Consulta presencial',
            local: 'Centro Médico Vida · Sala 204',
            dia: '11',
            mes: 'OUT',
            dataCompleta: '2026-10-11',
            diaSemana: 'Hoje',
            horario: '15:30',
            duracao: '30 minutos',
            horasRestantes: 1.5,
            status: 'Confirmada'
        },
        {
            id: 102,
            medico: 'Dr. Rafael Costa',
            especialidade: 'Cardiologia',
            tipo: 'Consulta presencial',
            local: 'Clínica Horizonte · Sala 08',
            dia: '15',
            mes: 'OUT',
            dataCompleta: '2026-10-15',
            diaSemana: 'Quinta-feira',
            horario: '09:00',
            duracao: '45 minutos',
            horasRestantes: 96,
            status: 'Marcada'
        }
    ];

    let consultasAgendadas = JSON.parse(localStorage.getItem('appsaude_consultas')) || consultasIniciais;

    function salvarConsultas() {
        localStorage.setItem('appsaude_consultas', JSON.stringify(consultasAgendadas));
    }

    function exibirFeedback(containerPai, texto, tipo) {
        if (!containerPai) return;
        let box = document.getElementById('js-feedback-box');
        if (!box) {
            box = document.createElement('div');
            box.id = 'js-feedback-box';
            box.style.padding = '14px 18px';
            box.style.margin = '16px 0';
            box.style.borderRadius = '10px';
            box.style.fontSize = '13px';
            box.style.fontWeight = '600';
            containerPai.parentNode.insertBefore(box, containerPai);
        }

        box.textContent = texto;
        if (tipo === 'sucesso') {
            box.style.backgroundColor = '#e4f5ec';
            box.style.color = '#247658';
            box.style.border = '1px solid #bce3cf';
        } else {
            box.style.backgroundColor = '#ffe9e7';
            box.style.color = '#bd5751';
            box.style.border = '1px solid #f5c2be';
        }
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const filterForm = document.querySelector('.filter-form');
    const doctorGrid = document.querySelector('.doctor-grid');
    const resultsCount = document.querySelector('.results-count');

    if (filterForm && doctorGrid) {
        const selectEspecialidade = filterForm.querySelector('select[name="especialidade"]');
        const selectConvenio = filterForm.querySelector('select[name="convenio"]');
        const inputData = filterForm.querySelector('input[name="data"]');

        const horariosSelecionados = {};

        function renderizarMedicos(lista) {
            doctorGrid.innerHTML = '';

            if (resultsCount) {
                const qtd = String(lista.length).padStart(2, '0');
                resultsCount.textContent = `${qtd} ${lista.length === 1 ? 'profissional' : 'profissionais'}`;
            }

            if (lista.length === 0) {
                doctorGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; background: white; padding: 24px; border-radius: 15px; border: 1px solid #e2ebe6; text-align: center; color: #667b7b;">
                        Nenhum especialista encontrado para os filtros selecionados.
                    </div>
                `;
                return;
            }

            lista.forEach(medico => {
                const horarioAtivo = horariosSelecionados[medico.id] || medico.horarios[0];

                const card = document.createElement('article');
                card.className = 'doctor-card';
                card.innerHTML = `
                    <div class="doctor-card-top">
                        <div class="avatar ${medico.corAvatar}">${medico.iniciais}</div>
                        <span class="pill ${medico.corPill}">${medico.disponibilidade}</span>
                    </div>

                    <h3>${medico.nome}</h3>
                    <p class="specialty">${medico.especialidade}</p>

                    <div class="doctor-meta">
                        <span>★ ${medico.nota} <small>(${medico.avaliacoes})</small></span>
                        <span>◷ ${medico.duracao}</span>
                    </div>

                    <div class="insurance">
                        <span>Convênios aceitos</span>
                        <strong>${medico.convenios.join(' · ')}</strong>
                    </div>

                    <div class="slots">
                        <span>Próximos horários (clique para selecionar)</span>
                        <div class="slots-list">
                            ${medico.horarios.map(h => `
                                <span class="slot-item" data-medico="${medico.id}" data-hora="${h}" 
                                      style="cursor: pointer; ${h === horarioAtivo ? 'background: #176b63; color: #fff; border-color: #176b63;' : ''}">
                                    ${h}
                                </span>
                            `).join('')}
                        </div>
                    </div>

                    <button type="button" class="btn btn-primary btn-full btn-agendar" data-medico="${medico.id}">
                        Agendar às ${horarioAtivo} →
                    </button>
                `;

                doctorGrid.appendChild(card);
            });
s
            doctorGrid.querySelectorAll('.slot-item').forEach(slot => {
                slot.addEventListener('click', (e) => {
                    const medId = Number(e.target.dataset.medico);
                    const hora = e.target.dataset.hora;
                    horariosSelecionados[medId] = hora;
                    aplicarFiltros();
                });
            });

            doctorGrid.querySelectorAll('.btn-agendar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const medId = Number(e.target.dataset.medico);
                    const medico = medicos.find(m => m.id === medId);
                    const horarioEscolhido = horariosSelecionados[medId] || medico.horarios[0];
                    const dataEscolhida = (inputData && inputData.value) ? inputData.value : medico.dataPadrao;

                    realizarAgendamento(medico, dataEscolhida, horarioEscolhido);
                });
            });
        }

        function realizarAgendamento(medico, dataIso, horario) {
            const existeConflito = consultasAgendadas.some(c =>
                c.medico === medico.nome &&
                c.dataCompleta === dataIso &&
                c.horario === horario &&
                c.status !== 'Cancelada'
            );

            if (existeConflito) {
                exibirFeedback(
                    doctorGrid,
                    `Conflito de Agenda (RN02): O horário ${horario} do dia ${dataIso} já está ocupado para ${medico.nome}. Selecione outro horário.`,
                    'erro'
                );
                return;
            }

            const partesData = dataIso.split('-');
            const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
            const dia = partesData[2] || '20';
            const mes = meses[parseInt(partesData[1], 10) - 1] || 'OUT';

            const novaConsulta = {
                id: Date.now(),
                medico: medico.nome,
                especialidade: medico.especialidade,
                tipo: 'Consulta presencial',
                local: medico.local,
                dia: dia,
                mes: mes,
                dataCompleta: dataIso,
                diaSemana: 'Agendada online',
                horario: horario,
                duracao: medico.duracao.replace('min', 'minutos'),
                horasRestantes: 48,
                status: 'Confirmada'
            };

            consultasAgendadas.push(novaConsulta);
            salvarConsultas();

            exibirFeedback(
                doctorGrid,
                `Sucesso (CT01): Consulta agendada com ${medico.nome} para ${dia}/${mes} às ${horario}! Acesse "Minhas consultas" para visualizar.`,
                'sucesso'
            );
        }

        function aplicarFiltros() {
            const esp = selectEspecialidade ? selectEspecialidade.value : '';
            const conv = selectConvenio ? selectConvenio.value : '';

            const filtrados = medicos.filter(m => {
                const matchEsp = !esp || esp === 'Todos' || m.especialidade === esp;
                const matchConv = !conv || conv === 'Todos' || m.convenios.includes(conv);
                return matchEsp && matchConv;
            });

            renderizarMedicos(filtrados);
        }

        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            aplicarFiltros();
        });

        if (selectEspecialidade) selectEspecialidade.addEventListener('change', aplicarFiltros);
        if (selectConvenio) selectConvenio.addEventListener('change', aplicarFiltros);

        aplicarFiltros();
    }

    const appointmentsPanel = document.querySelector('.appointments-panel');

    if (appointmentsPanel) {
        const filtroStatusSelect = appointmentsPanel.querySelector('.panel-heading select');

        function atualizarCardsResumo() {
            const ativas = consultasAgendadas.filter(c => c.status !== 'Cancelada');
            const summaryCards = document.querySelectorAll('.summary-grid .summary-card');

            if (summaryCards.length >= 3) {
                summaryCards[0].querySelector('strong').textContent = String(ativas.length).padStart(2, '0');

                if (ativas.length > 0) {
                    const proxima = ativas[0];
                    summaryCards[1].querySelector('strong').textContent = proxima.diaSemana === 'Hoje' ? 'Hoje' : `${proxima.dia}/${proxima.mes}`;
                    summaryCards[1].querySelector('small').textContent = `${proxima.horario} · ${proxima.especialidade}`;
                    summaryCards[2].querySelector('strong').textContent = proxima.status;
                } else {
                    summaryCards[1].querySelector('strong').textContent = '--';
                    summaryCards[1].querySelector('small').textContent = 'Nenhum horário ativo';
                    summaryCards[2].querySelector('strong').textContent = 'Sem agenda';
                }
            }
        }

        function renderizarConsultas(filtro = 'Todas as consultas') {
            // Remove apenas as linhas antigas, preservando o cabeçalho (.panel-heading)
            appointmentsPanel.querySelectorAll('.appointment-row, .empty-msg').forEach(el => el.remove());

            const listaFiltrada = consultasAgendadas.filter(c => {
                if (filtro === 'Confirmadas') return c.status === 'Confirmada';
                if (filtro === 'Marcadas') return c.status === 'Marcada';
                return true;
            });

            if (listaFiltrada.length === 0) {
                const vazio = document.createElement('p');
                vazio.className = 'empty-msg';
                vazio.style.padding = '20px 0';
                vazio.style.color = '#71857c';
                vazio.style.fontSize = '13px';
                vazio.textContent = 'Nenhuma consulta encontrada para este filtro.';
                appointmentsPanel.appendChild(vazio);
                atualizarCardsResumo();
                return;
            }

            listaFiltrada.forEach(consulta => {
                const isCancelada = consulta.status === 'Cancelada';
                let pillClass = 'pill-green';
                if (consulta.status === 'Marcada') pillClass = 'pill-blue';
                if (isCancelada) pillClass = 'pill-red';

                const row = document.createElement('article');
                row.className = 'appointment-row';
                if (isCancelada) row.style.opacity = '0.65';

                row.innerHTML = `
                    <div class="date-block ${consulta.status === 'Marcada' ? 'date-blue' : ''}">
                        <strong>${consulta.dia}</strong>
                        <span>${consulta.mes}</span>
                    </div>

                    <div class="appointment-main">
                        <h3>
                            ${consulta.medico}
                            <span class="pill ${pillClass}">${consulta.status}</span>
                        </h3>
                        <p>${consulta.especialidade} · ${consulta.tipo}</p>
                        <span class="appointment-location">⌖ ${consulta.local}</span>
                    </div>

                    <div class="appointment-time">
                        <strong>${consulta.horario}</strong>
                        <span>${consulta.diaSemana} · ${consulta.duracao}</span>
                    </div>

                    <div class="appointment-actions">
                        ${!isCancelada ? `
                            <button class="btn btn-outline btn-remarcar" type="button" data-id="${consulta.id}">
                                Remarcar
                            </button>
                            <button class="cancel-link btn-cancelar" type="button" data-id="${consulta.id}">
                                Cancelar
                            </button>
                        ` : '<span style="font-size: 11px; color: #8b9a94;">Encerrada</span>'}
                    </div>
                `;

                appointmentsPanel.appendChild(row);
            });

            // Eventos de Remarcar
            appointmentsPanel.querySelectorAll('.btn-remarcar').forEach(btn => {
                btn.addEventListener('click', () => {
                    window.location.href = 'profissionais.html';
                });
            });

            // Eventos de Cancelar (Regra RN01)
            appointmentsPanel.querySelectorAll('.btn-cancelar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = Number(e.target.dataset.id);
                    processarCancelamento(id);
                });
            });

            atualizarCardsResumo();
        }

        function processarCancelamento(idConsulta) {
            const consulta = consultasAgendadas.find(c => c.id === idConsulta);
            if (!consulta) return;

            // Regra RN01: Antecedência mínima de 2 horas
            if (consulta.horasRestantes < 2) {
                exibirFeedback(
                    appointmentsPanel,
                    `Cancelamento Bloqueado (RN01 / CT04): Faltam apenas ${Math.round(consulta.horasRestantes * 60)} minutos para a consulta com ${consulta.medico}. O cancelamento online exige antecedência mínima de 2 horas.`,
                    'erro'
                );
                return;
            }

            consulta.status = 'Cancelada';
            salvarConsultas();
            renderizarConsultas(filtroStatusSelect ? filtroStatusSelect.value : 'Todas as consultas');

            exibirFeedback(
                appointmentsPanel,
                `Cancelamento Confirmado (RN01 / CT03): Sua consulta com ${consulta.medico} às ${consulta.horario} foi cancelada gratuitamente e o horário foi liberado.`,
                'sucesso'
            );
        }

        if (filtroStatusSelect) {
            filtroStatusSelect.addEventListener('change', (e) => {
                renderizarConsultas(e.target.value);
            });
        }

        renderizarConsultas();
    }

    const scheduleTable = document.querySelector('.schedule-table');
    const scheduleSelect = document.querySelector('.schedule-controls select');

    if (scheduleTable && scheduleSelect) {
        scheduleSelect.addEventListener('change', (e) => {
            const profissionalSelecionado = e.target.value;
            const linhas = scheduleTable.querySelectorAll('tbody tr');

            linhas.forEach(tr => {
                const nomeProfissional = tr.children[2].textContent.trim();
                if (profissionalSelecionado === 'Todos os profissionais' || nomeProfissional === profissionalSelecionado) {
                    tr.style.display = '';
                } else {
                    tr.style.display = 'none';
                }
            });
        });
    }
});
