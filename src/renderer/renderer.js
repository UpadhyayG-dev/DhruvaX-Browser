const { ipcRenderer } = require('electron');

// State management
let tabs = [];
let activeTabId = null;
let currentUrl = '';

// DOM elements
const tabsContainer = document.getElementById('tabs-container');
const newTabBtn = document.getElementById('new-tab-btn');
const menuBtn = document.getElementById('menu-btn');
const menuDropdown = document.getElementById('menu-dropdown');
const addressInput = document.getElementById('address-input');
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');
const reloadBtn = document.getElementById('reload-btn');
const homeBtn = document.getElementById('home-btn');
const bookmarkBtn = document.getElementById('bookmark-btn');
const bookmarksBar = document.getElementById('bookmarks-bar');
const downloadsBtn = document.getElementById('downloads-btn');
const historyBtn = document.getElementById('history-btn');
const settingsBtn = document.getElementById('settings-btn');

// Window controls
document.getElementById('minimize-btn').addEventListener('click', () => {
    ipcRenderer.send('window-minimize');
});

document.getElementById('maximize-btn').addEventListener('click', () => {
    ipcRenderer.send('window-maximize');
});

document.getElementById('close-btn').addEventListener('click', () => {
    ipcRenderer.send('window-close');
});

// Tab management
async function createTab(url = 'sparsh://newtab') {
    const viewId = await ipcRenderer.invoke('create-tab', url);
    
    const tab = {
        id: viewId,
        title: 'New Tab',
        url: url,
        favicon: null
    };
    
    tabs.push(tab);
    renderTabs();
    switchToTab(viewId);
    
    return viewId;
}

function renderTabs() {
    tabsContainer.innerHTML = '';
    
    tabs.forEach(tab => {
        const tabElement = document.createElement('div');
        tabElement.className = `tab ${tab.id === activeTabId ? 'active' : ''}`;
        tabElement.dataset.tabId = tab.id;
        
        const favicon = document.createElement('div');
        favicon.className = 'tab-favicon';
        if (tab.favicon) {
            favicon.innerHTML = `<img src="${tab.favicon}" alt="">`;
        } else {
            favicon.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="currentColor" opacity="0.3"/></svg>`;
        }
        
        const title = document.createElement('div');
        title.className = 'tab-title';
        title.textContent = tab.title || 'New Tab';
        title.title = tab.title || 'New Tab';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'tab-close';
        closeBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2L10 10M10 2L2 10" stroke="currentColor" stroke-width="1.5"/></svg>`;
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            closeTab(tab.id);
        };
        
        tabElement.appendChild(favicon);
        tabElement.appendChild(title);
        tabElement.appendChild(closeBtn);
        
        tabElement.onclick = () => switchToTab(tab.id);
        
        tabsContainer.appendChild(tabElement);
    });
}

async function switchToTab(tabId) {
    activeTabId = tabId;
    await ipcRenderer.invoke('switch-tab', tabId);
    
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
        addressInput.value = tab.url === 'sparsh://newtab' ? '' : tab.url;
        currentUrl = tab.url;
        updateNavigationButtons();
    }
    
    renderTabs();
}

async function closeTab(tabId) {
    await ipcRenderer.invoke('close-tab', tabId);
    
    const index = tabs.findIndex(t => t.id === tabId);
    if (index !== -1) {
        tabs.splice(index, 1);
    }
    
    if (tabs.length === 0) {
        createTab();
    } else if (activeTabId === tabId) {
        const newActiveIndex = Math.min(index, tabs.length - 1);
        switchToTab(tabs[newActiveIndex].id);
    } else {
        renderTabs();
    }
}

// Navigation
async function navigateTo(url) {
    await ipcRenderer.invoke('navigate-to', url);
}

addressInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = addressInput.value.trim();
        if (input) {
            navigateTo(input);
        }
    }
});

addressInput.addEventListener('focus', () => {
    addressInput.select();
});

backBtn.addEventListener('click', async () => {
    await ipcRenderer.invoke('go-back');
});

forwardBtn.addEventListener('click', async () => {
    await ipcRenderer.invoke('go-forward');
});

reloadBtn.addEventListener('click', async () => {
    await ipcRenderer.invoke('reload');
});

homeBtn.addEventListener('click', () => {
    navigateTo('sparsh://newtab');
});

function updateNavigationButtons() {
    // These would need proper implementation with webContents state
    backBtn.disabled = false;
    forwardBtn.disabled = false;
}

