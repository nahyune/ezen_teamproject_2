// Node 24.13의 fs.rm/rmSync(recursive)가 비ASCII(한글) 경로에서
// 네이티브 크래시(0xC0000409)하는 버그 우회용 dist 청소 스크립트.
// Vite의 emptyOutDir도 같은 API를 써서 죽기 때문에, 빌드 전에
// readdir/unlink/rmdir 순회 방식으로 직접 비운다.
import { readdirSync, unlinkSync, rmdirSync, existsSync } from "node:fs";
import { join } from "node:path";

function removeDir(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) removeDir(p);
    else unlinkSync(p);
  }
  rmdirSync(dir);
}

if (existsSync("dist")) removeDir("dist");
