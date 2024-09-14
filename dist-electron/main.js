import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { fileURLToPath } from "node:url";
import path$c from "node:path";
import fs$i, { existsSync } from "fs";
import require$$1, { join } from "path";
import { platform as platform$1, homedir } from "os";
import require$$0 from "constants";
import require$$0$1 from "stream";
import require$$4 from "util";
import require$$5 from "assert";
import require$$0$2 from "zlib";
import require$$0$3 from "crypto";
const osType = platform$1();
const homeDir = homedir();
const exeName = osType === "win32" ? "Tyranny.exe" : "Tyranny";
function checkSteamPaths() {
  let steamPaths = [];
  if (osType === "win32") {
    steamPaths = [
      join("C:", "Program Files (x86)", "Steam", "steamapps", "common", "Tyranny"),
      join("C:", "SteamLibrary", "steamapps", "common", "Tyranny"),
      join("D:", "SteamLibrary", "steamapps", "common", "Tyranny")
    ];
  } else if (osType === "darwin") {
    steamPaths = [
      join(homeDir, "Library", "Application Support", "Steam", "steamapps", "common", "Tyranny"),
      join("Applications", "Steam", "steamapps", "common", "Tyranny")
    ];
  } else if (osType === "linux") {
    steamPaths = [
      join(homeDir, ".steam", "steam", "steamapps", "common", "Tyranny"),
      join(homeDir, ".local", "share", "Steam", "steamapps", "common", "Tyranny"),
      join(homeDir, ".steam", "root", "steamapps", "common", "Tyranny")
    ];
  }
  return findGameExecutable(steamPaths);
}
function checkGogPaths() {
  let gogPaths = [];
  if (osType === "win32") {
    gogPaths = [
      join("C:", "Program Files (x86)", "GOG Galaxy", "Games", "Tyranny"),
      join("D:", "GOG Galaxy", "Games", "Tyranny")
    ];
  } else if (osType === "darwin") {
    gogPaths = [
      join(homeDir, "Library", "Application Support", "GOG", "Galaxy", "Games", "Tyranny")
    ];
  } else if (osType === "linux") {
    gogPaths = [
      join(homeDir, "GOG Games", "Tyranny")
    ];
  }
  return findGameExecutable(gogPaths);
}
function checkEpicGamesPaths() {
  let epicGamesPaths = [];
  if (osType === "win32") {
    epicGamesPaths = [
      join("C:", "Program Files", "Epic Games", "Tyranny"),
      join("D:", "Epic Games", "Tyranny")
    ];
  } else if (osType === "darwin") {
    epicGamesPaths = [
      join("Applications", "Epic Games", "Tyranny")
    ];
  } else if (osType === "linux") {
    epicGamesPaths = [
      join(homeDir, "EpicGames", "Tyranny")
    ];
  }
  return findGameExecutable(epicGamesPaths);
}
function findGameExecutable(paths) {
  for (const path2 of paths) {
    const fullPath = join(path2, exeName);
    if (existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}
function checkAllLaunchers() {
  const steamPath = checkSteamPaths();
  if (steamPath) return steamPath;
  const gogPath = checkGogPaths();
  if (gogPath) return gogPath;
  const epicGamesPath = checkEpicGamesPaths();
  if (epicGamesPath) return epicGamesPath;
  return null;
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var fs$h = {};
var universalify$1 = {};
universalify$1.fromCallback = function(fn) {
  return Object.defineProperty(function(...args) {
    if (typeof args[args.length - 1] === "function") fn.apply(this, args);
    else {
      return new Promise((resolve, reject) => {
        args.push((err, res) => err != null ? reject(err) : resolve(res));
        fn.apply(this, args);
      });
    }
  }, "name", { value: fn.name });
};
universalify$1.fromPromise = function(fn) {
  return Object.defineProperty(function(...args) {
    const cb = args[args.length - 1];
    if (typeof cb !== "function") return fn.apply(this, args);
    else {
      args.pop();
      fn.apply(this, args).then((r) => cb(null, r), cb);
    }
  }, "name", { value: fn.name });
};
var constants$1 = require$$0;
var origCwd = process.cwd;
var cwd = null;
var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process);
  return cwd;
};
try {
  process.cwd();
} catch (er) {
}
if (typeof process.chdir === "function") {
  var chdir = process.chdir;
  process.chdir = function(d) {
    cwd = null;
    chdir.call(process, d);
  };
  if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
}
var polyfills$1 = patch$1;
function patch$1(fs2) {
  if (constants$1.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs2);
  }
  if (!fs2.lutimes) {
    patchLutimes(fs2);
  }
  fs2.chown = chownFix(fs2.chown);
  fs2.fchown = chownFix(fs2.fchown);
  fs2.lchown = chownFix(fs2.lchown);
  fs2.chmod = chmodFix(fs2.chmod);
  fs2.fchmod = chmodFix(fs2.fchmod);
  fs2.lchmod = chmodFix(fs2.lchmod);
  fs2.chownSync = chownFixSync(fs2.chownSync);
  fs2.fchownSync = chownFixSync(fs2.fchownSync);
  fs2.lchownSync = chownFixSync(fs2.lchownSync);
  fs2.chmodSync = chmodFixSync(fs2.chmodSync);
  fs2.fchmodSync = chmodFixSync(fs2.fchmodSync);
  fs2.lchmodSync = chmodFixSync(fs2.lchmodSync);
  fs2.stat = statFix(fs2.stat);
  fs2.fstat = statFix(fs2.fstat);
  fs2.lstat = statFix(fs2.lstat);
  fs2.statSync = statFixSync(fs2.statSync);
  fs2.fstatSync = statFixSync(fs2.fstatSync);
  fs2.lstatSync = statFixSync(fs2.lstatSync);
  if (fs2.chmod && !fs2.lchmod) {
    fs2.lchmod = function(path2, mode, cb) {
      if (cb) process.nextTick(cb);
    };
    fs2.lchmodSync = function() {
    };
  }
  if (fs2.chown && !fs2.lchown) {
    fs2.lchown = function(path2, uid, gid, cb) {
      if (cb) process.nextTick(cb);
    };
    fs2.lchownSync = function() {
    };
  }
  if (platform === "win32") {
    fs2.rename = typeof fs2.rename !== "function" ? fs2.rename : function(fs$rename) {
      function rename2(from, to, cb) {
        var start = Date.now();
        var backoff = 0;
        fs$rename(from, to, function CB(er) {
          if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
            setTimeout(function() {
              fs2.stat(to, function(stater, st) {
                if (stater && stater.code === "ENOENT")
                  fs$rename(from, to, CB);
                else
                  cb(er);
              });
            }, backoff);
            if (backoff < 100)
              backoff += 10;
            return;
          }
          if (cb) cb(er);
        });
      }
      if (Object.setPrototypeOf) Object.setPrototypeOf(rename2, fs$rename);
      return rename2;
    }(fs2.rename);
  }
  fs2.read = typeof fs2.read !== "function" ? fs2.read : function(fs$read) {
    function read(fd, buffer, offset, length, position, callback_) {
      var callback;
      if (callback_ && typeof callback_ === "function") {
        var eagCounter = 0;
        callback = function(er, _, __) {
          if (er && er.code === "EAGAIN" && eagCounter < 10) {
            eagCounter++;
            return fs$read.call(fs2, fd, buffer, offset, length, position, callback);
          }
          callback_.apply(this, arguments);
        };
      }
      return fs$read.call(fs2, fd, buffer, offset, length, position, callback);
    }
    if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
    return read;
  }(fs2.read);
  fs2.readSync = typeof fs2.readSync !== "function" ? fs2.readSync : /* @__PURE__ */ function(fs$readSync) {
    return function(fd, buffer, offset, length, position) {
      var eagCounter = 0;
      while (true) {
        try {
          return fs$readSync.call(fs2, fd, buffer, offset, length, position);
        } catch (er) {
          if (er.code === "EAGAIN" && eagCounter < 10) {
            eagCounter++;
            continue;
          }
          throw er;
        }
      }
    };
  }(fs2.readSync);
  function patchLchmod(fs22) {
    fs22.lchmod = function(path2, mode, callback) {
      fs22.open(
        path2,
        constants$1.O_WRONLY | constants$1.O_SYMLINK,
        mode,
        function(err, fd) {
          if (err) {
            if (callback) callback(err);
            return;
          }
          fs22.fchmod(fd, mode, function(err2) {
            fs22.close(fd, function(err22) {
              if (callback) callback(err2 || err22);
            });
          });
        }
      );
    };
    fs22.lchmodSync = function(path2, mode) {
      var fd = fs22.openSync(path2, constants$1.O_WRONLY | constants$1.O_SYMLINK, mode);
      var threw = true;
      var ret;
      try {
        ret = fs22.fchmodSync(fd, mode);
        threw = false;
      } finally {
        if (threw) {
          try {
            fs22.closeSync(fd);
          } catch (er) {
          }
        } else {
          fs22.closeSync(fd);
        }
      }
      return ret;
    };
  }
  function patchLutimes(fs22) {
    if (constants$1.hasOwnProperty("O_SYMLINK") && fs22.futimes) {
      fs22.lutimes = function(path2, at, mt, cb) {
        fs22.open(path2, constants$1.O_SYMLINK, function(er, fd) {
          if (er) {
            if (cb) cb(er);
            return;
          }
          fs22.futimes(fd, at, mt, function(er2) {
            fs22.close(fd, function(er22) {
              if (cb) cb(er2 || er22);
            });
          });
        });
      };
      fs22.lutimesSync = function(path2, at, mt) {
        var fd = fs22.openSync(path2, constants$1.O_SYMLINK);
        var ret;
        var threw = true;
        try {
          ret = fs22.futimesSync(fd, at, mt);
          threw = false;
        } finally {
          if (threw) {
            try {
              fs22.closeSync(fd);
            } catch (er) {
            }
          } else {
            fs22.closeSync(fd);
          }
        }
        return ret;
      };
    } else if (fs22.futimes) {
      fs22.lutimes = function(_a, _b, _c, cb) {
        if (cb) process.nextTick(cb);
      };
      fs22.lutimesSync = function() {
      };
    }
  }
  function chmodFix(orig) {
    if (!orig) return orig;
    return function(target, mode, cb) {
      return orig.call(fs2, target, mode, function(er) {
        if (chownErOk(er)) er = null;
        if (cb) cb.apply(this, arguments);
      });
    };
  }
  function chmodFixSync(orig) {
    if (!orig) return orig;
    return function(target, mode) {
      try {
        return orig.call(fs2, target, mode);
      } catch (er) {
        if (!chownErOk(er)) throw er;
      }
    };
  }
  function chownFix(orig) {
    if (!orig) return orig;
    return function(target, uid, gid, cb) {
      return orig.call(fs2, target, uid, gid, function(er) {
        if (chownErOk(er)) er = null;
        if (cb) cb.apply(this, arguments);
      });
    };
  }
  function chownFixSync(orig) {
    if (!orig) return orig;
    return function(target, uid, gid) {
      try {
        return orig.call(fs2, target, uid, gid);
      } catch (er) {
        if (!chownErOk(er)) throw er;
      }
    };
  }
  function statFix(orig) {
    if (!orig) return orig;
    return function(target, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      function callback(er, stats) {
        if (stats) {
          if (stats.uid < 0) stats.uid += 4294967296;
          if (stats.gid < 0) stats.gid += 4294967296;
        }
        if (cb) cb.apply(this, arguments);
      }
      return options ? orig.call(fs2, target, options, callback) : orig.call(fs2, target, callback);
    };
  }
  function statFixSync(orig) {
    if (!orig) return orig;
    return function(target, options) {
      var stats = options ? orig.call(fs2, target, options) : orig.call(fs2, target);
      if (stats) {
        if (stats.uid < 0) stats.uid += 4294967296;
        if (stats.gid < 0) stats.gid += 4294967296;
      }
      return stats;
    };
  }
  function chownErOk(er) {
    if (!er)
      return true;
    if (er.code === "ENOSYS")
      return true;
    var nonroot = !process.getuid || process.getuid() !== 0;
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true;
    }
    return false;
  }
}
var Stream = require$$0$1.Stream;
var legacyStreams = legacy$1;
function legacy$1(fs2) {
  return {
    ReadStream,
    WriteStream
  };
  function ReadStream(path2, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path2, options);
    Stream.call(this);
    var self2 = this;
    this.path = path2;
    this.fd = null;
    this.readable = true;
    this.paused = false;
    this.flags = "r";
    this.mode = 438;
    this.bufferSize = 64 * 1024;
    options = options || {};
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }
    if (this.encoding) this.setEncoding(this.encoding);
    if (this.start !== void 0) {
      if ("number" !== typeof this.start) {
        throw TypeError("start must be a Number");
      }
      if (this.end === void 0) {
        this.end = Infinity;
      } else if ("number" !== typeof this.end) {
        throw TypeError("end must be a Number");
      }
      if (this.start > this.end) {
        throw new Error("start must be <= end");
      }
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        self2._read();
      });
      return;
    }
    fs2.open(this.path, this.flags, this.mode, function(err, fd) {
      if (err) {
        self2.emit("error", err);
        self2.readable = false;
        return;
      }
      self2.fd = fd;
      self2.emit("open", fd);
      self2._read();
    });
  }
  function WriteStream(path2, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path2, options);
    Stream.call(this);
    this.path = path2;
    this.fd = null;
    this.writable = true;
    this.flags = "w";
    this.encoding = "binary";
    this.mode = 438;
    this.bytesWritten = 0;
    options = options || {};
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }
    if (this.start !== void 0) {
      if ("number" !== typeof this.start) {
        throw TypeError("start must be a Number");
      }
      if (this.start < 0) {
        throw new Error("start must be >= zero");
      }
      this.pos = this.start;
    }
    this.busy = false;
    this._queue = [];
    if (this.fd === null) {
      this._open = fs2.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
      this.flush();
    }
  }
}
var clone_1 = clone$1;
var getPrototypeOf = Object.getPrototypeOf || function(obj) {
  return obj.__proto__;
};
function clone$1(obj) {
  if (obj === null || typeof obj !== "object")
    return obj;
  if (obj instanceof Object)
    var copy2 = { __proto__: getPrototypeOf(obj) };
  else
    var copy2 = /* @__PURE__ */ Object.create(null);
  Object.getOwnPropertyNames(obj).forEach(function(key) {
    Object.defineProperty(copy2, key, Object.getOwnPropertyDescriptor(obj, key));
  });
  return copy2;
}
var fs$g = fs$i;
var polyfills = polyfills$1;
var legacy = legacyStreams;
var clone = clone_1;
var util$1 = require$$4;
var gracefulQueue;
var previousSymbol;
if (typeof Symbol === "function" && typeof Symbol.for === "function") {
  gracefulQueue = Symbol.for("graceful-fs.queue");
  previousSymbol = Symbol.for("graceful-fs.previous");
} else {
  gracefulQueue = "___graceful-fs.queue";
  previousSymbol = "___graceful-fs.previous";
}
function noop() {
}
function publishQueue(context, queue2) {
  Object.defineProperty(context, gracefulQueue, {
    get: function() {
      return queue2;
    }
  });
}
var debug = noop;
if (util$1.debuglog)
  debug = util$1.debuglog("gfs4");
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
  debug = function() {
    var m = util$1.format.apply(util$1, arguments);
    m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
    console.error(m);
  };
