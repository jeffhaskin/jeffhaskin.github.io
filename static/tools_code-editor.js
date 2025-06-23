window.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('modeSelect');
    const wrapToggle = document.getElementById('wrapToggle');
    const darkToggle = document.getElementById('darkToggle');
    const findInput = document.getElementById('findInput');
    const replaceInput = document.getElementById('replaceInput');
    const regexToggle = document.getElementById('regexToggle');
    const selectionToggle = document.getElementById('selectionToggle');
    const findBtn = document.getElementById('findBtn');
    const replaceBtn = document.getElementById('replaceBtn');
    const replaceAllBtn = document.getElementById('replaceAllBtn');
    const statusBar = document.getElementById('statusBar');

    const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
        lineNumbers: true,
        mode: modeSelect.value,
        theme: darkToggle.checked ? 'darcula' : 'default',
        lineWrapping: wrapToggle.checked
    });

    function updateCounts() {
        const text = editor.getValue();
        const lines = editor.lineCount();
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        statusBar.textContent = `Lines: ${lines} | Chars: ${chars} | Words: ${words}`;
    }

    editor.on('change', updateCounts);
    updateCounts();

    modeSelect.addEventListener('change', () => {
        editor.setOption('mode', modeSelect.value);
    });
    wrapToggle.addEventListener('change', () => {
        editor.setOption('lineWrapping', wrapToggle.checked);
    });
    darkToggle.addEventListener('change', () => {
        editor.setOption('theme', darkToggle.checked ? 'darcula' : 'default');
    });

    let searchCursor = null;
    let searchEnd = null;

    function getQuery() {
        if (regexToggle.checked) {
            try { return new RegExp(findInput.value, 'g'); } catch(e) { return null; }
        }
        return findInput.value;
    }

    function getRange() {
        if (selectionToggle.checked && editor.somethingSelected()) {
            return {from: editor.getCursor('from'), to: editor.getCursor('to')};
        }
        return {from: {line:0,ch:0}, to: null};
    }

    function findNext() {
        const query = getQuery();
        if (!query) return;
        const {from, to} = getRange();
        if (!searchCursor) {
            searchCursor = editor.getSearchCursor(query, from);
            searchEnd = to;
        }
        if (!searchCursor.findNext() || (searchEnd && CodeMirror.cmpPos(searchCursor.from(), searchEnd) >= 0)) {
            searchCursor = editor.getSearchCursor(query, from);
            if (!searchCursor.findNext() || (searchEnd && CodeMirror.cmpPos(searchCursor.from(), searchEnd) >= 0)) {
                return;
            }
        }
        if (searchEnd && CodeMirror.cmpPos(searchCursor.to(), searchEnd) > 0) return;
        editor.setSelection(searchCursor.from(), searchCursor.to());
        editor.scrollIntoView(searchCursor.from(), 100);
    }

    function replace() {
        if (!searchCursor) findNext();
        if (searchCursor && editor.getSelection()) {
            searchCursor.replace(replaceInput.value);
            searchCursor = null;
            updateCounts();
        }
    }

    function replaceAll() {
        const query = getQuery();
        if (!query) return;
        const {from, to} = getRange();
        const cursor = editor.getSearchCursor(query, from);
        editor.operation(() => {
            while (cursor.findNext() && (!to || CodeMirror.cmpPos(cursor.to(), to) <= 0)) {
                cursor.replace(replaceInput.value);
            }
        });
        searchCursor = null;
        updateCounts();
    }

    findBtn.addEventListener('click', () => { searchCursor = null; findNext(); });
    replaceBtn.addEventListener('click', replace);
    replaceAllBtn.addEventListener('click', replaceAll);
});
