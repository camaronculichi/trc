/* Pantalla de carga: avanza conforme cargan las imágenes (no lazy) y el video de fondo */
(function () {
    var loader = document.getElementById('page-loader');
    if (!loader) return;

    var fill = loader.querySelector('.loader-bar-fill');
    var pct = loader.querySelector('.loader-percent');
    var water = loader.querySelector('.loader-water');
    var done = false;

    function setProgress(p) {
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
        var imgs = Array.prototype.filter.call(
            document.querySelectorAll('img:not([loading="lazy"])'),
            function (img) { return !loader.contains(img); }
        );
        var videos = document.querySelectorAll('video[data-preload]');
        var total = imgs.length + videos.length + 1; // +1 = fuentes
        var loaded = 0;

        function tick() {
            loaded++;
            setProgress(Math.min(99, (loaded / total) * 100));
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
            // si el video no responde, no bloquear la página
            setTimeout(t, 5000);
        });

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(tick, tick);
        } else {
            tick();
        }

        // Seguridad: nunca dejar la pantalla de carga atorada
        setTimeout(finish, 12000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
