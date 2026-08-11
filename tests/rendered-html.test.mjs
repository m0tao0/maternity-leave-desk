import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the maternity leave calculator", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>产假政策核算台｜20城首版<\/title>/i);
  assert.match(html, /把政策条文，算成一个明确日期。/);
  assert.match(html, /填写核算条件/);
  assert.match(html, /确认分娩日期并更新核算结果/);
  assert.match(html, />确认<\/button>/);
  assert.match(html, /当前按 2026年8月11日周二 核算/);
  assert.match(html, /核算结果/);
  assert.match(html, /政策依据/);
  assert.match(html, /法规原文/);
  assert.match(html, /女职工生育享受98天产假/);
  assert.match(html, /查看官方原文/);
  assert.match(html, /首批 20 城/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});
