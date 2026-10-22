// Aquadro POS — Ultra-Modern Web Engine & Interactive Simulator
// Gère le basculement d'éditions, la démo interactive hero, le simulateur live et le téléchargement direct

let demoMozzarellaStock = 5.76;
const MARGHERITA_CHEESE_PER_PIZZA = 0.12; // 120g par pizza

// 1. Basculement d'éditions (Gourmet / Retail)
function switchEdition(edition) {
  const btnGourmet = document.getElementById('btn-tab-gourmet');
  const btnRetail = document.getElementById('btn-tab-retail');
  const cardGourmet = document.getElementById('card-gourmet-view');
  const cardRetail = document.getElementById('card-retail-view');

  if (edition === 'gourmet') {
    btnGourmet.classList.add('active');
    btnRetail.classList.remove('active');
    cardGourmet.style.opacity = '1';
    cardGourmet.style.transform = 'scale(1.02)';
    cardGourmet.style.borderColor = 'rgba(249, 115, 22, 0.6)';
    cardRetail.style.opacity = '0.75';
    cardRetail.style.transform = 'scale(1)';
    cardRetail.style.borderColor = 'rgba(255, 255, 255, 0.08)';
  } else {
    btnRetail.classList.add('active');
    btnGourmet.classList.remove('active');
    cardRetail.style.opacity = '1';
    cardRetail.style.transform = 'scale(1.02)';
    cardRetail.style.borderColor = 'rgba(59, 130, 246, 0.6)';
    cardGourmet.style.opacity = '0.75';
    cardGourmet.style.transform = 'scale(1)';
    cardGourmet.style.borderColor = 'rgba(255, 255, 255, 0.08)';
  }
}

// 2. Démo Interactive dans le Hero Mockup
function simulateRestock(deltaKg) {
  demoMozzarellaStock = Math.max(0, demoMozzarellaStock + deltaKg);
  updateDemoMockup();
}

function resetDemoStock() {
  demoMozzarellaStock = 5.76;
  updateDemoMockup();
}

function updateDemoMockup() {
  const counterEl = document.getElementById('demo-counter');
  const alertTextEl = document.getElementById('demo-limiting-text');
  const alertBoxEl = document.getElementById('demo-limiting-alert');

  const possiblePizzas = Math.floor(demoMozzarellaStock / MARGHERITA_CHEESE_PER_PIZZA);
  
  if (counterEl) {
    // Animation de compteur
    counterEl.textContent = possiblePizzas;
    counterEl.style.transform = 'scale(1.15)';
    setTimeout(() => {
      counterEl.style.transform = 'scale(1)';
    }, 180);
  }

  if (alertTextEl && alertBoxEl) {
    if (possiblePizzas === 0) {
      alertTextEl.textContent = `RUPTURE DE STOCK : 0 kg de Mozzarella restante — Service bloqué !`;
      alertBoxEl.style.background = 'rgba(239, 68, 68, 0.25)';
      alertBoxEl.style.borderColor = '#EF4444';
    } else {
      alertTextEl.textContent = `Fromage Mozzarella (Reste ${demoMozzarellaStock.toFixed(2)} kg — permet ${possiblePizzas} pizzas)`;
      alertBoxEl.style.background = 'rgba(249, 115, 22, 0.15)';
      alertBoxEl.style.borderColor = 'rgba(249, 115, 22, 0.35)';
    }
  }
}

// 3. Simulateur Live de Rendement (Section Interactive)
function updateLiveSimulator() {
  const flourInput = document.getElementById('slider-flour');
  const cheeseInput = document.getElementById('slider-cheese');
  const sauceInput = document.getElementById('slider-sauce');

  if (!flourInput || !cheeseInput || !sauceInput) return;

  const flourKg = parseFloat(flourInput.value);
  const cheeseKg = parseFloat(cheeseInput.value);
  const sauceKg = parseFloat(sauceInput.value);

  // Mettre à jour les labels
  document.getElementById('val-flour').textContent = `${flourKg} kg`;
  document.getElementById('val-cheese').textContent = `${cheeseKg.toFixed(1)} kg`;
  document.getElementById('val-sauce').textContent = `${sauceKg.toFixed(1)} kg`;

  // Portions requises par pizza :
  // Farine : 0.25 kg
  // Fromage : 0.12 kg
  // Sauce : 0.08 kg
  const pFlour = Math.floor(flourKg / 0.25);
  const pCheese = Math.floor(cheeseKg / 0.12);
  const pSauce = Math.floor(sauceKg / 0.08);

  const maxPortions = Math.min(pFlour, pCheese, pSauce);

  // Déterminer l'ingrédient limitant
  let limitingName = 'Farine Spéciale Pizza';
  let limitingPortions = pFlour;
  if (pCheese < limitingPortions) {
    limitingName = 'Fromage Mozzarella';
    limitingPortions = pCheese;
  }
  if (pSauce < limitingPortions) {
    limitingName = 'Sauce Tomate Italienne';
    limitingPortions = pSauce;
  }

  // Mettre à jour le DOM
  document.getElementById('sim-result-portions').textContent = maxPortions;
  document.getElementById('sim-result-limiting').textContent = `${limitingName} (limite à ${limitingPortions} portions)`;

  // Food cost = (0.25 * 80) + (0.12 * 1100) + (0.08 * 180) = 20 + 132 + 14.4 = 166.4 DA
  const cost = 166.4;
  const sellingPrice = 650;
  const margin = sellingPrice - cost;
  const marginPct = Math.round((margin / sellingPrice) * 100);

  document.getElementById('sim-kpi-cost').textContent = `${cost.toFixed(0)} DA`;
  document.getElementById('sim-kpi-margin').textContent = `${margin.toFixed(0)} DA (${marginPct}%)`;
}

// 4. Copier la commande PowerShell
function copyPowerShellCommand() {
  const code = document.getElementById('ps-cmd')?.textContent || '';
  navigator.clipboard.writeText(code).then(() => {
    const btnText = document.getElementById('copy-btn-text');
    if (btnText) {
      const original = btnText.textContent;
      btnText.textContent = '✓ Copié !';
      btnText.style.color = '#34D399';
      setTimeout(() => {
        btnText.textContent = original;
        btnText.style.color = '';
      }, 2000);
    }
  });
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  switchEdition('gourmet');
  updateLiveSimulator();
  updateDemoMockup();
});
