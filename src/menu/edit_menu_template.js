import { app, BrowserWindow } from 'electron';


export var editMenuTemplate = {
    label: 'Open',
    submenu: [
        { label: "Movies", click(){ win.loadURL(`file://${__dirname}/browser/index.html#/movies`); } },
        { type: "separator" },
        { label: "Tv Series",  click(){ win.loadURL(`file://${__dirname}/browser/index.html#/tv`); } },
        { type: "separator" },
        { label: "Quit", click(){ app.quit(); } }
    ]
};