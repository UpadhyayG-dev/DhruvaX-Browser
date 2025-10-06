import React, { useEffect, useMemo, useRef, useState } from 'react';
import { registerElectronDownloadHook } from './electron-bridge';

type Tab = {
  id: string;
  title: string;
  url: string;
  isPrivate: boolean;
  history: string[];
  historyIndex: number;
};

type Panel = 'none' | 'downloads' | 'history' | 'settings';

const DEFAULT_SHORTCUTS: { title: string; url: string }[] = [
  { title: 'Comet Docs', url: 'https://example.com' },
  { title: 'Wikipedia', url: 'https://wikipedia.org' },
  { title: 'GitHub', url: 'https://github.com' },
  { title: 'YouTube', url: 'https://youtube.com' },
  { title: 'MDN', url: 'https://developer.mozilla.org' },
  { title: 'Reddit', url: 'https://reddit.com' },
  { title: 'Hacker News', url: 'https://news.ycombinator.com' },
  { title: 'Product Hunt', url: 'https://www.producthunt.com' }
];

const HOME = 'about:newtab';

function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeInputToUrl(input: string, searchEngine: string): string {
  const trimmed = input.trim();
  if (!trimmed) return HOME;
  const looksLikeUrl = /\./.test(trimmed) && !/\s/.test(trimmed);
  if (looksLikeUrl) {
    const hasScheme = /^https?:\/\//i.test(trimmed);
    return hasScheme ? trimmed : `https://${trimmed}`;
  }
  const encoded = encodeURIComponent(trimmed);
  if (searchEngine === 'duck') return `https://duckduckgo.com/?q=${encoded}`;
  if (searchEngine === 'brave') return `https://search.brave.com/search?q=${encoded}`;
  return `https://www.google.com/search?q=${encoded}`;
}

