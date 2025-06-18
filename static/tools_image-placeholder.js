window.addEventListener('DOMContentLoaded', () => {
    const width = document.getElementById('width');
    const height = document.getElementById('height');
    const format = document.getElementById('format');
    const bgColor = document.getElementById('bgColor');
    const textColor = document.getElementById('textColor');
    const customText = document.getElementById('customText');
    const font = document.getElementById('font');
    const retina = document.getElementById('retina');
    const preview = document.getElementById('placeholderPreview');
    const urlDisplay = document.getElementById('urlDisplay');
    const copyBtn = document.getElementById('copyBtn');
    const saveBtn = document.getElementById('saveBtn');

    function update() {
        let w = width.value || 400;
        let h = height.value;
        let size = h ? `${w}x${h}` : `${w}`;
        if (retina.value !== '1') {
            size += `@${retina.value}x`;
        }
        let path = size;
        let bg = bgColor.value.replace('#', '');
        let txt = textColor.value.replace('#', '');
        if (bg && txt) {
            path += `/${bg}/${txt}`;
        }
        let url = `https://placehold.co/${path}.${format.value}`;
        let params = [];
        if (customText.value.trim()) {
            const encoded = customText.value.trim().replace(/ /g, '+').replace(/\n/g, '\n');
            params.push(`text=${encoded}`);
        }
        if (font.value) {
            params.push(`font=${encodeURIComponent(font.value)}`);
        }
        if (params.length) {
            url += '?' + params.join('&');
        }
        preview.src = url;
        urlDisplay.textContent = url;
        saveBtn.href = url;
        saveBtn.download = `placeholder.${format.value}`;
    }

    [width, height, format, bgColor, textColor, customText, font, retina].forEach(el => {
        el.addEventListener('input', update);
    });
    update();

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(urlDisplay.textContent);
    });
});
