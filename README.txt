# App Saúde — Sistema de Agendamento Médico Online

Projeto acadêmico integrado desenvolvido para as disciplinas de Desenvolvimento de Aplicações para Internet e Engenharia de Requisitos, Qualidade e Teste de Software, contemplando desde a elicitação de requisitos e prototipação de interfaces até a implementação de interatividade com JavaScript e execução de casos de teste.

Aplicação publicada (GitHub Pages): https://lgsg-88.github.io/App-Saude-Consulta/  
Repositório GitHub: https://github.com/Lgsg-88/App-Saude-Consulta

---

## 1. Visão Geral do Projeto

O App Saúde é uma aplicação web responsiva voltada para o agendamento e gerenciamento de consultas médicas online. O sistema foi concebido para facilitar a jornada do paciente na busca por especialistas e horários disponíveis, ao mesmo tempo em que oferece uma visão operacional da agenda para profissionais de saúde e recepção.

### Evolução das Etapas do Projeto
1ª Avaliação (Engenharia de Requisitos e Prototipação Estática): Elicitação e documentação de Requisitos Funcionais (RFs), Requisitos Não Funcionais (RNFs), Regras de Negócio (RNs), Épicos, Histórias de Usuário (HUs), cenários de aceitação em Gherkin e priorização MoSCoW, acompanhados pela construção da estrutura semântica em HTML5 e estilização responsiva em CSS3.
2ª Avaliação (Interatividade Front-End e Testes de Software): Evolução da aplicação com JavaScript puro (`script.js`) para manipulação dinâmica do DOM, tratamento de eventos e validação de regras de negócio no cliente, seguida pela elaboração e execução formal de casos de teste com matriz de rastreabilidade.

---

## 2. Tecnologias Utilizadas

* HTML5: Estruturação semântica e acessível das páginas.
* CSS3: Layout responsivo (Grid e Flexbox), variáveis de estilo e identidade visual consistente.
* JavaScript: Manipulação dinâmica do DOM, eventos (`submit`, `change`, `click`), validação de regras de negócio e persistência simulada no navegador via `localStorage` e JSON.
* Git & GitHub Pages: Controle de versão e publicação contínua do ambiente de demonstração.

---

## 3. Requisitos e Regras de Negócio Contemplados

O desenvolvimento e a validação concentraram-se nos seguintes requisitos e regras do sistema:

* RF01 — Agendamento de consulta: Permite ao paciente selecionar especialista, data e horário disponível para confirmar sua consulta.
* RF02 — Filtro de especialistas: Permite filtrar profissionais por especialidade médica e convênio aceito.
* RF04 — Consultar próximas consultas: Exibe ao paciente o resumo e a lista detalhada de seus atendimentos futuros.
* RF05 — Cancelar ou remarcar consulta: Permite o gerenciamento de consultas marcadas pelo paciente.
* RF06 — Configurar agenda e bloqueios do profissional: Define o controle de disponibilidade e bloqueios na agenda médica.
* RN01 (Antecedência mínima): O cancelamento ou remarcação gratuita exige antecedência mínima de **2 horas** em relação ao horário da consulta.
* RN02 (Integridade da agenda): O sistema não permite a sobreposição de consultas no mesmo dia e horário para o mesmo profissional.
* RN03 (Conflito de bloqueios): O sistema deve alertar o profissional caso um bloqueio coincida com consultas já agendadas.

---

## 4. Funcionalidades Implementadas (JavaScript)

Toda a lógica interativa encontra-se modularizada no arquivo externo `script.js`:

1. Busca e Filtro Dinâmico (`profissionais.html`): Atualização instantânea da grade de médicos e do contador de resultados conforme a especialidade e o convênio selecionados, sem recarregamento da página.
2. Seleção de Horários e Agendamento com Validação (`profissionais.html`): Seleção interativa de horários nos cards dos profissionais e verificação em tempo real contra conflitos de agenda (`RN02`), exibindo mensagens visuais de confirmação ou alerta de erro.
3. Painel de Consultas e Regra de Cancelamento (`consultas.html`): Sincronização com o `localStorage` para listar consultas agendadas, atualizar os cards de resumo e validar a regra de antecedência de 2 horas (`RN01`) ao solicitar cancelamento.
4. Filtro Operacional da Agenda (`agenda.html`): Filtragem dinâmica da tabela de atendimentos do dia por profissional.

---

## 5. Planejamento e Execução de Testes (ERTQ)

Para validar a qualidade e a conformidade das funcionalidades implementadas, foram especificados **6 casos de teste** (3 cenários positivos e 3 cenários negativos):

| Caso de Teste | Requisito / Regra | Tipo de Cenário | Status |
| :--- | :--- | :--- | :--- |
| CT01 — Agendamento em horário livre | RF01 / HU02 | Positivo | Aprovado |
| CT02 — Tentativa de sobreposição de horário | RF01 / RN02 | Negativo | Aprovado |
| CT03 — Cancelamento gratuito com antecedência $\ge$ 2h | RF05 / RN01 / HU04 | Positivo | Aprovado |
| CT04 — Tentativa de cancelamento com antecedência $<$ 2h | RF05 / RN01 / HU04 | Negativo | Aprovado |
| CT05 — Bloqueio de período livre na agenda médica | RF06 / HU05 / HU06 | Positivo | Não Executado |
| CT06 — Bloqueio conflitante com consulta existente | RF06 / RN03 / HU06 | Negativo | Não Executado |

Nota: Os casos CT05 e CT06 referem-se ao módulo administrativo exclusivo do perfil médico, fora do escopo visual implementado para a interface do paciente.

---

## 6. Estrutura de Diretórios e Arquivos

App-Saude-Consulta/
├── index.html          # Página inicial e apresentação geral do sistema
├── profissionais.html  # Busca, filtros e agendamento com especialistas
├── consultas.html      # Gerenciamento, remarcação e cancelamento de consultas
├── agenda.html         # Visão operacional da agenda clínica e auditoria
├── style.css           # Folha de estilos global e responsiva
├── script.js           # Lógica JavaScript, eventos, validações e DOM
└── README.md           # Documentação completa do projeto
```

---

## 7. Como Executar o Projeto

### Acesso Online
Acesse diretamente a versão publicada no GitHub Pages:  
👉 [https://lgsg-88.github.io/App-Saude-Consulta/](https://lgsg-88.github.io/App-Saude-Consulta/)

### Execução Local
1. Clone o repositório:
   ```bash
   git clone https://github.com/Lgsg-88/App-Saude-Consulta.git
   ```
2. Abra a pasta do projeto e execute o arquivo `index.html` em qualquer navegador web moderno (ou via extensão *Live Server* no VS Code).
3. **Reset de dados de teste:** Como os agendamentos são salvos localmente no navegador via `localStorage`, caso deseje restaurar o estado inicial dos testes, abra o Console do Desenvolvedor (`F12`), digite `localStorage.clear()` e recarregue a página.

---

## 8. Equipe de Desenvolvimento

* Pedro Rodrigues de Lima — Matrícula: `04207624`
* Luiz Guilherme Soares Gama — Matrícula: `04197824`
* Lucas Roberto Almeida S. Leal — Matrícula: `04213506`
* Jean David Dias Ribeiro — Matrícula: `04213868`
