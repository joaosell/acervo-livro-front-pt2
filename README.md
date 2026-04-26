

<div align ="center">
<p >
  <img src="https://s2.glbimg.com/nXvJL6pASCukU-CT1l_h6j2l_Qc=/300x225/s.glbimg.com/jo/g1/f/original/2015/04/06/udesc-novo_1.jpg" width="80" />
</p>
<h1>Trabalho de BAN II - Acervo de Livros</h1>
<h3>Frontend</h3>
<p> Feito por João Pedro Ferreira Sell e Pedro Paoli Neto</p>
</div>

## 📚 Acervo de Livros

Sistema para gerenciamento de acervo de livros, que permite o controle de autores, categorias, editoras, usuários e exemplares, além da gestão de empréstimos.
O sistema garante a organização e rastreabilidade dos livros disponíveis, possibilitando o controle de disponibilidade de exemplares e validações no processo de empréstimo.

## 🛠️ Tecnologias utilizadas
 * React + Typescript
 * Biblioteca <a href="https://ant.design/">Ant Design<a/>


# 🚀 Setup do Projeto

Antes de importar o projeto, é importante ressaltar que criamos o projeto utilizando o **WSL (Windows Subsystem for Linux)** e o **Yarn**, portanto este guia utilizará estas duas tecnologias para o setup do projeto

## ⚠️ Observação

Para garantir a melhor performance e evitar erros de sincronização (Hot Reload), **o projeto deve ser armazenado no sistema de ficheiros do Linux**.

* ✅ **Caminho Correto (Linux):** `~/projetos/meu-app-react`
* ❌ **Caminho Incorreto (Windows Mount):** `/mnt/c/Users/Nome/Projetos/...`

Executar projetos Node.js através de pastas montadas do Windows (`/mnt/c/`) tornará o processo de instalação e compilação extremamente lento. Ao abrir o WSL com o comando shell `wsl`, certifique-se de que não se encontra nesse caminho pois caso contrário a aplicação poderá levar muito tempo para ser iniciada. O jeito mais fácil de corrigir isso é só fazer um `cd` e criar uma pasta onde será importado o projeto.

---

## 📋 Pré-requisitos

Conforme mencionado anteriormente, para podermos iniciar o projeto necessitaremos do:

1.  <a href="https://ubuntu.com/desktop/wsl">WSL</a>
2.  **Node.js** instalado **dentro do WSL**. (Que provavelmente você já instalou ao importar o backend deste projeto)
3.  **Yarn** instalado globalmente no WSL:
    ```bash
    npm install --global yarn
    ```
    
---

## 🛠️ Configuração do Ambiente e Instalação

No terminal do WSL:

crie uma pasta para o projeto (caso ainda não exista):
```bash
cd
mkdir -p projetos && cd projetos
```

Clone este repositório
```bash
git clone https://github.com/joaosell/acervo-livro-front.git
cd acervo-livro-front
```
Instale as dependências:
```bash
yarn install
```

Para iniciar o projeto:
```bash
yarn dev
```
