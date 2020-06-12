/*
 * @Description: 
 * @Version: 
 * @Author: liu
 * @Date: 2020-06-10 14:28:51
 */ 

 const {app, BrowserWindow,screen,ipcRenderer,ipcMain} = require('electron')
 const path = require('path')

 let recordCapture = {}
 let win = {}
 let menuBar = {}

 function createWindow(){
    win = new BrowserWindow({
        width:400,
        height:400,
        transparent:true,
        frame:false,
        show:false,
        resizable:true,
        maximizable:false,
        minimizable:false,
        alwaysOnTop:true,
        webPreferences:{
            nodeIntegration:true,
            webSecurity:false,
            preload:path.join(__dirname,'./preload.js')
        }
    })

    win.loadFile('select.html')
    //  win.webContents.openDevTools()
    win.webContents.on('did-finish-load',()=>{
        createMenuBar()
    })

    win.on('move', e => {
        resizeMenuBar()
    })

    win.on('resize', e => {
        resizeMenuBar()
    })

    win.on('closed',e => [
        menuBar.close()
    ])
}


function resizeMenuBar(){
    menuBar.setPosition(win.getPosition()[0] + win.getSize()[0] - 400,win.getPosition()[1] + win.getSize()[1])
}

function createMenuBar(){
    menuBar = new BrowserWindow({
        width:400,
        height:32,
        frame:false,
        show:false,
        resizable:false,
        alwaysOnTop:true,
        minimizable:false,
        maximizable:false,
        webPreferences:{
            nodeIntegration:true,
            preload:path.join(__dirname, './preload.js')
        }
    })

    menuBar.loadFile('menu.html')
    menuBar.webContents.on('did-finish-load',()=>{
        win.setPosition(1500,100)
        menuBar.show()
        win.show()
    })

    menuBar.on('close', () => {
        win.close()
    })

}

app.whenReady().then(() =>{
    createWindow()
    ipcMain.on('start_record_screen',() => {
        win.setIgnoreMouseEvents(true)
        win.webContents.send('start_record_screen','-')
    })
    ipcMain.on('save_record_screen',() => {
        win.setIgnoreMouseEvents(false)
        win.webContents.send('save_record_screen','-')
    })
})
