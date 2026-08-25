<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bruno Souza — Psicólogo Clínico</title>
    <meta name="description" content="Psicólogo clínico dedicado à saúde mental, pautado na ciência, na transparência e na empatia.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>

    <nav class="nav" id="nav">
        <a href="/" class="nav-brand">Bruno Souza</a>
        <ul class="nav-links">
            <li><a href="/psicoeducacao">Psicoeducação</a></li>
            <li><a href="/neuroatlas">NeuroAtlas</a></li>
            <li><a href="#sobre">Sobre</a></li>
        </ul>
    </nav>

    <main>
        <?= $content ?>
    </main>

    <footer class="footer">
        <span class="footer-brand">Bruno Souza</span>
        <span class="footer-copy">Psicólogo Clínico · CRP &nbsp;·&nbsp; © <?= date('Y') ?></span>
    </footer>

    <script src="/js/animations.js"></script>
</body>
</html>
