// Travel journal window. Reads the character's entries from the mod store
// (written by npc/travel-journal.txt) and redraws when the server says a new
// one arrived.

const REGIONS = [
    ['prontera', 'Prontera'], ['izlude', 'Izlude'], ['geffen', 'Geffen'], ['payon', 'Payon'],
    ['morocc', 'Morocc'], ['alberta', 'Alberta'], ['aldebaran', 'Aldebaran'],
    ['prt_fild', 'Campos de Prontera'], ['pay_fild', 'Campos de Payon'], ['gef_fild', 'Campos de Geffen'],
    ['moc_fild', 'Desierto de Morocc'], ['mjolnir_', 'Montañas Mjolnir'], ['cmd_fild', 'Campos de Comodo'],
    ['iz_dun', 'Mazmorra de Izlude'], ['pay_dun', 'Cueva de Payon'], ['gef_dun', 'Mazmorra de Geffen'],
    ['prt_sewb', 'Alcantarillas de Prontera'], ['moc_pryd', 'Pirámides de Morocc'],
];

const STYLE = `
.top { display: flex; justify-content: space-between; padding: 6px 8px; border-bottom: 1px solid #c9d1e6; background: #f3f5fb; color: #556; }
.list { overflow: auto; padding: 4px 6px 8px; }
.entry { display: grid; grid-template-columns: 22px 1fr; gap: 2px 8px; padding: 5px 4px; border-bottom: 1px solid #eef0f6; }
.entry .glyph { text-align: center; font-size: 15px; }
.entry small { grid-column: 2; color: #889; }
.entry.death { background: #fbeeee; }
.empty { color: #889; padding: 12px; }
.launcher { position: fixed; right: 145px; top: 92px; width: 43px; height: 22px; z-index: 8999; font: bold 11px Tahoma, sans-serif; padding: 0;
  border: 1px solid #6b7a99; border-radius: 4px; background: linear-gradient(#f3f6fd, #d3dbef); color: #273256; cursor: pointer; display: none; }
.launcher.ingame { display: block; }
`;

const escape = text => String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** A readable name for a map code; the code itself when none is known. */
export function placeName(code) {
    const map = String(code || '');
    const exact = REGIONS.find(([prefix]) => prefix === map);
    if (exact) return exact[1];
    const region = REGIONS.find(([prefix]) => prefix.includes('_') && map.startsWith(prefix));
    return region ? `${region[1]} (${map})` : map;
}

/** "<unix>|<type>|<text>" from the store, or null when it is not one. */
export function parseEntry(line) {
    const match = /^(\d{1,12})\|([a-z_]{1,24})\|(.*)$/.exec(String(line || ''));
    if (!match) return null;
    return { time: Number(match[1]) * 1000, type: match[2], text: match[3] };
}

export function describe(entry) {
    if (entry.type === 'map') return { glyph: '🧭', text: `Primera vez en ${placeName(entry.text)}.` };
    if (entry.type === 'death') return { glyph: '💀', text: `Caíste en ${placeName(entry.text)}.` };
    return { glyph: '📝', text: entry.text };
}

export default function init(parameters, api) {
    if (api?.version !== 1) throw new Error('travel-journal requires client API 1');
    const win = api.ui.window({ id: 'travel-journal', title: 'Diario del viajero', width: 360, height: 420 });
    win.body.innerHTML = `<style>${STYLE}</style><div class="top"><span class="name"></span><span class="count"></span></div><div class="list"></div>`;
    const list = win.body.querySelector('.list');
    const count = win.body.querySelector('.count');
    win.body.querySelector('.name').textContent = api.snapshot()?.player?.name || '';

    let loading = 0;
    async function refresh() {
        const ticket = ++loading;
        let store;
        try {
            store = await api.store.get('char', 'client');
        } catch (error) {
            if (ticket === loading) list.innerHTML = '<div class="empty">No se pudo leer el diario.</div>';
            return;
        }
        if (ticket !== loading) return;
        const entries = Object.entries(store?.e || {})
            .map(([n, line]) => ({ n: Number(n), ...parseEntry(line) }))
            .filter(entry => entry.time)
            .sort((a, b) => b.n - a.n);
        count.textContent = `${entries.length} entradas`;
        list.innerHTML = entries.length ? entries.map(entry => {
            const { glyph, text } = describe(entry);
            return `<div class="entry ${escape(entry.type)}"><span class="glyph">${glyph}</span><span>${escape(text)}</span><small>${escape(new Date(entry.time).toLocaleString())}</small></div>`;
        }).join('') : '<div class="empty">Aún no hay nada escrito.</div>';
    }

    const open = () => { win.show(); refresh(); };
    const toggle = () => { if (win.isOpen()) win.hide(); else open(); };

    api.on('server:event', ({ command, text }) => {
        if (command !== 'journal') return;
        if (text === 'open') open();
        else if (text === 'new' && win.isOpen()) refresh();
    });

    let inGame = false;
    let launcher = null;
    const setInGame = value => {
        inGame = value;
        launcher?.classList.toggle('ingame', value);
        if (!value && win.isOpen()) win.hide();
    };
    api.on('map:enter', () => {
        win.body.querySelector('.name').textContent = api.snapshot()?.player?.name || '';
        setInGame(true);
    }, { replay: true });
    api.on('map:leave', () => setInGame(false));

    const onKey = event => {
        if (inGame && event.altKey && event.code === 'KeyJ') { event.preventDefault(); toggle(); }
    };
    addEventListener('keydown', onKey, true);
    api.cleanup(() => removeEventListener('keydown', onKey, true));

    if (parameters?.show_button !== false) {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });
        root.innerHTML = `<style>${STYLE}</style><button class="launcher${inGame ? ' ingame' : ''}" title="Diario del viajero (Alt+J)">Diario</button>`;
        launcher = root.querySelector('button');
        // The map is under the button: a press here must not walk the character there.
        launcher.addEventListener('mousedown', event => event.stopImmediatePropagation());
        launcher.addEventListener('click', toggle);
        document.body.appendChild(host);
        api.cleanup(() => host.remove());
    }
}
