/**
 * CONFIGURAÇÕES GLOBAIS DA PIZZARIA
 */
const configuracao = {
    precos: {
      sabores: {
        margherita: 25.00,
        calabresa: 28.00,
        portuguesa: 30.00,
        'quatro-queijos': 32.00,
        'frango-catupiry': 30.00,
        sorvete: 20.00,
        chocolate: 22.00,
        acai: 24.00,
        'banana-queijo': 26.00
      },
      tamanhos: {
        pequena: 1.0,
        media: 1.3,
        grande: 1.6
      },
      bordas: {
        catupiry: 5.00,
        cheddar: 4.00,
        queijo: 3.00,
        requeijao: 6.00,
        chocolate: 7.00,
        'doce-de-leite': 8.00,
        nutella: 10.00,
        'sem-borda': 0.00
      },
      bebidas: {
        'coca-cola': 8.00,
        guarana: 7.00,
        fanta: 6.00,
        sprite: 6.00,
        pepsi: 7.00,
        'sem-refrigerante': 0.00
      }
    },
    taxasEntrega: {
      'Brasília': 6.00,
      'Gama': 8.00,
      'Taguatinga': 7.00,
      'Brazlândia': 10.00,
      'Sobradinho': 6.50,
      'Planaltina': 12.00,
      'Paranoá': 9.00,
      'Núcleo Bandeirante': 7.50,
      'Ceilândia': 8.50,
      'Guará': 6.00
    },
    cidadesRapidas: ['Brasília', 'Guará', 'Taguatinga']
};

/**
 * CLASSE PRINCIPAL PARA GERENCIAR PEDIDOS
 */
class GerenciadorPedidos {
    constructor() {
      this.quantidadePizzas = 1;
      this.iniciar();
    }
  
    iniciar() {
      this.capturarElementos();
      this.configurarEventos();
      this.atualizarContador();
      this.calcularTotal();
    }
  
    capturarElementos() {
      this.elementos = {
        botaoAdicionar: document.getElementById('botaoAdicionarPizza'),
        containerPizzas: document.getElementById('areaPizzas'),
        seletorCidade: document.getElementById('cidade'),
        seletorBebida: document.getElementById('bebida'),
        elementoTaxa: document.getElementById('taxaEntrega'),
        elementoTotal: document.getElementById('totalPedido'),
        elementoContador: document.getElementById('contadorPizzas'),
        elementoFeedback: document.getElementById('mensagemFeedback'),
        formulario: document.getElementById('formularioPedido'),
        containerFoguete: document.querySelector('.container-foguete'),
        foguete: document.querySelector('.foguete'),
      };
    }
  
    configurarEventos() {
      this.elementos.botaoAdicionar.addEventListener('click', () => this.adicionarPizza());
      this.elementos.seletorCidade.addEventListener('change', () => this.atualizarTaxaEntrega());
      this.elementos.formulario.addEventListener('submit', (e) => this.finalizarPedido(e));
      
      document.querySelectorAll('.entrada-pedido').forEach(input => {
        input.addEventListener('change', () => this.calcularTotal());
      });
    }
  