if (!fs$g[gracefulQueue]) {
  var queue = commonjsGlobal[gracefulQueue] || [];
  publishQueue(fs$g, queue);
  fs$g.close = function(fs$close) {
    function close(fd, cb) {
      return fs$close.call(fs$g, fd, function(err) {
        if (!err) {
          resetQueue();
        }
        if (typeof cb === "function")
          cb.apply(this, arguments);
      });
    }
    Object.defineProperty(close, previousSymbol, {
      value: fs$close
    });
    return close;
  }(fs$g.close);
  fs$g.closeSync = function(fs$closeSync) {
    function closeSync(fd) {
      fs$closeSync.apply(fs$g, arguments);
      resetQueue();
    }
    Object.defineProperty(closeSync, previousSymbol, {
      value: fs$closeSync
    });
    return closeSync;
  }(fs$g.closeSync);
  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
    process.on("exit", function() {
      debug(fs$g[gracefulQueue]);
      require$$5.equal(fs$g[gracefulQueue].length, 0);
    });
  }
}
if (!commonjsGlobal[gracefulQueue]) {
  publishQueue(commonjsGlobal, fs$g[gracefulQueue]);
}
var gracefulFs = patch(clone(fs$g));
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs$g.__patched) {
  gracefulFs = patch(fs$g);
  fs$g.__patched = true;
}
function patch(fs2) {
  polyfills(fs2);
  fs2.gracefulify = patch;
  fs2.createReadStream = createReadStream;
  fs2.createWriteStream = createWriteStream;
  var fs$readFile = fs2.readFile;
  fs2.readFile = readFile2;
  function readFile2(path2, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$readFile(path2, options, cb);
    function go$readFile(path22, options2, cb2, startTime) {
      return fs$readFile(path22, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$readFile, [path22, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$writeFile = fs2.writeFile;
  fs2.writeFile = writeFile2;
  function writeFile2(path2, data, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$writeFile(path2, data, options, cb);
    function go$writeFile(path22, data2, options2, cb2, startTime) {
      return fs$writeFile(path22, data2, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$writeFile, [path22, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$appendFile = fs2.appendFile;
  if (fs$appendFile)
    fs2.appendFile = appendFile;
  function appendFile(path2, data, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    return go$appendFile(path2, data, options, cb);
    function go$appendFile(path22, data2, options2, cb2, startTime) {
      return fs$appendFile(path22, data2, options2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$appendFile, [path22, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$copyFile = fs2.copyFile;
  if (fs$copyFile)
    fs2.copyFile = copyFile2;
  function copyFile2(src, dest, flags, cb) {
    if (typeof flags === "function") {
      cb = flags;
      flags = 0;
    }
    return go$copyFile(src, dest, flags, cb);
    function go$copyFile(src2, dest2, flags2, cb2, startTime) {
      return fs$copyFile(src2, dest2, flags2, function(err) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  var fs$readdir = fs2.readdir;
  fs2.readdir = readdir;
  var noReaddirOptionVersions = /^v[0-5]\./;
  function readdir(path2, options, cb) {
    if (typeof options === "function")
      cb = options, options = null;
    var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path22, options2, cb2, startTime) {
      return fs$readdir(path22, fs$readdirCallback(
        path22,
        options2,
        cb2,
        startTime
      ));
    } : function go$readdir2(path22, options2, cb2, startTime) {
      return fs$readdir(path22, options2, fs$readdirCallback(
        path22,
        options2,
        cb2,
        startTime
      ));
    };
    return go$readdir(path2, options, cb);
    function fs$readdirCallback(path22, options2, cb2, startTime) {
      return function(err, files) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([
            go$readdir,
            [path22, options2, cb2],
            err,
            startTime || Date.now(),
            Date.now()
          ]);
        else {
          if (files && files.sort)
            files.sort();
          if (typeof cb2 === "function")
            cb2.call(this, err, files);
        }
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var legStreams = legacy(fs2);
    ReadStream = legStreams.ReadStream;
    WriteStream = legStreams.WriteStream;
  }
  var fs$ReadStream = fs2.ReadStream;
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype);
    ReadStream.prototype.open = ReadStream$open;
  }
  var fs$WriteStream = fs2.WriteStream;
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype);
    WriteStream.prototype.open = WriteStream$open;
  }
  Object.defineProperty(fs2, "ReadStream", {
    get: function() {
      return ReadStream;
    },
    set: function(val) {
      ReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(fs2, "WriteStream", {
    get: function() {
      return WriteStream;
    },
    set: function(val) {
      WriteStream = val;
    },
    enumerable: true,
    configurable: true
  });
  var FileReadStream = ReadStream;
  Object.defineProperty(fs2, "FileReadStream", {
    get: function() {
      return FileReadStream;
    },
    set: function(val) {
      FileReadStream = val;
    },
    enumerable: true,
    configurable: true
  });
  var FileWriteStream = WriteStream;
  Object.defineProperty(fs2, "FileWriteStream", {
    get: function() {
      return FileWriteStream;
    },
    set: function(val) {
      FileWriteStream = val;
    },
    enumerable: true,
    configurable: true
  });
  function ReadStream(path2, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this;
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
  }
  function ReadStream$open() {
    var that = this;
    open(that.path, that.flags, that.mode, function(err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy();
        that.emit("error", err);
      } else {
        that.fd = fd;
        that.emit("open", fd);
        that.read();
      }
    });
  }
  function WriteStream(path2, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this;
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
  }
  function WriteStream$open() {
    var that = this;
    open(that.path, that.flags, that.mode, function(err, fd) {
      if (err) {
        that.destroy();
        that.emit("error", err);
      } else {
        that.fd = fd;
        that.emit("open", fd);
      }
    });
  }
  function createReadStream(path2, options) {
    return new fs2.ReadStream(path2, options);
  }
  function createWriteStream(path2, options) {
    return new fs2.WriteStream(path2, options);
  }
  var fs$open = fs2.open;
  fs2.open = open;
  function open(path2, flags, mode, cb) {
    if (typeof mode === "function")
      cb = mode, mode = null;
    return go$open(path2, flags, mode, cb);
    function go$open(path22, flags2, mode2, cb2, startTime) {
      return fs$open(path22, flags2, mode2, function(err, fd) {
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$open, [path22, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
        else {
          if (typeof cb2 === "function")
            cb2.apply(this, arguments);
        }
      });
    }
  }
  return fs2;
}
function enqueue(elem) {
  debug("ENQUEUE", elem[0].name, elem[1]);
  fs$g[gracefulQueue].push(elem);
  retry();
}
var retryTimer;
function resetQueue() {
  var now = Date.now();
  for (var i = 0; i < fs$g[gracefulQueue].length; ++i) {
    if (fs$g[gracefulQueue][i].length > 2) {
      fs$g[gracefulQueue][i][3] = now;
      fs$g[gracefulQueue][i][4] = now;
    }
  }
  retry();
}
function retry() {
  clearTimeout(retryTimer);
  retryTimer = void 0;
  if (fs$g[gracefulQueue].length === 0)
    return;
  var elem = fs$g[gracefulQueue].shift();
  var fn = elem[0];
  var args = elem[1];
  var err = elem[2];
  var startTime = elem[3];
  var lastTime = elem[4];
  if (startTime === void 0) {
    debug("RETRY", fn.name, args);
    fn.apply(null, args);
  } else if (Date.now() - startTime >= 6e4) {
    debug("TIMEOUT", fn.name, args);
    var cb = args.pop();
    if (typeof cb === "function")
      cb.call(null, err);
  } else {
    var sinceAttempt = Date.now() - lastTime;
    var sinceStart = Math.max(lastTime - startTime, 1);
    var desiredDelay = Math.min(sinceStart * 1.2, 100);
    if (sinceAttempt >= desiredDelay) {
      debug("RETRY", fn.name, args);
      fn.apply(null, args.concat([startTime]));
    } else {
      fs$g[gracefulQueue].push(elem);
    }
  }
  if (retryTimer === void 0) {
    retryTimer = setTimeout(retry, 0);
  }
}
(function(exports) {
  const u2 = universalify$1.fromCallback;
  const fs2 = gracefulFs;
  const api = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((key) => {
    return typeof fs2[key] === "function";
  });
  Object.assign(exports, fs2);
  api.forEach((method) => {
    exports[method] = u2(fs2[method]);
  });
  exports.exists = function(filename, callback) {
    if (typeof callback === "function") {
      return fs2.exists(filename, callback);
    }
    return new Promise((resolve) => {
      return fs2.exists(filename, resolve);
    });
  };
  exports.read = function(fd, buffer, offset, length, position, callback) {
    if (typeof callback === "function") {
      return fs2.read(fd, buffer, offset, length, position, callback);
    }
    return new Promise((resolve, reject) => {
      fs2.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
        if (err) return reject(err);
        resolve({ bytesRead, buffer: buffer2 });
      });
    });
  };
  exports.write = function(fd, buffer, ...args) {
    if (typeof args[args.length - 1] === "function") {
      return fs2.write(fd, buffer, ...args);
    }
    return new Promise((resolve, reject) => {
      fs2.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
        if (err) return reject(err);
        resolve({ bytesWritten, buffer: buffer2 });
      });
    });
  };
  exports.readv = function(fd, buffers, ...args) {
    if (typeof args[args.length - 1] === "function") {
      return fs2.readv(fd, buffers, ...args);
    }
    return new Promise((resolve, reject) => {
      fs2.readv(fd, buffers, ...args, (err, bytesRead, buffers2) => {
        if (err) return reject(err);
        resolve({ bytesRead, buffers: buffers2 });
      });
    });
  };
  exports.writev = function(fd, buffers, ...args) {
    if (typeof args[args.length - 1] === "function") {
      return fs2.writev(fd, buffers, ...args);
    }
    return new Promise((resolve, reject) => {
      fs2.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
        if (err) return reject(err);
        resolve({ bytesWritten, buffers: buffers2 });
      });
    });
  };
  if (typeof fs2.realpath.native === "function") {
    exports.realpath.native = u2(fs2.realpath.native);
  } else {
    process.emitWarning(
      "fs.realpath.native is not a function. Is fs being monkey-patched?",
      "Warning",
      "fs-extra-WARN0003"
    );
  }
})(fs$h);
var makeDir$1 = {};
var utils$2 = {};
const path$b = require$$1;
utils$2.checkPath = function checkPath(pth2) {
  if (process.platform === "win32") {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth2.replace(path$b.parse(pth2).root, ""));
    if (pathHasInvalidWinCharacters) {
      const error = new Error(`Path contains invalid characters: ${pth2}`);
      error.code = "EINVAL";
      throw error;
    }
  }
};
const fs$f = fs$h;
const { checkPath: checkPath2 } = utils$2;
const getMode = (options) => {
  const defaults = { mode: 511 };
  if (typeof options === "number") return options;
  return { ...defaults, ...options }.mode;
};
makeDir$1.makeDir = async (dir, options) => {
  checkPath2(dir);
  return fs$f.mkdir(dir, {
    mode: getMode(options),
    recursive: true
  });
};
makeDir$1.makeDirSync = (dir, options) => {
  checkPath2(dir);
  return fs$f.mkdirSync(dir, {
    mode: getMode(options),
    recursive: true
  });
};
const u$e = universalify$1.fromPromise;
const { makeDir: _makeDir, makeDirSync } = makeDir$1;
const makeDir = u$e(_makeDir);
var mkdirs$2 = {
  mkdirs: makeDir,
  mkdirsSync: makeDirSync,
  // alias
  mkdirp: makeDir,
  mkdirpSync: makeDirSync,
  ensureDir: makeDir,
  ensureDirSync: makeDirSync
};
const u$d = universalify$1.fromPromise;
const fs$e = fs$h;
function pathExists$6(path2) {
  return fs$e.access(path2).then(() => true).catch(() => false);
}
var pathExists_1 = {
  pathExists: u$d(pathExists$6),
  pathExistsSync: fs$e.existsSync
};
const fs$d = fs$h;
const u$c = universalify$1.fromPromise;
async function utimesMillis$1(path2, atime, mtime) {
  const fd = await fs$d.open(path2, "r+");
  let closeErr = null;
  try {
    await fs$d.futimes(fd, atime, mtime);
  } finally {
    try {
      await fs$d.close(fd);
    } catch (e) {
      closeErr = e;
    }
  }
  if (closeErr) {
    throw closeErr;
  }
}
function utimesMillisSync$1(path2, atime, mtime) {
  const fd = fs$d.openSync(path2, "r+");
  fs$d.futimesSync(fd, atime, mtime);
  return fs$d.closeSync(fd);
}
var utimes = {
  utimesMillis: u$c(utimesMillis$1),
  utimesMillisSync: utimesMillisSync$1
};
const fs$c = fs$h;
const path$a = require$$1;
const u$b = universalify$1.fromPromise;
function getStats$1(src, dest, opts) {
  const statFunc = opts.dereference ? (file2) => fs$c.stat(file2, { bigint: true }) : (file2) => fs$c.lstat(file2, { bigint: true });
  return Promise.all([
    statFunc(src),
    statFunc(dest).catch((err) => {
      if (err.code === "ENOENT") return null;
      throw err;
    })
  ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
}
function getStatsSync(src, dest, opts) {
  let destStat;
  const statFunc = opts.dereference ? (file2) => fs$c.statSync(file2, { bigint: true }) : (file2) => fs$c.lstatSync(file2, { bigint: true });
  const srcStat = statFunc(src);
  try {
    destStat = statFunc(dest);
  } catch (err) {
    if (err.code === "ENOENT") return { srcStat, destStat: null };
    throw err;
  }
  return { srcStat, destStat };
}
async function checkPaths(src, dest, funcName, opts) {
  const { srcStat, destStat } = await getStats$1(src, dest, opts);
  if (destStat) {
    if (areIdentical$2(srcStat, destStat)) {
      const srcBaseName = path$a.basename(src);
      const destBaseName = path$a.basename(dest);
      if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
        return { srcStat, destStat, isChangingCase: true };
      }
      throw new Error("Source and destination must not be the same.");
    }
    if (srcStat.isDirectory() && !destStat.isDirectory()) {
      throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
    }
    if (!srcStat.isDirectory() && destStat.isDirectory()) {
      throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
    }
  }
  if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
    throw new Error(errMsg(src, dest, funcName));
  }
  return { srcStat, destStat };
}
function checkPathsSync(src, dest, funcName, opts) {
  const { srcStat, destStat } = getStatsSync(src, dest, opts);
  if (destStat) {
    if (areIdentical$2(srcStat, destStat)) {
      const srcBaseName = path$a.basename(src);
      const destBaseName = path$a.basename(dest);
      if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
        return { srcStat, destStat, isChangingCase: true };
      }
      throw new Error("Source and destination must not be the same.");
    }
    if (srcStat.isDirectory() && !destStat.isDirectory()) {
      throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
    }
    if (!srcStat.isDirectory() && destStat.isDirectory()) {
      throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
    }
  }
  if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
    throw new Error(errMsg(src, dest, funcName));
  }
  return { srcStat, destStat };
}
async function checkParentPaths(src, srcStat, dest, funcName) {
  const srcParent = path$a.resolve(path$a.dirname(src));
  const destParent = path$a.resolve(path$a.dirname(dest));
  if (destParent === srcParent || destParent === path$a.parse(destParent).root) return;
  let destStat;
  try {
    destStat = await fs$c.stat(destParent, { bigint: true });
  } catch (err) {
    if (err.code === "ENOENT") return;
    throw err;
  }
  if (areIdentical$2(srcStat, destStat)) {
    throw new Error(errMsg(src, dest, funcName));
  }
  return checkParentPaths(src, srcStat, destParent, funcName);
}
function checkParentPathsSync(src, srcStat, dest, funcName) {
  const srcParent = path$a.resolve(path$a.dirname(src));
  const destParent = path$a.resolve(path$a.dirname(dest));
  if (destParent === srcParent || destParent === path$a.parse(destParent).root) return;
  let destStat;
  try {
    destStat = fs$c.statSync(destParent, { bigint: true });
  } catch (err) {
    if (err.code === "ENOENT") return;
    throw err;
  }
  if (areIdentical$2(srcStat, destStat)) {
    throw new Error(errMsg(src, dest, funcName));
  }
  return checkParentPathsSync(src, srcStat, destParent, funcName);
}
function areIdentical$2(srcStat, destStat) {
  return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
}
function isSrcSubdir(src, dest) {
  const srcArr = path$a.resolve(src).split(path$a.sep).filter((i) => i);
  const destArr = path$a.resolve(dest).split(path$a.sep).filter((i) => i);
  return srcArr.every((cur, i) => destArr[i] === cur);
}
function errMsg(src, dest, funcName) {
  return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
}
var stat$4 = {
  // checkPaths
  checkPaths: u$b(checkPaths),
  checkPathsSync,
  // checkParent
  checkParentPaths: u$b(checkParentPaths),
  checkParentPathsSync,
  // Misc
  isSrcSubdir,
  areIdentical: areIdentical$2
};
const fs$b = fs$h;
const path$9 = require$$1;
const { mkdirs: mkdirs$1 } = mkdirs$2;
const { pathExists: pathExists$5 } = pathExists_1;
const { utimesMillis } = utimes;
const stat$3 = stat$4;
async function copy$2(src, dest, opts = {}) {
  if (typeof opts === "function") {
    opts = { filter: opts };
  }
  opts.clobber = "clobber" in opts ? !!opts.clobber : true;
  opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
  if (opts.preserveTimestamps && process.arch === "ia32") {
    process.emitWarning(
      "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
      "Warning",
      "fs-extra-WARN0001"
    );
  }
  const { srcStat, destStat } = await stat$3.checkPaths(src, dest, "copy", opts);
  await stat$3.checkParentPaths(src, srcStat, dest, "copy");
  const include = await runFilter(src, dest, opts);
  if (!include) return;
  const destParent = path$9.dirname(dest);
  const dirExists = await pathExists$5(destParent);
  if (!dirExists) {
    await mkdirs$1(destParent);
  }
  await getStatsAndPerformCopy(destStat, src, dest, opts);
}
async function runFilter(src, dest, opts) {
  if (!opts.filter) return true;
  return opts.filter(src, dest);
}
async function getStatsAndPerformCopy(destStat, src, dest, opts) {
  const statFn = opts.dereference ? fs$b.stat : fs$b.lstat;
  const srcStat = await statFn(src);
  if (srcStat.isDirectory()) return onDir$1(srcStat, destStat, src, dest, opts);
  if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile$1(srcStat, destStat, src, dest, opts);
  if (srcStat.isSymbolicLink()) return onLink$1(destStat, src, dest, opts);
  if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`);
  if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`);
  throw new Error(`Unknown file: ${src}`);
}
async function onFile$1(srcStat, destStat, src, dest, opts) {
  if (!destStat) return copyFile$1(srcStat, src, dest, opts);
  if (opts.overwrite) {
    await fs$b.unlink(dest);
    return copyFile$1(srcStat, src, dest, opts);
  }
  if (opts.errorOnExist) {
    throw new Error(`'${dest}' already exists`);
  }
}
async function copyFile$1(srcStat, src, dest, opts) {
  await fs$b.copyFile(src, dest);
  if (opts.preserveTimestamps) {
    if (fileIsNotWritable$1(srcStat.mode)) {
      await makeFileWritable$1(dest, srcStat.mode);
    }
    const updatedSrcStat = await fs$b.stat(src);
    await utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
  }
  return fs$b.chmod(dest, srcStat.mode);
}
function fileIsNotWritable$1(srcMode) {
  return (srcMode & 128) === 0;
}
function makeFileWritable$1(dest, srcMode) {
  return fs$b.chmod(dest, srcMode | 128);
}
async function onDir$1(srcStat, destStat, src, dest, opts) {
  if (!destStat) {
    await fs$b.mkdir(dest);
  }
  const items = await fs$b.readdir(src);
  await Promise.all(items.map(async (item) => {
    const srcItem = path$9.join(src, item);
    const destItem = path$9.join(dest, item);
    const include = await runFilter(srcItem, destItem, opts);
    if (!include) return;
    const { destStat: destStat2 } = await stat$3.checkPaths(srcItem, destItem, "copy", opts);
    return getStatsAndPerformCopy(destStat2, srcItem, destItem, opts);
  }));
  if (!destStat) {
    await fs$b.chmod(dest, srcStat.mode);
  }
}
async function onLink$1(destStat, src, dest, opts) {
  let resolvedSrc = await fs$b.readlink(src);
  if (opts.dereference) {
    resolvedSrc = path$9.resolve(process.cwd(), resolvedSrc);
  }
  if (!destStat) {
    return fs$b.symlink(resolvedSrc, dest);
  }
  let resolvedDest = null;
  try {
    resolvedDest = await fs$b.readlink(dest);
  } catch (e) {
    if (e.code === "EINVAL" || e.code === "UNKNOWN") return fs$b.symlink(resolvedSrc, dest);
    throw e;
  }
  if (opts.dereference) {
    resolvedDest = path$9.resolve(process.cwd(), resolvedDest);
  }
  if (stat$3.isSrcSubdir(resolvedSrc, resolvedDest)) {
    throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
  }
  if (stat$3.isSrcSubdir(resolvedDest, resolvedSrc)) {
    throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
  }
  await fs$b.unlink(dest);
  return fs$b.symlink(resolvedSrc, dest);
}
var copy_1 = copy$2;
const fs$a = gracefulFs;
const path$8 = require$$1;
const mkdirsSync$1 = mkdirs$2.mkdirsSync;
const utimesMillisSync = utimes.utimesMillisSync;
const stat$2 = stat$4;
function copySync$1(src, dest, opts) {
  if (typeof opts === "function") {
    opts = { filter: opts };
  }
  opts = opts || {};
  opts.clobber = "clobber" in opts ? !!opts.clobber : true;
  opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
  if (opts.preserveTimestamps && process.arch === "ia32") {
    process.emitWarning(
      "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
      "Warning",
      "fs-extra-WARN0002"
    );
  }
  const { srcStat, destStat } = stat$2.checkPathsSync(src, dest, "copy", opts);
  stat$2.checkParentPathsSync(src, srcStat, dest, "copy");
  if (opts.filter && !opts.filter(src, dest)) return;
  const destParent = path$8.dirname(dest);
  if (!fs$a.existsSync(destParent)) mkdirsSync$1(destParent);
  return getStats(destStat, src, dest, opts);
}
function getStats(destStat, src, dest, opts) {
  const statSync = opts.dereference ? fs$a.statSync : fs$a.lstatSync;
  const srcStat = statSync(src);
  if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts);
  else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts);
  else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts);
  else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`);
  else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`);
  throw new Error(`Unknown file: ${src}`);
}
function onFile(srcStat, destStat, src, dest, opts) {
  if (!destStat) return copyFile(srcStat, src, dest, opts);
  return mayCopyFile(srcStat, src, dest, opts);
}
function mayCopyFile(srcStat, src, dest, opts) {
  if (opts.overwrite) {
    fs$a.unlinkSync(dest);
    return copyFile(srcStat, src, dest, opts);
  } else if (opts.errorOnExist) {
    throw new Error(`'${dest}' already exists`);
  }
}
function copyFile(srcStat, src, dest, opts) {
  fs$a.copyFileSync(src, dest);
  if (opts.preserveTimestamps) handleTimestamps(srcStat.mode, src, dest);
  return setDestMode(dest, srcStat.mode);
}
function handleTimestamps(srcMode, src, dest) {
  if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode);
  return setDestTimestamps(src, dest);
}
function fileIsNotWritable(srcMode) {
  return (srcMode & 128) === 0;
}
function makeFileWritable(dest, srcMode) {
  return setDestMode(dest, srcMode | 128);
}
function setDestMode(dest, srcMode) {
  return fs$a.chmodSync(dest, srcMode);
}
function setDestTimestamps(src, dest) {
  const updatedSrcStat = fs$a.statSync(src);
  return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
}
function onDir(srcStat, destStat, src, dest, opts) {
  if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts);
  return copyDir(src, dest, opts);
}
function mkDirAndCopy(srcMode, src, dest, opts) {
  fs$a.mkdirSync(dest);
  copyDir(src, dest, opts);
  return setDestMode(dest, srcMode);
}
function copyDir(src, dest, opts) {
  fs$a.readdirSync(src).forEach((item) => copyDirItem(item, src, dest, opts));
}
function copyDirItem(item, src, dest, opts) {
  const srcItem = path$8.join(src, item);
  const destItem = path$8.join(dest, item);
  if (opts.filter && !opts.filter(srcItem, destItem)) return;
  const { destStat } = stat$2.checkPathsSync(srcItem, destItem, "copy", opts);
  return getStats(destStat, srcItem, destItem, opts);
}
function onLink(destStat, src, dest, opts) {
  let resolvedSrc = fs$a.readlinkSync(src);
  if (opts.dereference) {
    resolvedSrc = path$8.resolve(process.cwd(), resolvedSrc);
  }
  if (!destStat) {
    return fs$a.symlinkSync(resolvedSrc, dest);
  } else {
    let resolvedDest;
    try {
      resolvedDest = fs$a.readlinkSync(dest);
    } catch (err) {
      if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs$a.symlinkSync(resolvedSrc, dest);
      throw err;
    }
    if (opts.dereference) {
      resolvedDest = path$8.resolve(process.cwd(), resolvedDest);
    }
    if (stat$2.isSrcSubdir(resolvedSrc, resolvedDest)) {
      throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
    }
    if (stat$2.isSrcSubdir(resolvedDest, resolvedSrc)) {
      throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
    }
    return copyLink(resolvedSrc, dest);
  }
}
function copyLink(resolvedSrc, dest) {
  fs$a.unlinkSync(dest);
  return fs$a.symlinkSync(resolvedSrc, dest);
}
var copySync_1 = copySync$1;
const u$a = universalify$1.fromPromise;
var copy$1 = {
  copy: u$a(copy_1),
  copySync: copySync_1
};
const fs$9 = gracefulFs;
const u$9 = universalify$1.fromCallback;
function remove$2(path2, callback) {
  fs$9.rm(path2, { recursive: true, force: true }, callback);
}
function removeSync$1(path2) {
  fs$9.rmSync(path2, { recursive: true, force: true });
}
var remove_1 = {
  remove: u$9(remove$2),
  removeSync: removeSync$1
};
const u$8 = universalify$1.fromPromise;
const fs$8 = fs$h;
const path$7 = require$$1;
const mkdir$3 = mkdirs$2;
const remove$1 = remove_1;
const emptyDir = u$8(async function emptyDir2(dir) {
  let items;
  try {
    items = await fs$8.readdir(dir);
  } catch {
    return mkdir$3.mkdirs(dir);
  }
  return Promise.all(items.map((item) => remove$1.remove(path$7.join(dir, item))));
});
function emptyDirSync(dir) {
  let items;
  try {
    items = fs$8.readdirSync(dir);
  } catch {
    return mkdir$3.mkdirsSync(dir);
  }
  items.forEach((item) => {
    item = path$7.join(dir, item);
    remove$1.removeSync(item);
  });
}
var empty = {
  emptyDirSync,
  emptydirSync: emptyDirSync,
  emptyDir,
  emptydir: emptyDir
};
const u$7 = universalify$1.fromPromise;
const path$6 = require$$1;
const fs$7 = fs$h;
const mkdir$2 = mkdirs$2;
async function createFile$1(file2) {
  let stats;
  try {
    stats = await fs$7.stat(file2);
  } catch {
  }
  if (stats && stats.isFile()) return;
  const dir = path$6.dirname(file2);
  let dirStats = null;
  try {
    dirStats = await fs$7.stat(dir);
  } catch (err) {
    if (err.code === "ENOENT") {
      await mkdir$2.mkdirs(dir);
      await fs$7.writeFile(file2, "");
      return;
    } else {
      throw err;
    }
  }
  if (dirStats.isDirectory()) {
    await fs$7.writeFile(file2, "");
  } else {
    await fs$7.readdir(dir);
  }
}
function createFileSync$1(file2) {
  let stats;
  try {
    stats = fs$7.statSync(file2);
  } catch {
  }
  if (stats && stats.isFile()) return;
  const dir = path$6.dirname(file2);
  try {
    if (!fs$7.statSync(dir).isDirectory()) {
      fs$7.readdirSync(dir);
    }
  } catch (err) {
    if (err && err.code === "ENOENT") mkdir$2.mkdirsSync(dir);
    else throw err;
  }
  fs$7.writeFileSync(file2, "");
}
var file = {
  createFile: u$7(createFile$1),
  createFileSync: createFileSync$1
};
const u$6 = universalify$1.fromPromise;
const path$5 = require$$1;
const fs$6 = fs$h;
const mkdir$1 = mkdirs$2;
const { pathExists: pathExists$4 } = pathExists_1;
const { areIdentical: areIdentical$1 } = stat$4;
async function createLink$1(srcpath, dstpath) {
  let dstStat;
  try {
    dstStat = await fs$6.lstat(dstpath);
  } catch {
  }
  let srcStat;
  try {
    srcStat = await fs$6.lstat(srcpath);
  } catch (err) {
    err.message = err.message.replace("lstat", "ensureLink");
    throw err;
  }
  if (dstStat && areIdentical$1(srcStat, dstStat)) return;
  const dir = path$5.dirname(dstpath);
  const dirExists = await pathExists$4(dir);
  if (!dirExists) {
    await mkdir$1.mkdirs(dir);
  }
  await fs$6.link(srcpath, dstpath);
}
function createLinkSync$1(srcpath, dstpath) {
  let dstStat;
  try {
    dstStat = fs$6.lstatSync(dstpath);
  } catch {
  }
  try {
    const srcStat = fs$6.lstatSync(srcpath);
    if (dstStat && areIdentical$1(srcStat, dstStat)) return;
  } catch (err) {
    err.message = err.message.replace("lstat", "ensureLink");
    throw err;
  }
  const dir = path$5.dirname(dstpath);
  const dirExists = fs$6.existsSync(dir);
  if (dirExists) return fs$6.linkSync(srcpath, dstpath);
  mkdir$1.mkdirsSync(dir);
  return fs$6.linkSync(srcpath, dstpath);
}
var link = {
  createLink: u$6(createLink$1),
  createLinkSync: createLinkSync$1
};
const path$4 = require$$1;
const fs$5 = fs$h;
const { pathExists: pathExists$3 } = pathExists_1;
const u$5 = universalify$1.fromPromise;
async function symlinkPaths$1(srcpath, dstpath) {
  if (path$4.isAbsolute(srcpath)) {
    try {
      await fs$5.lstat(srcpath);
    } catch (err) {
      err.message = err.message.replace("lstat", "ensureSymlink");
      throw err;
    }
    return {
      toCwd: srcpath,
      toDst: srcpath
    };
  }
  const dstdir = path$4.dirname(dstpath);
  const relativeToDst = path$4.join(dstdir, srcpath);
  const exists = await pathExists$3(relativeToDst);
  if (exists) {
    return {
      toCwd: relativeToDst,
      toDst: srcpath
    };
  }
  try {
    await fs$5.lstat(srcpath);
  } catch (err) {
    err.message = err.message.replace("lstat", "ensureSymlink");
    throw err;
  }
  return {
    toCwd: srcpath,
    toDst: path$4.relative(dstdir, srcpath)
  };
}
function symlinkPathsSync$1(srcpath, dstpath) {
  if (path$4.isAbsolute(srcpath)) {
    const exists2 = fs$5.existsSync(srcpath);
    if (!exists2) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: srcpath,
      toDst: srcpath
    };
  }
  const dstdir = path$4.dirname(dstpath);
  const relativeToDst = path$4.join(dstdir, srcpath);
  const exists = fs$5.existsSync(relativeToDst);
  if (exists) {
    return {
      toCwd: relativeToDst,
      toDst: srcpath
    };
  }
  const srcExists = fs$5.existsSync(srcpath);
  if (!srcExists) throw new Error("relative srcpath does not exist");
  return {
    toCwd: srcpath,
    toDst: path$4.relative(dstdir, srcpath)
  };
}
var symlinkPaths_1 = {
  symlinkPaths: u$5(symlinkPaths$1),
  symlinkPathsSync: symlinkPathsSync$1
};
const fs$4 = fs$h;
const u$4 = universalify$1.fromPromise;
async function symlinkType$1(srcpath, type) {
  if (type) return type;
  let stats;
  try {
    stats = await fs$4.lstat(srcpath);
  } catch {
    return "file";
  }
  return stats && stats.isDirectory() ? "dir" : "file";
}
function symlinkTypeSync$1(srcpath, type) {
  if (type) return type;
  let stats;
  try {
    stats = fs$4.lstatSync(srcpath);
  } catch {
    return "file";
  }
  return stats && stats.isDirectory() ? "dir" : "file";
}
var symlinkType_1 = {
  symlinkType: u$4(symlinkType$1),
  symlinkTypeSync: symlinkTypeSync$1
};
const u$3 = universalify$1.fromPromise;
const path$3 = require$$1;
const fs$3 = fs$h;
const { mkdirs, mkdirsSync } = mkdirs$2;
const { symlinkPaths, symlinkPathsSync } = symlinkPaths_1;
const { symlinkType, symlinkTypeSync } = symlinkType_1;
const { pathExists: pathExists$2 } = pathExists_1;
const { areIdentical } = stat$4;
async function createSymlink$1(srcpath, dstpath, type) {
  let stats;
  try {
    stats = await fs$3.lstat(dstpath);
  } catch {
  }
  if (stats && stats.isSymbolicLink()) {
    const [srcStat, dstStat] = await Promise.all([
      fs$3.stat(srcpath),
      fs$3.stat(dstpath)
    ]);
    if (areIdentical(srcStat, dstStat)) return;
  }
  const relative = await symlinkPaths(srcpath, dstpath);
  srcpath = relative.toDst;
  const toType = await symlinkType(relative.toCwd, type);
  const dir = path$3.dirname(dstpath);
  if (!await pathExists$2(dir)) {
    await mkdirs(dir);
  }
  return fs$3.symlink(srcpath, dstpath, toType);
}
function createSymlinkSync$1(srcpath, dstpath, type) {
  let stats;
  try {
    stats = fs$3.lstatSync(dstpath);
  } catch {
  }
  if (stats && stats.isSymbolicLink()) {
    const srcStat = fs$3.statSync(srcpath);
    const dstStat = fs$3.statSync(dstpath);
    if (areIdentical(srcStat, dstStat)) return;
  }
  const relative = symlinkPathsSync(srcpath, dstpath);
  srcpath = relative.toDst;
  type = symlinkTypeSync(relative.toCwd, type);
  const dir = path$3.dirname(dstpath);
  const exists = fs$3.existsSync(dir);
  if (exists) return fs$3.symlinkSync(srcpath, dstpath, type);
  mkdirsSync(dir);
  return fs$3.symlinkSync(srcpath, dstpath, type);
}
var symlink = {
  createSymlink: u$3(createSymlink$1),
  createSymlinkSync: createSymlinkSync$1
};
const { createFile, createFileSync } = file;
const { createLink, createLinkSync } = link;
const { createSymlink, createSymlinkSync } = symlink;
var ensure = {
  // file
  createFile,
  createFileSync,
  ensureFile: createFile,
  ensureFileSync: createFileSync,
  // link
  createLink,
  createLinkSync,
  ensureLink: createLink,
  ensureLinkSync: createLinkSync,
  // symlink
  createSymlink,
  createSymlinkSync,
  ensureSymlink: createSymlink,
  ensureSymlinkSync: createSymlinkSync
};
function stringify$3(obj, { EOL = "\n", finalEOL = true, replacer = null, spaces } = {}) {
  const EOF = finalEOL ? EOL : "";
  const str = JSON.stringify(obj, replacer, spaces);
  return str.replace(/\n/g, EOL) + EOF;
}
function stripBom$1(content) {
  if (Buffer.isBuffer(content)) content = content.toString("utf8");
  return content.replace(/^\uFEFF/, "");
}
var utils$1 = { stringify: stringify$3, stripBom: stripBom$1 };
let _fs;
try {
  _fs = gracefulFs;
} catch (_) {
  _fs = fs$i;
}
const universalify = universalify$1;
const { stringify: stringify$2, stripBom } = utils$1;
async function _readFile(file2, options = {}) {
  if (typeof options === "string") {
    options = { encoding: options };
  }
  const fs2 = options.fs || _fs;
  const shouldThrow = "throws" in options ? options.throws : true;
  let data = await universalify.fromCallback(fs2.readFile)(file2, options);
  data = stripBom(data);
  let obj;
  try {
    obj = JSON.parse(data, options ? options.reviver : null);
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file2}: ${err.message}`;
      throw err;
    } else {
      return null;
    }
  }
  return obj;
}
const readFile = universalify.fromPromise(_readFile);
function readFileSync(file2, options = {}) {
  if (typeof options === "string") {
    options = { encoding: options };
  }
  const fs2 = options.fs || _fs;
  const shouldThrow = "throws" in options ? options.throws : true;
  try {
    let content = fs2.readFileSync(file2, options);
    content = stripBom(content);
    return JSON.parse(content, options.reviver);
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file2}: ${err.message}`;
      throw err;
    } else {
      return null;
    }
  }
}
async function _writeFile(file2, obj, options = {}) {
  const fs2 = options.fs || _fs;
  const str = stringify$2(obj, options);
  await universalify.fromCallback(fs2.writeFile)(file2, str, options);
}
const writeFile = universalify.fromPromise(_writeFile);
function writeFileSync(file2, obj, options = {}) {
  const fs2 = options.fs || _fs;
  const str = stringify$2(obj, options);
  return fs2.writeFileSync(file2, str, options);
}
const jsonfile$1 = {
  readFile,
  readFileSync,
  writeFile,
  writeFileSync
};
var jsonfile_1 = jsonfile$1;
const jsonFile$1 = jsonfile_1;
var jsonfile = {
  // jsonfile exports
  readJson: jsonFile$1.readFile,
  readJsonSync: jsonFile$1.readFileSync,
  writeJson: jsonFile$1.writeFile,
  writeJsonSync: jsonFile$1.writeFileSync
};
const u$2 = universalify$1.fromPromise;
const fs$2 = fs$h;
const path$2 = require$$1;
const mkdir = mkdirs$2;
const pathExists$1 = pathExists_1.pathExists;
async function outputFile$1(file2, data, encoding = "utf-8") {
  const dir = path$2.dirname(file2);
  if (!await pathExists$1(dir)) {
    await mkdir.mkdirs(dir);
  }
  return fs$2.writeFile(file2, data, encoding);
}
function outputFileSync$1(file2, ...args) {
  const dir = path$2.dirname(file2);
  if (!fs$2.existsSync(dir)) {
    mkdir.mkdirsSync(dir);
  }
  fs$2.writeFileSync(file2, ...args);
}
var outputFile_1 = {
  outputFile: u$2(outputFile$1),
  outputFileSync: outputFileSync$1
};
const { stringify: stringify$1 } = utils$1;
const { outputFile } = outputFile_1;
async function outputJson(file2, data, options = {}) {
  const str = stringify$1(data, options);
  await outputFile(file2, str, options);
}
var outputJson_1 = outputJson;
const { stringify } = utils$1;
const { outputFileSync } = outputFile_1;
function outputJsonSync(file2, data, options) {
  const str = stringify(data, options);
  outputFileSync(file2, str, options);
}
var outputJsonSync_1 = outputJsonSync;
const u$1 = universalify$1.fromPromise;
const jsonFile = jsonfile;
jsonFile.outputJson = u$1(outputJson_1);
jsonFile.outputJsonSync = outputJsonSync_1;
jsonFile.outputJSON = jsonFile.outputJson;
jsonFile.outputJSONSync = jsonFile.outputJsonSync;
jsonFile.writeJSON = jsonFile.writeJson;
jsonFile.writeJSONSync = jsonFile.writeJsonSync;
jsonFile.readJSON = jsonFile.readJson;
jsonFile.readJSONSync = jsonFile.readJsonSync;
var json = jsonFile;
const fs$1 = fs$h;
const path$1 = require$$1;
const { copy } = copy$1;
const { remove } = remove_1;
const { mkdirp } = mkdirs$2;
const { pathExists } = pathExists_1;
const stat$1 = stat$4;
async function move$1(src, dest, opts = {}) {
  const overwrite = opts.overwrite || opts.clobber || false;
  const { srcStat, isChangingCase = false } = await stat$1.checkPaths(src, dest, "move", opts);
  await stat$1.checkParentPaths(src, srcStat, dest, "move");
  const destParent = path$1.dirname(dest);
  const parsedParentPath = path$1.parse(destParent);
  if (parsedParentPath.root !== destParent) {
    await mkdirp(destParent);
  }
  return doRename$1(src, dest, overwrite, isChangingCase);
}
async function doRename$1(src, dest, overwrite, isChangingCase) {
  if (!isChangingCase) {
    if (overwrite) {
      await remove(dest);
    } else if (await pathExists(dest)) {
      throw new Error("dest already exists.");
    }
  }
  try {
    await fs$1.rename(src, dest);
  } catch (err) {
    if (err.code !== "EXDEV") {
      throw err;
    }
    await moveAcrossDevice$1(src, dest, overwrite);
  }
}
async function moveAcrossDevice$1(src, dest, overwrite) {
  const opts = {
    overwrite,
    errorOnExist: true,
    preserveTimestamps: true
  };
  await copy(src, dest, opts);
  return remove(src);
}
var move_1 = move$1;
const fs = gracefulFs;
const path = require$$1;
const copySync = copy$1.copySync;
const removeSync = remove_1.removeSync;
const mkdirpSync = mkdirs$2.mkdirpSync;
const stat = stat$4;
function moveSync(src, dest, opts) {
  opts = opts || {};
  const overwrite = opts.overwrite || opts.clobber || false;
  const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, "move", opts);
  stat.checkParentPathsSync(src, srcStat, dest, "move");
  if (!isParentRoot(dest)) mkdirpSync(path.dirname(dest));
  return doRename(src, dest, overwrite, isChangingCase);
}
function isParentRoot(dest) {
  const parent = path.dirname(dest);
  const parsedPath = path.parse(parent);
  return parsedPath.root === parent;
}
function doRename(src, dest, overwrite, isChangingCase) {
  if (isChangingCase) return rename(src, dest, overwrite);
  if (overwrite) {
    removeSync(dest);
    return rename(src, dest, overwrite);
  }
  if (fs.existsSync(dest)) throw new Error("dest already exists.");
  return rename(src, dest, overwrite);
}
function rename(src, dest, overwrite) {
  try {
    fs.renameSync(src, dest);
  } catch (err) {
    if (err.code !== "EXDEV") throw err;
    return moveAcrossDevice(src, dest, overwrite);
  }
}
function moveAcrossDevice(src, dest, overwrite) {
  const opts = {
    overwrite,
    errorOnExist: true,
    preserveTimestamps: true
  };
  copySync(src, dest, opts);
  return removeSync(src);
}
var moveSync_1 = moveSync;
const u = universalify$1.fromPromise;
var move = {
  move: u(move_1),
  moveSync: moveSync_1
};
var lib = {
  // Export promiseified graceful-fs:
  ...fs$h,
  // Export extra methods:
  ...copy$1,
  ...empty,
  ...ensure,
  ...json,
  ...mkdirs$2,
  ...move,
  ...outputFile_1,
  ...pathExists_1,
  ...remove_1
};
var util = { exports: {} };
var constants = {
  /* The local file header */
  LOCHDR: 30,
  // LOC header size
  LOCSIG: 67324752,
  // "PK\003\004"
  LOCVER: 4,
  // version needed to extract
  LOCFLG: 6,
  // general purpose bit flag
  LOCHOW: 8,
  // compression method
  LOCTIM: 10,
  // modification time (2 bytes time, 2 bytes date)
  LOCCRC: 14,
  // uncompressed file crc-32 value
  LOCSIZ: 18,
  // compressed size
  LOCLEN: 22,
  // uncompressed size
  LOCNAM: 26,
  // filename length
  LOCEXT: 28,
  // extra field length
  /* The Data descriptor */
  EXTSIG: 134695760,
  // "PK\007\008"
  EXTHDR: 16,
  // EXT header size
  EXTCRC: 4,
  // uncompressed file crc-32 value
  EXTSIZ: 8,
  // compressed size
  EXTLEN: 12,
  // uncompressed size
  /* The central directory file header */
  CENHDR: 46,
  // CEN header size
  CENSIG: 33639248,
  // "PK\001\002"
  CENVEM: 4,
  // version made by
  CENVER: 6,
  // version needed to extract
  CENFLG: 8,
  // encrypt, decrypt flags
  CENHOW: 10,
  // compression method
  CENTIM: 12,
  // modification time (2 bytes time, 2 bytes date)
  CENCRC: 16,
  // uncompressed file crc-32 value
  CENSIZ: 20,
  // compressed size
  CENLEN: 24,
  // uncompressed size
  CENNAM: 28,
  // filename length
  CENEXT: 30,
  // extra field length
  CENCOM: 32,
  // file comment length
  CENDSK: 34,
  // volume number start
  CENATT: 36,
  // internal file attributes
  CENATX: 38,
  // external file attributes (host system dependent)
  CENOFF: 42,
  // LOC header offset
  /* The entries in the end of central directory */
  ENDHDR: 22,
  // END header size
  ENDSIG: 101010256,
  // "PK\005\006"
  ENDSUB: 8,
  // number of entries on this disk
  ENDTOT: 10,
  // total number of entries
  ENDSIZ: 12,
  // central directory size in bytes
  ENDOFF: 16,
  // offset of first CEN header
  ENDCOM: 20,
  // zip file comment length
  END64HDR: 20,
  // zip64 END header size
  END64SIG: 117853008,
  // zip64 Locator signature, "PK\006\007"
  END64START: 4,
  // number of the disk with the start of the zip64
  END64OFF: 8,
  // relative offset of the zip64 end of central directory
  END64NUMDISKS: 16,
  // total number of disks
  ZIP64SIG: 101075792,
  // zip64 signature, "PK\006\006"
  ZIP64HDR: 56,
  // zip64 record minimum size
  ZIP64LEAD: 12,
  // leading bytes at the start of the record, not counted by the value stored in ZIP64SIZE
  ZIP64SIZE: 4,
  // zip64 size of the central directory record
  ZIP64VEM: 12,
  // zip64 version made by
  ZIP64VER: 14,
  // zip64 version needed to extract
  ZIP64DSK: 16,
  // zip64 number of this disk
  ZIP64DSKDIR: 20,
  // number of the disk with the start of the record directory
  ZIP64SUB: 24,
  // number of entries on this disk
  ZIP64TOT: 32,
  // total number of entries
  ZIP64SIZB: 40,
  // zip64 central directory size in bytes
  ZIP64OFF: 48,
  // offset of start of central directory with respect to the starting disk number
  ZIP64EXTRA: 56,
  // extensible data sector
  /* Compression methods */
  STORED: 0,
  // no compression
  SHRUNK: 1,
  // shrunk
  REDUCED1: 2,
  // reduced with compression factor 1
  REDUCED2: 3,
  // reduced with compression factor 2
  REDUCED3: 4,
  // reduced with compression factor 3
  REDUCED4: 5,
  // reduced with compression factor 4
  IMPLODED: 6,
  // imploded
  // 7 reserved for Tokenizing compression algorithm
  DEFLATED: 8,
  // deflated
  ENHANCED_DEFLATED: 9,
  // enhanced deflated
  PKWARE: 10,
  // PKWare DCL imploded
  // 11 reserved by PKWARE
  BZIP2: 12,
  //  compressed using BZIP2
  // 13 reserved by PKWARE
  LZMA: 14,
  // LZMA
  // 15-17 reserved by PKWARE
  IBM_TERSE: 18,
  // compressed using IBM TERSE
  IBM_LZ77: 19,
  // IBM LZ77 z
  AES_ENCRYPT: 99,
  // WinZIP AES encryption method
  /* General purpose bit flag */
  // values can obtained with expression 2**bitnr
  FLG_ENC: 1,
  // Bit 0: encrypted file
  FLG_COMP1: 2,
  // Bit 1, compression option
  FLG_COMP2: 4,
  // Bit 2, compression option
  FLG_DESC: 8,
  // Bit 3, data descriptor
  FLG_ENH: 16,
  // Bit 4, enhanced deflating
  FLG_PATCH: 32,
  // Bit 5, indicates that the file is compressed patched data.
  FLG_STR: 64,
  // Bit 6, strong encryption (patented)
  // Bits 7-10: Currently unused.
  FLG_EFS: 2048,
  // Bit 11: Language encoding flag (EFS)
  // Bit 12: Reserved by PKWARE for enhanced compression.
  // Bit 13: encrypted the Central Directory (patented).
  // Bits 14-15: Reserved by PKWARE.
  FLG_MSK: 4096,
  // mask header values
  /* Load type */
  FILE: 2,
  BUFFER: 1,
  NONE: 0,
  /* 4.5 Extensible data fields */
  EF_ID: 0,
  EF_SIZE: 2,
  /* Header IDs */
  ID_ZIP64: 1,
  ID_AVINFO: 7,
  ID_PFS: 8,
  ID_OS2: 9,
  ID_NTFS: 10,
  ID_OPENVMS: 12,
  ID_UNIX: 13,
  ID_FORK: 14,
  ID_PATCH: 15,
  ID_X509_PKCS7: 20,
  ID_X509_CERTID_F: 21,
  ID_X509_CERTID_C: 22,
  ID_STRONGENC: 23,
  ID_RECORD_MGT: 24,
  ID_X509_PKCS7_RL: 25,
  ID_IBM1: 101,
  ID_IBM2: 102,
  ID_POSZIP: 18064,
  EF_ZIP64_OR_32: 4294967295,
  EF_ZIP64_OR_16: 65535,
  EF_ZIP64_SUNCOMP: 0,
  EF_ZIP64_SCOMP: 8,
  EF_ZIP64_RHO: 16,
  EF_ZIP64_DSN: 24
};
var errors = {};
(function(exports) {
  const errors2 = {
    /* Header error messages */
    INVALID_LOC: "Invalid LOC header (bad signature)",
    INVALID_CEN: "Invalid CEN header (bad signature)",
    INVALID_END: "Invalid END header (bad signature)",
    /* Descriptor */
    DESCRIPTOR_NOT_EXIST: "No descriptor present",
    DESCRIPTOR_UNKNOWN: "Unknown descriptor format",
    DESCRIPTOR_FAULTY: "Descriptor data is malformed",
    /* ZipEntry error messages*/
    NO_DATA: "Nothing to decompress",
    BAD_CRC: "CRC32 checksum failed {0}",
    FILE_IN_THE_WAY: "There is a file in the way: {0}",
    UNKNOWN_METHOD: "Invalid/unsupported compression method",
    /* Inflater error messages */
    AVAIL_DATA: "inflate::Available inflate data did not terminate",
    INVALID_DISTANCE: "inflate::Invalid literal/length or distance code in fixed or dynamic block",
    TO_MANY_CODES: "inflate::Dynamic block code description: too many length or distance codes",
    INVALID_REPEAT_LEN: "inflate::Dynamic block code description: repeat more than specified lengths",
    INVALID_REPEAT_FIRST: "inflate::Dynamic block code description: repeat lengths with no first length",
    INCOMPLETE_CODES: "inflate::Dynamic block code description: code lengths codes incomplete",
    INVALID_DYN_DISTANCE: "inflate::Dynamic block code description: invalid distance code lengths",
    INVALID_CODES_LEN: "inflate::Dynamic block code description: invalid literal/length code lengths",
    INVALID_STORE_BLOCK: "inflate::Stored block length did not match one's complement",
    INVALID_BLOCK_TYPE: "inflate::Invalid block type (type == 3)",
    /* ADM-ZIP error messages */
    CANT_EXTRACT_FILE: "Could not extract the file",
    CANT_OVERRIDE: "Target file already exists",
    DISK_ENTRY_TOO_LARGE: "Number of disk entries is too large",
    NO_ZIP: "No zip file was loaded",
    NO_ENTRY: "Entry doesn't exist",
    DIRECTORY_CONTENT_ERROR: "A directory cannot have content",
    FILE_NOT_FOUND: 'File not found: "{0}"',
    NOT_IMPLEMENTED: "Not implemented",
    INVALID_FILENAME: "Invalid filename",
    INVALID_FORMAT: "Invalid or unsupported zip format. No END header found",
    INVALID_PASS_PARAM: "Incompatible password parameter",
    WRONG_PASSWORD: "Wrong Password",
    /* ADM-ZIP */
    COMMENT_TOO_LONG: "Comment is too long",
    // Comment can be max 65535 bytes long (NOTE: some non-US characters may take more space)
    EXTRA_FIELD_PARSE_ERROR: "Extra field parsing error"
  };
  function E(message) {
    return function(...args) {
      if (args.length) {
        message = message.replace(/\{(\d)\}/g, (_, n) => args[n] || "");
      }
      return new Error("ADM-ZIP: " + message);
    };
  }
  for (const msg of Object.keys(errors2)) {
    exports[msg] = E(errors2[msg]);
  }
})(errors);
const fsystem = fs$i;
const pth$2 = require$$1;
const Constants$3 = constants;
const Errors$1 = errors;
const isWin = typeof process === "object" && "win32" === process.platform;
const is_Obj = (obj) => typeof obj === "object" && obj !== null;
const crcTable = new Uint32Array(256).map((t, c) => {
  for (let k = 0; k < 8; k++) {
    if ((c & 1) !== 0) {
      c = 3988292384 ^ c >>> 1;
    } else {
      c >>>= 1;
    }
  }
  return c >>> 0;
});
function Utils$5(opts) {
  this.sep = pth$2.sep;
  this.fs = fsystem;
  if (is_Obj(opts)) {
    if (is_Obj(opts.fs) && typeof opts.fs.statSync === "function") {
      this.fs = opts.fs;
    }
  }
}
var utils = Utils$5;
Utils$5.prototype.makeDir = function(folder) {
  const self2 = this;
  function mkdirSync(fpath) {
    let resolvedPath = fpath.split(self2.sep)[0];
    fpath.split(self2.sep).forEach(function(name) {
      if (!name || name.substr(-1, 1) === ":") return;
      resolvedPath += self2.sep + name;
      var stat2;
      try {
        stat2 = self2.fs.statSync(resolvedPath);
      } catch (e) {
        self2.fs.mkdirSync(resolvedPath);
      }
      if (stat2 && stat2.isFile()) throw Errors$1.FILE_IN_THE_WAY(`"${resolvedPath}"`);
    });
  }
  mkdirSync(folder);
};
Utils$5.prototype.writeFileTo = function(path2, content, overwrite, attr) {
  const self2 = this;
  if (self2.fs.existsSync(path2)) {
    if (!overwrite) return false;
    var stat2 = self2.fs.statSync(path2);
    if (stat2.isDirectory()) {
      return false;
    }
  }
  var folder = pth$2.dirname(path2);
  if (!self2.fs.existsSync(folder)) {
    self2.makeDir(folder);
  }
  var fd;
  try {
    fd = self2.fs.openSync(path2, "w", 438);
  } catch (e) {
    self2.fs.chmodSync(path2, 438);
    fd = self2.fs.openSync(path2, "w", 438);
  }
  if (fd) {
    try {
      self2.fs.writeSync(fd, content, 0, content.length, 0);
    } finally {
      self2.fs.closeSync(fd);
    }
  }
  self2.fs.chmodSync(path2, attr || 438);
  return true;
};
Utils$5.prototype.writeFileToAsync = function(path2, content, overwrite, attr, callback) {
  if (typeof attr === "function") {
    callback = attr;
    attr = void 0;
  }
  const self2 = this;
  self2.fs.exists(path2, function(exist) {
    if (exist && !overwrite) return callback(false);
    self2.fs.stat(path2, function(err, stat2) {
      if (exist && stat2.isDirectory()) {
        return callback(false);
      }
      var folder = pth$2.dirname(path2);
      self2.fs.exists(folder, function(exists) {
        if (!exists) self2.makeDir(folder);
        self2.fs.open(path2, "w", 438, function(err2, fd) {
          if (err2) {
            self2.fs.chmod(path2, 438, function() {
              self2.fs.open(path2, "w", 438, function(err3, fd2) {
                self2.fs.write(fd2, content, 0, content.length, 0, function() {
                  self2.fs.close(fd2, function() {
                    self2.fs.chmod(path2, attr || 438, function() {
                      callback(true);
                    });
                  });
                });
              });
            });
          } else if (fd) {
            self2.fs.write(fd, content, 0, content.length, 0, function() {
              self2.fs.close(fd, function() {
                self2.fs.chmod(path2, attr || 438, function() {
                  callback(true);
                });
              });
            });
          } else {
            self2.fs.chmod(path2, attr || 438, function() {
              callback(true);
            });
          }
        });
      });
    });
  });
};
Utils$5.prototype.findFiles = function(path2) {
  const self2 = this;
  function findSync(dir, pattern, recursive) {
    let files = [];
    self2.fs.readdirSync(dir).forEach(function(file2) {
      const path3 = pth$2.join(dir, file2);
      const stat2 = self2.fs.statSync(path3);
      {
        files.push(pth$2.normalize(path3) + (stat2.isDirectory() ? self2.sep : ""));
      }
      if (stat2.isDirectory() && recursive) files = files.concat(findSync(path3, pattern, recursive));
    });
    return files;
  }
  return findSync(path2, void 0, true);
};
Utils$5.prototype.findFilesAsync = function(dir, cb) {
  const self2 = this;
  let results = [];
  self2.fs.readdir(dir, function(err, list) {
    if (err) return cb(err);
    let list_length = list.length;
    if (!list_length) return cb(null, results);
    list.forEach(function(file2) {
      file2 = pth$2.join(dir, file2);
      self2.fs.stat(file2, function(err2, stat2) {
        if (err2) return cb(err2);
        if (stat2) {
          results.push(pth$2.normalize(file2) + (stat2.isDirectory() ? self2.sep : ""));
          if (stat2.isDirectory()) {
            self2.findFilesAsync(file2, function(err3, res) {
              if (err3) return cb(err3);
              results = results.concat(res);
              if (!--list_length) cb(null, results);
            });
          } else {
            if (!--list_length) cb(null, results);
          }
        }
      });
    });
  });
};
Utils$5.prototype.getAttributes = function() {
};
Utils$5.prototype.setAttributes = function() {
};
Utils$5.crc32update = function(crc, byte) {
  return crcTable[(crc ^ byte) & 255] ^ crc >>> 8;
};
Utils$5.crc32 = function(buf) {
  if (typeof buf === "string") {
    buf = Buffer.from(buf, "utf8");
  }
  let len = buf.length;
  let crc = ~0;
  for (let off = 0; off < len; ) crc = Utils$5.crc32update(crc, buf[off++]);
  return ~crc >>> 0;
};
Utils$5.methodToString = function(method) {
  switch (method) {
    case Constants$3.STORED:
      return "STORED (" + method + ")";
    case Constants$3.DEFLATED:
      return "DEFLATED (" + method + ")";
    default:
      return "UNSUPPORTED (" + method + ")";
  }
};
Utils$5.canonical = function(path2) {
  if (!path2) return "";
  const safeSuffix = pth$2.posix.normalize("/" + path2.split("\\").join("/"));
  return pth$2.join(".", safeSuffix);
};
Utils$5.zipnamefix = function(path2) {
  if (!path2) return "";
  const safeSuffix = pth$2.posix.normalize("/" + path2.split("\\").join("/"));
  return pth$2.posix.join(".", safeSuffix);
};
Utils$5.findLast = function(arr, callback) {
  if (!Array.isArray(arr)) throw new TypeError("arr is not array");
  const len = arr.length >>> 0;
  for (let i = len - 1; i >= 0; i--) {
    if (callback(arr[i], i, arr)) {
      return arr[i];
    }
  }
  return void 0;
};
Utils$5.sanitize = function(prefix, name) {
  prefix = pth$2.resolve(pth$2.normalize(prefix));
  var parts = name.split("/");
  for (var i = 0, l = parts.length; i < l; i++) {
    var path2 = pth$2.normalize(pth$2.join(prefix, parts.slice(i, l).join(pth$2.sep)));
    if (path2.indexOf(prefix) === 0) {
      return path2;
    }
  }
  return pth$2.normalize(pth$2.join(prefix, pth$2.basename(name)));
};
Utils$5.toBuffer = function toBuffer(input, encoder) {
  if (Buffer.isBuffer(input)) {
    return input;
  } else if (input instanceof Uint8Array) {
    return Buffer.from(input);
  } else {
    return typeof input === "string" ? encoder(input) : Buffer.alloc(0);
  }
};
Utils$5.readBigUInt64LE = function(buffer, index) {
  var slice = Buffer.from(buffer.slice(index, index + 8));
  slice.swap64();
  return parseInt(`0x${slice.toString("hex")}`);
};
Utils$5.fromDOS2Date = function(val) {
  return new Date((val >> 25 & 127) + 1980, Math.max((val >> 21 & 15) - 1, 0), Math.max(val >> 16 & 31, 1), val >> 11 & 31, val >> 5 & 63, (val & 31) << 1);
};
Utils$5.fromDate2DOS = function(val) {
  let date = 0;
  let time = 0;
  if (val.getFullYear() > 1979) {
    date = (val.getFullYear() - 1980 & 127) << 9 | val.getMonth() + 1 << 5 | val.getDate();
    time = val.getHours() << 11 | val.getMinutes() << 5 | val.getSeconds() >> 1;
  }
  return date << 16 | time;
};
Utils$5.isWin = isWin;
Utils$5.crcTable = crcTable;
const pth$1 = require$$1;
var fattr = function(path2, { fs: fs2 }) {
  var _path = path2 || "", _obj = newAttr(), _stat = null;
  function newAttr() {
    return {
      directory: false,
      readonly: false,
      hidden: false,
      executable: false,
      mtime: 0,
      atime: 0
    };
  }
  if (_path && fs2.existsSync(_path)) {
    _stat = fs2.statSync(_path);
    _obj.directory = _stat.isDirectory();
    _obj.mtime = _stat.mtime;
    _obj.atime = _stat.atime;
    _obj.executable = (73 & _stat.mode) !== 0;
    _obj.readonly = (128 & _stat.mode) === 0;
    _obj.hidden = pth$1.basename(_path)[0] === ".";
  } else {
    console.warn("Invalid path: " + _path);
  }
  return {
    get directory() {
      return _obj.directory;
    },
    get readOnly() {
      return _obj.readonly;
    },
    get hidden() {
      return _obj.hidden;
    },
    get mtime() {
      return _obj.mtime;
    },
    get atime() {
      return _obj.atime;
    },
    get executable() {
      return _obj.executable;
    },
    decodeAttributes: function() {
    },
    encodeAttributes: function() {
    },
    toJSON: function() {
      return {
        path: _path,
        isDirectory: _obj.directory,
        isReadOnly: _obj.readonly,
        isHidden: _obj.hidden,
        isExecutable: _obj.executable,
        mTime: _obj.mtime,
        aTime: _obj.atime
      };
    },
    toString: function() {
      return JSON.stringify(this.toJSON(), null, "	");
    }
  };
};
var decoder = {
  efs: true,
  encode: (data) => Buffer.from(data, "utf8"),
  decode: (data) => data.toString("utf8")
};
util.exports = utils;
util.exports.Constants = constants;
util.exports.Errors = errors;
util.exports.FileAttr = fattr;
util.exports.decoder = decoder;
var utilExports = util.exports;
var headers = {};
var Utils$4 = utilExports, Constants$2 = Utils$4.Constants;
var entryHeader = function() {
  var _verMade = 20, _version = 10, _flags = 0, _method = 0, _time = 0, _crc = 0, _compressedSize = 0, _size = 0, _fnameLen = 0, _extraLen = 0, _comLen = 0, _diskStart = 0, _inattr = 0, _attr = 0, _offset = 0;
  _verMade |= Utils$4.isWin ? 2560 : 768;
  _flags |= Constants$2.FLG_EFS;
  const _localHeader = {
    extraLen: 0
  };
  const uint32 = (val) => Math.max(0, val) >>> 0;
  const uint8 = (val) => Math.max(0, val) & 255;
  _time = Utils$4.fromDate2DOS(/* @__PURE__ */ new Date());
  return {
    get made() {
      return _verMade;
    },
    set made(val) {
      _verMade = val;
    },
    get version() {
      return _version;
    },
    set version(val) {
      _version = val;
    },
    get flags() {
      return _flags;
    },
    set flags(val) {
      _flags = val;
    },
    get flags_efs() {
      return (_flags & Constants$2.FLG_EFS) > 0;
    },
    set flags_efs(val) {
      if (val) {
        _flags |= Constants$2.FLG_EFS;
      } else {
        _flags &= ~Constants$2.FLG_EFS;
      }
    },
    get flags_desc() {
      return (_flags & Constants$2.FLG_DESC) > 0;
    },
    set flags_desc(val) {
      if (val) {
        _flags |= Constants$2.FLG_DESC;
      } else {
        _flags &= ~Constants$2.FLG_DESC;
      }
    },
    get method() {
      return _method;
    },
    set method(val) {
      switch (val) {
        case Constants$2.STORED:
          this.version = 10;
        case Constants$2.DEFLATED:
        default:
          this.version = 20;
      }
      _method = val;
    },
    get time() {
      return Utils$4.fromDOS2Date(this.timeval);
    },
    set time(val) {
      this.timeval = Utils$4.fromDate2DOS(val);
    },
    get timeval() {
      return _time;
    },
    set timeval(val) {
      _time = uint32(val);
    },
    get timeHighByte() {
      return uint8(_time >>> 8);
    },
    get crc() {
      return _crc;
    },
    set crc(val) {
      _crc = uint32(val);
    },
    get compressedSize() {
      return _compressedSize;
    },
    set compressedSize(val) {
      _compressedSize = uint32(val);
    },
    get size() {
      return _size;
    },
    set size(val) {
      _size = uint32(val);
    },
    get fileNameLength() {
      return _fnameLen;
    },
    set fileNameLength(val) {
      _fnameLen = val;
    },
    get extraLength() {
      return _extraLen;
    },
    set extraLength(val) {
      _extraLen = val;
    },
    get extraLocalLength() {
      return _localHeader.extraLen;
    },
    set extraLocalLength(val) {
      _localHeader.extraLen = val;
    },
    get commentLength() {
      return _comLen;
    },
    set commentLength(val) {
      _comLen = val;
    },
    get diskNumStart() {
      return _diskStart;
    },
    set diskNumStart(val) {
      _diskStart = uint32(val);
    },
    get inAttr() {
      return _inattr;
    },
    set inAttr(val) {
      _inattr = uint32(val);
    },
    get attr() {
      return _attr;
    },
    set attr(val) {
      _attr = uint32(val);
    },
    // get Unix file permissions
    get fileAttr() {
      return (_attr || 0) >> 16 & 4095;
    },
    get offset() {
      return _offset;
    },
    set offset(val) {
      _offset = uint32(val);
    },
    get encrypted() {
      return (_flags & Constants$2.FLG_ENC) === Constants$2.FLG_ENC;
    },
    get centralHeaderSize() {
      return Constants$2.CENHDR + _fnameLen + _extraLen + _comLen;
    },
    get realDataOffset() {
      return _offset + Constants$2.LOCHDR + _localHeader.fnameLen + _localHeader.extraLen;
    },
    get localHeader() {
      return _localHeader;
    },
    loadLocalHeaderFromBinary: function(input) {
      var data = input.slice(_offset, _offset + Constants$2.LOCHDR);
      if (data.readUInt32LE(0) !== Constants$2.LOCSIG) {
        throw Utils$4.Errors.INVALID_LOC();
      }
      _localHeader.version = data.readUInt16LE(Constants$2.LOCVER);
      _localHeader.flags = data.readUInt16LE(Constants$2.LOCFLG);
      _localHeader.method = data.readUInt16LE(Constants$2.LOCHOW);
      _localHeader.time = data.readUInt32LE(Constants$2.LOCTIM);
      _localHeader.crc = data.readUInt32LE(Constants$2.LOCCRC);
      _localHeader.compressedSize = data.readUInt32LE(Constants$2.LOCSIZ);
      _localHeader.size = data.readUInt32LE(Constants$2.LOCLEN);
      _localHeader.fnameLen = data.readUInt16LE(Constants$2.LOCNAM);
      _localHeader.extraLen = data.readUInt16LE(Constants$2.LOCEXT);
      const extraStart = _offset + Constants$2.LOCHDR + _localHeader.fnameLen;
      const extraEnd = extraStart + _localHeader.extraLen;
      return input.slice(extraStart, extraEnd);
    },
    loadFromBinary: function(data) {
      if (data.length !== Constants$2.CENHDR || data.readUInt32LE(0) !== Constants$2.CENSIG) {
        throw Utils$4.Errors.INVALID_CEN();
      }
      _verMade = data.readUInt16LE(Constants$2.CENVEM);
      _version = data.readUInt16LE(Constants$2.CENVER);
      _flags = data.readUInt16LE(Constants$2.CENFLG);
      _method = data.readUInt16LE(Constants$2.CENHOW);
      _time = data.readUInt32LE(Constants$2.CENTIM);
      _crc = data.readUInt32LE(Constants$2.CENCRC);
      _compressedSize = data.readUInt32LE(Constants$2.CENSIZ);
      _size = data.readUInt32LE(Constants$2.CENLEN);
      _fnameLen = data.readUInt16LE(Constants$2.CENNAM);
      _extraLen = data.readUInt16LE(Constants$2.CENEXT);
      _comLen = data.readUInt16LE(Constants$2.CENCOM);
      _diskStart = data.readUInt16LE(Constants$2.CENDSK);
      _inattr = data.readUInt16LE(Constants$2.CENATT);
      _attr = data.readUInt32LE(Constants$2.CENATX);
      _offset = data.readUInt32LE(Constants$2.CENOFF);
    },
    localHeaderToBinary: function() {
      var data = Buffer.alloc(Constants$2.LOCHDR);
      data.writeUInt32LE(Constants$2.LOCSIG, 0);
      data.writeUInt16LE(_version, Constants$2.LOCVER);
      data.writeUInt16LE(_flags, Constants$2.LOCFLG);
      data.writeUInt16LE(_method, Constants$2.LOCHOW);
      data.writeUInt32LE(_time, Constants$2.LOCTIM);
      data.writeUInt32LE(_crc, Constants$2.LOCCRC);
      data.writeUInt32LE(_compressedSize, Constants$2.LOCSIZ);
      data.writeUInt32LE(_size, Constants$2.LOCLEN);
      data.writeUInt16LE(_fnameLen, Constants$2.LOCNAM);
      data.writeUInt16LE(_localHeader.extraLen, Constants$2.LOCEXT);
      return data;
    },
    centralHeaderToBinary: function() {
      var data = Buffer.alloc(Constants$2.CENHDR + _fnameLen + _extraLen + _comLen);
      data.writeUInt32LE(Constants$2.CENSIG, 0);
      data.writeUInt16LE(_verMade, Constants$2.CENVEM);
      data.writeUInt16LE(_version, Constants$2.CENVER);
      data.writeUInt16LE(_flags, Constants$2.CENFLG);
      data.writeUInt16LE(_method, Constants$2.CENHOW);
      data.writeUInt32LE(_time, Constants$2.CENTIM);
      data.writeUInt32LE(_crc, Constants$2.CENCRC);
      data.writeUInt32LE(_compressedSize, Constants$2.CENSIZ);
      data.writeUInt32LE(_size, Constants$2.CENLEN);
      data.writeUInt16LE(_fnameLen, Constants$2.CENNAM);
      data.writeUInt16LE(_extraLen, Constants$2.CENEXT);
      data.writeUInt16LE(_comLen, Constants$2.CENCOM);
      data.writeUInt16LE(_diskStart, Constants$2.CENDSK);
      data.writeUInt16LE(_inattr, Constants$2.CENATT);
      data.writeUInt32LE(_attr, Constants$2.CENATX);
      data.writeUInt32LE(_offset, Constants$2.CENOFF);
      return data;
    },
    toJSON: function() {
      const bytes = function(nr) {
        return nr + " bytes";
      };
      return {
        made: _verMade,
        version: _version,
        flags: _flags,
        method: Utils$4.methodToString(_method),
        time: this.time,
        crc: "0x" + _crc.toString(16).toUpperCase(),
        compressedSize: bytes(_compressedSize),
        size: bytes(_size),
        fileNameLength: bytes(_fnameLen),
        extraLength: bytes(_extraLen),
        commentLength: bytes(_comLen),
        diskNumStart: _diskStart,
        inAttr: _inattr,
        attr: _attr,
        offset: _offset,
        centralHeaderSize: bytes(Constants$2.CENHDR + _fnameLen + _extraLen + _comLen)
      };
    },
    toString: function() {
      return JSON.stringify(this.toJSON(), null, "	");
    }
  };
};
var Utils$3 = utilExports, Constants$1 = Utils$3.Constants;
var mainHeader = function() {
  var _volumeEntries = 0, _totalEntries = 0, _size = 0, _offset = 0, _commentLength = 0;
  return {
    get diskEntries() {
      return _volumeEntries;
    },
    set diskEntries(val) {
      _volumeEntries = _totalEntries = val;
    },
    get totalEntries() {
      return _totalEntries;
    },
    set totalEntries(val) {
      _totalEntries = _volumeEntries = val;
    },
    get size() {
      return _size;
    },
    set size(val) {
      _size = val;
    },
    get offset() {
      return _offset;
    },
    set offset(val) {
      _offset = val;
    },
    get commentLength() {
      return _commentLength;
    },
    set commentLength(val) {
      _commentLength = val;
    },
    get mainHeaderSize() {
      return Constants$1.ENDHDR + _commentLength;
    },
    loadFromBinary: function(data) {
      if ((data.length !== Constants$1.ENDHDR || data.readUInt32LE(0) !== Constants$1.ENDSIG) && (data.length < Constants$1.ZIP64HDR || data.readUInt32LE(0) !== Constants$1.ZIP64SIG)) {
        throw Utils$3.Errors.INVALID_END();
      }
      if (data.readUInt32LE(0) === Constants$1.ENDSIG) {
        _volumeEntries = data.readUInt16LE(Constants$1.ENDSUB);
        _totalEntries = data.readUInt16LE(Constants$1.ENDTOT);
        _size = data.readUInt32LE(Constants$1.ENDSIZ);
        _offset = data.readUInt32LE(Constants$1.ENDOFF);
        _commentLength = data.readUInt16LE(Constants$1.ENDCOM);
      } else {
        _volumeEntries = Utils$3.readBigUInt64LE(data, Constants$1.ZIP64SUB);
        _totalEntries = Utils$3.readBigUInt64LE(data, Constants$1.ZIP64TOT);
        _size = Utils$3.readBigUInt64LE(data, Constants$1.ZIP64SIZE);
        _offset = Utils$3.readBigUInt64LE(data, Constants$1.ZIP64OFF);
        _commentLength = 0;
      }
    },
    toBinary: function() {
      var b = Buffer.alloc(Constants$1.ENDHDR + _commentLength);
      b.writeUInt32LE(Constants$1.ENDSIG, 0);
      b.writeUInt32LE(0, 4);
      b.writeUInt16LE(_volumeEntries, Constants$1.ENDSUB);
      b.writeUInt16LE(_totalEntries, Constants$1.ENDTOT);
      b.writeUInt32LE(_size, Constants$1.ENDSIZ);
      b.writeUInt32LE(_offset, Constants$1.ENDOFF);
      b.writeUInt16LE(_commentLength, Constants$1.ENDCOM);
      b.fill(" ", Constants$1.ENDHDR);
      return b;
    },
    toJSON: function() {
      const offset = function(nr, len) {
        let offs = nr.toString(16).toUpperCase();
        while (offs.length < len) offs = "0" + offs;
        return "0x" + offs;
      };
      return {
        diskEntries: _volumeEntries,
        totalEntries: _totalEntries,
        size: _size + " bytes",
        offset: offset(_offset, 4),
        commentLength: _commentLength
      };
    },
    toString: function() {
      return JSON.stringify(this.toJSON(), null, "	");
    }
  };
};
headers.EntryHeader = entryHeader;
headers.MainHeader = mainHeader;
var methods = {};
var deflater = function(inbuf) {
  var zlib = require$$0$2;
  var opts = { chunkSize: (parseInt(inbuf.length / 1024) + 1) * 1024 };
  return {
    deflate: function() {
      return zlib.deflateRawSync(inbuf, opts);
    },
    deflateAsync: function(callback) {
      var tmp = zlib.createDeflateRaw(opts), parts = [], total = 0;
      tmp.on("data", function(data) {
        parts.push(data);
        total += data.length;
      });
      tmp.on("end", function() {
        var buf = Buffer.alloc(total), written = 0;
        buf.fill(0);
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          part.copy(buf, written);
          written += part.length;
        }
        callback && callback(buf);
      });
      tmp.end(inbuf);
    }
  };
};
const version = +(process.versions ? process.versions.node : "").split(".")[0] || 0;
var inflater = function(inbuf, expectedLength) {
  var zlib = require$$0$2;
  const option = version >= 15 && expectedLength > 0 ? { maxOutputLength: expectedLength } : {};
  return {
    inflate: function() {
      return zlib.inflateRawSync(inbuf, option);
    },
    inflateAsync: function(callback) {
      var tmp = zlib.createInflateRaw(option), parts = [], total = 0;
      tmp.on("data", function(data) {
        parts.push(data);
        total += data.length;
      });
      tmp.on("end", function() {
        var buf = Buffer.alloc(total), written = 0;
        buf.fill(0);
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          part.copy(buf, written);
          written += part.length;
        }
        callback && callback(buf);
      });
      tmp.end(inbuf);
    }
  };
};
const { randomFillSync } = require$$0$3;
const Errors = errors;
const crctable = new Uint32Array(256).map((t, crc) => {
  for (let j = 0; j < 8; j++) {
    if (0 !== (crc & 1)) {
      crc = crc >>> 1 ^ 3988292384;
    } else {
      crc >>>= 1;
    }
  }
  return crc >>> 0;
});
const uMul = (a, b) => Math.imul(a, b) >>> 0;
const crc32update = (pCrc32, bval) => {
  return crctable[(pCrc32 ^ bval) & 255] ^ pCrc32 >>> 8;
};
const genSalt = () => {
  if ("function" === typeof randomFillSync) {
    return randomFillSync(Buffer.alloc(12));
  } else {
    return genSalt.node();
  }
};
genSalt.node = () => {
  const salt = Buffer.alloc(12);
  const len = salt.length;
  for (let i = 0; i < len; i++) salt[i] = Math.random() * 256 & 255;
  return salt;
};
const config = {
  genSalt
};
function Initkeys(pw) {
  const pass = Buffer.isBuffer(pw) ? pw : Buffer.from(pw);
  this.keys = new Uint32Array([305419896, 591751049, 878082192]);
  for (let i = 0; i < pass.length; i++) {
    this.updateKeys(pass[i]);
  }
}
Initkeys.prototype.updateKeys = function(byteValue) {
  const keys = this.keys;
  keys[0] = crc32update(keys[0], byteValue);
  keys[1] += keys[0] & 255;
  keys[1] = uMul(keys[1], 134775813) + 1;
  keys[2] = crc32update(keys[2], keys[1] >>> 24);
  return byteValue;
};
Initkeys.prototype.next = function() {
  const k = (this.keys[2] | 2) >>> 0;
  return uMul(k, k ^ 1) >> 8 & 255;
};
function make_decrypter(pwd) {
  const keys = new Initkeys(pwd);
  return function(data) {
    const result = Buffer.alloc(data.length);
    let pos = 0;
    for (let c of data) {
      result[pos++] = keys.updateKeys(c ^ keys.next());
    }
    return result;
  };
}
function make_encrypter(pwd) {
  const keys = new Initkeys(pwd);
  return function(data, result, pos = 0) {
    if (!result) result = Buffer.alloc(data.length);
    for (let c of data) {
      const k = keys.next();
      result[pos++] = c ^ k;
      keys.updateKeys(c);
    }
    return result;
  };
}
function decrypt(data, header, pwd) {
  if (!data || !Buffer.isBuffer(data) || data.length < 12) {
    return Buffer.alloc(0);
  }
  const decrypter = make_decrypter(pwd);
  const salt = decrypter(data.slice(0, 12));
  const verifyByte = (header.flags & 8) === 8 ? header.timeHighByte : header.crc >>> 24;
  if (salt[11] !== verifyByte) {
    throw Errors.WRONG_PASSWORD();
  }
  return decrypter(data.slice(12));
}
function _salter(data) {
  if (Buffer.isBuffer(data) && data.length >= 12) {
    config.genSalt = function() {
      return data.slice(0, 12);
    };
  } else if (data === "node") {
    config.genSalt = genSalt.node;
  } else {
    config.genSalt = genSalt;
  }
}
function encrypt(data, header, pwd, oldlike = false) {
  if (data == null) data = Buffer.alloc(0);
  if (!Buffer.isBuffer(data)) data = Buffer.from(data.toString());
  const encrypter = make_encrypter(pwd);
  const salt = config.genSalt();
  salt[11] = header.crc >>> 24 & 255;
  if (oldlike) salt[10] = header.crc >>> 16 & 255;
  const result = Buffer.alloc(data.length + 12);
  encrypter(salt, result);
  return encrypter(data, result, 12);
}
var zipcrypto = { decrypt, encrypt, _salter };
methods.Deflater = deflater;
methods.Inflater = inflater;
methods.ZipCrypto = zipcrypto;
var Utils$2 = utilExports, Headers$1 = headers, Constants = Utils$2.Constants, Methods = methods;
var zipEntry = function(options, input) {
  var _centralHeader = new Headers$1.EntryHeader(), _entryName = Buffer.alloc(0), _comment = Buffer.alloc(0), _isDirectory = false, uncompressedData = null, _extra = Buffer.alloc(0), _extralocal = Buffer.alloc(0), _efs = true;
  const opts = options;
  const decoder2 = typeof opts.decoder === "object" ? opts.decoder : Utils$2.decoder;
  _efs = decoder2.hasOwnProperty("efs") ? decoder2.efs : false;
  function getCompressedDataFromZip() {
    if (!input || !(input instanceof Uint8Array)) {
      return Buffer.alloc(0);
    }
    _extralocal = _centralHeader.loadLocalHeaderFromBinary(input);
    return input.slice(_centralHeader.realDataOffset, _centralHeader.realDataOffset + _centralHeader.compressedSize);
  }
  function crc32OK(data) {
    if (!_centralHeader.flags_desc) {
      if (Utils$2.crc32(data) !== _centralHeader.localHeader.crc) {
        return false;
      }
    } else {
      const descriptor = {};
      const dataEndOffset = _centralHeader.realDataOffset + _centralHeader.compressedSize;
      if (input.readUInt32LE(dataEndOffset) == Constants.LOCSIG || input.readUInt32LE(dataEndOffset) == Constants.CENSIG) {
        throw Utils$2.Errors.DESCRIPTOR_NOT_EXIST();
      }
      if (input.readUInt32LE(dataEndOffset) == Constants.EXTSIG) {
        descriptor.crc = input.readUInt32LE(dataEndOffset + Constants.EXTCRC);
        descriptor.compressedSize = input.readUInt32LE(dataEndOffset + Constants.EXTSIZ);
        descriptor.size = input.readUInt32LE(dataEndOffset + Constants.EXTLEN);
      } else if (input.readUInt16LE(dataEndOffset + 12) === 19280) {
        descriptor.crc = input.readUInt32LE(dataEndOffset + Constants.EXTCRC - 4);
        descriptor.compressedSize = input.readUInt32LE(dataEndOffset + Constants.EXTSIZ - 4);
        descriptor.size = input.readUInt32LE(dataEndOffset + Constants.EXTLEN - 4);
      } else {
        throw Utils$2.Errors.DESCRIPTOR_UNKNOWN();
      }
      if (descriptor.compressedSize !== _centralHeader.compressedSize || descriptor.size !== _centralHeader.size || descriptor.crc !== _centralHeader.crc) {
        throw Utils$2.Errors.DESCRIPTOR_FAULTY();
      }
      if (Utils$2.crc32(data) !== descriptor.crc) {
        return false;
      }
    }
    return true;
  }
  function decompress(async, callback, pass) {
    if (typeof callback === "undefined" && typeof async === "string") {
      pass = async;
      async = void 0;
    }
    if (_isDirectory) {
      if (async && callback) {
        callback(Buffer.alloc(0), Utils$2.Errors.DIRECTORY_CONTENT_ERROR());
      }
      return Buffer.alloc(0);
    }
    var compressedData = getCompressedDataFromZip();
    if (compressedData.length === 0) {
      if (async && callback) callback(compressedData);
      return compressedData;
    }
    if (_centralHeader.encrypted) {
      if ("string" !== typeof pass && !Buffer.isBuffer(pass)) {
        throw Utils$2.Errors.INVALID_PASS_PARAM();
      }
      compressedData = Methods.ZipCrypto.decrypt(compressedData, _centralHeader, pass);
    }
    var data = Buffer.alloc(_centralHeader.size);
    switch (_centralHeader.method) {
      case Utils$2.Constants.STORED:
        compressedData.copy(data);
        if (!crc32OK(data)) {
          if (async && callback) callback(data, Utils$2.Errors.BAD_CRC());
          throw Utils$2.Errors.BAD_CRC();
        } else {
          if (async && callback) callback(data);
          return data;
        }
      case Utils$2.Constants.DEFLATED:
        var inflater2 = new Methods.Inflater(compressedData, _centralHeader.size);
        if (!async) {
          const result = inflater2.inflate(data);
          result.copy(data, 0);
          if (!crc32OK(data)) {
            throw Utils$2.Errors.BAD_CRC(`"${decoder2.decode(_entryName)}"`);
          }
          return data;
        } else {
          inflater2.inflateAsync(function(result) {
            result.copy(result, 0);
            if (callback) {
              if (!crc32OK(result)) {
                callback(result, Utils$2.Errors.BAD_CRC());
              } else {
                callback(result);
              }
            }
          });
        }
        break;
      default:
        if (async && callback) callback(Buffer.alloc(0), Utils$2.Errors.UNKNOWN_METHOD());
        throw Utils$2.Errors.UNKNOWN_METHOD();
    }
  }
  function compress(async, callback) {
    if ((!uncompressedData || !uncompressedData.length) && Buffer.isBuffer(input)) {
      if (async && callback) callback(getCompressedDataFromZip());
      return getCompressedDataFromZip();
    }
    if (uncompressedData.length && !_isDirectory) {
      var compressedData;
      switch (_centralHeader.method) {
        case Utils$2.Constants.STORED:
          _centralHeader.compressedSize = _centralHeader.size;
          compressedData = Buffer.alloc(uncompressedData.length);
          uncompressedData.copy(compressedData);
          if (async && callback) callback(compressedData);
          return compressedData;
        default:
        case Utils$2.Constants.DEFLATED:
          var deflater2 = new Methods.Deflater(uncompressedData);
          if (!async) {
            var deflated = deflater2.deflate();
            _centralHeader.compressedSize = deflated.length;
            return deflated;
          } else {
            deflater2.deflateAsync(function(data) {
              compressedData = Buffer.alloc(data.length);
              _centralHeader.compressedSize = data.length;
              data.copy(compressedData);
              callback && callback(compressedData);
            });
          }
          deflater2 = null;
          break;
      }
    } else if (async && callback) {
      callback(Buffer.alloc(0));
    } else {
      return Buffer.alloc(0);
    }
  }
  function readUInt64LE(buffer, offset) {
    return (buffer.readUInt32LE(offset + 4) << 4) + buffer.readUInt32LE(offset);
  }
  function parseExtra(data) {
    try {
      var offset = 0;
      var signature, size, part;
      while (offset + 4 < data.length) {
        signature = data.readUInt16LE(offset);
        offset += 2;
        size = data.readUInt16LE(offset);
        offset += 2;
        part = data.slice(offset, offset + size);
        offset += size;
        if (Constants.ID_ZIP64 === signature) {
          parseZip64ExtendedInformation(part);
        }
      }
    } catch (error) {
      throw Utils$2.Errors.EXTRA_FIELD_PARSE_ERROR();
    }
  }
  function parseZip64ExtendedInformation(data) {
    var size, compressedSize, offset, diskNumStart;
    if (data.length >= Constants.EF_ZIP64_SCOMP) {
      size = readUInt64LE(data, Constants.EF_ZIP64_SUNCOMP);
      if (_centralHeader.size === Constants.EF_ZIP64_OR_32) {
        _centralHeader.size = size;
      }
    }
    if (data.length >= Constants.EF_ZIP64_RHO) {
      compressedSize = readUInt64LE(data, Constants.EF_ZIP64_SCOMP);
      if (_centralHeader.compressedSize === Constants.EF_ZIP64_OR_32) {
        _centralHeader.compressedSize = compressedSize;
      }
    }
    if (data.length >= Constants.EF_ZIP64_DSN) {
      offset = readUInt64LE(data, Constants.EF_ZIP64_RHO);
      if (_centralHeader.offset === Constants.EF_ZIP64_OR_32) {
        _centralHeader.offset = offset;
      }
    }
    if (data.length >= Constants.EF_ZIP64_DSN + 4) {
      diskNumStart = data.readUInt32LE(Constants.EF_ZIP64_DSN);
      if (_centralHeader.diskNumStart === Constants.EF_ZIP64_OR_16) {
        _centralHeader.diskNumStart = diskNumStart;
      }
    }
  }
  return {
    get entryName() {
      return decoder2.decode(_entryName);
    },
    get rawEntryName() {
      return _entryName;
    },
    set entryName(val) {
      _entryName = Utils$2.toBuffer(val, decoder2.encode);
      var lastChar = _entryName[_entryName.length - 1];
      _isDirectory = lastChar === 47 || lastChar === 92;
      _centralHeader.fileNameLength = _entryName.length;
    },
    get efs() {
      if (typeof _efs === "function") {
        return _efs(this.entryName);
      } else {
        return _efs;
      }
    },
    get extra() {
      return _extra;
    },
    set extra(val) {
      _extra = val;
      _centralHeader.extraLength = val.length;
      parseExtra(val);
    },
    get comment() {
      return decoder2.decode(_comment);
    },
    set comment(val) {
      _comment = Utils$2.toBuffer(val, decoder2.encode);
      _centralHeader.commentLength = _comment.length;
      if (_comment.length > 65535) throw Utils$2.Errors.COMMENT_TOO_LONG();
    },
    get name() {
      var n = decoder2.decode(_entryName);
      return _isDirectory ? n.substr(n.length - 1).split("/").pop() : n.split("/").pop();
    },
    get isDirectory() {
      return _isDirectory;
    },
    getCompressedData: function() {
      return compress(false, null);
    },
    getCompressedDataAsync: function(callback) {
      compress(true, callback);
    },
    setData: function(value) {
      uncompressedData = Utils$2.toBuffer(value, Utils$2.decoder.encode);
      if (!_isDirectory && uncompressedData.length) {
        _centralHeader.size = uncompressedData.length;
        _centralHeader.method = Utils$2.Constants.DEFLATED;
        _centralHeader.crc = Utils$2.crc32(value);
        _centralHeader.changed = true;
      } else {
        _centralHeader.method = Utils$2.Constants.STORED;
      }
    },
    getData: function(pass) {
      if (_centralHeader.changed) {
        return uncompressedData;
      } else {
        return decompress(false, null, pass);
      }
    },
    getDataAsync: function(callback, pass) {
      if (_centralHeader.changed) {
        callback(uncompressedData);
      } else {
        decompress(true, callback, pass);
      }
    },
    set attr(attr) {
      _centralHeader.attr = attr;
    },
    get attr() {
      return _centralHeader.attr;
    },
    set header(data) {
      _centralHeader.loadFromBinary(data);
    },
    get header() {
      return _centralHeader;
    },
    packCentralHeader: function() {
      _centralHeader.flags_efs = this.efs;
      _centralHeader.extraLength = _extra.length;
      var header = _centralHeader.centralHeaderToBinary();
      var addpos = Utils$2.Constants.CENHDR;
      _entryName.copy(header, addpos);
      addpos += _entryName.length;
      _extra.copy(header, addpos);
      addpos += _centralHeader.extraLength;
      _comment.copy(header, addpos);
      return header;
    },
    packLocalHeader: function() {
      let addpos = 0;
      _centralHeader.flags_efs = this.efs;
      _centralHeader.extraLocalLength = _extralocal.length;
      const localHeaderBuf = _centralHeader.localHeaderToBinary();
      const localHeader = Buffer.alloc(localHeaderBuf.length + _entryName.length + _centralHeader.extraLocalLength);
      localHeaderBuf.copy(localHeader, addpos);
      addpos += localHeaderBuf.length;
      _entryName.copy(localHeader, addpos);
      addpos += _entryName.length;
      _extralocal.copy(localHeader, addpos);
      addpos += _extralocal.length;
      return localHeader;
    },
    toJSON: function() {
      const bytes = function(nr) {
        return "<" + (nr && nr.length + " bytes buffer" || "null") + ">";
      };
      return {
        entryName: this.entryName,
        name: this.name,
        comment: this.comment,
        isDirectory: this.isDirectory,
        header: _centralHeader.toJSON(),
        compressedData: bytes(input),
        data: bytes(uncompressedData)
      };
    },
    toString: function() {
      return JSON.stringify(this.toJSON(), null, "	");
    }
  };
};
const ZipEntry$1 = zipEntry;
const Headers = headers;
const Utils$1 = utilExports;
var zipFile = function(inBuffer, options) {
  var entryList = [], entryTable = {}, _comment = Buffer.alloc(0), mainHeader2 = new Headers.MainHeader(), loadedEntries = false;
  const temporary = /* @__PURE__ */ new Set();
  const opts = options;
  const { noSort, decoder: decoder2 } = opts;
  if (inBuffer) {
    readMainHeader(opts.readEntries);
  } else {
    loadedEntries = true;
  }
  function makeTemporaryFolders() {
    const foldersList = /* @__PURE__ */ new Set();
    for (const elem of Object.keys(entryTable)) {
      const elements = elem.split("/");
      elements.pop();
      if (!elements.length) continue;
      for (let i = 0; i < elements.length; i++) {
        const sub = elements.slice(0, i + 1).join("/") + "/";
        foldersList.add(sub);
      }
    }
    for (const elem of foldersList) {
      if (!(elem in entryTable)) {
        const tempfolder = new ZipEntry$1(opts);
        tempfolder.entryName = elem;
        tempfolder.attr = 16;
        tempfolder.temporary = true;
        entryList.push(tempfolder);
        entryTable[tempfolder.entryName] = tempfolder;
        temporary.add(tempfolder);
      }
    }
  }
  function readEntries() {
    loadedEntries = true;
    entryTable = {};
    if (mainHeader2.diskEntries > (inBuffer.length - mainHeader2.offset) / Utils$1.Constants.CENHDR) {
      throw Utils$1.Errors.DISK_ENTRY_TOO_LARGE();
    }
    entryList = new Array(mainHeader2.diskEntries);
    var index = mainHeader2.offset;
    for (var i = 0; i < entryList.length; i++) {
      var tmp = index, entry = new ZipEntry$1(opts, inBuffer);
      entry.header = inBuffer.slice(tmp, tmp += Utils$1.Constants.CENHDR);
      entry.entryName = inBuffer.slice(tmp, tmp += entry.header.fileNameLength);
      if (entry.header.extraLength) {
        entry.extra = inBuffer.slice(tmp, tmp += entry.header.extraLength);
      }
      if (entry.header.commentLength) entry.comment = inBuffer.slice(tmp, tmp + entry.header.commentLength);
      index += entry.header.centralHeaderSize;
      entryList[i] = entry;
      entryTable[entry.entryName] = entry;
    }
    temporary.clear();
    makeTemporaryFolders();
  }
  function readMainHeader(readNow) {
    var i = inBuffer.length - Utils$1.Constants.ENDHDR, max = Math.max(0, i - 65535), n = max, endStart = inBuffer.length, endOffset = -1, commentEnd = 0;
    const trailingSpace = typeof opts.trailingSpace === "boolean" ? opts.trailingSpace : false;
    if (trailingSpace) max = 0;
    for (i; i >= n; i--) {
      if (inBuffer[i] !== 80) continue;
      if (inBuffer.readUInt32LE(i) === Utils$1.Constants.ENDSIG) {
        endOffset = i;
        commentEnd = i;
        endStart = i + Utils$1.Constants.ENDHDR;
        n = i - Utils$1.Constants.END64HDR;
        continue;
      }
      if (inBuffer.readUInt32LE(i) === Utils$1.Constants.END64SIG) {
        n = max;
        continue;
      }
      if (inBuffer.readUInt32LE(i) === Utils$1.Constants.ZIP64SIG) {
        endOffset = i;
        endStart = i + Utils$1.readBigUInt64LE(inBuffer, i + Utils$1.Constants.ZIP64SIZE) + Utils$1.Constants.ZIP64LEAD;
        break;
      }
    }
    if (endOffset == -1) throw Utils$1.Errors.INVALID_FORMAT();
    mainHeader2.loadFromBinary(inBuffer.slice(endOffset, endStart));
    if (mainHeader2.commentLength) {
      _comment = inBuffer.slice(commentEnd + Utils$1.Constants.ENDHDR);
    }
    if (readNow) readEntries();
  }
  function sortEntries() {
    if (entryList.length > 1 && !noSort) {
      entryList.sort((a, b) => a.entryName.toLowerCase().localeCompare(b.entryName.toLowerCase()));
    }
  }
  return {
    /**
     * Returns an array of ZipEntry objects existent in the current opened archive
     * @return Array
     */
    get entries() {
      if (!loadedEntries) {
        readEntries();
      }
      return entryList.filter((e) => !temporary.has(e));
    },
    /**
     * Archive comment
     * @return {String}
     */
    get comment() {
      return decoder2.decode(_comment);
    },
    set comment(val) {
      _comment = Utils$1.toBuffer(val, decoder2.encode);
      mainHeader2.commentLength = _comment.length;
    },
    getEntryCount: function() {
      if (!loadedEntries) {
        return mainHeader2.diskEntries;
      }
      return entryList.length;
    },
    forEach: function(callback) {
      this.entries.forEach(callback);
    },
    /**
     * Returns a reference to the entry with the given name or null if entry is inexistent
     *
     * @param entryName
     * @return ZipEntry
     */
    getEntry: function(entryName) {
      if (!loadedEntries) {
        readEntries();
      }
      return entryTable[entryName] || null;
    },
    /**
     * Adds the given entry to the entry list
     *
     * @param entry
     */
    setEntry: function(entry) {
      if (!loadedEntries) {
        readEntries();
      }
      entryList.push(entry);
      entryTable[entry.entryName] = entry;
      mainHeader2.totalEntries = entryList.length;
    },
    /**
     * Removes the file with the given name from the entry list.
     *
     * If the entry is a directory, then all nested files and directories will be removed
     * @param entryName
     * @returns {void}
     */
    deleteFile: function(entryName, withsubfolders = true) {
      if (!loadedEntries) {
        readEntries();
      }
      const entry = entryTable[entryName];
      const list = this.getEntryChildren(entry, withsubfolders).map((child) => child.entryName);
      list.forEach(this.deleteEntry);
    },
    /**
     * Removes the entry with the given name from the entry list.
     *
     * @param {string} entryName
     * @returns {void}
     */
    deleteEntry: function(entryName) {
      if (!loadedEntries) {
        readEntries();
      }
      const entry = entryTable[entryName];
      const index = entryList.indexOf(entry);
      if (index >= 0) {
        entryList.splice(index, 1);
        delete entryTable[entryName];
        mainHeader2.totalEntries = entryList.length;
      }
    },
    /**
     *  Iterates and returns all nested files and directories of the given entry
     *
     * @param entry
     * @return Array
     */
    getEntryChildren: function(entry, subfolders = true) {
      if (!loadedEntries) {
        readEntries();
      }
      if (typeof entry === "object") {
        if (entry.isDirectory && subfolders) {
          const list = [];
          const name = entry.entryName;
          for (const zipEntry2 of entryList) {
            if (zipEntry2.entryName.startsWith(name)) {
              list.push(zipEntry2);
            }
          }
          return list;
        } else {
          return [entry];
        }
      }
      return [];
    },
    /**
     *  How many child elements entry has
     *
     * @param {ZipEntry} entry
     * @return {integer}
     */
    getChildCount: function(entry) {
      if (entry && entry.isDirectory) {
        const list = this.getEntryChildren(entry);
        return list.includes(entry) ? list.length - 1 : list.length;
      }
      return 0;
    },
    /**
     * Returns the zip file
     *
     * @return Buffer
     */
    compressToBuffer: function() {
      if (!loadedEntries) {
        readEntries();
      }
      sortEntries();
      const dataBlock = [];
      const headerBlocks = [];
      let totalSize = 0;
      let dindex = 0;
      mainHeader2.size = 0;
      mainHeader2.offset = 0;
      let totalEntries = 0;
      for (const entry of this.entries) {
        const compressedData = entry.getCompressedData();
        entry.header.offset = dindex;
        const localHeader = entry.packLocalHeader();
        const dataLength = localHeader.length + compressedData.length;
        dindex += dataLength;
        dataBlock.push(localHeader);
        dataBlock.push(compressedData);
        const centralHeader = entry.packCentralHeader();
        headerBlocks.push(centralHeader);
        mainHeader2.size += centralHeader.length;
        totalSize += dataLength + centralHeader.length;
        totalEntries++;
      }
      totalSize += mainHeader2.mainHeaderSize;
      mainHeader2.offset = dindex;
      mainHeader2.totalEntries = totalEntries;
      dindex = 0;
      const outBuffer = Buffer.alloc(totalSize);
      for (const content of dataBlock) {
        content.copy(outBuffer, dindex);
        dindex += content.length;
      }
      for (const content of headerBlocks) {
        content.copy(outBuffer, dindex);
        dindex += content.length;
      }
      const mh = mainHeader2.toBinary();
      if (_comment) {
        _comment.copy(mh, Utils$1.Constants.ENDHDR);
      }
      mh.copy(outBuffer, dindex);
      inBuffer = outBuffer;
      loadedEntries = false;
      return outBuffer;
    },
    toAsyncBuffer: function(onSuccess, onFail, onItemStart, onItemEnd) {
      try {
        if (!loadedEntries) {
          readEntries();
        }
        sortEntries();
        const dataBlock = [];
        const centralHeaders = [];
        let totalSize = 0;
        let dindex = 0;
        let totalEntries = 0;
        mainHeader2.size = 0;
        mainHeader2.offset = 0;
        const compress2Buffer = function(entryLists) {
          if (entryLists.length > 0) {
            const entry = entryLists.shift();
            const name = entry.entryName + entry.extra.toString();
            if (onItemStart) onItemStart(name);
            entry.getCompressedDataAsync(function(compressedData) {
              if (onItemEnd) onItemEnd(name);
              entry.header.offset = dindex;
              const localHeader = entry.packLocalHeader();
              const dataLength = localHeader.length + compressedData.length;
              dindex += dataLength;
              dataBlock.push(localHeader);
              dataBlock.push(compressedData);
              const centalHeader = entry.packCentralHeader();
              centralHeaders.push(centalHeader);
              mainHeader2.size += centalHeader.length;
              totalSize += dataLength + centalHeader.length;
              totalEntries++;
              compress2Buffer(entryLists);
            });
          } else {
            totalSize += mainHeader2.mainHeaderSize;
            mainHeader2.offset = dindex;
            mainHeader2.totalEntries = totalEntries;
            dindex = 0;
            const outBuffer = Buffer.alloc(totalSize);
            dataBlock.forEach(function(content) {
              content.copy(outBuffer, dindex);
              dindex += content.length;
            });
            centralHeaders.forEach(function(content) {
              content.copy(outBuffer, dindex);
              dindex += content.length;
            });
            const mh = mainHeader2.toBinary();
            if (_comment) {
              _comment.copy(mh, Utils$1.Constants.ENDHDR);
            }
            mh.copy(outBuffer, dindex);
            inBuffer = outBuffer;
            loadedEntries = false;
            onSuccess(outBuffer);
          }
        };
        compress2Buffer(Array.from(this.entries));
      } catch (e) {
        onFail(e);
      }
    }
  };
};
const Utils = utilExports;
const pth = require$$1;
const ZipEntry = zipEntry;
const ZipFile = zipFile;
const get_Bool = (...val) => Utils.findLast(val, (c) => typeof c === "boolean");
const get_Str = (...val) => Utils.findLast(val, (c) => typeof c === "string");
const get_Fun = (...val) => Utils.findLast(val, (c) => typeof c === "function");
const defaultOptions = {
  // option "noSort" : if true it disables files sorting
  noSort: false,
  // read entries during load (initial loading may be slower)
  readEntries: false,
  // default method is none
  method: Utils.Constants.NONE,
  // file system
  fs: null
};
var admZip = function(input, options) {
  let inBuffer = null;
  const opts = Object.assign(/* @__PURE__ */ Object.create(null), defaultOptions);
  if (input && "object" === typeof input) {
    if (!(input instanceof Uint8Array)) {
      Object.assign(opts, input);
      input = opts.input ? opts.input : void 0;
      if (opts.input) delete opts.input;
    }
    if (Buffer.isBuffer(input)) {
      inBuffer = input;
      opts.method = Utils.Constants.BUFFER;
      input = void 0;
    }
  }
  Object.assign(opts, options);
  const filetools = new Utils(opts);
  if (typeof opts.decoder !== "object" || typeof opts.decoder.encode !== "function" || typeof opts.decoder.decode !== "function") {
    opts.decoder = Utils.decoder;
  }
  if (input && "string" === typeof input) {
    if (filetools.fs.existsSync(input)) {
      opts.method = Utils.Constants.FILE;
      opts.filename = input;
      inBuffer = filetools.fs.readFileSync(input);
    } else {
      throw Utils.Errors.INVALID_FILENAME();
    }
  }
  const _zip = new ZipFile(inBuffer, opts);
  const { canonical, sanitize, zipnamefix } = Utils;
  function getEntry(entry) {
    if (entry && _zip) {
      var item;
      if (typeof entry === "string") item = _zip.getEntry(pth.posix.normalize(entry));
      if (typeof entry === "object" && typeof entry.entryName !== "undefined" && typeof entry.header !== "undefined") item = _zip.getEntry(entry.entryName);
      if (item) {
        return item;
      }
    }
    return null;
  }
  function fixPath(zipPath) {
    const { join: join2, normalize, sep } = pth.posix;
    return join2(".", normalize(sep + zipPath.split("\\").join(sep) + sep));
  }
  function filenameFilter(filterfn) {
    if (filterfn instanceof RegExp) {
      return /* @__PURE__ */ function(rx) {
        return function(filename) {
          return rx.test(filename);
        };
      }(filterfn);
    } else if ("function" !== typeof filterfn) {
      return () => true;
    }
    return filterfn;
  }
  const relativePath = (local, entry) => {
    let lastChar = entry.slice(-1);
    lastChar = lastChar === filetools.sep ? filetools.sep : "";
    return pth.relative(local, entry) + lastChar;
  };
  return {
    /**
     * Extracts the given entry from the archive and returns the content as a Buffer object
     * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
     * @param {Buffer|string} [pass] - password
     * @return Buffer or Null in case of error
     */
    readFile: function(entry, pass) {
      var item = getEntry(entry);
      return item && item.getData(pass) || null;
    },
    /**
     * Returns how many child elements has on entry (directories) on files it is always 0
     * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
     * @returns {integer}
     */
    childCount: function(entry) {
      const item = getEntry(entry);
      if (item) {
        return _zip.getChildCount(item);
      }
    },
    /**
     * Asynchronous readFile
     * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
     * @param {callback} callback
     *
     * @return Buffer or Null in case of error
     */
    readFileAsync: function(entry, callback) {
      var item = getEntry(entry);
      if (item) {
        item.getDataAsync(callback);
      } else {
        callback(null, "getEntry failed for:" + entry);
      }
    },
    /**
     * Extracts the given entry from the archive and returns the content as plain text in the given encoding
     * @param {ZipEntry|string} entry - ZipEntry object or String with the full path of the entry
     * @param {string} encoding - Optional. If no encoding is specified utf8 is used
     *
     * @return String
     */
    readAsText: function(entry, encoding) {
      var item = getEntry(entry);
      if (item) {
        var data = item.getData();
        if (data && data.length) {
          return data.toString(encoding || "utf8");
        }
      }
      return "";
    },
    /**
     * Asynchronous readAsText
     * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
     * @param {callback} callback
     * @param {string} [encoding] - Optional. If no encoding is specified utf8 is used
     *
     * @return String
     */
    readAsTextAsync: function(entry, callback, encoding) {
      var item = getEntry(entry);
      if (item) {
        item.getDataAsync(function(data, err) {
          if (err) {
            callback(data, err);
            return;
          }
          if (data && data.length) {
            callback(data.toString(encoding || "utf8"));
          } else {
            callback("");
          }
        });
      } else {
        callback("");
      }
    },
    /**
     * Remove the entry from the file or the entry and all it's nested directories and files if the given entry is a directory
     *
     * @param {ZipEntry|string} entry
     * @returns {void}
     */
    deleteFile: function(entry, withsubfolders = true) {
      var item = getEntry(entry);
      if (item) {
        _zip.deleteFile(item.entryName, withsubfolders);
      }
    },
    /**
     * Remove the entry from the file or directory without affecting any nested entries
     *
     * @param {ZipEntry|string} entry
     * @returns {void}
     */
    deleteEntry: function(entry) {
      var item = getEntry(entry);
      if (item) {
        _zip.deleteEntry(item.entryName);
      }
    },
    /**
     * Adds a comment to the zip. The zip must be rewritten after adding the comment.
     *
     * @param {string} comment
     */
    addZipComment: function(comment) {
      _zip.comment = comment;
    },
    /**
     * Returns the zip comment
     *
     * @return String
     */
    getZipComment: function() {
      return _zip.comment || "";
    },
    /**
     * Adds a comment to a specified zipEntry. The zip must be rewritten after adding the comment
     * The comment cannot exceed 65535 characters in length
     *
     * @param {ZipEntry} entry
     * @param {string} comment
     */
    addZipEntryComment: function(entry, comment) {
      var item = getEntry(entry);
      if (item) {
        item.comment = comment;
      }
    },
    /**
     * Returns the comment of the specified entry
     *
     * @param {ZipEntry} entry
     * @return String
     */
    getZipEntryComment: function(entry) {
      var item = getEntry(entry);
      if (item) {
        return item.comment || "";
      }
      return "";
    },
    /**
     * Updates the content of an existing entry inside the archive. The zip must be rewritten after updating the content
     *
     * @param {ZipEntry} entry
     * @param {Buffer} content
     */
    updateFile: function(entry, content) {
      var item = getEntry(entry);
      if (item) {
        item.setData(content);
      }
    },
    /**
     * Adds a file from the disk to the archive
     *
     * @param {string} localPath File to add to zip
     * @param {string} [zipPath] Optional path inside the zip
     * @param {string} [zipName] Optional name for the file
     * @param {string} [comment] Optional file comment
     */
    addLocalFile: function(localPath2, zipPath, zipName, comment) {
      if (filetools.fs.existsSync(localPath2)) {
        zipPath = zipPath ? fixPath(zipPath) : "";
        const p = pth.win32.basename(pth.win32.normalize(localPath2));
        zipPath += zipName ? zipName : p;
        const _attr = filetools.fs.statSync(localPath2);
        const data = _attr.isFile() ? filetools.fs.readFileSync(localPath2) : Buffer.alloc(0);
        if (_attr.isDirectory()) zipPath += filetools.sep;
        this.addFile(zipPath, data, comment, _attr);
      } else {
        throw Utils.Errors.FILE_NOT_FOUND(localPath2);
      }
    },
    /**
     * Callback for showing if everything was done.
     *
     * @callback doneCallback
     * @param {Error} err - Error object
     * @param {boolean} done - was request fully completed
     */
    /**
     * Adds a file from the disk to the archive
     *
     * @param {(object|string)} options - options object, if it is string it us used as localPath.
     * @param {string} options.localPath - Local path to the file.
     * @param {string} [options.comment] - Optional file comment.
     * @param {string} [options.zipPath] - Optional path inside the zip
     * @param {string} [options.zipName] - Optional name for the file
     * @param {doneCallback} callback - The callback that handles the response.
     */
    addLocalFileAsync: function(options2, callback) {
      options2 = typeof options2 === "object" ? options2 : { localPath: options2 };
      const localPath2 = pth.resolve(options2.localPath);
      const { comment } = options2;
      let { zipPath, zipName } = options2;
      const self2 = this;
      filetools.fs.stat(localPath2, function(err, stats) {
        if (err) return callback(err, false);
        zipPath = zipPath ? fixPath(zipPath) : "";
        const p = pth.win32.basename(pth.win32.normalize(localPath2));
        zipPath += zipName ? zipName : p;
        if (stats.isFile()) {
          filetools.fs.readFile(localPath2, function(err2, data) {
            if (err2) return callback(err2, false);
            self2.addFile(zipPath, data, comment, stats);
            return setImmediate(callback, void 0, true);
          });
        } else if (stats.isDirectory()) {
          zipPath += filetools.sep;
          self2.addFile(zipPath, Buffer.alloc(0), comment, stats);
          return setImmediate(callback, void 0, true);
        }
      });
    },
    /**
     * Adds a local directory and all its nested files and directories to the archive
     *
     * @param {string} localPath - local path to the folder
     * @param {string} [zipPath] - optional path inside zip
     * @param {(RegExp|function)} [filter] - optional RegExp or Function if files match will be included.
     */
    addLocalFolder: function(localPath2, zipPath, filter) {
      filter = filenameFilter(filter);
      zipPath = zipPath ? fixPath(zipPath) : "";
      localPath2 = pth.normalize(localPath2);
      if (filetools.fs.existsSync(localPath2)) {
        const items = filetools.findFiles(localPath2);
        const self2 = this;
        if (items.length) {
          for (const filepath of items) {
            const p = pth.join(zipPath, relativePath(localPath2, filepath));
            if (filter(p)) {
              self2.addLocalFile(filepath, pth.dirname(p));
            }
          }
        }
      } else {
        throw Utils.Errors.FILE_NOT_FOUND(localPath2);
      }
    },
    /**
     * Asynchronous addLocalFolder
     * @param {string} localPath
     * @param {callback} callback
     * @param {string} [zipPath] optional path inside zip
     * @param {RegExp|function} [filter] optional RegExp or Function if files match will
     *               be included.
     */
    addLocalFolderAsync: function(localPath2, callback, zipPath, filter) {
      filter = filenameFilter(filter);
      zipPath = zipPath ? fixPath(zipPath) : "";
      localPath2 = pth.normalize(localPath2);
      var self2 = this;
      filetools.fs.open(localPath2, "r", function(err) {
        if (err && err.code === "ENOENT") {
          callback(void 0, Utils.Errors.FILE_NOT_FOUND(localPath2));
        } else if (err) {
          callback(void 0, err);
        } else {
          var items = filetools.findFiles(localPath2);
          var i = -1;
          var next = function() {
            i += 1;
            if (i < items.length) {
              var filepath = items[i];
              var p = relativePath(localPath2, filepath).split("\\").join("/");
              p = p.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "");
              if (filter(p)) {
                filetools.fs.stat(filepath, function(er0, stats) {
                  if (er0) callback(void 0, er0);
                  if (stats.isFile()) {
                    filetools.fs.readFile(filepath, function(er1, data) {
                      if (er1) {
                        callback(void 0, er1);
                      } else {
                        self2.addFile(zipPath + p, data, "", stats);
                        next();
                      }
                    });
                  } else {
                    self2.addFile(zipPath + p + "/", Buffer.alloc(0), "", stats);
                    next();
                  }
                });
              } else {
                process.nextTick(() => {
                  next();
                });
              }
            } else {
              callback(true, void 0);
            }
          };
          next();
        }
      });
    },
    /**
     * Adds a local directory and all its nested files and directories to the archive
     *
     * @param {object | string} options - options object, if it is string it us used as localPath.
     * @param {string} options.localPath - Local path to the folder.
     * @param {string} [options.zipPath] - optional path inside zip.
     * @param {RegExp|function} [options.filter] - optional RegExp or Function if files match will be included.
     * @param {function|string} [options.namefix] - optional function to help fix filename
     * @param {doneCallback} callback - The callback that handles the response.
     *
     */
    addLocalFolderAsync2: function(options2, callback) {
      const self2 = this;
      options2 = typeof options2 === "object" ? options2 : { localPath: options2 };
      localPath = pth.resolve(fixPath(options2.localPath));
      let { zipPath, filter, namefix } = options2;
      if (filter instanceof RegExp) {
        filter = /* @__PURE__ */ function(rx) {
          return function(filename) {
            return rx.test(filename);
          };
        }(filter);
      } else if ("function" !== typeof filter) {
        filter = function() {
          return true;
        };
      }
      zipPath = zipPath ? fixPath(zipPath) : "";
      if (namefix == "latin1") {
        namefix = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "");
      }
      if (typeof namefix !== "function") namefix = (str) => str;
      const relPathFix = (entry) => pth.join(zipPath, namefix(relativePath(localPath, entry)));
      const fileNameFix = (entry) => pth.win32.basename(pth.win32.normalize(namefix(entry)));
      filetools.fs.open(localPath, "r", function(err) {
        if (err && err.code === "ENOENT") {
          callback(void 0, Utils.Errors.FILE_NOT_FOUND(localPath));
        } else if (err) {
          callback(void 0, err);
        } else {
          filetools.findFilesAsync(localPath, function(err2, fileEntries) {
            if (err2) return callback(err2);
            fileEntries = fileEntries.filter((dir) => filter(relPathFix(dir)));
            if (!fileEntries.length) callback(void 0, false);
            setImmediate(
              fileEntries.reverse().reduce(function(next, entry) {
                return function(err3, done) {
                  if (err3 || done === false) return setImmediate(next, err3, false);
                  self2.addLocalFileAsync(
                    {
                      localPath: entry,
                      zipPath: pth.dirname(relPathFix(entry)),
                      zipName: fileNameFix(entry)
                    },
                    next
                  );
                };
              }, callback)
            );
          });
        }
      });
    },
    /**
     * Adds a local directory and all its nested files and directories to the archive
     *
     * @param {string} localPath - path where files will be extracted
     * @param {object} props - optional properties
     * @param {string} [props.zipPath] - optional path inside zip
     * @param {RegExp|function} [props.filter] - optional RegExp or Function if files match will be included.
     * @param {function|string} [props.namefix] - optional function to help fix filename
     */
    addLocalFolderPromise: function(localPath2, props) {
      return new Promise((resolve, reject) => {
        this.addLocalFolderAsync2(Object.assign({ localPath: localPath2 }, props), (err, done) => {
          if (err) reject(err);
          if (done) resolve(this);
        });
      });
    },
    /**
     * Allows you to create a entry (file or directory) in the zip file.
     * If you want to create a directory the entryName must end in / and a null buffer should be provided.
     * Comment and attributes are optional
     *
     * @param {string} entryName
     * @param {Buffer | string} content - file content as buffer or utf8 coded string
     * @param {string} [comment] - file comment
     * @param {number | object} [attr] - number as unix file permissions, object as filesystem Stats object
     */
    addFile: function(entryName, content, comment, attr) {
      entryName = zipnamefix(entryName);
      let entry = getEntry(entryName);
      const update = entry != null;
      if (!update) {
        entry = new ZipEntry(opts);
        entry.entryName = entryName;
      }
      entry.comment = comment || "";
      const isStat = "object" === typeof attr && attr instanceof filetools.fs.Stats;
      if (isStat) {
        entry.header.time = attr.mtime;
      }
      var fileattr = entry.isDirectory ? 16 : 0;
      let unix = entry.isDirectory ? 16384 : 32768;
      if (isStat) {
        unix |= 4095 & attr.mode;
      } else if ("number" === typeof attr) {
        unix |= 4095 & attr;
      } else {
        unix |= entry.isDirectory ? 493 : 420;
      }
      fileattr = (fileattr | unix << 16) >>> 0;
      entry.attr = fileattr;
      entry.setData(content);
      if (!update) _zip.setEntry(entry);
      return entry;
    },
    /**
     * Returns an array of ZipEntry objects representing the files and folders inside the archive
     *
     * @param {string} [password]
     * @returns Array
     */
    getEntries: function(password) {
      _zip.password = password;
      return _zip ? _zip.entries : [];
    },
    /**
     * Returns a ZipEntry object representing the file or folder specified by ``name``.
     *
     * @param {string} name
     * @return ZipEntry
     */
    getEntry: function(name) {
      return getEntry(name);
    },
    getEntryCount: function() {
      return _zip.getEntryCount();
    },
    forEach: function(callback) {
      return _zip.forEach(callback);
    },
    /**
     * Extracts the given entry to the given targetPath
     * If the entry is a directory inside the archive, the entire directory and it's subdirectories will be extracted
     *
     * @param {string|ZipEntry} entry - ZipEntry object or String with the full path of the entry
     * @param {string} targetPath - Target folder where to write the file
     * @param {boolean} [maintainEntryPath=true] - If maintainEntryPath is true and the entry is inside a folder, the entry folder will be created in targetPath as well. Default is TRUE
     * @param {boolean} [overwrite=false] - If the file already exists at the target path, the file will be overwriten if this is true.
     * @param {boolean} [keepOriginalPermission=false] - The file will be set as the permission from the entry if this is true.
     * @param {string} [outFileName] - String If set will override the filename of the extracted file (Only works if the entry is a file)
     *
     * @return Boolean
     */
    extractEntryTo: function(entry, targetPath, maintainEntryPath, overwrite, keepOriginalPermission, outFileName) {
      overwrite = get_Bool(false, overwrite);
      keepOriginalPermission = get_Bool(false, keepOriginalPermission);
      maintainEntryPath = get_Bool(true, maintainEntryPath);
      outFileName = get_Str(keepOriginalPermission, outFileName);
      var item = getEntry(entry);
      if (!item) {
        throw Utils.Errors.NO_ENTRY();
      }
      var entryName = canonical(item.entryName);
      var target = sanitize(targetPath, outFileName && !item.isDirectory ? outFileName : maintainEntryPath ? entryName : pth.basename(entryName));
      if (item.isDirectory) {
        var children = _zip.getEntryChildren(item);
        children.forEach(function(child) {
          if (child.isDirectory) return;
          var content2 = child.getData();
          if (!content2) {
            throw Utils.Errors.CANT_EXTRACT_FILE();
          }
          var name = canonical(child.entryName);
          var childName = sanitize(targetPath, maintainEntryPath ? name : pth.basename(name));
          const fileAttr2 = keepOriginalPermission ? child.header.fileAttr : void 0;
          filetools.writeFileTo(childName, content2, overwrite, fileAttr2);
        });
        return true;
      }
      var content = item.getData(_zip.password);
      if (!content) throw Utils.Errors.CANT_EXTRACT_FILE();
      if (filetools.fs.existsSync(target) && !overwrite) {
        throw Utils.Errors.CANT_OVERRIDE();
      }
      const fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
      filetools.writeFileTo(target, content, overwrite, fileAttr);
      return true;
    },
    /**
     * Test the archive
     * @param {string} [pass]
     */
    test: function(pass) {
      if (!_zip) {
        return false;
      }
      for (var entry in _zip.entries) {
        try {
          if (entry.isDirectory) {
            continue;
          }
          var content = _zip.entries[entry].getData(pass);
          if (!content) {
            return false;
          }
        } catch (err) {
          return false;
        }
      }
      return true;
    },
    /**
     * Extracts the entire archive to the given location
     *
     * @param {string} targetPath Target location
     * @param {boolean} [overwrite=false] If the file already exists at the target path, the file will be overwriten if this is true.
     *                  Default is FALSE
     * @param {boolean} [keepOriginalPermission=false] The file will be set as the permission from the entry if this is true.
     *                  Default is FALSE
     * @param {string|Buffer} [pass] password
     */
    extractAllTo: function(targetPath, overwrite, keepOriginalPermission, pass) {
      keepOriginalPermission = get_Bool(false, keepOriginalPermission);
      pass = get_Str(keepOriginalPermission, pass);
      overwrite = get_Bool(false, overwrite);
      if (!_zip) throw Utils.Errors.NO_ZIP();
      _zip.entries.forEach(function(entry) {
        var entryName = sanitize(targetPath, canonical(entry.entryName));
        if (entry.isDirectory) {
          filetools.makeDir(entryName);
          return;
        }
        var content = entry.getData(pass);
        if (!content) {
          throw Utils.Errors.CANT_EXTRACT_FILE();
        }
        const fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
        filetools.writeFileTo(entryName, content, overwrite, fileAttr);
        try {
          filetools.fs.utimesSync(entryName, entry.header.time, entry.header.time);
        } catch (err) {
          throw Utils.Errors.CANT_EXTRACT_FILE();
        }
      });
    },
    /**
     * Asynchronous extractAllTo
     *
     * @param {string} targetPath Target location
     * @param {boolean} [overwrite=false] If the file already exists at the target path, the file will be overwriten if this is true.
     *                  Default is FALSE
     * @param {boolean} [keepOriginalPermission=false] The file will be set as the permission from the entry if this is true.
     *                  Default is FALSE
     * @param {function} callback The callback will be executed when all entries are extracted successfully or any error is thrown.
     */
    extractAllToAsync: function(targetPath, overwrite, keepOriginalPermission, callback) {
      callback = get_Fun(overwrite, keepOriginalPermission, callback);
      keepOriginalPermission = get_Bool(false, keepOriginalPermission);
      overwrite = get_Bool(false, overwrite);
      if (!callback) {
        return new Promise((resolve, reject) => {
          this.extractAllToAsync(targetPath, overwrite, keepOriginalPermission, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(this);
            }
          });
        });
      }
      if (!_zip) {
        callback(Utils.Errors.NO_ZIP());
        return;
      }
      targetPath = pth.resolve(targetPath);
      const getPath = (entry) => sanitize(targetPath, pth.normalize(canonical(entry.entryName)));
      const getError = (msg, file2) => new Error(msg + ': "' + file2 + '"');
      const dirEntries = [];
      const fileEntries = [];
      _zip.entries.forEach((e) => {
        if (e.isDirectory) {
          dirEntries.push(e);
        } else {
          fileEntries.push(e);
        }
      });
      for (const entry of dirEntries) {
        const dirPath = getPath(entry);
        const dirAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
        try {
          filetools.makeDir(dirPath);
          if (dirAttr) filetools.fs.chmodSync(dirPath, dirAttr);
          filetools.fs.utimesSync(dirPath, entry.header.time, entry.header.time);
        } catch (er) {
          callback(getError("Unable to create folder", dirPath));
        }
      }
      fileEntries.reverse().reduce(function(next, entry) {
        return function(err) {
          if (err) {
            next(err);
          } else {
            const entryName = pth.normalize(canonical(entry.entryName));
            const filePath = sanitize(targetPath, entryName);
            entry.getDataAsync(function(content, err_1) {
              if (err_1) {
                next(err_1);
              } else if (!content) {
                next(Utils.Errors.CANT_EXTRACT_FILE());
              } else {
                const fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
                filetools.writeFileToAsync(filePath, content, overwrite, fileAttr, function(succ) {
                  if (!succ) {
                    next(getError("Unable to write file", filePath));
                  }
                  filetools.fs.utimes(filePath, entry.header.time, entry.header.time, function(err_2) {
                    if (err_2) {
                      next(getError("Unable to set times", filePath));
                    } else {
                      next();
                    }
                  });
                });
              }
            });
          }
        };
      }, callback)();
    },
    /**
     * Writes the newly created zip file to disk at the specified location or if a zip was opened and no ``targetFileName`` is provided, it will overwrite the opened zip
     *
     * @param {string} targetFileName
     * @param {function} callback
     */
    writeZip: function(targetFileName, callback) {
      if (arguments.length === 1) {
        if (typeof targetFileName === "function") {
          callback = targetFileName;
          targetFileName = "";
        }
      }
      if (!targetFileName && opts.filename) {
        targetFileName = opts.filename;
      }
      if (!targetFileName) return;
      var zipData = _zip.compressToBuffer();
      if (zipData) {
        var ok = filetools.writeFileTo(targetFileName, zipData, true);
        if (typeof callback === "function") callback(!ok ? new Error("failed") : null, "");
      }
    },
    /**
             *
             * @param {string} targetFileName
             * @param {object} [props]
             * @param {boolean} [props.overwrite=true] If the file already exists at the target path, the file will be overwriten if this is true.
             * @param {boolean} [props.perm] The file will be set as the permission from the entry if this is true.
    
             * @returns {Promise<void>}
             */
    writeZipPromise: function(targetFileName, props) {
      const { overwrite, perm } = Object.assign({ overwrite: true }, props);
      return new Promise((resolve, reject) => {
        if (!targetFileName && opts.filename) targetFileName = opts.filename;
        if (!targetFileName) reject("ADM-ZIP: ZIP File Name Missing");
        this.toBufferPromise().then((zipData) => {
          const ret = (done) => done ? resolve(done) : reject("ADM-ZIP: Wasn't able to write zip file");
          filetools.writeFileToAsync(targetFileName, zipData, overwrite, perm, ret);
        }, reject);
      });
    },
    /**
     * @returns {Promise<Buffer>} A promise to the Buffer.
     */
    toBufferPromise: function() {
      return new Promise((resolve, reject) => {
        _zip.toAsyncBuffer(resolve, reject);
      });
    },
    /**
     * Returns the content of the entire zip file as a Buffer object
     *
     * @prop {function} [onSuccess]
     * @prop {function} [onFail]
     * @prop {function} [onItemStart]
     * @prop {function} [onItemEnd]
     * @returns {Buffer}
     */
    toBuffer: function(onSuccess, onFail, onItemStart, onItemEnd) {
      if (typeof onSuccess === "function") {
        _zip.toAsyncBuffer(onSuccess, onFail, onItemStart, onItemEnd);
        return null;
      }
      return _zip.compressToBuffer();
    }
  };
};
const AdmZip = /* @__PURE__ */ getDefaultExportFromCjs(admZip);
const __dirname = path$c.dirname(fileURLToPath(import.meta.url));
const appDataDir = process.env.APPDATA || (process.platform == "darwin" ? process.env.HOME + "/Library/Preferences" : process.env.HOME + "/.local/share");
const dataDir = join(appDataDir, "Tyranny Mod Manager");
const persistentDataDir = join(dataDir, "persistent-data");
const disabledModsDir = join(dataDir, "mods");
const cachedPathsFile = join(persistentDataDir, "paths.json");
const installedModsFile = join(persistentDataDir, "modList.json");
let execFile;
let gameDir;
let pluginsDir;
lib.ensureDir(persistentDataDir);
process.env.APP_ROOT = path$c.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$c.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$c.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$c.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path$c.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path$c.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    win == null ? void 0 : win.webContents.openDevTools();
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$c.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
ipcMain.handle("open-exe-dialog", async () => {
  try {
    const result = await dialog.showOpenDialog({
      title: "Select an EXE file",
      properties: ["openFile"],
      filters: [
        { name: "Executable Files", extensions: ["exe"] }
      ]
    });
    if (!result.canceled && result.filePaths.length > 0) {
      console.log("Selected file:", result.filePaths[0]);
      return result.filePaths[0];
    }
    return null;
  } catch (err) {
    console.error("Error opening dialog:", err);
    return null;
  }
});
ipcMain.handle("check-default-paths", () => {
  return Promise.resolve(checkAllLaunchers());
});
ipcMain.handle("cache-exec-path", (_, execPath) => {
  let fileContent = "";
  if (fs$i.existsSync(cachedPathsFile))
    fileContent = fs$i.readFileSync(cachedPathsFile, "utf-8");
  else {
    lib.createFileSync(cachedPathsFile);
  }
  let cachedPaths;
  if (fileContent)
    cachedPaths = JSON.parse(fileContent);
  else {
    cachedPaths = {
      execPath
    };
  }
  cachedPaths.execPath = execPath;
  const jsonStr = JSON.stringify(cachedPaths, null, 2);
  fs$i.writeFileSync(cachedPathsFile, jsonStr);
  execFile = execPath;
  gameDir = path$c.dirname(execFile);
  pluginsDir = join(gameDir, "BepInEx", "plugins");
});
ipcMain.handle("check-cached-path", async () => {
  if (!fs$i.existsSync(cachedPathsFile))
    return Promise.resolve(null);
  const content = fs$i.readFileSync(cachedPathsFile, "utf-8");
  const json2 = JSON.parse(content);
  const execPath = json2.execPath || null;
  if (!execPath) {
    return Promise.resolve(null);
  }
  execFile = execPath;
  gameDir = path$c.dirname(execFile);
  pluginsDir = join(gameDir, "BepInEx", "plugins");
  return Promise.resolve(execPath);
});
ipcMain.handle("install-mod", async (_, file2) => {
  if (!fs$i.existsSync(file2)) return Promise.resolve(null);
  const fileName = path$c.basename(file2);
  const fileExt = path$c.extname(file2);
  const targetPath = join(pluginsDir, fileName);
  fs$i.copyFileSync(file2, targetPath);
  let containsDll = false;
  if (fileExt === ".zip") {
    try {
      const zip = new AdmZip(targetPath);
      const zipEntries = zip.getEntries();
      const topLevelItems = /* @__PURE__ */ new Set();
      zipEntries.forEach((entry) => {
        const topLevelItem = entry.entryName.split("/")[0];
        topLevelItems.add(topLevelItem);
        if (path$c.extname(entry.entryName) === ".dll") {
          containsDll = true;
        }
      });
      let extractedDirName = "";
      if (topLevelItems.size === 1) {
        const singleItem = Array.from(topLevelItems)[0];
        extractedDirName = singleItem;
        const mainDir = join(pluginsDir, singleItem);
        zip.extractAllTo(pluginsDir, true);
        console.log(`Extracted directory ${singleItem} to ${mainDir}`);
      } else {
        extractedDirName = path$c.basename(file2, ".zip");
        const extractTo = join(pluginsDir, extractedDirName);
        zip.extractAllTo(extractTo, true);
        console.log(`File unzipped to: ${extractTo}`);
      }
      if (containsDll) {
        console.log("The archive contains at least one .dll file.");
      } else {
        console.log("No .dll files were found in the archive.");
      }
      fs$i.unlinkSync(targetPath);
      if (!fs$i.existsSync(installedModsFile))
        lib.createFileSync(installedModsFile);
      const installedMods = fs$i.readFileSync(installedModsFile, "utf-8");
      let modInfo;
      if (installedMods)
        modInfo = JSON.parse(installedMods);
      if (!modInfo)
        modInfo = { mods: [] };
      modInfo.mods.push({ name: extractedDirName, enabled: true });
      const modListJson = JSON.stringify(modInfo, null, 2);
      fs$i.writeFileSync(installedModsFile, modListJson);
      console.log(`Deleted ZIP file: ${targetPath}`);
      return Promise.resolve({ modName: extractedDirName });
    } catch (error) {
      console.error("Error unzipping file:", error);
    }
  }
  return Promise.resolve(null);
});
ipcMain.handle("update-mod-status", (_, id, modName, enabled) => {
  const modPath = enabled ? join(disabledModsDir, modName) : join(pluginsDir, modName);
  const targetPath = enabled ? join(pluginsDir, modName) : join(disabledModsDir, modName);
  lib.moveSync(modPath, targetPath);
  const installedMods = fs$i.readFileSync(installedModsFile, "utf-8");
  let modInfo;
  if (installedMods)
    modInfo = JSON.parse(installedMods);
  if (!modInfo)
    modInfo = { mods: [] };
  const index = modInfo.mods.findIndex((mod) => mod.name == modName);
  modInfo.mods[index] = { name: modName, enabled };
  const modListJson = JSON.stringify(modInfo, null, 2);
  fs$i.writeFileSync(installedModsFile, modListJson);
});
ipcMain.handle("get-managed-mods", () => {
  if (!fs$i.existsSync(installedModsFile))
    return Promise.resolve({ mods: [] });
  const installedMods = fs$i.readFileSync(installedModsFile, "utf-8");
  let modInfo;
  if (installedMods)
    modInfo = JSON.parse(installedMods);
  if (!modInfo)
    modInfo = { mods: [] };
  return Promise.resolve(modInfo);
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
