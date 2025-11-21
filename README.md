# Captura de Leads - Sistema de Diagnóstico AI

Um formulário de captura de leads em português para diagnóstico personalizado de implementação de AI em organizações.

## 📋 Estrutura do Projeto

```
captura.leads/
├── index.html              # Landing page (intro + button)
├── question1.html          # Question 1 page (single-select form)
├── script-landing.js       # Landing page logic
├── script-form.js          # Question page logic
├── script.js               # DEPRECATED (not used)
├── style.css               # Estilos compartilhados (Bootstrap 5)
├── form_submit.php         # Backend para processar leads
├── strings.json            # Textos em português (JSON)
├── leads.json              # Armazenamento de leads (auto-gerado)
├── img/                    # Logo e ilustrações
├── js/                     # Componentes JavaScript
└── partials/               # Componentes HTML (se necessário)
```

## 🏗️ Arquitetura

O projeto usa **duas páginas separadas** para melhor organização:

1. **Landing Page (`index.html`)**
   - Introdução com 3 passos
   - Badge "EM 5 MINUTOS"
   - Botão "Iniciar diagnóstico"
   - Carrega `script-landing.js`

2. **Question Page (`question1.html`)**
   - Formulário com seleção única (single-select)
   - 7 opções com ícones e descrições
   - Botão de envio
   - Mensagens de sucesso/erro
   - Carrega `script-form.js`

## 🚀 Como Executar

### Windows (PowerShell)

1. **Abra PowerShell** e navegue para a pasta do projeto:
   ```powershell
   cd "d:\Repositorios\captura.leads"
   ```

2. **Inicie o servidor PHP built-in**:
   ```powershell
   php -S localhost:8000
   ```

3. **Abra no navegador**:
   - Acesse: `http://localhost:8000`

4. **Para parar o servidor**:
   - Pressione `Ctrl + C` no PowerShell

### macOS / Linux

```bash
cd /caminho/para/captura.leads
php -S localhost:8000
# Acesse http://localhost:8000
```

## ✅ Como Testar

### Fluxo Completo

1. Acesse a **landing page**: `http://localhost:8000/`
2. Veja o card intro com 3 passos
3. Clique no botão **"Iniciar diagnóstico"**
4. Você será redirecionado para `question1.html`
5. Selecione uma opção (clique para destacar em azul)
6. Clique em **"Próximo"** para enviar
7. Você deverá ver a mensagem de sucesso: _"Obrigado! Recebemos o teu contacto."_
8. Os dados serão salvos em `leads.json`

### URLs

- Landing: `http://localhost:8000/` ou `http://localhost:8000/index.html`
- Question 1: `http://localhost:8000/question1.html`

## 🔧 Características Técnicas

- **Frontend**: HTML5 + Bootstrap 5 + JavaScript Vanilla
- **Backend**: PHP 7.2+
- **Armazenamento**: Arquivo JSON (`leads.json`)
- **Validação**: Email validado no backend
- **Segurança**: 
  - Proteção contra múltiplas requisições
  - Arquivo locking para evitar corrupção
  - Sanitização básica de entrada

## 📝 Campos do Formulário

- **Nome**: Campo obrigatório (texto)
- **Email**: Campo obrigatório (email válido)

Os leads incluem também:
- **Data/Hora**: Timestamp automático (YYYY-MM-DD HH:MM:SS)

## 📂 Visualizar Leads Capturados

Abra o arquivo `leads.json` para ver todos os leads capturados em formato JSON:

```json
[
  {
    "name": "João Silva",
    "email": "joao@example.com",
    "date": "2025-11-19 14:30:00"
  }
]
```

## 🌐 Customização

### Mudar Textos
Edite o arquivo `strings.json` e mude os valores sob a chave `landing`:
- `title`: Título principal
- `description`: Descrição
- `successMessage`: Mensagem após envio bem-sucedido

### Mudar Estilos
Edite `style.css` para customizar cores, fontes e layout.

### Adicionar Campos ao Formulário
1. Adicione um novo `<input>` em `index.html`
2. Capture o valor em `script.js`
3. Envie no `FormData` para `form_submit.php`
4. Processe e salve em `form_submit.php`

## 🔒 Notas de Segurança

Para produção, considere:
- ✅ Remover o header CORS ou restringir a origens específicas
- ✅ Adicionar validação e sanitização mais rigorosa
- ✅ Implementar rate limiting
- ✅ Usar banco de dados (MySQL, PostgreSQL) em vez de arquivo JSON
- ✅ Adicionar autenticação/autorização
- ✅ Implementar HTTPS
- ✅ Enviar emails de confirmação
- ✅ Backup automático de dados

## 📧 Próximos Passos (Opcionais)

- [ ] Integrar com serviço de email (PHPMailer, SendGrid)
- [ ] Adicionar dashboard para visualizar leads
- [ ] Implementar exportação para CSV/Excel
- [ ] Adicionar webhook para CRM
- [ ] Implementar autenticação para visualizar dados

## 💡 Troubleshooting

**Erro: "Method not allowed"**
- Certifique-se de que está usando `POST` no formulário

**Erro: "Missing fields"**
- Verifique se nome e email estão preenchidos

**Erro: "Invalid email"**
- O email deve estar no formato correto (exemplo@dominio.com)

**Arquivo `leads.json` não é criado**
- Verifique permissões de escrita na pasta do projeto

---

**Versão**: 1.0  
**Última atualização**: Novembro 2025
