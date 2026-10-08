export default function init(parameters, api) {
    if (api?.version !== 1) throw new Error('hunger-mod requires client API 1');

    const style = document.createElement('style');
    style.textContent = `
        .hunger-mod-meter {
            position: fixed;
            right: 12px;
            bottom: calc(58px + env(safe-area-inset-bottom, 0px));
            z-index: 100000;
            width: 190px;
            box-sizing: border-box;
            padding: 8px 10px;
            border: 1px solid #c0a66b;
            border-radius: 4px;
            background: linear-gradient(180deg, #29241c, #171717);
            color: #f2e8d0;
            font: 12px Tahoma, Arial, sans-serif;
            box-shadow: 0 2px 8px #0009;
            pointer-events: none;
        }
        .hunger-mod-meter[hidden] { display: none; }
        .hunger-mod-meter__heading {
            display: flex;
            align-items: center;
            gap: 6px;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .hunger-mod-meter__warning {
            display: inline-grid;
            width: 16px;
            height: 16px;
            place-items: center;
            border: 1px solid #f0c36b;
            border-radius: 50%;
            background: #9e3028;
            color: #fff4dc;
            font-weight: bold;
            cursor: help;
        }
        .hunger-mod-meter__warning[hidden] { display: none; }
        .hunger-mod-tooltip {
            position: fixed;
            z-index: 100001;
            max-width: 260px;
            padding: 7px 9px;
            border: 1px solid #c0a66b;
            border-radius: 4px;
            background: #171717;
            color: #f2e8d0;
            font: 12px Tahoma, Arial, sans-serif;
            line-height: 1.4;
            box-shadow: 0 2px 8px #0009;
            pointer-events: none;
        }
        .hunger-mod-tooltip[hidden] { display: none; }
        .hunger-mod-meter__track {
            height: 9px;
            overflow: hidden;
            border: 1px solid #84724f;
            background: #100f0d;
        }
        .hunger-mod-meter__fill {
            width: 100%;
            height: 100%;
            background: #77aa52;
            transition: width 180ms ease, background-color 180ms ease;
        }
    `;
    document.head.append(style);

    const meter = document.createElement('section');
    meter.className = 'hunger-mod-meter';
    meter.setAttribute('role', 'group');
    meter.setAttribute('aria-label', 'Nivel de hambre');
    meter.hidden = true;

    const heading = document.createElement('div');
    heading.className = 'hunger-mod-meter__heading';
    const label = document.createElement('span');
    label.textContent = 'Hambre';
    const warning = document.createElement('span');
    warning.className = 'hunger-mod-meter__warning';
    warning.textContent = '!';
    const warningDescription = 'Agotamiento: velocidad de movimiento y las seis estadísticas reducidas un 20%.';
    warning.setAttribute('role', 'img');
    warning.setAttribute('aria-label', warningDescription);
    warning.setAttribute('aria-describedby', 'hunger-mod-tooltip');
    warning.hidden = true;
    const value = document.createElement('output');
    value.textContent = '-- / 100';
    heading.append(label, warning, value);

    const track = document.createElement('div');
    track.className = 'hunger-mod-meter__track';
    track.setAttribute('role', 'meter');
    track.setAttribute('aria-label', 'Hambre');
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', '100');
    const fill = document.createElement('div');
    fill.className = 'hunger-mod-meter__fill';
    track.append(fill);
    meter.append(heading, track);
    document.body.append(meter);

    const tooltip = document.createElement('div');
    tooltip.id = 'hunger-mod-tooltip';
    tooltip.className = 'hunger-mod-tooltip';
    tooltip.textContent = warningDescription;
    tooltip.setAttribute('role', 'tooltip');
    tooltip.hidden = true;
    document.body.append(tooltip);

    let pointerX = -1;
    let pointerY = -1;
    const updateTooltip = () => {
        if (warning.hidden) {
            tooltip.hidden = true;
            return;
        }
        const rect = warning.getBoundingClientRect();
        const inside = pointerX >= rect.left && pointerX <= rect.right
            && pointerY >= rect.top && pointerY <= rect.bottom;
        tooltip.hidden = !inside;
        if (inside) {
            tooltip.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - tooltip.offsetWidth - 8))}px`;
            tooltip.style.top = `${Math.min(rect.bottom + 6, window.innerHeight - tooltip.offsetHeight - 8)}px`;
        }
    };
    const onPointerMove = event => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        updateTooltip();
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    api.on('server:event', ({ command, text }) => {
        if (command !== 'hunger') return;
        const match = /^update (100|[1-9]?\d)$/.exec(text);
        if (!match) {
            console.warn('[hunger-mod] ignored an invalid hunger update from the server');
            return;
        }

        const hunger = Number(match[1]);
        value.textContent = `${hunger} / 100`;
        track.setAttribute('aria-valuenow', String(hunger));
        fill.style.width = `${hunger}%`;
        fill.style.backgroundColor = hunger === 0 ? '#b84438' : hunger <= 20 ? '#d58c3e' : '#77aa52';
        warning.hidden = hunger !== 0;
        meter.hidden = false;
        updateTooltip();
    });

    api.on('connection', ({ status }) => {
        if (status !== 'connected') {
            meter.hidden = true;
            tooltip.hidden = true;
        }
    });

    api.cleanup(() => {
        window.removeEventListener('pointermove', onPointerMove);
        meter.remove();
        tooltip.remove();
        style.remove();
    });
}
