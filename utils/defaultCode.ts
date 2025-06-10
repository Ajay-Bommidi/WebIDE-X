export const defaultCode = {
    html: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Advanced Interactive Demo</title>
  </head>
  <body>
      <div class="dashboard">
          <header>
              <h1>Dynamic Dashboard</h1>
              <p>Built with HTML, CSS, & JS in Web IDE X</p>
          </header>
  
          <section class="card item-creator">
              <h2>Add New Item</h2>
              <div class="input-group">
                  <input type="text" id="itemInput" placeholder="Enter item name...">
                  <button id="addItemBtn">Add Item</button>
              </div>
              <div id="itemMessage" class="message"></div>
          </section>
  
          <section class="card item-list">
              <h2>My Items (<span id="itemCount">0</span>)</h2>
              <ul id="itemsContainer">
                  <!-- Dynamic items will be added here -->
              </ul>
              <button id="clearItemsBtn" class="secondary-btn">Clear All Items</button>
          </section>
  
          <section class="card progress-card">
              <h2>Task Progress</h2>
              <div class="progress-container">
                  <div class="progress-bar" id="progressBar"></div>
              </div>
              <p id="progressText">0% Complete</p>
              <div class="progress-controls">
                  <button id="increaseProgressBtn">+10%</button>
                  <button id="decreaseProgressBtn">-10%</button>
              </div>
          </section>
      </div>
  </body>
  </html>`,
    css: `:root {
      --primary-color: #6200EE;
      --primary-dark: #3700B3;
      --secondary-color: #03DAC6;
      --background-color: #121212;
      --surface-color: #1F1F1F;
      --text-color-primary: #FFFFFF;
      --text-color-secondary: #BBBBBB;
      --border-color: #333333;
      --error-color: #CF6679;
  }
  
  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }
  
  body {
      font-family: 'Roboto', sans-serif;
      background-color: var(--background-color);
      color: var(--text-color-primary);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      overflow-y: auto;
  }
  
  .dashboard {
      display: grid;
      gap: 25px;
      width: 100%;
      max-width: 900px;
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
  }
  
  @media (min-width: 768px) {
      .dashboard {
          grid-template-columns: 1.5fr 1fr;
          grid-template-rows: auto auto;
      }
      .item-creator {
          grid-column: 1 / 2;
          grid-row: 1 / 2;
      }
      .item-list {
          grid-column: 1 / 2;
          grid-row: 2 / 3;
      }
      .progress-card {
          grid-column: 2 / 3;
          grid-row: 1 / 3;
      }
  }
  
  header {
      grid-column: 1 / -1;
      text-align: center;
      margin-bottom: 20px;
  }
  
  header h1 {
      font-size: 3em;
      color: var(--primary-color);
      margin-bottom: 10px;
  }
  
  header p {
      font-size: 1.1em;
      color: var(--text-color-secondary);
  }
  
  .card {
      background-color: var(--surface-color);
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      border: 1px solid var(--border-color);
  }
  
  .card h2 {
      font-size: 1.8em;
      color: var(--primary-color);
      margin-bottom: 20px;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 10px;
  }
  
  .input-group {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
  }
  
  .input-group input[type="text"] {
      flex-grow: 1;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background-color: #2a2a2a;
      color: var(--text-color-primary);
      font-size: 1em;
  }
  
  .input-group input[type="text"]:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(98, 0, 238, 0.3);
  }
  
  button {
      background-color: var(--primary-color);
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1em;
      font-weight: 700;
      transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  button:hover {
      background-color: var(--primary-dark);
      transform: translateY(-2px);
  }
  
  button:active {
      transform: translateY(0);
  }
  
  .secondary-btn {
      background-color: #666;
      margin-top: 20px;
  }
  
  .secondary-btn:hover {
      background-color: #555;
  }
  
  .message {
      color: var(--text-color-secondary);
      font-size: 0.9em;
      min-height: 1.2em; /* Reserve space */
  }
  
  .error-message {
      color: var(--error-color);
      font-weight: 700;
  }
  
  .item-list ul {
      list-style: none;
      padding: 0;
      max-height: 200px;
      overflow-y: auto;
      margin-bottom: 20px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
  }
  
  .item-list li {
      background-color: #2a2a2a;
      padding: 10px 15px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1em;
      transition: background-color 0.3s ease;
  }
  
  .item-list li:last-child {
      border-bottom: none;
  }
  
  .item-list li:hover {
      background-color: #3a3a3a;
  }
  
  .delete-item-btn {
      background-color: var(--error-color);
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 0.8em;
      font-weight: 400;
  }
  
  .delete-item-btn:hover {
      background-color: #b05260;
  }
  
  .progress-container {
      width: 100%;
      background-color: #333;
      border-radius: 10px;
      overflow: hidden;
      margin: 25px 0 15px;
  }
  
  .progress-bar {
      height: 25px;
      width: 0%;
      background-color: var(--secondary-color);
      border-radius: 10px;
      text-align: center;
      line-height: 25px;
      color: var(--background-color);
      font-weight: 700;
      transition: width 0.4s ease-in-out;
  }
  
  .progress-controls {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 20px;
  }
  
  /* Keyframe Animations */
  @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
  }
  
  .fade-in {
      animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(10px); }
  }
  
  .fade-out {
      animation: fadeOut 0.3s ease-in forwards;
  }
  `,
    js: `document.addEventListener('DOMContentLoaded', function() {
      // State management with localStorage
      let items = JSON.parse(localStorage.getItem('demoItems')) || [];
      let currentProgress = parseInt(localStorage.getItem('demoProgress')) || 0;

      // DOM Elements
      const itemInput = document.getElementById('itemInput');
      const addItemBtn = document.getElementById('addItemBtn');
      const itemMessage = document.getElementById('itemMessage');
      const itemsContainer = document.getElementById('itemsContainer');
      const itemCountElement = document.getElementById('itemCount');
      const clearItemsBtn = document.getElementById('clearItemsBtn');
      const progressBar = document.getElementById('progressBar');
      const progressText = document.getElementById('progressText');
      const increaseProgressBtn = document.getElementById('increaseProgressBtn');
      const decreaseProgressBtn = document.getElementById('decreaseProgressBtn');

      // Save state
      function saveState() {
          localStorage.setItem('demoItems', JSON.stringify(items));
          localStorage.setItem('demoProgress', currentProgress);
      }

      // Message helper with animation
      function showMessage(message, isError = false) {
          itemMessage.textContent = message;
          itemMessage.className = 'message ' + (isError ? 'error-message' : 'success-message');
          itemMessage.style.animation = 'none';
          itemMessage.offsetHeight; // Trigger reflow
          itemMessage.style.animation = 'fadeInOut 3s forwards';
      }

      // Add item with animation
      function addItem() {
          const itemName = itemInput.value.trim();
          if (itemName) {
              items.push({
                  text: itemName,
                  completed: false,
                  id: Date.now()
              });
              saveState();
              renderItems();
              itemInput.value = '';
              showMessage('Item "' + itemName + '" added!');
              itemInput.focus();
          } else {
              showMessage('Please enter an item name!', true);
          }
      }

      // Toggle item completion
      function toggleItemCompletion(id) {
          const itemIndex = items.findIndex(item => item.id === id);
          if (itemIndex !== -1) {
              items[itemIndex].completed = !items[itemIndex].completed;
              saveState();
              renderItems();
              updateProgressBar();
          }
      }

      // Render items
      function renderItems() {
          itemsContainer.innerHTML = '';
          if (items.length === 0) {
              itemsContainer.innerHTML = '<li class="empty-message">No items yet. Add some above!</li>';
          } else {
              items.forEach(item => {
                  const listItem = document.createElement('li');
                  listItem.className = 'item fade-in' + (item.completed ? ' completed' : '');
                  listItem.innerHTML = 
                      '<div class="item-content">' +
                      '<input type="checkbox" class="item-checkbox" ' + (item.completed ? 'checked' : '') + '>' +
                      '<span class="item-text">' + item.text + '</span>' +
                      '</div>' +
                      '<button class="delete-item-btn" title="Delete item">×</button>';
                  
                  const checkbox = listItem.querySelector('.item-checkbox');
                  checkbox.addEventListener('change', () => toggleItemCompletion(item.id));
                  
                  const deleteBtn = listItem.querySelector('.delete-item-btn');
                  deleteBtn.addEventListener('click', () => {
                      listItem.classList.add('fade-out');
                      listItem.addEventListener('animationend', () => {
                          items = items.filter(i => i.id !== item.id);
                          saveState();
                          renderItems();
                          showMessage('Item deleted!');
                      }, { once: true });
                  });
                  
                  itemsContainer.appendChild(listItem);
              });
          }
          itemCountElement.textContent = items.length;
          updateProgressBar();
      }

      // Progress bar with dynamic updates
      function updateProgressBar() {
          const completedItems = items.filter(item => item.completed).length;
          const totalItems = items.length;
          const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : currentProgress;
          currentProgress = progress;
          
          progressBar.style.width = progress + '%';
          progressText.textContent = progress + '% Complete';
          
          // Dynamic color based on progress
          if (progress < 30) {
              progressBar.style.backgroundColor = '#CF6679';
          } else if (progress < 70) {
              progressBar.style.backgroundColor = '#FFA500';
          } else {
              progressBar.style.backgroundColor = 'var(--secondary-color)';
          }
      }

      // Keyboard shortcuts
      document.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' && document.activeElement === itemInput) {
              addItem();
          }
      });

      // Event Listeners
      addItemBtn.addEventListener('click', addItem);
      
      clearItemsBtn.addEventListener('click', function() {
          if (items.length > 0) {
              const allItems = itemsContainer.querySelectorAll('.item');
              let completedAnimations = 0;
              allItems.forEach(item => {
                  item.classList.add('fade-out');
                  item.addEventListener('animationend', () => {
                      completedAnimations++;
                      if (completedAnimations === allItems.length) {
                          items = [];
                          saveState();
                          renderItems();
                          showMessage('All items cleared!');
                      }
                  }, { once: true });
              });
          } else {
              showMessage('No items to clear!', true);
          }
      });

      increaseProgressBtn.addEventListener('click', function() {
          if (currentProgress < 100) {
              currentProgress = Math.min(100, currentProgress + 10);
              saveState();
              updateProgressBar();
              showMessage('Progress increased!');
          } else {
              showMessage('Tasks are 100% complete! 🎉');
          }
      });

      decreaseProgressBtn.addEventListener('click', function() {
          if (currentProgress > 0) {
              currentProgress = Math.max(0, currentProgress - 10);
              saveState();
              updateProgressBar();
              showMessage('Progress decreased!');
          } else {
              showMessage('No progress made yet.');
          }
      });

      // Add some CSS for the new features
      const style = document.createElement('style');
      style.textContent = \`
          .item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px;
              margin: 8px 0;
              background: var(--background-color);
              border: 1px solid var(--border-color);
              border-radius: 8px;
              transition: all 0.3s ease;
          }
          
          .item:hover {
              transform: translateX(5px);
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .item.completed .item-text {
              text-decoration: line-through;
              color: var(--text-color-secondary);
          }
          
          .item-content {
              display: flex;
              align-items: center;
              gap: 12px;
          }
          
          .item-checkbox {
              width: 18px;
              height: 18px;
              cursor: pointer;
          }
          
          .delete-item-btn {
              background: none;
              border: none;
              color: var(--error-color);
              font-size: 20px;
              cursor: pointer;
              padding: 4px 8px;
              border-radius: 4px;
              transition: all 0.2s ease;
          }
          
          .delete-item-btn:hover {
              background: var(--error-color);
              color: white;
          }
          
          .message {
              padding: 8px 16px;
              border-radius: 4px;
              margin: 8px 0;
              animation: fadeInOut 3s forwards;
          }
          
          .success-message {
              background: var(--secondary-color);
              color: white;
          }
          
          .error-message {
              background: var(--error-color);
              color: white;
          }
          
          @keyframes fadeInOut {
              0% { opacity: 0; transform: translateY(-10px); }
              10% { opacity: 1; transform: translateY(0); }
              90% { opacity: 1; transform: translateY(0); }
              100% { opacity: 0; transform: translateY(-10px); }
          }
          
          .empty-message {
              text-align: center;
              color: var(--text-color-secondary);
              padding: 20px;
              font-style: italic;
          }
          
          .fade-in {
              animation: fadeIn 0.3s ease-in;
          }
          
          .fade-out {
              animation: fadeOut 0.3s ease-out;
          }
          
          @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fadeOut {
              from { opacity: 1; transform: translateY(0); }
              to { opacity: 0; transform: translateY(-10px); }
          }
      \`;
      document.head.appendChild(style);

      // Initial render
      renderItems();
      updateProgressBar();

      console.log('Enhanced interactive demo with item completion, animations, and keyboard shortcuts loaded! 🚀');
    });`,
  };
  
  export interface FileTreeNode {
    id: string;
    name: string;
    path: string;
    type: "folder" | "html" | "css" | "js";
    content?: string;
    children?: FileTreeNode[];
    icon?: string;
    isDirty?: boolean;
    isOpen?: boolean;
  }
  
  export type FileType = "html" | "css" | "js";
  
  // Helper to get file content by type from defaultCode
  export const getFileContent = (type: FileType): string => {
    return defaultCode[type];
  };
  
  export const initialFileStructure: FileTreeNode[] = [
    // ... existing code ...
  ];