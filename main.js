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
        <h1>Weekly Lotto</h1>
        <div class="lotto-numbers">
          <span class="number"></span>
          <span class="number"></span>
          <span class="number"></span>
          <span class="number"></span>
          <span class="number"></span>
          <span class="number"></span>
        </div>
        <button id="generate-btn">Generate Numbers</button>
      </div>
    `;
  }

  connectedCallback() {
    const generateBtn = this.shadowRoot.getElementById('generate-btn');
    const numberSpans = this.shadowRoot.querySelectorAll('.lotto-numbers .number');

    generateBtn.addEventListener('click', () => {
      const lottoNumbers = this.generateLottoNumbers();
      this.displayLottoNumbers(lottoNumbers, numberSpans);
    });
  }

  generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 45) + 1;
      numbers.add(randomNumber);
    }
    return Array.from(numbers);
  }

  displayLottoNumbers(numbers, spans) {
    numbers.sort((a, b) => a - b);
    spans.forEach((span, index) => {
        span.textContent = '';
        span.classList.remove('generated');
        setTimeout(() => {
            span.textContent = numbers[index];
            span.style.animationDelay = `${index * 100}ms`;
            span.classList.add('generated');
        }, 100);
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
