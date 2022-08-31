( function () {
    self = this;
    self.voice = null;
    self.statusplay = 'off';
    let deferredPrompt = null;//install prompt
    const customText = {
        1: 'Necesito a los bomberos',
        2: 'Necesito una ambulacia',
        3: 'Quiero comprar entradas',
        4: 'Me podria indicar esta calle'
    }

    // logica de eventos
    const $ = selector => document.querySelector( selector );
    self.events = {
        initApplication: function () {
            console.log('arranco...');
            self.events.btnPlay();
            self.events.btnClean();
            self.events.btnInstall();
            self.events.btnNavigate();
            self.views.cardVoices();

            var instance = new SiriWave({
                container: document.getElementById("custom-loading"),
                width: 500,
                height: 500,
                style: 'ios9',
                curveDefinition: [
                    {
                      color: "255,255,255",
                      supportLine: true,
                    },
                    {
                      color: "15, 82, 169",
                    },
                    {
                      color: "173, 57, 76",
                    },
                    {
                      color: "48, 220, 155",
                    }],
                ratio: 1.5,
                speed: 0.2,
                amplitude: 2.5,
                frequency: 6,  // frequency (iOS style only)
                color: "#fff", 
                cover: false,//cover container
                autostart: true, //autostart
                pixelDepth: 0.02, //pixel depth
                lerpSpeed: 0.1, //lerp speed
            });
            instance.start();

        },
        btnPlay: function (){
            document.getElementById('btn-speak').addEventListener('click', function () {
                this.disabled = true;
                let msg = document.getElementById('text-input').value;
                let statusPlay = 'ok';
                //vamos a validar
                if(msg === ''){
                    statusPlay = 'vacio';
                    self.statusplay === 'on'
                }
                if (speechSynthesis.speaking ){
                    self.statusplay === 'on'
                    statusPlay = 'playing';
                } 
                
                if( self.statusplay === 'off') {
                    self.methods.playSpeak(msg);
                } else {
                    console.log('No reproducir porque '+ statusPlay)
                }
            })
        }, 
        btnClean: function (){
            $('#btn-clean').addEventListener('click', function () {
                $('#text-input').value = '';
            });
        },
        btnInstall: function (){
            $('#btn-install').addEventListener('click', function () {
                if (deferredPrompt) deferredPrompt.prompt();
            });
        },
        navigate: function (link){
            document.querySelectorAll('.section-app').forEach( elem => {
                elem.style.display = 'none';
            });
            document.getElementById(link).style.display = 'block';
        },
        btnNavigate: function(){
            let linksFooter = document.querySelectorAll('.link-section');
            linksFooter.forEach(link => {
                link.addEventListener('click', function (event) {
                    self.events.navigate(event.target.getAttribute('data-link'));
                });
            });
        }
    }
    //logica de las vistas
    self.views = {
        cardVoices: function(){
            document.querySelectorAll('.container-pic').forEach( elem => {
                elem.addEventListener('click', function (event) {
                    let seleted = event.target.getAttribute('data-msj');
                    self.methods.playCard(seleted);
                }, false);
            });
        }
    }
    
    self.methods = {
        playSpeak: function ( msg ) {
            console.log(msg);
            if ( !('speechSynthesis' in window) ){
                console.log('Servicio de voz no disponible');
                return;
            }

            if (self.voice === null){
                self.methods.getVoices();
            }

            const pronunciacion = new SpeechSynthesisUtterance(msg);
            pronunciacion.voice = self.voice;
            speechSynthesis.speak(pronunciacion);

            //empezo a reproducir sonido
            pronunciacion.onstart = function(event) {
                self.methods.openAnimation();
            }
            //finalizo la reproduccion
            pronunciacion.onend = function(event) {
                document.getElementById('btn-speak').disabled = false;
                self.methods.closeAnimation();
            }
        },
        getVoices: function (event, idioma = "es") {
            const voces = speechSynthesis.getVoices().filter(v=>v.lang.startsWith(idioma));
            if (voces .length > 0){
                self.voice = voces[5];
            } else {
                //idioma no español
                if (idioma.length == 5){
                    self.methods.getVoices(event, idioma.substring(0,2))
                }
            }
        },
        openAnimation: function () {
            document.getElementById('custom-loading').style.display = 'block';
        },
        closeAnimation: function () {
            document.getElementById('custom-loading').style.display = 'none';
        },
        playCard: function ( cardSelected ) {
            self.methods.playSpeak(customText[cardSelected]);
        }
    }

    self.events.initApplication();

     //registro el service worker
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("/serviceworker.js")
            .then(res => console.log("service worker registrado"))
            .catch(err => console.log("service worker no registrado", err))
        })
    }

    /* evento para el boton instalar */
    window.addEventListener("beforeinstallprompt", event => {
        deferredPrompt = event;
        console.log("deferredPrompt");
        $("#btn-install").style.display = "block";
    });
}())