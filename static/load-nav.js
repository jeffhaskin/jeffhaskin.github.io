document.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('navbar');
    if (!target) return;
    fetch('/templates/nav.html')
        .then(resp => resp.text())
        .then(html => {
            target.innerHTML = html;
        });
});
