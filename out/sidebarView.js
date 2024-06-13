"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarViewProvider = void 0;
class SidebarViewProvider {
    _extensionUri;
    static viewType = 'myInput.myView';
    _view;
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
        console.log('SidebarViewProvider constructor');
    }
    resolveWebviewView(webviewView, context, _token) {
        console.log('resolveWebviewView');
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true
        };
        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
    }
    updateWebviewContent(text) {
        console.log('updateWebviewContent:', text);
        if (this._view) {
            this._view.webview.postMessage({ text });
        }
    }
    getHtmlForWebview(webview) {
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
    getNonce() {
        console.log('getNonce');
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
exports.SidebarViewProvider = SidebarViewProvider;
//# sourceMappingURL=sidebarView.js.map