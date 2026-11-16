document.addEventListener('DOMContentLoaded', () => {
    const medicos = [
        { id: 1, nome: 'Dr. Carlos Silva', especialidade: 'Cardiologia', convenio: 'Unimed' },
        { id: 2, nome: 'Dra. Ana Beatriz', especialidade: 'Dermatologia', convenio: 'Bradesco Saúde' },
        { id: 3, nome: 'Dr. Roberto Mendes', especialidade: 'Ortopedia', convenio: 'SUS' },
        { id: 4, nome: 'Dra. Juliana Costa', especialidade: 'Cardiologia', convenio: 'Amil' }
    ];

    let consultasAgendadas = [
        {
            id: 101,
            paciente: 'Paciente Logado',
            medico: 'Dr. Carlos Silva',
            especialidade: 'Cardiologia',
            data: '2026-11-20',
            horario: '10:00',
            horasRestantes: 24,
            status: 'Confirmada'
        },
        {
            id: 102,
            paciente: 'Paciente Logado',
            medico: 'Dra. Ana Beatriz',
            especialidade: 'Dermatologia',
            data: '2026-11-20',
            horario: '15:00',
            horasRestantes: 3,
            status: 'Confirmada'
        },
        {
            id: 103,
            paciente: 'Paciente Logado',
            medico: 'Dr. Roberto Mendes',
            especialidade: 'Ortopedia',
            data: '2026-11-20',
            horario: '15:00',
            horasRestantes: 0.5,
            status: 'Confirmada'
        }
    ];

    const filtroEspecialidade = document.getElementById('filtro-especialidade');
    const filtroConvenio = document.getElementById('filtro-convenio');
    const listaMedicosContainer = document.getElementById('lista-medicos');

    const formAgendamento = document.getElementById('form-agendamento');
    const selectMedico = document.getElementById('select-medico');
    const inputData = document.getElementById('input-data');
    const selectHorario = document.getElementById('select-horario');
    const feedbackAgendamento = document.getElementById('feedback-agendamento');

    const listaConsultasContainer = document.getElementById('lista-consultas');
    const feedbackCancelamento = document.getElementById('feedback-cancelamento');

    function exibirMensagem(elemento, texto, tipo) {
        if (!elemento) return;
        elemento.textContent = texto;
        elemento.style.display = 'block';
        elemento.style.padding = '12px 16px';
        elemento.style.marginTop = '12px';
        elemento.style.borderRadius = '6px';
        elemento.style.fontWeight = '600';

        if (tipo === 'sucesso') {
            elemento.style.backgroundColor = '#d4edda';
            elemento.style.color = '#155724';
            elemento.style.border = '1px solid #c3e6cb';
        } else {
            elemento.style.backgroundColor = '#f8d7da';
            elemento.style.color = '#721c24';
            elemento.style.border = '1px solid #f5c6cb';
        }
    }

    function renderizarMedicos(listaFiltrada) {
        if (!listaMedicosContainer) return;
        listaMedicosContainer.innerHTML = '';

        if (listaFiltrada.length === 0) {
            listaMedicosContainer.innerHTML = '<p>Nenhum especialista encontrado para os filtros selecionados.</p>';
            return;
        }

        listaFiltrada.forEach(medico => {
            const card = document.createElement('div');
            card.className = 'card-medico';
            card.style.border = '1px solid #ddd';
            card.style.padding = '12px';
            card.style.marginBottom = '10px';
            card.style.borderRadius = '6px';

            card.innerHTML = `
                <strong>${medico.nome}</strong><br>
                <span>Especialidade: ${medico.especialidade}</span> | 
                <span>Convênio: ${medico.convenio}</span>
            `;
            listaMedicosContainer.appendChild(card);
        });
    }

    function aplicarFiltros() {
        const esp = filtroEspecialidade ? filtroEspecialidade.value : 'Todos';
        const conv = filtroConvenio ? filtroConvenio.value : 'Todos';

        const filtrados = medicos.filter(m => {
            const matchEsp = (esp === 'Todos' || m.especialidade === esp);
            const matchConv = (conv === 'Todos' || m.convenio === conv);
            return matchEsp && matchConv;
        });

        renderizarMedicos(filtrados);
    }

    if (filtroEspecialidade) filtroEspecialidade.addEventListener('change', aplicarFiltros);
    if (filtroConvenio) filtroConvenio.addEventListener('change', aplicarFiltros);

    if (formAgendamento) {
        formAgendamento.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const medicoSelecionado = selectMedico.value;
            const dataSelecionada = inputData.value;
            const horarioSelecionado = selectHorario.value;

            if (!medicoSelecionado || !dataSelecionada || !horarioSelecionado) {
                exibirMensagem(
                    feedbackAgendamento,
                    'Erro: Preencha todos os campos obrigatórios (Médico, Data e Horário).',
                    'erro'
                );
                return;
            }

            const existeConflito = consultasAgendadas.some(c =>
                c.medico === medicoSelecionado &&
                c.data === dataSelecionada &&
                c.horario === horarioSelecionado &&
                c.status === 'Confirmada'
            );

            if (existeConflito) {
                exibirMensagem(
                    feedbackAgendamento,
                    `Conflito de Agenda (RN02): O horário ${horarioSelecionado} do dia ${dataSelecionada} já está ocupado para ${medicoSelecionado}. Escolha outro horário.`,
                    'erro'
                );
                return;
            }

            const infoMedico = medicos.find(m => m.nome === medicoSelecionado);
            const novaConsulta = {
                id: Date.now(),
                paciente: 'Paciente Logado',
                medico: medicoSelecionado,
                especialidade: infoMedico ? infoMedico.especialidade : 'Geral',
                data: dataSelecionada,
                horario: horarioSelecionado,
                horasRestantes: 48,
                status: 'Confirmada'
            };

            consultasAgendadas.push(novaConsulta);
            renderizarConsultas();

            exibirMensagem(
                feedbackAgendamento,
                `Sucesso (CT01): Consulta agendada com ${medicoSelecionado} para ${dataSelecionada} às ${horarioSelecionado}!`,
                'sucesso'
            );
        });
    }

    function renderizarConsultas() {
        if (!listaConsultasContainer) return;
        listaConsultasContainer.innerHTML = '';

        consultasAgendadas.forEach(consulta => {
            const item = document.createElement('div');
            item.className = 'card-consulta';
            item.style.border = '1px solid #ccc';
            item.style.padding = '12px';
            item.style.marginBottom = '10px';
            item.style.borderRadius = '6px';
            item.style.backgroundColor = consulta.status === 'Cancelada' ? '#f2f2f2' : '#ffffff';

            const textoAntecedencia = consulta.horasRestantes >= 1
                ? `${consulta.horasRestantes} hora(s) antes`
                : `${consulta.horasRestantes * 60} minutos antes`;

            item.innerHTML = `
                <p style="margin: 0 0 8px 0;">
                    <strong>${consulta.especialidade}</strong> — ${consulta.medico}<br>
                    Data: ${consulta.data} às <strong>${consulta.horario}</strong> 
                    <em>(Simulação: faltam ${textoAntecedencia})</em><br>
                    Status: <strong>${consulta.status}</strong>
                </p>
            `;

            if (consulta.status === 'Confirmada') {
                const btnCancelar = document.createElement('button');
                btnCancelar.textContent = 'Cancelar Consulta';
                btnCancelar.type = 'button';
                btnCancelar.style.padding = '6px 12px';
                btnCancelar.style.backgroundColor = '#dc3545';
                btnCancelar.style.color = '#fff';
                btnCancelar.style.border = 'none';
                btnCancelar.style.borderRadius = '4px';
                btnCancelar.style.cursor = 'pointer';

                btnCancelar.addEventListener('click', () => processarCancelamento(consulta.id));
                item.appendChild(btnCancelar);
            }

            listaConsultasContainer.appendChild(item);
        });
    }

    function processarCancelamento(idConsulta) {
        const consulta = consultasAgendadas.find(c => c.id === idConsulta);
        if (!consulta) return;

        if (consulta.horasRestantes < 2) {
            exibirMensagem(
                feedbackCancelamento,
                `Cancelamento Bloqueado (RN01 / CT04): Faltam apenas ${consulta.horasRestantes * 60} minutos para a consulta. O cancelamento online gratuito exige antecedência mínima de 2 horas. Entre em contato com a recepção.`,
                'erro'
            );
            return;
        }

        consulta.status = 'Cancelada';
        renderizarConsultas();

        exibirMensagem(
            feedbackCancelamento,
            `Cancelamento Confirmado (RN01 / CT03): Sua consulta com ${consulta.medico} às ${consulta.horario} foi cancelada gratuitamente (antecedência de ${consulta.horasRestantes}h) e o horário foi liberado na agenda.`,
            'sucesso'
        );
    }

    renderizarMedicos(medicos);
    renderizarConsultas();
});