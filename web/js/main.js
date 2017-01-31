
var highexp = {};

(function () {
    

    highexp.init = function () {
        var options = document.getElementById('options'),
            format = document.getElementById('format'),
            width = document.getElementById('width'),
            scale = document.getElementById('scale'),
            constr = document.getElementById('constr'),
            callback = document.getElementById('callback'),
            error = document.getElementById('error'),
            btnPreview = document.getElementById('preview'),
            btnDownload = document.getElementById('download'),
            preview = document.getElementById('preview-container'),
            styledMode = document.getElementById('styledMode'),
            cssNode = document.getElementById('css'),
            rawJsNode = document.getElementById('rawJS'),
            asyncRendering = document.getElementById('asyncRendering'),

            optionsCM,
            callbackCM,
            cssCM,
            jsCm,

            mime = {
                'image/png': 'png',
                'image/jpeg': 'jpg',
                'image/svg+xml': 'xml',
                'application/pdf': 'pdf'
            }
        ;

        optionsCM = CodeMirror.fromTextArea(options, {
            lineNumbers: true,
            mode: 'javascript'
        });

        callbackCM = CodeMirror.fromTextArea(callback, {
            lineNumbers: true,
            mode: 'javascript'
        });

        cssCM = CodeMirror.fromTextArea(cssNode, {
            lineNumbers: true,
            mode: 'css'
        });

        jsCm = CodeMirror.fromTextArea(rawJsNode, {
            lineNumbers: true,
            mode: 'javascript'
        });

        function ajax(url, data, yes, no) {
            var r = new XMLHttpRequest();
            r.open('post', url, true);
            r.setRequestHeader('Content-Type', 'application/json');
            r.onreadystatechange = function () {
                if (r.readyState === 4 && r.status === 200) {  
                    if (yes) {
                        yes(r.responseText);
                    }                 
                } else if (r.readyState === 4) {
                    if (no) {
                        no(r.status);
                    }
                }                    
            };
            r.send(JSON.stringify(data));
        }

        function toStructure(async) {     
            var resources,
                js = jsCm.getValue(),
                css = cssCM.getValue()
            ;

            if (js || css) {
                resources = {
                    js: js || false,
                    css: css || false
                };
            }

            return {
                infile: optionsCM.getValue(),
                width: width.value.length ? width.value : false,
                scale: scale.value.length ? scale.value : false,
                constr: constr.value,
                callback: callbackCM.getValue(),
                styledMode: styledMode.value === '1',
                type: format.value,
                asyncRendering: asyncRendering.value === '1',
                async: async,
                resources: resources
            };
        }

        btnPreview.onclick = function () {
            preview.innerHTML = '<div class="info">Processing chart, please wait..</div>';

            ajax(
                '/', 
                toStructure(true),
                function (data) {
                    var f = document.createElement('iframe');
                    console.log(data);
                    if (format.value === 'image/png' || format.value === 'image/jpeg' || format.value === 'image/svg+xml') {
                        preview.innerHTML = '<img src="/' + data + '"/>'                        
                    } else {// if (format.value === 'pdf') {
                        preview.innerHTML = '';
                        try {
                            f.src = '/' + data + '?embedded=true';
                            f.frameborder = 0;
                            f.style.width = '100%';
                            f.style.height = '100%';
                            preview.appendChild(f);                            
                        } catch (e) {
                            preview.innerHTML = e;
                        }
                    }
                },
                function (r) {
                    if (r == 429) {
                        preview.innerHTML = '<div class="info">Too many requests - please try again later</div>';                        
                    } else {
                        preview.innerHTML = '<div class="info">Error when processing chart: Please verify that the options are valid.</div>';                        
                    }
                }

            );
        };

        btnDownload.onclick = function () {
            ajax(
                '/',
                toStructure(true),
                function (data) {
                    var l = document.createElement('a');
                    l.download = 'chart.' + mime[format.value];
                    l.href = data;
                    document.body.appendChild(l);
                    l.click();
                    document.body.removeChild(l);
                },
                function () {

                }
            );
        };

    };
})();

