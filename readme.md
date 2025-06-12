# Projeto Balatro - Frontend + Google Sheets + Proxy

## Visão Geral

Este projeto é uma aplicação web hospedada no **GitHub Pages** que utiliza o **Google Sheets** como backend para armazenar dados de partidas e jogadores. 

- A leitura dos dados é feita diretamente via CSV público gerado pelo Google Sheets.
- A escrita (inserção de partidas) é feita através de um **proxy hospedado no Vercel**, que encaminha as requisições para um **Google Apps Script**.
- Isso permite contornar a limitação de CORS para requisições POST no Google Apps Script, além de manter o frontend estático no GitHub Pages.

---

## Componentes

### Frontend

- HTML + JavaScript hospedados no GitHub Pages.
- Faz fetch dos dados públicos CSV para exibir estatísticas.
- Envia resultados via POST para o proxy Vercel.

### Backend (Google Sheets + Apps Script)

- Google Sheets armazena os dados de jogadores e partidas.
- Google Apps Script expõe uma API para adicionar partidas e jogadores.
- A API está publicada como um web app com permissão para “qualquer pessoa, mesmo anônima”.

### Proxy

- Proxy Node.js/serverless hospedado no Vercel.
- Encaminha requisições do frontend para o Google Apps Script para evitar bloqueios CORS.
- Adiciona headers CORS para liberar acesso ao frontend hospedado no GitHub Pages.

---

## Fluxo de Dados

1. Frontend (GitHub Pages) lê dados da planilha via CSV público.
2. Frontend envia resultados ao proxy (Vercel) via POST.
3. Proxy encaminha para o Google Apps Script.
4. Apps Script valida e grava dados na planilha.
5. Frontend atualiza a interface conforme os dados da planilha.

---

## Como Usar

### Configurar Google Sheets e Apps Script

- Crie sua planilha com as abas necessárias (exemplo: `Dados` para partidas).
- Implemente o Apps Script com as funções para ler e escrever dados.
- Publique o Apps Script como web app para acesso público.

### Configurar Proxy no Vercel

- Crie um projeto no Vercel com seu código proxy.
- Configure o proxy para redirecionar requisições para o Apps Script.
- Garanta que o proxy adicione os headers CORS adequados.

### Frontend

- Atualize o URL do CSV público e do proxy no seu código JS.
- Publique no GitHub Pages.
- Use a interface para ler e enviar partidas.

---

## Exemplo de JSON para envio via POST

```json
{
  "action": "addMatch",
  "player1": "Mateus",
  "player2": "Enzo",
  "winner": "Mateus",
  "date": "2025-06-10T18:00:00Z"
}
