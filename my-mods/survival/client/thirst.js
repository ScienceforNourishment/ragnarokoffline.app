export function initThirstMeter(api) {
    const root = document.documentElement;
    const previousMeterOffset = root.style.getPropertyValue('--thirst-mod-meter-offset');
    const previousMeterOffsetPriority = root.style.getPropertyPriority('--thirst-mod-meter-offset');
    root.style.setProperty('--thirst-mod-meter-offset', '54px');

    const style = document.createElement('style');
    style.textContent = `
        .thirst-mod-meter {
            position: fixed;
            right: 12px;
            bottom: calc(58px + env(safe-area-inset-bottom, 0px));
            z-index: 100000;
            width: 190px;
            box-sizing: border-box;
            padding: 8px 10px;
            border: 1px solid #79a9c0;
            border-radius: 4px;
            background: linear-gradient(180deg, #202a30, #171717);
            color: #e4f2f7;
            font: 12px Tahoma, Arial, sans-serif;
            box-shadow: 0 2px 8px #0009;
            pointer-events: none;
        }
        .thirst-mod-meter[hidden] { display: none; }
        .thirst-mod-meter__heading {
            display: flex;
            align-items: center;
            gap: 6px;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .thirst-mod-meter__warning {
            display: inline-grid;
            width: 16px;
            height: 16px;
            place-items: center;
            border: 1px solid #9bd7eb;
            border-radius: 50%;
            background: #246781;
            color: #fff;
            font-weight: bold;
            cursor: help;
        }
        .thirst-mod-meter__warning[hidden] { display: none; }
        .thirst-mod-tooltip {
            position: fixed;
            z-index: 100001;
            max-width: 260px;
            padding: 7px 9px;
            border: 1px solid #79a9c0;
            border-radius: 4px;
            background: #171717;
            color: #e4f2f7;
            font: 12px Tahoma, Arial, sans-serif;
            line-height: 1.4;
            box-shadow: 0 2px 8px #0009;
            pointer-events: none;
        }
        .thirst-mod-tooltip[hidden] { display: none; }
        .thirst-mod-meter__track {
            height: 9px;
            overflow: hidden;
            border: 1px solid #587d8d;
            background: #100f0d;
        }
        .thirst-mod-meter__fill {
            width: 100%;
            height: 100%;
            background: #58a9c8;
            transition: width 180ms ease, background-color 180ms ease;
        }
    `;
    document.head.append(style);

    const meter = document.createElement('section');
    meter.className = 'thirst-mod-meter';
    meter.setAttribute('role', 'group');
    meter.setAttribute('aria-label', 'Nivel de sed');
    meter.hidden = true;

    const heading = document.createElement('div');
    heading.className = 'thirst-mod-meter__heading';
    const label = document.createElement('span');
    label.textContent = 'Sed';
    const warning = document.createElement('span');
    warning.className = 'thirst-mod-meter__warning';
    warning.textContent = '!';
    const warningDescription = 'Agotamiento por sed: velocidad de movimiento y las seis estadisticas reducidas un 20%.';
    warning.setAttribute('role', 'img');
    warning.setAttribute('aria-label', warningDescription);
    warning.setAttribute('aria-describedby', 'thirst-mod-tooltip');
    warning.hidden = true;
    const value = document.createElement('output');
    value.textContent = '-- / 100';
    heading.append(label, warning, value);

    const track = document.createElement('div');
    track.className = 'thirst-mod-meter__track';
    track.setAttribute('role', 'meter');
    track.setAttribute('aria-label', 'Sed');
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', '100');
    const fill = document.createElement('div');
    fill.className = 'thirst-mod-meter__fill';
    track.append(fill);
    meter.append(heading, track);
    document.body.append(meter);

    const tooltip = document.createElement('div');
    tooltip.id = 'thirst-mod-tooltip';
    tooltip.className = 'thirst-mod-tooltip';
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
        if (command !== 'thirst') return;
        const match = /^update (100|[1-9]?\d)$/.exec(text);
        if (!match) {
            console.warn('[survival] ignored an invalid thirst update from the server');
            return;
        }

        const thirst = Number(match[1]);
        value.textContent = `${thirst} / 100`;
        track.setAttribute('aria-valuenow', String(thirst));
        fill.style.width = `${thirst}%`;
        fill.style.backgroundColor = thirst === 0 ? '#b84438' : thirst <= 20 ? '#d58c3e' : '#58a9c8';
        warning.hidden = thirst !== 0;
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
        if (previousMeterOffset) {
            root.style.setProperty('--thirst-mod-meter-offset', previousMeterOffset, previousMeterOffsetPriority);
        } else {
            root.style.removeProperty('--thirst-mod-meter-offset');
        }
    });
}
