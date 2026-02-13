class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        @import url('/style.css'); /* Import global styles */

        /* Inherit theme variables from the document root */
        .lotto-container {
          background: var(--lotto-card-bg); /* Use theme variable */
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px var(--lotto-card-shadow); /* Use theme variable */
          text-align: center;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }

        h1 {
          color: var(--text-color); /* Use theme variable */
          font-family: 'Poppins', sans-serif;
          font-size: 2.5rem;
          margin-bottom: 30px;
          text-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          transition: color 0.3s ease;
        }

        .lotto-numbers {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 40px;
        }

        .number {
          width: 60px;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--background-color); /* Use theme variable */
          color: var(--text-color); /* Use theme variable */
          font-size: 1.8rem;
          font-weight: 700;
          border-radius: 50%;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;
          transform-origin: center bottom;
        }

        .number.generated {
            animation: pop-in 0.5s ease-out forwards;
        }

        @keyframes pop-in {
            0% {
                transform: scale(0.5) translateY(20px);
                opacity: 0;
            }
            80% {
                transform: scale(1.1);
                opacity: 1;
            }
            100% {
                transform: scale(1);
            }
        }

        #generate-btn {
          background-color: var(--button-bg); /* Use theme variable */
          color: var(--button-text); /* Use theme variable */
          font-family: 'Poppins', sans-serif;
          font-size: 1.2rem;
          padding: 15px 30px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s, color 0.3s;
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4); /* This shadow might need adjustment for dark mode */
        }

        #generate-btn:hover {
          opacity: 0.9; /* Use opacity for hover effect */
          transform: translateY(-2px);
        }

        #generate-btn:active {
          transform: translateY(0);
        }
      </style>
      <div class="lotto-container">
        <h1>5x5 Lotto</h1>
        <div id="lotto-sets-container">
          <!-- Lotto sets will be dynamically added here -->
        </div>
        <button id="generate-btn">Generate Numbers</button>
      </div>
    `;
  }

  connectedCallback() {
    const generateBtn = this.shadowRoot.getElementById('generate-btn');

    generateBtn.addEventListener('click', () => {
      const lottoSets = this.generateMultipleLottoSets();
      this.displayLottoNumbers(lottoSets);
    });
  }

  generateMultipleLottoSets() {
    const allLottoSets = [];
    for (let i = 0; i < 5; i++) {
      allLottoSets.push(this.generateLottoSet());
    }
    return allLottoSets;
  }

  generateLottoSet() {
    const numbers = new Set();
    while (numbers.size < 5) {
      const randomNumber = Math.floor(Math.random() * 25) + 1;
      numbers.add(randomNumber);
    }
    return Array.from(numbers);
  }

  displayLottoNumbers(lottoSets) {
    const lottoSetsContainer = this.shadowRoot.getElementById('lotto-sets-container');
    lottoSetsContainer.innerHTML = ''; // Clear previous sets

    lottoSets.forEach((numbers, setIndex) => {
      const lottoNumbersDiv = document.createElement('div');
      lottoNumbersDiv.classList.add('lotto-numbers');

      numbers.sort((a, b) => a - b); // Sort numbers within each set

      numbers.forEach((number, numberIndex) => {
        const numberSpan = document.createElement('span');
        numberSpan.classList.add('number');
        lottoNumbersDiv.appendChild(numberSpan);

        setTimeout(() => {
          numberSpan.textContent = number;
          numberSpan.style.animationDelay = `${(setIndex * 5 + numberIndex) * 100}ms`;
          numberSpan.classList.add('generated');
        }, 100);
      });
      lottoSetsContainer.appendChild(lottoNumbersDiv);
    });
  }
}

customElements.define('lotto-generator', LottoGenerator);

// Dark Mode Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Function to apply the theme
  const applyTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    themeToggleBtn.textContent = theme === 'dark' ? 'Toggle Light Mode' : 'Toggle Dark Mode';
  };

  // Function to toggle theme
  const toggleTheme = () => {
    let currentTheme = htmlElement.getAttribute('data-theme');
    let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Set initial theme on page load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Check for user's system preference
    applyTheme('dark');
  } else {
    applyTheme('light'); // Default to light theme
  }

  // Add event listener to the toggle button
  themeToggleBtn.addEventListener('click', toggleTheme);
});