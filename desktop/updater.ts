const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

// Configure log debugging
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"

// Disable auto downloads
autoUpdater.autoDownload = false;

module.exports = () => {

  // Checking for an update
  autoUpdater.checkForUpdates();

  // Listen for update found
  autoUpdater.on('update-available', () => {

    //Prompt user to start download
    dialog.showMessageBox({
      type: 'info',
      title: 'Доступно обновление',
      message: 'Доступно новое обновление Farmme. Хотите установить сейчас?',
      buttons: ['Установить сейчас', 'Позже']
    }).then(result => {

      let buttonIndex = result.response;

      if(buttonIndex === 0) autoUpdater.downloadUpdate();

    });

  });

  // Listen for update downloaded
  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall(false, true);
  });
}