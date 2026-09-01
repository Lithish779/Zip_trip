const fs = require("fs");
const path = require("path");

/**
 * Minimal file-based JSON "database".
 *
 * Why a hand-rolled store instead of a library:
 * the challenge explicitly allows "a file or a database", and a plain
 * JSON file keeps the project runnable by anyone with zero setup
 * (no Mongo/Postgres instance required to evaluate the submission).
 *
 * Writes are serialized through a promise chain (`writeQueue`) so that
 * concurrent requests can't interleave and corrupt the file.
 */
class FileStore {
  constructor(fileName) {
    this.filePath = path.join(__dirname, "..", "data", fileName);
    this.writeQueue = Promise.resolve();
    this._ensureFile();
  }

  _ensureFile() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, "[]", "utf-8");
    }
  }

  readAll() {
    const raw = fs.readFileSync(this.filePath, "utf-8");
    try {
      return JSON.parse(raw || "[]");
    } catch (err) {
      console.error(`Failed to parse ${this.filePath}, resetting to []`, err);
      return [];
    }
  }

  // All writes are queued so they run one-at-a-time, even if several
  // requests call write() around the same time.
  write(data) {
    this.writeQueue = this.writeQueue.then(
      () =>
        new Promise((resolve, reject) => {
          fs.writeFile(
            this.filePath,
            JSON.stringify(data, null, 2),
            "utf-8",
            (err) => (err ? reject(err) : resolve())
          );
        })
    );
    return this.writeQueue;
  }
}

module.exports = FileStore;
