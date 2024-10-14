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
            generateDiagram(diagramText, 'diagramOutput'); // ユーザーの図を生成
        }, 500); // 500msの遅延
    });

    function generateDiagram(text, outputElementId) {
        fetch('backend.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uml: text, format: 'svg' })
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById(outputElementId).innerHTML = data;
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
            {
                question: "「User(ユーザー)」と「System(システム)」でユースケース図を作成してください。",
                uml: "@startuml\nactor User\nactor System\nUser -> (Usecase Example)\n@enduml"
            },
            {
                question: "Person, Student, Teacherの3つのクラスでクラス図を作成してください。",
                uml: "@startuml\nclass Person\nclass Student\nclass Teacher\nPerson <|-- Student\nPerson <|-- Teacher\n@enduml"
            },
            {
                question: "「Customer（顧客）」と「Shop（ショップ）」の間のインタラクションを含むシーケンス図を作成してください。",
                uml: "@startuml\nactor Customer\nparticipant Shop\nCustomer -> Shop: Order\nShop --> Customer: Confirm Order\n@enduml"
            }
        ];

        let randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        document.getElementById('promptOutput').innerText = randomPrompt.question;

        // 正解例のUMLコードを表示するスペースに設定して図を生成
        document.getElementById('answerUmlCode').innerText = randomPrompt.uml;  // 正解のUMLコードを表示
        generateDiagram(randomPrompt.uml, 'answerDiagramOutput'); // 正解の図を生成
    }
});
