const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');


let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({show: false});
    mainWindow.setFullScreen(true);
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
       
       
    })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'splash.html'),
        protocol: 'file:',
        slashes: true
    }));


    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {

        const fs = require('fs');
        var os = require('os');
        var tmp = os.tmpdir() + "/croatoan/";
        





        if (fs.existsSync(tmp)) {

            fs.readdirSync(tmp).forEach(file => {
                if (file.indexOf(".foo") > -1)
                    fs.unlink(tmp + file, function () {});

            });
        }

        const folder =  __dirname.split("/EDUNGURU.app")[0]+"/.content/videos";;

        fs.readdirSync(folder).forEach(file => {
            if (file.indexOf(".foo") > -1)
                fs.unlink(folder + file, function () {});

        });
        try {
            fs.unlink( __dirname.split("/EDUNGURU.app")[0]+'/.content/content.json', function () {});
            fs.unlink(__dirname.split("/EDUNGURU.app")[0]+'/.content/validity.json', function () {});
        } catch (exception) {

        }
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });






    // true 
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
   
        app.quit();
    
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.