export default function App(): JSX.Element {
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const saved = localStorage.getItem('sparsh-tabs');
    if (saved) {
      try { return JSON.parse(saved) as Tab[]; } catch {}
    }
    return [];
  });
  const [activeId, setActiveId] = useState<string>(() => {
    const saved = localStorage.getItem('sparsh-active');
    return saved || '';
  });
  const [address, setAddress] = useState('');
  const [panel, setPanel] = useState<Panel>('none');
  const [historyLog, setHistoryLog] = useState<string[]>(() => {
    const s = localStorage.getItem('sparsh-history');
    return s ? JSON.parse(s) : [];
  });
  const [downloads, setDownloads] = useState<{ url: string; at: number }[]>(() => {
    const s = localStorage.getItem('sparsh-downloads');
    return s ? JSON.parse(s) : [];
  });
  const [searchEngine, setSearchEngine] = useState<'google'|'duck'|'brave'>(() => (localStorage.getItem('sparsh-search') as any) || 'google');

  useEffect(() => {
    const persistable = tabs.filter(t => !t.isPrivate);
    localStorage.setItem('sparsh-tabs', JSON.stringify(persistable));
  }, [tabs]);
  useEffect(() => { localStorage.setItem('sparsh-active', activeId); }, [activeId]);
  useEffect(() => { localStorage.setItem('sparsh-history', JSON.stringify(historyLog)); }, [historyLog]);
  useEffect(() => { localStorage.setItem('sparsh-downloads', JSON.stringify(downloads)); }, [downloads]);
  useEffect(() => { localStorage.setItem('sparsh-search', searchEngine); }, [searchEngine]);

  const activeTab = useMemo(() => tabs.find(t => t.id === activeId) || null, [tabs, activeId]);

  useEffect(() => {
    const dispose = registerElectronDownloadHook((url) => {
      setDownloads(prev => [{ url, at: Date.now() }, ...prev]);
    });
    return dispose;
  }, []);

  useEffect(() => {
    if (!activeTab) return;
    setAddress(activeTab.url === HOME ? '' : activeTab.url);
  }, [activeTab?.url]);

  useEffect(() => {
    if (tabs.length === 0) {
      handleNewTab(false);
    } else if (!activeTab) {
      setActiveId(tabs[0].id);
    }
  }, []);

  function handleNewTab(isPrivate: boolean) {
    const id = generateId('tab');
    const newTab: Tab = { id, title: 'New Tab', url: HOME, isPrivate, history: [HOME], historyIndex: 0 };
    setTabs(prev => [...prev, newTab]);
    setActiveId(id);
    setPanel('none');
  }

  function handleCloseTab(id: string) {
    setTabs(prev => prev.filter(t => t.id !== id));
    if (activeId === id) {
      const idx = tabs.findIndex(t => t.id === id);
      const next = tabs[idx + 1] || tabs[idx - 1];
      setActiveId(next ? next.id : '');
    }
  }

  function navigateTo(input: string) {
    const url = normalizeInputToUrl(input, searchEngine);
    if (!activeTab) return;
    const updated = tabs.map(t => {
      if (t.id !== activeTab.id) return t;
      const history = t.history.slice(0, t.historyIndex + 1);
      history.push(url);
      return { ...t, url, history, historyIndex: history.length - 1 };
    });
    setTabs(updated);
    if (url !== HOME && !activeTab.isPrivate) {
      setHistoryLog(prev => [url, ...prev].slice(0, 500));
    }
  }

  function goBack() {
    if (!activeTab) return;
    const t = activeTab;
    if (t.historyIndex <= 0) return;
    const newIndex = t.historyIndex - 1;
    setTabs(prev => prev.map(x => x.id === t.id ? { ...x, historyIndex: newIndex, url: t.history[newIndex] } : x));
  }
  function goForward() {
    if (!activeTab) return;
    const t = activeTab;
    if (t.historyIndex >= t.history.length - 1) return;
    const newIndex = t.historyIndex + 1;
    setTabs(prev => prev.map(x => x.id === t.id ? { ...x, historyIndex: newIndex, url: t.history[newIndex] } : x));
  }
  function reload() {
    if (!activeTab) return;
    setTabs(prev => prev.map(x => x.id === activeTab.id ? { ...x } : x));
  }

  function onNewTabShortcut(url: string) { navigateTo(url); }

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="app" ref={containerRef}>
      <div className="titlebar">
        <div className="brand"><img src="/sparsh.svg" alt="logo"/> Spàrsh</div>
        <div className="window-controls">
          <div className="win-dot"/><div className="win-dot"/><div className="win-dot"/>
        </div>
      </div>

      <div className="tabstrip">
        {tabs.map(t => (
          <div key={t.id} className={`tab ${t.id === activeId ? 'active' : ''}`} onClick={() => setActiveId(t.id)}>
            <span style={{fontWeight:500}}>{t.isPrivate ? '🕶 ' : ''}{t.title || 'New Tab'}</span>
            <button className="close" onClick={(e) => { e.stopPropagation(); handleCloseTab(t.id); }}>✕</button>
          </div>
        ))}
        <button className="tab newtab" onClick={() => handleNewTab(false)}>＋</button>
        <button className="tab newtab" onClick={() => handleNewTab(true)}>🕶</button>
        <div className="right-tools" style={{marginLeft:'auto'}}>
          <button className="iconbtn" title="Downloads" onClick={() => setPanel(panel==='downloads'?'none':'downloads')}>⬇</button>
          <button className="iconbtn" title="History" onClick={() => setPanel(panel==='history'?'none':'history')}>🕑</button>
          <button className="iconbtn" title="Settings" onClick={() => setPanel(panel==='settings'?'none':'settings')}>⚙</button>
        </div>
      </div>

      <div className="toolbar">
        <button className="iconbtn" title="Back" onClick={goBack}>←</button>
        <button className="iconbtn" title="Forward" onClick={goForward}>→</button>
        <button className="iconbtn" title="Reload" onClick={reload}>⟳</button>
        <button className="iconbtn" title="Home" onClick={() => navigateTo(HOME)}>⌂</button>
        <div className="address">
          <span className="lock">🔒</span>
          <input
            placeholder="Search or enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') navigateTo(address); }}
          />
          <button className="iconbtn starbtn" title="Bookmark" onClick={() => { /* bookmarks stub */ }}>★</button>
        </div>
      </div>

      <div className="content">
        {activeTab && (
          activeTab.url === HOME ? (
            <NewTabPage onShortcut={onNewTabShortcut} />
          ) : (
            <iframe key={activeTab.id + ':' + activeTab.historyIndex}
              className="webview"
              src={activeTab.url}
              title={activeTab.title}
              onLoad={(e) => {
                const iframe = e.currentTarget as HTMLIFrameElement;
                let title = activeTab.title;
                try {
                  title = iframe.contentDocument?.title || activeTab.url;
                } catch {
                  title = activeTab.url;
                }
                setTabs(prev => prev.map(t => t.id === activeTab.id ? { ...t, title } : t));
              }}
            />
          )
        )}
      </div>

      {panel !== 'none' && (
        <div className="overlay" onClick={() => setPanel('none')}>
          <div className="panel" onClick={e => e.stopPropagation()}>
            <header>
              <span style={{opacity:.8, fontWeight:600}}>{panel === 'downloads' ? 'Downloads' : panel === 'history' ? 'History' : 'Settings'}</span>
              <button className="iconbtn" onClick={() => setPanel('none')}>✕</button>
            </header>
            <div className="body">
              {panel === 'downloads' && (
                <DownloadsView items={downloads} onClear={() => setDownloads([])} />
              )}
              {panel === 'history' && (
                <HistoryView items={historyLog} onOpen={(u)=>{ setPanel('none'); navigateTo(u); }} onClear={()=>setHistoryLog([])} />
              )}
              {panel === 'settings' && (
                <SettingsView searchEngine={searchEngine} onChangeEngine={setSearchEngine} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NewTabPage({ onShortcut }: { onShortcut: (url: string) => void }): JSX.Element {
  return (
    <div style={{padding:24}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <img src="/sparsh.svg" width={28} height={28} />
          <div style={{fontSize:18, fontWeight:700}}>Spàrsh</div>
          <span className="badge">New Tab</span>
        </div>
        <div style={{opacity:.7}}>Tip: Press <span className="kbd">Ctrl/Cmd + L</span> to focus the address bar</div>
      </div>
      <div className="grid">
        {DEFAULT_SHORTCUTS.map(s => (
          <div key={s.url} className="tile" onClick={() => onShortcut(s.url)}>
            <div style={{fontWeight:600, marginBottom:6}}>{s.title}</div>
            <div style={{opacity:.7, fontSize:12}}>{s.url}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DownloadsView({ items, onClear }: { items: { url: string; at: number }[]; onClear: () => void }): JSX.Element {
  return (
    <div>
      <div style={{display:'flex', justifyContent:'flex-end'}}>
        <button className="iconbtn" onClick={onClear}>Clear</button>
      </div>
      {items.length === 0 && <div style={{opacity:.7}}>No downloads yet</div>}
      {items.map((d, i) => (
        <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)'}}>
          <div>
            <div style={{fontWeight:600}}>{d.url}</div>
            <div style={{opacity:.6, fontSize:12}}>{new Date(d.at).toLocaleString()}</div>
          </div>
          <div className="badge">Saved</div>
        </div>
      ))}
    </div>
  );
}

function HistoryView({ items, onOpen, onClear }: { items: string[]; onOpen: (u:string)=>void; onClear: ()=>void }): JSX.Element {
  return (
    <div>
      <div style={{display:'flex', justifyContent:'flex-end'}}>
        <button className="iconbtn" onClick={onClear}>Clear</button>
      </div>
      {items.length === 0 && <div style={{opacity:.7}}>No history yet</div>}
      {items.map((u, i) => (
        <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)'}}>
          <div style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'70%'}}>{u}</div>
          <button className="iconbtn" onClick={() => onOpen(u)}>Open</button>
        </div>
      ))}
    </div>
  );
}

function SettingsView({ searchEngine, onChangeEngine }: { searchEngine: 'google'|'duck'|'brave'; onChangeEngine: (s:any)=>void }): JSX.Element {
  return (
    <div>
      <div style={{marginBottom:12, fontWeight:600}}>Search Engine</div>
      <div style={{display:'flex', gap:8}}>
        <button className="iconbtn" style={{borderColor: searchEngine==='google'?'var(--accent)':'var(--border)'}} onClick={()=>onChangeEngine('google')}>Google</button>
        <button className="iconbtn" style={{borderColor: searchEngine==='duck'?'var(--accent)':'var(--border)'}} onClick={()=>onChangeEngine('duck')}>DuckDuckGo</button>
        <button className="iconbtn" style={{borderColor: searchEngine==='brave'?'var(--accent)':'var(--border)'}} onClick={()=>onChangeEngine('brave')}>Brave</button>
      </div>
    </div>
  );
}
