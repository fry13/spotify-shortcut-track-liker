const { app, BrowserWindow, Tray, Menu, nativeImage } = require("electron");

let tray;
const icon = nativeImage.createFromPath("./media/tray.png");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 200,
    resizable: false,
    icon: "./media/tray.png",
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#1DB954",
      symbolColor: "#191414",
      height: 30,
    },
  });

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open window",
      click: function () {
        win.show();
      },
    },
    {
      label: "Exit",
      click: function () {
        app.quit();
      },
    },
  ]);

  win.loadFile("index.html");
  win.removeMenu();
  win.on("minimize", function (event) {
    event.preventDefault();
    win.hide();
    tray = new Tray(icon);
    tray.setToolTip("Press CTRL+L to like current track!");
    tray.setContextMenu(contextMenu);
    tray.on("double-click", function (event) {
      win.show();
    });
  });
  win.on("restore", function (event) {
    win.show();
    tray.destroy();
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
