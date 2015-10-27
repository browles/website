import {default as System, quat, vec3, transform} from './system.js';

const divcss = {
    'font-size': '2rem',
    color: 'white',
    'border-radius': '10px',
    margin: 0,
    padding: 0,
    position: 'absolute',
    'transform-style': 'preserve-3d',
    'text-align': 'center'
};

const contcss = {
    background: '#eee',
    height: '80%',
    width: '80%',
    left: '10%',
    top: '15%',
    position: 'absolute',
    overflow: 'scroll',
    '-webkit-overflow-scrolling': 'touch',
    'overflow-scrolling': 'touch'
};

const ld = document.createElement('script');
const jq = document.createElement('script');
ld.async = jq.async = 1;
ld.src = 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js';
jq.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js';
const pe = document.getElementsByTagName('script')[0];
pe.parentNode.insertBefore(ld, pe);
pe.parentNode.insertBefore(jq, pe);

window.onload = function() {
    const engine = new System();

    const $cont = $('<div id="container"></div>')
        .css(contcss)
        .appendTo('body');

    const scollerWidth = $cont.width();
    const num = 100;
    const panelHeight = $cont.height() * 0.1;
    const panelWidth = scollerWidth * 0.3;
    const spacing = panelHeight * 0.5;
    const scrollerHeight = spacing + num * (spacing + panelHeight);

    const $scroller = $('<div></div>')
        .css({width: '100%', height: scrollerHeight + 'px', overflow: 'hidden'})
        .appendTo($cont);

    const panels = [];
    for (let i = 0; i <= num; i++) {
        let $div = $('<div class="panel">'+(i + 1)+'</div>');
        let lr = 2  * Math.random() | 0;
        let body = engine.body({
            damping: 0,
            position: vec3(10 + (scollerWidth - panelWidth - 20) * lr, spacing + (spacing + panelHeight) * i,0)
        });
        body.translates = false;
        body.rotates = false;
        let anchor = vec3.copy(body.position);
        body.addConstraint(body.springConstraint(anchor, 0.01));

        $div.css(divcss);
        $div.css({
            background: lr === 0 ? 'grey' : 'blue',
            lineHeight: panelHeight + 'px',
            height: panelHeight + 'px',
            width: panelWidth + 'px',
            transform: `matrix3d(${transform(body)})`,
        });
        $div.appendTo($scroller);

        panels.push({$div, body, anchor, i});
    }

    function clamp(val, a, b) {
        return val < a ? a : val > b ? b : val;
    }

    let scrollTop = 0;
    let scrollDelta = 0;
    $('#container').scroll(_.throttle(function(e) {
        let curr = $cont.scrollTop();
        let h = $cont.height();
        scrollDelta = curr - scrollTop;
        scrollTop = curr;
        panels.forEach(function(p) {
            let pos = p.body.position;
            let d = scrollDelta * 0.01 * Math.min(0.1 * Math.abs(pos.y - (scrollTop + h * 0.5)), 1000) | 0;
            pos.y += clamp(d, -10, 10);
        });
    }, 16));

    function loop() {
        requestAnimationFrame(loop);
        engine.step();
        panels.forEach(function(p) {
            p.$div.css('transform', `matrix3d(${transform(p.body)})`);
        });
    }

    loop();
}
