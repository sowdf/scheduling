var marked = require('marked');
var renderer = new marked.Renderer();

renderer.heading = function (text, level) {
    console.log(level);

    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

    return '<h' + level + '><a name="' +
        escapedText +
        '" class="anchor" href="#' +
        escapedText +
        '"><span class="header-link"></span></a>' +
        text + '</h' + level + '>';
},

    console.log(marked('# heading+', { renderer: renderer }));

var html = `<pre><code class="lang-javascript">console.log(111);</code></pre>`;