import dayjs from "dayjs";
import { isDev } from "./config";

class Logger {
  static _printLog() {
    if (!isDev) return;
    const args = Array.from(arguments);
    const type = args.shift();

    let prefix = "[MIMECON WEB]";
    const ts = new Date();
    const dateString = "[" + dayjs(ts).format("hh:mm:ss.ms") + "]";
    args.unshift(dateString);
    if (type === Logger.Types.INFO) {
      prefix = Logger.Colors.BLUE + prefix;
    } else if (type === Logger.Types.WARN) {
      prefix = Logger.Colors.YELLOW + prefix;
    } else if (type === Logger.Types.ERROR) {
      prefix = Logger.Colors.RED + prefix;
    } else if (type === Logger.Types.NETWORK) {
      prefix = Logger.Colors.MAGENTA + prefix;
    }
    args.unshift(prefix);

    console.log(...args);
  }

  static log() {
    const args = arguments;
    Logger._printLog(Logger.Types.INFO, ...args);
  }

  static warn() {
    const args = arguments;
    Logger._printLog(Logger.Types.WARN, ...args);
  }

  static error() {
    const args = arguments;
    Logger._printLog(Logger.Types.ERROR, ...args);
  }

  static network() {
    const args = arguments;
    Logger._printLog(Logger.Types.NETWORK, ...args);
  }
}
Logger.Colors = {
  BLACK: "\x1b[30m",
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
  CYAN: "\x1b[36m",
  WHITE: "\x1b[37m",
};

Logger.Types = {
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  NETWORK: 3,
};

export default Logger;
