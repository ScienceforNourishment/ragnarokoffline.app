// Traveller's journal window, with two tabs: Diario (the entries, as in
// travel-journal) and Relatos (the expedition under way and what is still
// untold). Reads the character's store, written by npc/adventure.txt, and
// redraws when the server says something new arrived.

const REGIONS = [
    ['prontera', 'Prontera'], ['izlude', 'Izlude'], ['geffen', 'Geffen'], ['payon', 'Payon'],
    ['morocc', 'Morocc'], ['alberta', 'Alberta'], ['aldebaran', 'Aldebaran'],
    ['prt_fild', 'Campos de Prontera'], ['pay_fild', 'Campos de Payon'], ['gef_fild', 'Campos de Geffen'],
    ['moc_fild', 'Desierto de Morocc'], ['mjolnir_', 'Montañas Mjolnir'], ['cmd_fild', 'Campos de Comodo'],
    ['iz_dun', 'Mazmorra de Izlude'], ['pay_dun', 'Cueva de Payon'], ['gef_dun', 'Mazmorra de Geffen'],
    ['prt_sewb', 'Alcantarillas de Prontera'], ['moc_pryd', 'Pirámides de Morocc'],
];

const STYLE = `
.tabs { display: flex; border-bottom: 1px solid #c9d1e6; background: #f3f5fb; }
.tabs button { flex: 1; border: 0; background: none; padding: 6px; font: 12px Tahoma, sans-serif; color: #556; cursor: pointer; }
.tabs button.on { background: #fff; color: #273256; font-weight: bold; box-shadow: inset 0 -2px #6b7a99; }
.top { display: flex; justify-content: space-between; gap: 8px; padding: 6px 8px; border-bottom: 1px solid #c9d1e6; background: #f9fafd; color: #556; }
.list { overflow: auto; padding: 4px 6px 8px; }
.pane[hidden] { display: none; }
.entry { display: grid; grid-template-columns: 22px 1fr; gap: 2px 8px; padding: 5px 4px; border-bottom: 1px solid #eef0f6; }
.entry .glyph { text-align: center; font-size: 15px; }
.entry small { grid-column: 2; color: #889; }
.entry.death { background: #fbeeee; }
.entry.exp { background: #f6f3e6; }
.entry.expedition { background: #eaf2ea; }
.empty { color: #889; padding: 12px; }
.hint { color: #889; padding: 8px; font-size: 11px; }
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

/** An untold relato, "<base>|<job>|<per mille>|<tier>|<text>"; null when not one. */
export function parseTale(line) {
    const match = /^(\d{1,19})\|(\d{1,19})\|(\d{1,9})\|(\d{1,2})\|(.*)$/.exec(String(line || ''));
    if (!match || !match[5]) return null;
    return { perMille: Number(match[3]), tier: Number(match[4]), text: match[5] };
}

/** Seconds as "1 h 42 min" or "17 min", like the server's summary. */
export function duration(seconds) {
    const minutes = Math.max(0, Math.floor(Number(seconds) / 60) || 0);
    return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

/** Seconds spent outside so far: the closed time plus the open segment. */
export function timeOutside(expedition, nowSeconds) {
    const out = Number(expedition?.out) || 0;
    const since = Number(expedition?.since) || 0;
    return out + (since > 0 ? Math.max(0, nowSeconds - since) : 0);
}

export function describe(entry) {
    if (entry.type === 'map') return { glyph: '🧭', text: `Primera vez en ${placeName(entry.text)}.` };
    if (entry.type === 'death') return { glyph: '💀', text: `Caíste en ${placeName(entry.text)}.` };
    if (entry.type === 'exp') return { glyph: '✨', text: `${entry.text}.` };
    if (entry.type === 'expedition') return { glyph: '🏕️', text: entry.text };
    return { glyph: '📝', text: entry.text };
}

export default function init(parameters, api) {
    if (api?.version !== 1) throw new Error('adventure requires client API 1');
    const win = api.ui.window({ id: 'adventure-journal', title: 'Diario del viajero', width: 360, height: 440 });
    win.body.innerHTML = `<style>${STYLE}</style>