// Listen for tab updates
ipcRenderer.on('tab-navigated', (event, { viewId, url, title }) => {
    const tab = tabs.find(t => t.id === viewId);
    if (tab) {
        tab.url = url;
        tab.title = title || url;
        if (viewId === activeTabId) {
            addressInput.value = url.startsWith('sparsh://') ? '' : url;
            currentUrl = url;
        }
        renderTabs();
    }
});

ipcRenderer.on('tab-title-updated', (event, { viewId, title }) => {
    const tab = tabs.find(t => t.id === viewId);
    if (tab) {
        tab.title = title;
        renderTabs();
    }
});

ipcRenderer.on('tab-favicon-updated', (event, { viewId, favicon }) => {
    const tab = tabs.find(t => t.id === viewId);
    if (tab) {
        tab.favicon = favicon;
        renderTabs();
    }
});

// Bookmarks
async function loadBookmarks() {
    const bookmarks = await ipcRenderer.invoke('get-bookmarks');
    renderBookmarks(bookmarks);
}

function renderBookmarks(bookmarks) {
    bookmarksBar.innerHTML = '';
    
    bookmarks.forEach(bookmark => {
        const item = document.createElement('button');
        item.className = 'bookmark-item';
        item.title = bookmark.url;
        
        if (bookmark.favicon) {
            const favicon = document.createElement('img');
            favicon.className = 'bookmark-item-favicon';
            favicon.src = bookmark.favicon;
            item.appendChild(favicon);
        }
        
        const title = document.createElement('span');
        title.textContent = bookmark.title;
        item.appendChild(title);
        
        item.onclick = () => {
            navigateTo(bookmark.url);
        };
        
        bookmarksBar.appendChild(item);
    });
}

bookmarkBtn.addEventListener('click', async () => {
    const url = addressInput.value || currentUrl;
    const tab = tabs.find(t => t.id === activeTabId);
    const title = tab ? tab.title : 'Bookmark';
    
    await ipcRenderer.invoke('add-bookmark', { url, title });
    await loadBookmarks();
    
    bookmarkBtn.classList.add('active');
    setTimeout(() => bookmarkBtn.classList.remove('active'), 300);
});

// Menu
let menuOpen = false;

menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menuDropdown.style.display = menuOpen ? 'block' : 'none';
});

document.addEventListener('click', (e) => {
    if (menuOpen && !menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
        menuOpen = false;
        menuDropdown.style.display = 'none';
    }
});

// Menu items
document.getElementById('new-tab-menu').addEventListener('click', () => {
    createTab();
    menuOpen = false;
    menuDropdown.style.display = 'none';
});

document.getElementById('new-private-menu').addEventListener('click', () => {
    createTab('sparsh://newtab?private=true');
    menuOpen = false;
    menuDropdown.style.display = 'none';
});

document.getElementById('history-menu').addEventListener('click', () => {
    navigateTo('sparsh://history');
    menuOpen = false;
    menuDropdown.style.display = 'none';
});

document.getElementById('downloads-menu').addEventListener('click', () => {
    navigateTo('sparsh://downloads');
    menuOpen = false;
    menuDropdown.style.display = 'none';
});

document.getElementById('bookmarks-menu').addEventListener('click', () => {
    navigateTo('sparsh://bookmarks');
    menuOpen = false;
    menuDropdown.style.display = 'none';
});

document.getElementById('settings-menu').addEventListener('click', () => {
    navigateTo('sparsh://settings');
    menuOpen = false;
    menuDropdown.style.display = 'none';
});

document.getElementById('exit-menu').addEventListener('click', () => {
    ipcRenderer.send('window-close');
});

// Toolbar buttons
downloadsBtn.addEventListener('click', () => {
    navigateTo('sparsh://downloads');
});

historyBtn.addEventListener('click', () => {
    navigateTo('sparsh://history');
});

settingsBtn.addEventListener('click', () => {
    navigateTo('sparsh://settings');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 't') {
            e.preventDefault();
            createTab();
        } else if (e.key === 'w') {
            e.preventDefault();
            if (activeTabId) {
                closeTab(activeTabId);
            }
        } else if (e.key === 'l') {
            e.preventDefault();
            addressInput.focus();
            addressInput.select();
        } else if (e.key === 'r') {
            e.preventDefault();
            ipcRenderer.invoke('reload');
        } else if (e.key === 'h') {
            e.preventDefault();
            navigateTo('sparsh://history');
        } else if (e.key === 'j') {
            e.preventDefault();
            navigateTo('sparsh://downloads');
        } else if (e.key === 'd') {
            e.preventDefault();
            bookmarkBtn.click();
        }
    }
});

// Initialize
newTabBtn.addEventListener('click', () => createTab());

// Create initial tab
createTab();
loadBookmarks();
