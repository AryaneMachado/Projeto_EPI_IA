# 🦺 Sistema de Verificação de EPI com IA

Sistema web para **detecção do uso de Equipamentos de Proteção Individual (EPI)** utilizando **Inteligência Artificial**, com suporte para **análise em tempo real via câmera** e **upload de imagens**.


### 📌 Objetivo

Este projeto foi desenvolvido com o objetivo de auxiliar no **monitoramento de segurança do trabalho**, identificando automaticamente se uma pessoa está:

- com **EPI completo** (capacete e colete)
- com **EPI incompleto** (apenas capacete ou colete)
- **sem EPI**
- ou se a imagem não contém um cenário relevante para análise

A solução utiliza um modelo treinado no **Teachable Machine**, integrado ao navegador com **TensorFlow.js**.


### 🚀 Funcionalidades

- 📷 **Análise em tempo real com a câmera do usuário**
- 🖼️ **Upload de imagem para validação**
- 🤖 **Classificação automática com IA**
- 📊 **Exibição de confiança da predição**
- 🎨 **Feedback visual por cores**
  - 🟢 Verde → EPI completo
  - 🟠 Laranja → EPI incompleto
  - 🔴 Vermelho → Sem EPI
  - ⚪ Cinza → Sem detecção relevante
    

### 🧠 Classes treinadas no Modelo

O modelo foi treinado para reconhecer as seguintes classes:

| Classe | Descrição |
|--------|-----------|
| `epi_completo` | Pessoa utilizando os EPIs esperados |
| `epi_incompleto` | Pessoa utilizando apenas parte dos EPIs |
| `sem_epi` | Pessoa sem nenhum dos equipamentos de proteção esperados|
| `fundo_imagens` | Imagens de fundo, ambiente ou conteúdo irrelevante |


### 🛠️ Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript**
- **TensorFlow.js**
- **Teachable Machine**
- **p5.js**


### 📂 Estrutura do Projeto
```bash
projeto-epi/
│
├── index.html
├── style.css
├── script.js
└── my_model/
    ├── model.json
    ├── metadata.json
    └── weights.bin
