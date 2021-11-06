const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");

let git_path = null;
for (let p of process.env.PATH.split(path.delimiter)) {
    let exts = ["", ".exe"];
    for (let ext of exts) {
        let candidate = path.resolve(p, `git${ext}`);
        if (fs.existsSync(candidate)) {
            git_path = candidate;
            break;
        }
    }
    if (git_path !== null) {
        break;
    }
}
if (git_path === null) {
    console.error("git is missing!");
    process.exit(1);
}

const distDir = path.resolve(__dirname, "./dist");

(() => {
    let npm = spawnSync("npm", ["run", "build"], { shell: true });
    if (npm.error) {
        throw npm.error;
    }
})();

const publishDir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);

const check_error = (proc) => {
    if (proc.error) {
        fs.rm(publishDir, { recursive: true, force: true });
        throw proc.error;
    }
};
const spawn_git = (args, options) => {
    let git = spawnSync(git_path, args, Object.assign({ stdout: ["pipe", "inherit", "inherit"] }, options));
    console.log(git.stdout.toString().trimEnd());
    check_error(git);
    return git;
};

process.chdir(publishDir);
spawn_git(["init"]);
spawn_git(["remote", "add", "origin", "https://github.com/siniarskimar/siniarskimar.github.io"]);
spawn_git(["fetch", "origin"]);
spawn_git(["switch", "www-root"]);

(async () => {
    for (let file of await fsp.readdir(".")) {
        if (file === ".git") {
            continue;
        }
        fsp.rm(path.resolve(".", file), { recursive: true, force: true });
    }

    const copy = async (src, dst) => {
        let stat = await fsp.stat(src);
        if (!stat.isDirectory()) {
            await fsp.copyFile(src, dst).catch((error) => { throw new Error(error); });
            return;
        }
        if (!fs.existsSync(dst)) {
            fs.mkdirSync(dst);
        }
        let files = (await fsp.readdir(src)).map((v) => { return path.resolve(src, v) });
        await Promise.all(
            files.map((file) => {
                return copy(file, path.join(dst, path.basename(file)));
            }));
    };

    await copy(distDir, publishDir);

    spawn_git(["add", "-A"]);
    spawn_git(["commit", "-m", new Date().toISOString()]);
    spawn_git(["push"]);

    process.chdir(__dirname);
    spawn_git(["fetch"]);

})().then(() => {
    fsp.rm(publishDir, { recursive: true, force: true });
});