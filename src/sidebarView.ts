import * as vscode from 'vscode';

export class SidebarViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'myInput.myView';

    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {
        console.log('SidebarViewProvider constructor');
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        console.log('resolveWebviewView');
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true
        };

        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
    }

    public updateWebviewContent(text: string) {
        console.log('updateWebviewContent:', text);
        if (this._view) {
            this._view.webview.postMessage({ text });
        }
    }

    private getHtmlForWebview(webview: vscode.Webview): string {
        console.log('getHtmlForWebview');
        const nonce = this.getNonce();

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Input View</title>
            </head>
            <body>
                <input id="codeInput" type="text" style="width: 100%;" />
                <script nonce="${nonce}">
                    const vscode = acquireVsCodeApi();

                    window.addEventListener('message', event => {
                        const message = event.data;
                        document.getElementById('codeInput').value = message.text;
                    });
                </script>
            </body>
            </html>
        `;
    }

    private getNonce() {
        console.log('getNonce');
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
