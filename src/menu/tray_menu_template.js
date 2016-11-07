import { app, BrowserWindow } from 'electron';
import { mainWindow , createWindow , rmDir , tempFiles } from '../background.js';

export var trayMenuTemplate = [
    {
    label: 'Open Qmovies',click(){
      mainWindow.show()
    }},
    { type:'separator'},
    {label: 'Movies', click(){
      createWindow(`file://${__dirname}/browser/index.html#/movies`);
    }},
    {label: 'Tv Series', click(){
      createWindow(`file://${__dirname}/browser/index.html#/tv`);
    }},
    {
      type:'separator'
    },
    {label: 'Quit', click(){
        app.quit();
    }}
    ];