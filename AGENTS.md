This repository is maintained primarily by AI agents. Feel free to modify and extend it when implementing new features.

Policy:
- On each tools category page (e.g., development-tools.html, image-tools.html), links to individual tool pages must be presented as cards. Use a container with the `gallery` class and wrap each link in a `div` with the `card` class, matching the styling on tools.html.
- HTML pages go in the `/templates` folder.
- CSS and Javascript files go in the `/static` folder.
- Tool pages go in the `/tools/tool_pages` folder.
- Currently, the nav bar should only have the following options: Home, Tools, Portfolio, Resume, Posts
- Files named `.DS_Store` can be deleted wherever they're encountered. They're an artifact of the MacOS file system and don't matter.
- Using libraries: Because of the way Github static pages work, using links like this `<script src="https://cdn.jsdelivr.net/npm/codemirror@5.65.9/mode/htmlmixed/htmlmixed.js"></script>` won't work. Instead, download any such files or assets we need to use into the `/static` folder in this repo, then link to those.

