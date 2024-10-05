require(['vs/editor/editor.main'], function () {
    let editor = monaco.editor.create(document.getElementById('editor'), {
        value: "@startuml\nactor User\nUser -> (Usecase Example)\n@enduml",
        language: 'plaintext'
    });

    // デバウンス用のタイマー
    let timeoutId = null;

    // リアルタイムで図を生成
    editor.onDidChangeModelContent(function () {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // 入力が止まった後に500ms後に図を生成
        timeoutId = setTimeout(function () {
            let diagramText = editor.getValue();
            generateDiagram(diagramText);
        }, 500); // 500msの遅延
    });

    function generateDiagram(text) {
        fetch('backend.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uml: text, format: 'svg' })
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById('diagramOutput').innerHTML = data;
        })
        .catch(error => {
            console.error("Error generating diagram:", error);
        });
    }

    // ダウンロード機能
    document.getElementById('downloadPng').addEventListener('click', () => downloadFile('png'));
    document.getElementById('downloadSvg').addEventListener('click', () => downloadFile('svg'));
    document.getElementById('downloadTxt').addEventListener('click', () => downloadFile('txt'));

    function downloadFile(format) {
        let diagramText = editor.getValue();
        let url = `backend.php?uml=${encodeURIComponent(diagramText)}&format=${format}`;
        window.location.href = url;
    }

    // プラクティスプロンプト
    document.getElementById('generatePrompt').addEventListener('click', function () {
        generatePrompt();
    });

    function generatePrompt() {
        let prompts = [
            "Create a use case diagram with a User and System.",
            "Create a class diagram with three classes: Person, Student, and Teacher.",
            "Create a sequence diagram with an interaction between a Customer and a Shop."
        ];
        let randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        document.getElementById('promptOutput').innerText = randomPrompt;
    }
});
