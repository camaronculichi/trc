/*
 * Datos por defecto del sitio y del menú.
 * Se usan cuando Firebase todavía no tiene datos guardados (o si no hay internet).
 * Una vez que guardes desde admin.html, el sitio usa lo que está en Firebase.
 *
 * Imágenes: una ruta como "ENTRADAS.webp" es un archivo del sitio;
 * "img:XXXX" es una foto subida desde el admin (guardada en Firebase).
 */
(function () {
    function it(nombre, precio, extra) {
        return Object.assign({ nombre: nombre, precio: precio, desc: '', sub: false }, extra || {});
    }
    function half(precio) { return it('1/2 ORDEN', precio, { sub: true }); }
    function grupo(items, titulo) { return { titulo: titulo || '', items: items }; }

    window.CULICHI_DEFAULTS = {
        site: {
            logo: 'logo.webp',
            fondo: 'FONDOT.webp',
            facebook: 'https://www.facebook.com/share/1CFk2kdY1V/?mibextid=wwXIfr',
            whatsapp: '528714632883',
            telefono: '871 463 2883',
            direccion: 'Paseo de la Soledad #22, Torreón',
            maps: 'https://maps.app.goo.gl/SBPpbC7itaPebRxJ7',
            promo: 'procion.webp',
            promoActiva: true,
            formatoCarrusel: '4/5'
        },
        menu: {
            sections: [
                {
                    id: 'entradas', nombre: 'ENTRADAS', portada: 'ENTRADAS.webp',
                    fotos: ['galeentradas1.webp', 'galeentradas2.webp', 'galeentradas3.webp'],
                    grupos: [grupo([
                        it('AGUACHILES', '175'),
                        it('CAMARÓN Y PULPO PARA PICAR', '175'),
                        it('CHICHARRÓN DE PESCADO (orden)', '235'),
                        half('175'),
                        it('TOSTITOS C/CEVICHE DE PESCADO', '120'),
                        it('TOSTITOS C/CEVICHE DE CAMARÓN', '130'),
                        it('TOSTITOS MIXTOS', '140'),
                        it('ARROZ MARINERO', '160', { desc: 'Guisado con camarón, pulpo y surimi' }),
                        it('SASHIMI DE ATÚN', '175'),
                        it('CHICHARRÓN DE ATÚN', '230')
                    ])]
                },
                {
                    id: 'tostadas', nombre: 'TOSTADAS', portada: 'TOSTADAS.webp',
                    fotos: ['galeTOSTADAS1.webp', 'galeTOSTADAS2.webp', 'galeTOSTADAS3.webp'],
                    grupos: [grupo([
                        it('CEVICHE DE PESCADO', '40'),
                        it('CEVICHE DE CAMARÓN', '55'),
                        it('CULICHI ESPECIAL', '60'),
                        it('CAMARÓN ENTERO', '60'),
                        it('PULPO', '80'),
                        it('CALLO', '70'),
                        it('SURIMI', '45'),
                        it('AGUACATE', '30'),
                        it('AGUACHILE', '60'),
                        it('ATÚN', '60'),
                        it('LA SINALOENSE', '80', { desc: 'Ceviche de camarón, pulpo, camarón entero y salsas negras' }),
                        it('MANGO ATÚN', '80')
                    ])]
                },
                {
                    id: 'ceviche', nombre: 'CEVICHES', portada: 'CEVICHES.webp',
                    fotos: ['galeCEVICHES1.webp', 'galeCEVICHES2.webp'],
                    grupos: [grupo([
                        it('DE PESCADO', '175'), half('130'),
                        it('DE PESCADO CAMPECHANO', '200'), half('145'),
                        it('DE CAMARÓN', '195'), half('130'),
                        it('CULICHI DE CAMARÓN', '200'), half('145')
                    ])]
                },
                {
                    id: 'platillos', nombre: 'CAMARONES', portada: 'PLATILLOS_DE_CAMARONES.webp',
                    fotos: ['galePLATILLOS_DE_CAMARONES1.webp', 'galePLATILLOS_DE_CAMARONES2.webp', 'galePLATILLOS_DE_CAMARONES3.webp'],
                    grupos: [grupo([
                        it('EMPANIZADOS', '170'), half('120'),
                        it('MOJO DE AJO', '170'),
                        it('TOCINETA', '180'),
                        it('A LA DIABLA', '170'),
                        it('AL CHIPOTLE', '170'),
                        it('AL COCO', '180'),
                        it('PHILADELPHIA', '180')
                    ])]
                },
                {
                    id: 'cockteles', nombre: 'COCKTELES', portada: 'COCKTELES.webp',
                    fotos: ['galeCOCKTELES1.webp', 'galeCOCKTELES2.webp'],
                    grupos: [grupo([
                        it('CHICO', '85'), it('CHICO MIXTO', '95', { sub: true }),
                        it('MEDIANO', '115'), it('MEDIANO MIXTO', '140', { sub: true }),
                        it('GRANDE', '155'), it('GRANDE MIXTO', '180', { sub: true })
                    ])]
                },
                {
                    id: 'caldos', nombre: 'CALDOS', portada: 'CALDOS.webp',
                    fotos: ['galeCALDOS1.webp'],
                    grupos: [grupo([
                        it('DE PESCADO', '125'),
                        it('MIXTO', '160'),
                        it('DE CAMARÓN', '155'),
                        it('CONSOMÉ DE LITRO', '55')
                    ])]
                },
                {
                    id: 'bebidas', nombre: 'BEBIDAS', portada: 'BEBIDAS.webp',
                    fotos: ['galeBEBIDAS1.webp', 'galeBEBIDAS2.webp', 'galeBEBIDAS3.webp'],
                    grupos: [
                        grupo([it('Limonada mineral', '40'), it('Limonada natural', '35'), it('Agua de jamaica 355ml', '35'), it('Agua de horchata 355ml', '35'), it('Agua mineral 355ml', '35'), it('Refrescos 500ml', '35')], 'Bebidas sin alcohol'),
                        grupo([it('Chelado', '30'), it('Michelado', '35'), it('Clamato vaso', '35'), it('Chelado litro', '40'), it('Michelado litro', '45'), it('Clamato litro', '50')], 'Clamatos'),
                        grupo([it('Margarita', '130'), it('Vampiro', '130'), it('Paloma', '130'), it('Carajillo', '130')], 'Bebidas preparadas'),
                        grupo([it('Corona Extra', '37'), it('Victoria', '37'), it('Modelo especial', '40'), it('Negra modelo', '40'), it('Ultra', '40'), it('Familiar corona', '80'), it('Pacífico clara', '40'), it('Corona sin alcohol', '40')], 'Cervezas'),
                        grupo([it('Buchanans', '100'), it('Etiqueta negra', '100'), it('Etiqueta roja', '100'), it('Black and white', '70'), it('Jack Daniels', '110')], 'Whisky'),
                        grupo([it('Maestro dobel', '140'), it('1800 cristalino', '140'), it('Tradicional plata', '85'), it('Tradicional reposado', '85'), it('Don julio 70', '150'), it('Don julio reposado', '140')], 'Tequilas'),
                        grupo([it('Baileys', '100'), it('Licor 43', '110'), it('Jagermeister', '110')], 'Licores'),
                        grupo([it('Bacardi blanco', '65'), it('Matusalem clásico', '120')], 'Ron'),
                        grupo([it('Torres 10', '100'), it('Azteca de oro', '70')], 'Brandy'),
                        grupo([it('Smirnoff tamarindo', '70'), it('Absolut azul', '85'), it('Absolut citron', '90')], 'Vodka'),
                        grupo([it('400 conejos', '140'), it('Mitre', '130')], 'Mezcal'),
                        grupo([it('Tanqueray', '140'), it('Bombay', '140')], 'Ginebra')
                    ]
                },
                {
                    id: 'filetes', nombre: 'FILETES', portada: 'FILETES.webp',
                    fotos: ['galeFILETES1.webp'],
                    grupos: [grupo([
                        it('FILETE EMPANIZADO', '135'), half('100'),
                        it('FILETE A LA DIABLA', '140'),
                        it('FILETE AL CHIPOTLE', '140'),
                        it('FILETE AL MOJO DE AJO', '140'),
                        it('FILETE A LA PLANCHA', '140'),
                        it('FILETE SALSA VERDE', '140'),
                        it('FILETE A LA VERACRUZANA', '150'),
                        it('FILETE CULICHI', '175')
                    ])]
                },
                {
                    id: 'kids', nombre: 'PARA LOS NIÑOS', portada: 'KIDS.webp',
                    fotos: ['galeKIDS1.webp', 'galeKIDS2.webp', 'galeKIDS3.webp'],
                    grupos: [grupo([
                        it('NUGGETS DE POLLO C/PAPAS A LA FRANCESA', '95'),
                        it('HAMBURGUESA DE RES C/PAPAS A LA FRANCESA', '95'),
                        it('ORDEN DE PAPAS A LA FRANCESA', '60'),
                        it('DEDOS DE QUESO', '95')
                    ])]
                },
                {
                    id: 'tacos', nombre: 'TACOS', portada: 'TACOS.webp',
                    fotos: ['galeTACOS1.webp', 'galeTACOS2.webp'],
                    grupos: [grupo([
                        it('TACO CULICHI', '50'),
                        it('TACO CAPEADO', '50'),
                        it('TACO DE MARLIN', '50'),
                        it('TACO DE ATÚN', '65'),
                        it('TACO TOCINETA', '60'),
                        it('QUESADILLA DE CAMARÓN', '50')
                    ])]
                },
                {
                    id: 'postre', nombre: 'POSTRES', portada: 'POSTRE.webp',
                    fotos: ['galepostre1.webp'],
                    grupos: [grupo([it('PAY', '80'), it('PASTEL', '90')])]
                },
                {
                    id: 'pescadofrito', nombre: 'PESCADO FRITO', portada: 'PESCADO_FRITO.webp',
                    fotos: ['galePESCADOFRITO1.webp'],
                    grupos: [grupo([it('MOJARRA', '175 kg')])]
                },
                {
                    id: 'molcajetes', nombre: 'MOLCAJETES', portada: 'MOLCAJETES.webp',
                    fotos: ['galeMOLCAJETES1.webp'],
                    grupos: [grupo([
                        it('MOLCAJETE DE GUACAMOLE', '90'),
                        it('MOLCAJETE MATA CRUDAS', '199'),
                        it('MOLCAJETE CULIACÁN', '199'),
                        it('MOLCAJETE SINALOA', '199')
                    ])]
                }
            ]
        }
    };
})();
