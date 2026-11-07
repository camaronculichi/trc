/*
 * Pantalla de carga: avanza conforme cargan las imágenes (no lazy) y el video de fondo.
 * Si #page-loader tiene data-manual, espera a que la página llame PageLoader.begin()
 * (por ejemplo, después de leer el menú de Firebase).
 */
(function () {
    var loader = document.getElementById('page-loader');
    if (!loader) { window.PageLoader = { begin: function () {} }; return; }

    var fill = loader.querySelector('.loader-bar-fill');
    var pct = loader.querySelector('.loader-percent');
    var water = loader.querySelector('.loader-water');
    var done = false;
    var started = false;
    var shown = 0;

    function setProgress(p) {
        if (p < shown) return;
        shown = p;
        fill.style.width = p + '%';
        pct.textContent = Math.round(p) + '%';
        water.style.transform = 'translateY(' + (100 - p) + '%)';
    }

    function finish() {
        if (done) return;
        done = true;
        setProgress(100);
        setTimeout(function () {
            loader.classList.add('loader-hidden');
            document.documentElement.classList.remove('is-loading');
            setTimeout(function () { loader.remove(); }, 700);
        }, 350);
    }

    function start() {
        if (started) return;
        started = true;
        var base = shown; // progreso ya mostrado mientras se esperaban los datos
        var imgs = Array.prototype.filter.call(
            document.querySelectorAll('img:not([loading="lazy"])'),
            function (img) { return !loader.contains(img) && img.getAttribute('src'); }
        );
        var videos = document.querySelectorAll('video[data-preload]');
        var total = imgs.length + videos.length + 1; // +1 = fuentes
        var loaded = 0;

        function tick() {
            loaded++;
            setProgress(Math.min(99, base + (loaded / total) * (100 - base)));
            if (loaded >= total) finish();
        }

        function once(fn) {
            var called = false;
            return function () { if (!called) { called = true; fn(); } };
        }

        imgs.forEach(function (img) {
            if (img.complete) { tick(); return; }
            var t = once(tick);
            img.addEventListener('load', t);
            img.addEventListener('error', t);
        });

        Array.prototype.forEach.call(videos, function (v) {
            if (v.readyState >= 3) { tick(); return; }
            var t = once(tick);
            v.addEventListener('canplay', t);
            v.addEventListener('error', t);
            setTimeout(t, 5000); // si el video no responde, no bloquear la página
        });

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(tick, tick);
        } else {
            tick();
        }
    }

    window.PageLoader = { begin: start, finish: finish };

    // Seguridad: nunca dejar la pantalla de carga atorada
    setTimeout(finish, 12000);

    if (loader.hasAttribute('data-manual')) {
        // Mientras llegan los datos, avanzar poco a poco hasta 30%
        var creep = setInterval(function () {
            if (started || done) { clearInterval(creep); return; }
            setProgress(Math.min(30, shown + 3));
        }, 250);
        return;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
