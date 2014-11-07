'use strict';

var Feedback = (function() {

    var canvas, regions, regionsData, mode, mousedown, mouseup, mousemove, captureDataUrl;

    var exports = {};

    exports.show = function() {
        $$$('.feedback-container').toggleClass('active');
    }

    exports.startCapture = function() {

        if(!$('feedback-ext-installed')) {
            $$$('.feedback .attach i').addClass('loading');
            chrome.webstore.install('https://chrome.google.com/webstore/detail/ccgjjlcljkfnkobbdioacacpkpnbmjoa',
                function() {
                    window.location.reload();
                },
                function() {
                    $$$('.feedback .attach i').removeClass('loading');
                })
            return;
        }

        mode = 'highlight';
        regionsData = [];

        $$$('.feedback .attach-form').show();
        $$$('.feedback .feedback-form').hide();


        exports.changeMode(mode);

        initCanvas();
    }

    exports.changeMode = function(newMode) {
        mode = newMode;
        $$$('.feedback .attach-form .attach-mode[data-mode="'+mode+'"]').addClass('active');
        $$$('.feedback .attach-form .attach-mode[data-mode!="'+mode+'"]').removeClass('active');
    }

    exports.saveCapture = function() {

        $$$('.feedback').hide();
        $$$(regions).addClass('wait');

        function callback(event) {
            if(event.data.type && event.data.type == 'kg.feedback.captureCallback') {
                cleanUp();
                var img = $$$('.feedback .feedback-form .attach-img img').get(0);
                img.src = event.data.dataUrl;
                img.onclick = function() {
                    window.open(event.data.dataUrl);
                }
                $$$('.feedback .feedback-form .attach-img').show();
                $$$('.feedback .feedback-form .attach').hide();
                window.removeEventListener('message', callback);
                $$$('.feedback').show();
                $$$('.feedback .attach-form').hide();
                $$$('.feedback .feedback-form').show();

                captureDataUrl = event.data.dataUrl;
            }

        }
        window.addEventListener('message', callback);

        setTimeout(function() {
            window.postMessage({type: 'kg.feedback.capture'}, "*");
        }, 100);
    }

    exports.cancelCapture = function() {

        cleanUp();

        $$$('.feedback .attach-form').hide();
        $$$('.feedback .feedback-form').show();
    }

    exports.removeCapture = function() {
        $$$('.feedback .feedback-form .attach-img').hide();
        $$$('.feedback .feedback-form .attach-img img').get(0).src = '';
        if(window.chrome && chrome.webstore)
            $$$('.feedback .feedback-form .attach').show();
        captureDataUrl = null;
    }

    exports.send = function() {
        var data = {
            name: $$$('.feedback-form input[name="name"]').val(),
            email: $$$('.feedback-form input[name="email"]').val(),
            subject: $$$('.feedback-form input[name="subject"]').val(),
            message: $$$('.feedback-form textarea[name="message"]').val(),
            allow_publish: $$$('.feedback-form input[name="allow_publish"]').attr('checked') ? 1 : 0,
            browser: JSON.stringify($$$.browser)
        };

        if(captureDataUrl)
            data.upload = captureDataUrl;

        $$$('.feedback button').attr('disabled','disabled');

        $$$.post('/api/zendesk/create-ticket', data, function(response) {
            flush();
            $$$('.feedback .sent').show();
        });

        $$$('.feedback .loading').show();
    }

    function flush() {
        $$$('.feedback .loading').hide();
        exports.removeCapture();
        $$$('.feedback-form input:not(:disabled), .feedback-form textarea').val('');
        $$$('.feedback button').removeAttr('disabled');
    }


    function initCanvas() {

        if(canvas)
            cleanUp();

        canvas = document.createElement('canvas');
        canvas.className = 'feedback-canvas';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        regions = document.createElement('div');
        regions.className = 'feedback-regions';
        document.body.appendChild(regions);

        var ctx = canvas.getContext('2d');

        var startPoint = [], endPoint = [], clicked = false;

        function redraw() {
            ctx.globalAlpha = 0.6;
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillRect(0,0,canvas.width,canvas.height);
            for(var i=0;i<regionsData.length;i++)
                if(regionsData[i].type == 'highlight')
                    ctx.clearRect(regionsData[i].x, regionsData[i].y, regionsData[i].w, regionsData[i].h);

            if(clicked) {
                if(mode == 'highlight') {
                    ctx.clearRect(startPoint[0], startPoint[1], endPoint[0]-startPoint[0], endPoint[1]-startPoint[1]);
                }
                else {
                    ctx.globalAlpha = 0.5;
                    ctx.fillRect(startPoint[0], startPoint[1], endPoint[0]-startPoint[0], endPoint[1]-startPoint[1]);
                }
            }
        }

        redraw();

        mousedown = function(event) {
            if(clicked)
                return;
            clicked = true;
            startPoint = [event.clientX, event.clientY];
            endPoint = [event.clientX+1, event.clientY+1];
            redraw();
            event.preventDefault();
        }

        mousemove = function(event) {
            if(!clicked) return;
            endPoint = [event.clientX+1, event.clientY+1];
            redraw();
            event.preventDefault();
        }

        mouseup = function(event) {
            endPoint = [event.clientX, event.clientY];
            redraw();
            clicked = false;
            event.preventDefault();

            setTimeout(createRegion, 0);
        }

        regions.addEventListener("mousedown", mousedown);
        regions.addEventListener("mousemove", mousemove);
        regions.addEventListener("mouseup", mouseup);

        function createRegion() {

            var w = endPoint[0] - startPoint[0],
                h = endPoint[1] - startPoint[1],
                x,y;
            if(w > 0)
                x = startPoint[0];
            else {
                x = endPoint[0];
                w = -w;
            }
            if(h > 0)
                y = startPoint[1];
            else {
                y = endPoint[1];
                h = -h;
            }

            if(w > 20 && h > 20) {

                var region = document.createElement('div');
                region.setAttribute('style', 'left: '+x+'px; top: '+y+'px; width: '+(w-1)+'px; height: '+(h-1)+'px');
                if(mode == 'highlight')
                    region.className = 'feedback-region feedback-region-highlight';
                else
                    region.className = 'feedback-region feedback-region-blackout';
                regions.appendChild(region);

                var regionData = {x: x, y: y, w: w, h: h, type: mode};
                regionsData.push(regionData);

                var close = document.createElement('i');
                region.appendChild(close);
                close.addEventListener('mousedown', function(event) {
                    event.stopImmediatePropagation();
                });
                close.addEventListener('mouseup', function(event) {
                    event.stopImmediatePropagation();
                });
                close.addEventListener('click', function(event) {
                    regions.removeChild(region);
                    regionData.type = 'deleted';
                    redraw();
                })
            }

            redraw();
        }
    }



    function cleanUp() {
        document.body.removeChild(canvas);
        canvas = null;

        document.body.removeChild(regions);
        regions = null;

        regionsData = [];
    }


    return exports;
})();