<div class="tabs"><button data-tab="journal" class="on">Diario</button><button data-tab="tales">Relatos</button></div>
<div class="pane" data-pane="journal"><div class="top"><span class="name"></span><span class="count"></span></div><div class="list journal"></div></div>
<div class="pane" data-pane="tales" hidden><div class="top"><span class="trip"></span><span class="clock"></span></div><div class="list tales"></div></div>`;
    const $ = selector => win.body.querySelector(selector);
    const journal = $('.list.journal');
    const tales = $('.list.tales');
    $('.name').textContent = api.snapshot()?.player?.name || '';

    let tab = 'journal';
    let expedition = null;
    let clock = null;

    const showClock = () => {
        $('.clock').textContent = expedition?.on ? `${duration(timeOutside(expedition, Date.now() / 1000))} fuera` : '';
    };
    const stopClock = () => { if (clock) { clearInterval(clock); clock = null; } };
    api.cleanup(stopClock);

    let loading = 0;
    async function refresh() {
        const ticket = ++loading;
        let entries, trip, untold;
        try {
            // Read apart: one answer over about 36 KB is refused.
            [entries, trip, untold] = await Promise.all([
                api.store.get('char', 'client.e'),
                api.store.get('char', 'client.x'),
                api.store.get('char', 'client.p'),
            ]);
        } catch (error) {
            if (ticket === loading) journal.innerHTML = tales.innerHTML = '<div class="empty">No se pudo leer el diario.</div>';
            return;
        }
        if (ticket !== loading) return;

        const list = Object.entries(entries || {})
            .map(([n, line]) => ({ n: Number(n), ...parseEntry(line) }))
            .filter(entry => entry.time)
            .sort((a, b) => b.n - a.n);
        $('.count').textContent = `${list.length} entradas`;
        journal.innerHTML = list.length ? list.map(entry => {
            const { glyph, text } = describe(entry);
            return `<div class="entry ${escape(entry.type)}"><span class="glyph">${glyph}</span><span>${escape(text)}</span><small>${escape(new Date(entry.time).toLocaleString())}</small></div>`;
        }).join('') : '<div class="empty">Aún no hay nada escrito.</div>';

        expedition = trip && typeof trip === 'object' ? trip : null;
        const pending = Object.entries(untold || {})
            .map(([n, line]) => ({ n: Number(n), ...parseTale(line) }))
            .filter(tale => tale.text)
            .sort((a, b) => a.n - b.n);
        const total = pending.reduce((sum, tale) => sum + tale.perMille, 0);
        const deaths = Number(expedition?.deaths) || 0;
        $('.trip').textContent = expedition?.on
            ? `Expedición ${expedition.no}${deaths ? ` · ${deaths} caída${deaths > 1 ? 's' : ''}` : ''}`
            : 'No estás de expedición';
        showClock();
        tales.innerHTML = (pending.length
            ? pending.map(tale => `<div class="entry exp"><span class="glyph">✨</span><span>${escape(tale.text)}.</span><small>Tier ${tale.tier}</small></div>`).join('')
              + `<div class="hint">${pending.length} relato${pending.length > 1 ? 's' : ''} sin contar, unos +${Math.floor(total / 10)} % de nivel. Se cuentan al Cronista, junto al tablero de cada ciudad.</div>`
            : '<div class="empty">Nada sin contar.</div>');
    }

    const select = name => {
        tab = name;
        for (const button of win.body.querySelectorAll('.tabs button')) button.classList.toggle('on', button.dataset.tab === name);
        for (const pane of win.body.querySelectorAll('.pane')) pane.hidden = pane.dataset.pane !== name;
        stopClock();
        if (name === 'tales') clock = setInterval(showClock, 30000);
    };
    for (const button of win.body.querySelectorAll('.tabs button')) button.addEventListener('click', () => select(button.dataset.tab));

    const open = () => { win.show(); select(tab); refresh(); };
    const close = () => { win.hide(); stopClock(); };
    const toggle = () => { if (win.isOpen()) close(); else open(); };

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
        if (!value && win.isOpen()) close();
    };
    api.on('map:enter', () => {
        $('.name').textContent = api.snapshot()?.player?.name || '';
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
