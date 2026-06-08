# OpsFlow Atende

Plataforma de **atendimento e agendamento via WhatsApp** para pequenos negócios
(barbearias, salões, padarias, açougues) — protótipo funcional.

Foco atual: **barbearia/salão** (agendamento por horário).

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000/atende`.

## Telas

| Rota | O que faz |
|------|-----------|
| `/atende` | Painel inicial com indicadores e atalhos |
| `/atende/simulador` | "Celular" do cliente — converse com o robô e veja o agendamento acontecer |
| `/atende/inbox` | Caixa de entrada do dono: ver conversas, assumir / devolver ao robô |
| `/atende/agenda` | Agenda dia a dia — agendamentos do robô caem aqui |
| `/atende/servicos` | Cadastro de serviços, preços e profissionais |

## O robô (atendimento automático)

O robô tem **dois modos** e escolhe sozinho qual usar:

1. **IA (Claude)** — entende linguagem natural ("queria cortar o cabelo amanhã
   de tarde"). Liga automaticamente quando há uma chave da API configurada
   (`ANTHROPIC_API_KEY` — veja `.env.example`). Roda no servidor em
   `app/api/atende/bot/route.ts` e usa _ferramentas_ para consultar horários
   livres e agendar de verdade (sem inventar disponibilidade).
2. **Menu (regras)** — fallback que funciona sem nenhuma chave. O cliente
   responde por números (1, 2, 3). Lógica em `app/atende/lib/bot.ts`.

A troca entre os dois é transparente: se a IA não estiver configurada ou
falhar, o robô cai no modo de menu.

## Organização do código

```
app/atende/
  page.tsx              Painel
  simulador/            Simulador do cliente
  inbox/                Caixa de entrada do dono
  agenda/               Agenda
  servicos/             Serviços & profissionais
  components/           Shell (cabeçalho + navegação), MessageList
  lib/
    types.ts            Tipos + config do negócio (horário, dias fechados)
    seed.ts             Dados de demonstração
    store.ts            Estado compartilhado (localStorage) + IA/fallback
    bot.ts              Robô de regras (menu) + cálculo de horários livres
    format.ts           Datas, horas e dinheiro (pt-BR)
app/api/atende/bot/route.ts   Robô de IA (Claude + tool use)
```

> Os dados ficam no **navegador** (localStorage). É um protótipo: não há banco
> de dados nem WhatsApp real ainda. "Reiniciar demo" recarrega os dados de
> exemplo.

## Próximos passos possíveis

- **WhatsApp real** — conectar na WhatsApp Cloud API (Meta) com webhook.
- **Lembretes automáticos** — avisar o cliente antes do horário.
- **Persistência** — banco de dados + login para vários negócios (SaaS).
- **Padaria/açougue** — fluxo de encomendas/pedidos além do agendamento.
