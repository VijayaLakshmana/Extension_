import * as vscode from 'vscode';
import { SidebarViewProvider } from './sidebarView';

export function activate(context: vscode.ExtensionContext) {
    console.log('activate');

    const sidebarProvider = new SidebarViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(SidebarViewProvider.viewType, sidebarProvider)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.populateInputField', () => {
            vscode.commands.executeCommand('workbench.view.extension.mySidebar');
            console.log('populateInputField');
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const selectedText = editor.document.getText(editor.selection);
                console.log('selectedText:', selectedText);
                sidebarProvider.updateWebviewContent(selectedText);
            }
        })
    );
}

export function deactivate() {
    console.log('deactivate');
}
