import { TProfile } from "@/@types/profile";
import { app, BrowserWindow, ipcMain, screen } from "electron";
import * as path from "path";
import { baseUrl } from "./context";
import * as sudo from "sudo-prompt";
import { exec } from "child_process";
import fs from "fs-extra";
import { color } from "./definitions/color";

let rendererWindow: BrowserWindow;

const createRendererWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  rendererWindow = new BrowserWindow({
    width: width / 2,
    height: height / 2,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
    },
  });
  rendererWindow.removeMenu();
  void rendererWindow.loadURL(`${baseUrl}?renderer`);

  if (!app.isPackaged) {
    rendererWindow.webContents.openDevTools();
  }
};

// ipcMain.handle('exec_command', async (event, data) => {
//     try {
//         var sudo = require("sudo-prompt")
//         var options = {
//             name: "Electron",
//         };
//         sudo.exec(data, options, function(error, stdout) {
//             if (error) throw error;
//         });
//         return data;
//     } catch (e) {
//         return "failed.";
//     }
// })

ipcMain.handle("load_template", (event, data: string) => {
  const command =
    "term_template=`cat ./electron/data/" +
    data +
    '.terminal`;plutil -insert "Window Settings.' +
    data +
    '" -xml "$term_template" ~/Library/Preferences/com.apple.Terminal.plist; defaults write com.apple.Terminal "Default Window Settings" ' +
    data +
    ';defaults write com.apple.Terminal "Startup Window Settings" ' +
    data;
  try {
    const options = {
      name: "Electron",
    };
    sudo.exec(command, options, function (error) {
      if (error) throw error;
    });
    return command;
  } catch (e) {
    return "failed.";
  }
});

ipcMain.handle("update_prompt", (event, data: string) => {
  const command = `
    TKG_START_LINE="$((\`sed -n '/Start: Terminal Kake Gohan/=' ~/.zshrc\`-1))"
    TKG_END_LINE="$((\`sed -n '/End  : Terminal Kake Gohan/=' ~/.zshrc\`+1))"
    sed "$TKG_START_LINE,$((TKG_END_LINE))d" ~/.zshrc > ~/.tmp_zshrc_tkg
    mv -f ~/.tmp_zshrc_tkg ~/.zshrc
    rm -f ~/.tmp_zshrc_tkg
    echo '\n#** -- Start: Terminal Kake Gohan -> **#\n\nPROMPT="${data}"\n\n#** <- End  : Terminal Kake Gohan -- **#\n' >> ~/.zshrc
    chmod 777 ~/.zshrc
  `;
  try {
    exec(command, function (error) {
      if (error) throw error;
    });
    return command;
  } catch (e) {
    return e;
  }
});

ipcMain.handle("apply_tprofile", (event, data: TProfile) => {
  let caretType = 0;
  if (data.caret.endsWith("block")) {
    caretType = 0;
  }
  if (data.caret.endsWith("underline")) {
    caretType = 1;
  }
  if (data.caret.endsWith("vertical")) {
    caretType = 2;
  }

  let caretBlink = data.caret.startsWith("blink-") ? 1 : 0;

  // XMLを生成
  const xml = `\
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>type</key>
  <string>Window Settings</string>
  <key>name</key>
  <string>${data.name}</string>
  <key>TextColor</key>
  <data>${color[data.color.screenText.color]}</data>
  <key>TextBoldColor</key>
  <data>${color[data.color.boldText.color]}</data>
	<key>BackgroundColor</key>
  <data>${color[data.color.screenBg.color]}</data>
	<key>SelectionColor</key>
  <data>${color[data.color.selectedText.color]}</data>
	<key>CursorType</key>
  <integer>${caretType}</integer>
	<key>CursorBlink</key>
  ${caretBlink ? "<true/>" : "<false/>"}
</dict>
</plist>
  `;
  const file = path.join(
    __dirname,
    `../../electron/data/${data.name}.terminal`
  );
  // XMLを書き出し
  fs.writeFile(file, xml, (error) => {
    console.log(error);
  });

  const prompt = data.prompt.reduce((pv, value) => {
    return pv + value.value + " ";
  }, "");
  const command_prompt = `TKG_START_LINE="$((\`sed -n '/Start: Terminal Kake Gohan/=' ${path.join(
    process.env.HOME,
    "/.zshrc"
  )}\`-1))"; if [ $TKG_START_LINE = "-1" ];then echo '\n#** -- Start: Terminal Kake Gohan -> **#\n\nPROMPT="${prompt}"\n\n#** <- End  : Terminal Kake Gohan -- **#\n' >> ${path.join(
    process.env.HOME,
    "/.zshrc"
  )}; else TKG_START_LINE="$((\`sed -n '/Start: Terminal Kake Gohan/=' ${path.join(
    process.env.HOME,
    "/.zshrc"
  )}\`-1))";TKG_END_LINE="$((\`sed -n '/End  : Terminal Kake Gohan/=' ${path.join(
    process.env.HOME,
    "/.zshrc"
  )}\`+1))";sed "$TKG_START_LINE,$((TKG_END_LINE))d" ${path.join(
    process.env.HOME,
    "/.zshrc"
  )} > ~/.tmp_zshrc_tkg;mv -f ~/.tmp_zshrc_tkg ${path.join(
    process.env.HOME,
    "/.zshrc"
  )};rm -f ~/.tmp_zshrc_tkg;echo '\n#** -- Start: Terminal Kake Gohan -> **#\n\nPROMPT="${prompt}"\n\n#** <- End  : Terminal Kake Gohan -- **#\n' >> ${path.join(
    process.env.HOME,
    "/.zshrc"
  )};fi;`;
  const command_terminal = `plutil -insert "Window Settings.${
    data.name
  }" -xml '${xml}' ${path.join(
    process.env.HOME,
    "/Library/Preferences/com.apple.Terminal.plist"
  )}`;

  // const command = `
  //   TKG_START_LINE="$((\`sed -n '/Start: Terminal Kake Gohan/=' ~/.zshrc\`-1))"
  //   TKG_END_LINE="$((\`sed -n '/End  : Terminal Kake Gohan/=' ~/.zshrc\`+1))"
  //   if [ $]
  //   sed "$TKG_START_LINE,$((TKG_END_LINE))d" ~/.zshrc > ~/.tmp_zshrc_tkg
  //   mv -f ~/.tmp_zshrc_tkg ~/.zshrc
  //   rm -f ~/.tmp_zshrc_tkg
  //   echo '\n#** -- Start: Terminal Kake Gohan -> **#\n\nPROMPT="${prompt}"\n\n#** <- End  : Terminal Kake Gohan -- **#\n' >> ~/.zshrc
  //   chmod 777 ~/.zshrc
  // `;
  const init = async () => {
    try {
      exec(command_prompt, function (error, stdout, stderr) {
        if (error) {
          console.log(stdout);
          console.log(stderr);
          throw error;
        }
      });
      exec(
        command_terminal,
        { env: { ...process.env, term_template: xml.replace(/\n/g, "") } },
        function (error, stdout, stderr) {
          if (error) {
            console.log(stdout);
            console.log(stderr);
            throw error;
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  };
  init();
  /*  try {

    exec(command_prompt + command_terminal, function (error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (error) throw error;
    });
    return data;
  } catch (e) {
    return e;
  }*/
});

export { createRendererWindow };