    adicionarPizza() {
      this.quantidadePizzas++;
      
      const cardPizza = document.createElement('div');
      cardPizza.className = 'card-pizza';
      cardPizza.innerHTML = this.gerarHtmlPizza(this.quantidadePizzas);
      
      this.elementos.containerPizzas.appendChild(cardPizza);
      cardPizza.style.animation = 'slideIn 0.5s ease';
      
      const botaoRemover = cardPizza.querySelector('.remover-pizza');
      botaoRemover.addEventListener('click', () => this.removerPizza(cardPizza));
      
      cardPizza.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', () => this.calcularTotal());
      });
      
      this.atualizarContador();
      this.calcularTotal();
    }
  
    gerarHtmlPizza(indice) {
      return `
        <div class="cabecalho-pizza">
          <h3>Pizza ${indice}</h3>
          <button type="button" class="botao remover-pizza">
            <i class="fas fa-times"></i> Remover
          </button>
        </div>
        <div class="grupo-formulario">
          <label for="sabor${indice}" class="rotulo">
            <i class="fas fa-pizza-slice"></i> Sabor:
          </label>
          <select id="sabor${indice}" class="entrada-pedido selecao" required>
            <option value="" disabled selected>Escolha um sabor</option>
            ${Object.keys(configuracao.precos.sabores).map(sabor => `
              <option value="${sabor}">${this.formatarTexto(sabor)}</option>
            `).join('')}
          </select>
        </div>
        <div class="grupo-formulario">
          <label for="tamanho${indice}" class="rotulo">
            <i class="fas fa-ruler"></i> Tamanho:
          </label>
          <select id="tamanho${indice}" class="entrada-pedido selecao" required>
            <option value="" disabled selected>Escolha um tamanho</option>
            ${Object.keys(configuracao.precos.tamanhos).map(tamanho => `
              <option value="${tamanho}">${this.formatarTexto(tamanho)}</option>
            `).join('')}
          </select>
        </div>
        <div class="grupo-formulario">
          <label for="borda${indice}" class="rotulo">
            <i class="fas fa-border-style"></i> Borda:
          </label>
          <select id="borda${indice}" class="entrada-pedido selecao" required>
            <option value="" disabled selected>Escolha uma borda</option>
            ${Object.keys(configuracao.precos.bordas).map(borda => `
              <option value="${borda}">${this.formatarTexto(borda)}</option>
            `).join('')}
          </select>
        </div>
      `;
    }
  
    removerPizza(card) {
      card.classList.add('removing');
      setTimeout(() => {
        card.remove();
        this.quantidadePizzas--;
        this.atualizarContador();
        this.calcularTotal();
      }, 500);
    }
  
    atualizarTaxaEntrega() {
      const cidade = this.elementos.seletorCidade.value;
      const taxa = configuracao.taxasEntrega[cidade] || 0;
      this.elementos.elementoTaxa.textContent = `R$ ${taxa.toFixed(2)}`;
      this.calcularTotal();
    }
  
    calcularTotal() {
      let total = 0;
      
      for (let i = 1; i <= this.quantidadePizzas; i++) {
        const sabor = document.getElementById(`sabor${i}`)?.value;
        const tamanho = document.getElementById(`tamanho${i}`)?.value;
        const borda = document.getElementById(`borda${i}`)?.value;
        
        if (!sabor || !tamanho || !borda) continue;
        
        const precoSabor = configuracao.precos.sabores[sabor];
        const multiplicador = configuracao.precos.tamanhos[tamanho];
        const precoBorda = configuracao.precos.bordas[borda];
        
        total += (precoSabor * multiplicador) + precoBorda;
      }
      
      const bebida = this.elementos.seletorBebida.value;
      if (bebida) {
        total += configuracao.precos.bebidas[bebida];
      }
      
      const taxa = parseFloat(this.elementos.elementoTaxa.textContent.replace('R$ ', '')) || 0;
      total += taxa;
      
      this.elementos.elementoTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
  
    calcularTempoEntrega(cidade, qtdPizzas) {
      return configuracao.cidadesRapidas.includes(cidade) 
        ? 30 + (qtdPizzas * 5)
        : 60 + (qtdPizzas * 5);
    }
  
    atualizarContador() {
      this.elementos.elementoContador.textContent = 
        `${this.quantidadePizzas} ${this.quantidadePizzas === 1 ? 'pizza' : 'pizzas'}`;
    }
  
    mostrarFeedback(mensagem, sucesso) {
      this.elementos.elementoFeedback.textContent = mensagem;
      this.elementos.elementoFeedback.className = `mensagem-feedback ${sucesso ? 'sucesso' : 'erro'}`;
      this.elementos.elementoFeedback.style.display = 'block';
      
      setTimeout(() => {
        this.elementos.elementoFeedback.style.display = 'none';
      }, 3000);
    }
  
    formatarTexto(texto) {
      return texto.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  
    finalizarPedido(evento) {
      evento.preventDefault();
      
      const cidade = this.elementos.seletorCidade.value;
      if (!cidade) {
        this.mostrarFeedback('Por favor, selecione uma cidade.', false);
        return;
      }
      
      const bebida = this.elementos.seletorBebida.value;
      if (!bebida) {
        this.mostrarFeedback('Por favor, selecione uma bebida.', false);
        return;
      }
      
      const pizzas = [];
      for (let i = 1; i <= this.quantidadePizzas; i++) {
        const sabor = document.getElementById(`sabor${i}`)?.value;
        const tamanho = document.getElementById(`tamanho${i}`)?.value;
        const borda = document.getElementById(`borda${i}`)?.value;
        
        if (!sabor || !tamanho || !borda) {
          this.mostrarFeedback(`Preencha todos os campos da Pizza ${i}.`, false);
          return;
        }
        
        const precoSabor = configuracao.precos.sabores[sabor];
        const multiplicador = configuracao.precos.tamanhos[tamanho];
        const precoBorda = configuracao.precos.bordas[borda];
        const precoPizza = (precoSabor * multiplicador) + precoBorda;
        
        pizzas.push({
          sabor: this.formatarTexto(sabor),
          tamanho: this.formatarTexto(tamanho),
          borda: this.formatarTexto(borda),
          preco: precoPizza
        });
      }
      
      const precoBebida = configuracao.precos.bebidas[bebida];
      const taxa = parseFloat(this.elementos.elementoTaxa.textContent.replace('R$ ', '')) || 0;
      const total = pizzas.reduce((soma, pizza) => soma + pizza.preco, 0) + precoBebida + taxa;
      const tempo = this.calcularTempoEntrega(cidade, this.quantidadePizzas);
      
      const pedido = {
        cidade,
        bebida: this.formatarTexto(bebida),
        precoBebida,
        taxaEntrega: taxa,
        tempoEntrega: tempo,
        pizzas,
        total
      };
      
      localStorage.setItem('pedidoAtual', JSON.stringify(pedido));
      this.mostrarFeedback('Pedido realizado com sucesso!', true);
      this.mostrarAnimacaoFoguete();
      
      setTimeout(() => {
        window.location.href = 'resumo.html';
      }, 3000);
    }
  
    mostrarAnimacaoFoguete() {
      this.elementos.containerFoguete.classList.add('active');
      this.elementos.foguete.style.animation = 'none';
      void this.elementos.foguete.offsetWidth;
      this.elementos.foguete.style.animation = 'launch 2s ease forwards';
      
      setTimeout(() => {
        this.elementos.containerFoguete.classList.remove('active');
      }, 2000);
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('formularioPedido')) {
      new GerenciadorPedidos();
    }
    
    if (document.getElementById('resumoPedido')) {
      criarEfeitoConfete();
    }
});

function criarEfeitoConfete() {
    const cores = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
    
    for (let i = 0; i < 100; i++) {
      const confete = document.createElement('div');
      confete.className = 'confetti';
      confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
      confete.style.left = `${Math.random() * 100}vw`;
      confete.style.top = '-10px';
      confete.style.width = `${Math.random() * 10 + 5}px`;
      confete.style.height = `${Math.random() * 10 + 5}px`;
      confete.style.animationDuration = `${Math.random() * 3 + 2}s`;
      
      document.body.appendChild(confete);
      
      setTimeout(() => {
        confete.remove();
      }, 5000);
    }
}