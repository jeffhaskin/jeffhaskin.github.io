# jeffhaskin.github.io

<a href="/templates/index.html">index.html</a>

## Road Map

- [x] Centralize the nav bar so it's a single file that all the other pages pull from to load that part of the page. That way, you only have to make a change to one file to change the nav bar globally.
- [x] Add a new item to the nav bar just after tools called "fun"
    - [x] create a page for "fun" that--like tools--has a grid of cards (recycle the code from the tools page). Unlike tools, however, this page will not have categories. The actual individual "fun" pages will appear as cards directly on the main "fun" page. You would then click a card to visit that individual toy/game.
    - [x] for the first toy/game on the "fun" page, add a card that leads to a game called matrix rain kanji catch. This page should have the normal nav bar and stuff, and for the page content, use an iframe to load `/fun/matrix-rain-kanji-catch.html`.
