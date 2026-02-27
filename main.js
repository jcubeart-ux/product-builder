class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    this.selectedNumbers = new Set();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        @import url('/style.css?v=' + new Date().getTime() + '); /* Import global styles */

        /* Inherit theme variables from the document root */
        .lotto-container {
          background: var(--lotto-card-bg); /* Use theme variable */
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px var(--lotto-card-shadow); /* Use theme variable */
          text-align: center;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }

        h1, h2 {
          color: var(--text-color); /* Use theme variable */
          font-family: 'Poppins', sans-serif;
          text-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          transition: color 0.3s ease;
        }
        
        h1 {
          font-size: 2.5rem;
          margin-bottom: 30px;
        }

        h2 {
          font-size: 1.5rem;
          margin-bottom: 20px;
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

        .number-selection-container {
          margin-bottom: 30px;
        }

        .number-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          max-width: 400px;
          margin: 0 auto;
        }

        .selectable-number {
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--background-color);
          color: var(--text-color);
          font-size: 1.2rem;
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s, transform 0.2s;
        }

        .selectable-number:hover {
          transform: scale(1.1);
        }

        .selectable-number.selected {
          background-color: var(--button-bg);
          color: var(--button-text);
        }
      </style>
      <div class="lotto-container">
        <h1>5x5 Lotto</h1>
        <div class="number-selection-container">
          <h2>Choose your numbers</h2>
          <div class="number-grid"></div>
        </div>
        <div id="lotto-sets-container">
          <!-- Lotto sets will be dynamically added here -->
        </div>
        <button id="generate-btn">Generate Numbers</button>
      </div>
    `;
  }

  connectedCallback() {
    const generateBtn = this.shadowRoot.getElementById('generate-btn');
    const numberGrid = this.shadowRoot.querySelector('.number-grid');

    for (let i = 1; i <= 25; i++) {
      const numberEl = document.createElement('div');
      numberEl.classList.add('selectable-number');
      numberEl.textContent = i;
      numberEl.dataset.number = i;
      numberGrid.appendChild(numberEl);
    }

    numberGrid.addEventListener('click', (e) => {
      if (e.target.classList.contains('selectable-number')) {
        const number = parseInt(e.target.dataset.number, 10);
        if (this.selectedNumbers.has(number)) {
          this.selectedNumbers.delete(number);
          e.target.classList.remove('selected');
        } else {
          if (this.selectedNumbers.size < 5) {
            this.selectedNumbers.add(number);
            e.target.classList.add('selected');
          }
        }
      }
    });

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
    const numbers = new Set(this.selectedNumbers);
    while (numbers.size < 5) {
      const randomNumber = Math.floor(Math.random() * 25) + 1;
      if (!this.selectedNumbers.has(randomNumber)) {
        numbers.add(randomNumber);
      }
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

class ContactForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        @import url('/style.css?v=' + new Date().getTime());

        .contact-container {
          background: var(--lotto-card-bg);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px var(--lotto-card-shadow);
          text-align: center;
          transition: background 0.3s ease, box-shadow 0.3s ease;
          max-width: 500px;
          width: 90%;
          margin: 40px auto;
        }

        h2 {
          color: var(--text-color);
          font-family: 'Poppins', sans-serif;
          margin-bottom: 30px;
          font-size: 2rem;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
        }

        label {
          color: var(--text-color);
          font-weight: 700;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        input, textarea {
          padding: 12px 15px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.1);
          background: var(--background-color);
          color: var(--text-color);
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        html[data-theme='dark'] input, 
        html[data-theme='dark'] textarea {
            border: 1px solid rgba(255,255,255,0.1);
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }

        button {
          background-color: var(--button-bg);
          color: var(--button-text);
          font-family: 'Poppins', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          padding: 15px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: opacity 0.3s, transform 0.2s;
          margin-top: 10px;
        }

        button:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        button:active {
          transform: translateY(0);
        }
      </style>
      <div class="contact-container">
        <h2>Contact Us</h2>
        <form action="https://formspree.io/f/mwvnygeg" method="POST">
          <label>
            Your email:
            <input type="email" name="email" placeholder="email@example.com" required>
          </label>
          <label>
            Your message:
            <textarea name="message" placeholder="How can we help you?" required></textarea>
          </label>
          <button type="submit">Send Message</button>
        </form>
      </div>
    `;
  }
}

customElements.define('contact-form', ContactForm);

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