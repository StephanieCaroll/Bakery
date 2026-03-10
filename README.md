# 🥐 Bakery

![GitHub repo size](https://img.shields.io/github/repo-size/StephanieCaroll/bakery?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/StephanieCaroll/bakery?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/StephanieCaroll/bakery?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/StephanieCaroll/bakery?style=for-the-badge)
![GitHub pull requests](https://img.shields.io/github/issues-pr/StephanieCaroll/bakery?style=for-the-badge)

<img src="./assets/image.png" width="1200" alt="bakery">

> O **Bakery** é uma plataforma de e-commerce para padarias e confeitarias, desenvolvida com React e Firebase, focada em oferecer uma experiência de compra deliciosa e intuitiva.

## ✨ Sobre o Projeto

O **Bakery** foi desenvolvido para facilitar a gestão e a venda de produtos de panificação online. Com uma interface moderna e acolhedora, utilizando Tailwind CSS para um design responsivo e cores personalizadas (Bakery Dark #b91c1c e Light #fbcbb0), o projeto une funcionalidade técnica com uma estética atraente.

### Funcionalidades Principais:
- **Catálogo de Produtos**: Exibição dinâmica de itens com detalhes completos.
- **Gestão de Carrinho**: Sistema completo para adicionar e gerenciar pedidos.
- **Área do Cliente**: Gerenciamento de perfil, favoritos e configurações pessoais.
- **Painel Administrativo**: Gestão de pedidos, clientes, produtos e banners promocionais.
- **Autenticação Segura**: Fluxo de login e proteção de rotas via Firebase Auth.
- **Integração em Tempo Real**: Banco de dados Firestore para persistência de dados e Storage para imagens.

---

### Ajustes e melhorias

O projeto está em constante evolução e as próximas etapas incluem:

- [ ] Implementação de notificações em tempo real para novos pedidos.
- [ ] Relatórios de vendas e estatísticas no painel admin.
- [ ] Refinamento das animações de transição de página.

---

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você instalou a versão mais recente de `Node.js` e `npm`.
- Você possui um projeto configurado no **Firebase** (Firestore, Auth e Storage).
- Você tem uma máquina `Windows`, `Linux` ou `Mac`.

---

## 🚀 Instalando Bakery

Para instalar o Bakery, siga estas etapas:

Linux, macOS e Windows:

# Clone o repositório
```bash
git clone [https://github.com/StephanieCaroll/bakery](https://github.com/StephanieCaroll/bakery)
```
# Entre no diretório
```
cd bakery
```
# Instale as dependências
```
npm install
```
# Configure as variáveis de ambiente no arquivo .env
```
VITE_FIREBASE_API_KEY=sua_chave_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_dominio_aqui
VITE_FIREBASE_PROJECT_ID=seu_id_aqui
VITE_FIREBASE_STORAGE_BUCKET=seu_bucket_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id_aqui
VITE_FIREBASE_APP_ID=seu_app_id_aqui
``` 
## ☕ Usando Bakery
Para iniciar o servidor de desenvolvimento, execute:
```
npm run dev
```
Acesse http://localhost:5173 no seu navegador. Você poderá navegar pelos produtos, adicionar ao carrinho e acessar as áreas restritas após o login.

## 👥 Colaboradores
Agradecemos às seguintes pessoas que contribuíram para este projeto:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/StephanieCaroll" title="Stephanie Caroline">
        <img src="https://github.com/StephanieCaroll.png" width="100px;" alt="Foto da Stephanie"/><br>
        <sub><b>Stephanie Caroline</b></sub>
      </a>
    </td>
  </tr>
</table>


## 📫 Contribuindo para Bakery


Para contribuir com **Bakery**, siga estas etapas:

1. Bifurque este repositório.
2. Crie um branch:  
   ```bash
   git checkout -b minha-feature
   ```
3. Faça suas alterações e confirme-as:
   ```bash
   git commit -m 'feat: nova funcionalidade'
   
4. Envie para o branch original:
  ```bash
  git push origin minha-feature
```
5. Crie a solicitação de pull.
Como alternativa, consulte a documentação oficial do GitHub sobre pull requests.

## 🤝 Contribuições

Sinta-se à vontade para contribuir com este projeto!

💡 Sugira novas funcionalidades e melhorias.  
🐛 Relate bugs ou problemas encontrados.  
📚 Compartilhe recursos ou ideias para o design.

   
