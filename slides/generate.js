// コーディングエージェント入門セミナー資料
// 今日は無料の OpenCode × OpenRouter で体験する
// 配色: GitHub Dark / モチーフ: ターミナル
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
pres.layout = "WIDE";
pres.author = "OJII3";
pres.title = "コーディングエージェント入門";

// ---- パレット (GitHub Dark) ----
const C = {
  bg: "0D1117",
  panel: "161B22",
  panel2: "1C2128",
  panel3: "21262D",
  border: "30363D",
  text: "E6EDF3",
  sub: "C9D1D9",
  muted: "8B949E",
  green: "3FB950",
  blue: "58A6FF",
  purple: "BC8CFF",
  orange: "F0883E",
  red: "FF7B72",
  yellow: "E3B341",
};
const F = { head: "Hiragino Sans", body: "Hiragino Sans", code: "Menlo" };
const W = 13.33;
const MX = 0.7;
const TOTAL = 28;

const shadow = () => ({ type: "outer", color: "000000", blur: 10, offset: 3, angle: 90, opacity: 0.35 });

// ---- ページ採番付きフッター ----
let _page = 1;
function footer(slide) {
  _page++;
  slide.addText(
    [
      { text: "コーディングエージェント入門", options: { color: C.muted } },
      { text: "  ·  OpenCode × OpenRouter", options: { color: C.border } },
    ],
    { x: MX, y: 7.02, w: 8, h: 0.3, fontSize: 9, fontFace: F.body, align: "left", valign: "middle", margin: 0 }
  );
  slide.addText(`${String(_page).padStart(2, "0")} / ${TOTAL}`, {
    x: W - MX - 2, y: 7.02, w: 2, h: 0.3, fontSize: 9, fontFace: F.code,
    color: C.muted, align: "right", valign: "middle", margin: 0,
  });
}

function bg(slide) {
  slide.background = { color: C.bg };
}

// 章ヘッダー (プロンプト記号 + タイトル + 章ラベル)
function header(slide, chapter, chColor, title) {
  slide.addText(chapter.toUpperCase(), {
    x: MX, y: 0.42, w: 6, h: 0.3, fontSize: 11, fontFace: F.code, bold: true,
    color: chColor, charSpacing: 2, align: "left", valign: "middle", margin: 0,
  });
  slide.addText(">", {
    x: MX, y: 0.78, w: 0.4, h: 0.7, fontSize: 30, fontFace: F.code, bold: true,
    color: chColor, align: "left", valign: "middle", margin: 0,
  });
  slide.addText(title, {
    x: MX + 0.42, y: 0.78, w: W - MX * 2 - 0.42, h: 0.7, fontSize: 29, fontFace: F.head,
    bold: true, color: C.text, align: "left", valign: "middle", margin: 0,
  });
}

// ターミナル信号機ドット
function termDots(slide, x, y) {
  [C.red, C.yellow, C.green].forEach((c, i) => {
    slide.addShape(pres.shapes.OVAL, {
      x: x + i * 0.22, y, w: 0.12, h: 0.12, fill: { color: c }, line: { type: "none" },
    });
  });
}

// コードブロック (ターミナルウィンドウ風)
function codeBlock(slide, x, y, w, h, lines, opts = {}) {
  const title = opts.title || "Terminal";
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: C.panel2 }, line: { color: C.border, width: 1 }, shadow: shadow(),
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x + 0.01, y: y + 0.01, w: w - 0.02, h: 0.38, fill: { color: C.panel3 }, line: { type: "none" },
  });
  termDots(slide, x + 0.18, y + 0.135);
  slide.addText(title, {
    x: x + 0.9, y: y + 0.01, w: w - 1.2, h: 0.38, fontSize: 10, fontFace: F.code,
    color: C.muted, align: "left", valign: "middle", margin: 0,
  });
  const runs = [];
  lines.forEach((ln, i) => {
    const isLast = i === lines.length - 1;
    const t = typeof ln === "string" ? ln : ln.t;
    const c = typeof ln === "string" ? C.sub : ln.c || C.sub;
    runs.push({ text: t === "" ? " " : t, options: { color: c, breakLine: !isLast } });
  });
  slide.addText(runs, {
    x: x + 0.28, y: y + 0.5, w: w - 0.5, h: h - 0.62, fontSize: opts.fontSize || 13,
    fontFace: F.code, align: "left", valign: "top", lineSpacingMultiple: 1.25, margin: 0,
  });
}

function card(slide, x, y, w, h, fill) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: fill || C.panel }, line: { color: C.border, width: 1 }, shadow: shadow(),
  });
}

function badge(slide, x, y, d, num, color) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { type: "none" } });
  slide.addText(String(num), {
    x, y, w: d, h: d, fontSize: d * 22, fontFace: F.head, bold: true,
    color: C.bg, align: "center", valign: "middle", margin: 0,
  });
}

function check(slide, x, y, d) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: C.green }, line: { type: "none" } });
  slide.addText("✓", {
    x, y, w: d, h: d, fontSize: d * 26, fontFace: F.head, bold: true,
    color: C.bg, align: "center", valign: "middle", margin: 0,
  });
}

// ============================================================
// 1. タイトル
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  s.addText("$ _", {
    x: 9.5, y: 0.3, w: 3.5, h: 1, fontSize: 40, fontFace: F.code, color: C.panel3,
    align: "right", valign: "top", margin: 0,
  });
  s.addText("HANDS-ON SEMINAR", {
    x: MX, y: 1.5, w: 8, h: 0.4, fontSize: 13, fontFace: F.code, bold: true,
    color: C.green, charSpacing: 3, align: "left", valign: "middle", margin: 0,
  });
  s.addText("コーディングエージェント\n入門", {
    x: MX, y: 2.0, w: 11.5, h: 2.0, fontSize: 52, fontFace: F.head, bold: true,
    color: C.text, align: "left", valign: "top", lineSpacingMultiple: 1.0, margin: 0,
  });
  s.addText(
    [
      { text: "“あなたのPCで動くAI” を、", options: { color: C.sub } },
      { text: "無料", options: { color: C.green, bold: true } },
      { text: "で体験する", options: { color: C.sub } },
    ],
    { x: MX, y: 4.15, w: 11.5, h: 0.6, fontSize: 22, fontFace: F.head, align: "left", valign: "middle", margin: 0 }
  );
  codeBlock(s, MX, 5.2, 6.4, 1.5, [
    { t: "$ opencode", c: C.green },
    { t: "> ToDoアプリを作って", c: C.blue },
    { t: "  作成中: index.html …", c: C.muted },
  ], { title: "今日やること", fontSize: 12.5 });
  s.addText("情報学科 研究室向け / 所要 約1時間 / お金はかかりません", {
    x: 7.6, y: 6.25, w: 5.0, h: 0.4, fontSize: 12, fontFace: F.body, color: C.muted,
    align: "right", valign: "middle", margin: 0,
  });
}

// ============================================================
// 2. 今日のゴール
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "今日のゴール");
  const items = [
    { n: 1, t: "“何か”が分かる", d: "コーディングエージェントとは何か、普段のAIチャットと何が違うのかを理解する。", c: C.blue },
    { n: 2, t: "自分のPCで動かす", d: "エージェントを実際にインストールし、AIモデルにつないで起動するところまでやる。", c: C.purple },
    { n: 3, t: "アプリを作らせる", d: "チャットにとどまらず、エージェントに ToDo アプリを作らせてブラウザで動かす。", c: C.orange },
  ];
  const cw = 3.7, gap = 0.42, y = 2.1, ch = 4.3;
  items.forEach((it, i) => {
    const x = MX + i * (cw + gap);
    card(s, x, y, cw, ch);
    badge(s, x + 0.4, y + 0.45, 0.75, it.n, it.c);
    s.addText(it.t, { x: x + 0.4, y: y + 1.45, w: cw - 0.8, h: 0.6, fontSize: 19, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
    s.addText(it.d, { x: x + 0.4, y: y + 2.1, w: cw - 0.8, h: 1.9, fontSize: 14, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.3, margin: 0 });
  });
  footer(s);
}

// ============================================================
// 3. 今日の流れ
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "今日の流れ");
  const steps = [
    { t: "知る：エージェントって何？", d: "座学でイメージをつかむ", time: "〜15分", c: C.blue },
    { t: "準備：エージェントを入れる", d: "OpenCode をインストール", time: "〜15分", c: C.purple },
    { t: "つなぐ：AIモデルに接続", d: "APIキーを作って /connect", time: "〜10分", c: C.green },
    { t: "作る：ToDoアプリを生成", d: "複数ファイルに分けて作らせる", time: "〜20分", c: C.orange },
  ];
  const y0 = 2.05, rh = 1.08, gap = 0.13;
  steps.forEach((st, i) => {
    const y = y0 + i * (rh + gap);
    card(s, MX, y, W - MX * 2, rh);
    badge(s, MX + 0.35, y + (rh - 0.62) / 2, 0.62, i + 1, st.c);
    s.addText(st.t, { x: MX + 1.3, y: y + 0.14, w: 7.5, h: 0.45, fontSize: 18, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
    s.addText(st.d, { x: MX + 1.3, y: y + 0.58, w: 7.5, h: 0.38, fontSize: 13, fontFace: F.body, color: C.muted, align: "left", valign: "middle", margin: 0 });
    s.addText(st.time, { x: W - MX - 1.7, y, w: 1.4, h: rh, fontSize: 14, fontFace: F.code, bold: true, color: st.c, align: "right", valign: "middle", margin: 0 });
  });
  footer(s);
}

// ============================================================
// 4. 導入の問い
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "AIチャット、使ってますか？");
  s.addText(
    [
      { text: "ChatGPT や Claude に質問 → 返ってきた答えを", options: { color: C.sub } },
      { text: "自分でコピペ", options: { color: C.blue, bold: true } },
      { text: "。", options: { color: C.sub } },
    ],
    { x: MX, y: 2.1, w: W - MX * 2, h: 0.5, fontSize: 20, fontFace: F.head, align: "left", valign: "middle", margin: 0 }
  );
  card(s, MX, 2.95, 5.75, 3.4);
  s.addText("ふつうの AI チャット", { x: MX + 0.4, y: 3.2, w: 5, h: 0.5, fontSize: 17, fontFace: F.head, bold: true, color: C.blue, align: "left", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "質問すると文章を返してくれる", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "コードも“テキストとして”もらえる", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "でも…ファイルに保存するのは自分", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "実行・テスト・修正も全部自分", options: { bullet: { indent: 18 } } },
    ],
    { x: MX + 0.4, y: 3.8, w: 5.0, h: 2.3, fontSize: 15, fontFace: F.body, color: C.sub, align: "left", valign: "top", paraSpaceAfter: 10, margin: 0 }
  );
  s.addText("→", { x: 6.55, y: 2.95, w: 0.9, h: 3.4, fontSize: 40, fontFace: F.head, bold: true, color: C.muted, align: "center", valign: "middle", margin: 0 });
  card(s, 7.45, 2.95, 5.15, 3.4, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: 7.45, y: 2.95, w: 0.09, h: 3.4, fill: { color: C.green }, line: { type: "none" } });
  s.addText("コーディングエージェント", { x: 7.85, y: 3.2, w: 4.5, h: 0.5, fontSize: 17, fontFace: F.head, bold: true, color: C.green, align: "left", valign: "middle", margin: 0 });
  s.addText("コピペの“その先”を、AIが\nあなたのPCの上で自分でやる。", { x: 7.85, y: 3.9, w: 4.4, h: 1.6, fontSize: 18, fontFace: F.head, color: C.text, align: "left", valign: "top", lineSpacingMultiple: 1.35, margin: 0 });
  footer(s);
}

// ============================================================
// 5. エージェントとは
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "コーディングエージェントとは？");
  s.addText("ひとことで言うと —— あなたのPCを操作できるAI。", { x: MX, y: 1.95, w: W - MX * 2, h: 0.5, fontSize: 19, fontFace: F.head, color: C.sub, align: "left", valign: "middle", margin: 0 });
  const caps = [
    { t: "ファイルを読む", d: "プロジェクト全体を把握" },
    { t: "ファイルを書く・直す", d: "コードを実際に保存" },
    { t: "コマンドを実行", d: "ビルド・テスト・起動" },
    { t: "エラーを読んで直す", d: "結果を見て自分で修正" },
  ];
  const cw = 2.85, gap = 0.31, y = 2.75, ch = 2.15;
  caps.forEach((c, i) => {
    const x = MX + i * (cw + gap);
    card(s, x, y, cw, ch);
    s.addShape(pres.shapes.OVAL, { x: x + 0.32, y: y + 0.32, w: 0.5, h: 0.5, fill: { color: C.green }, line: { type: "none" } });
    s.addText(String(i + 1), { x: x + 0.32, y: y + 0.32, w: 0.5, h: 0.5, fontSize: 16, fontFace: F.head, bold: true, color: C.bg, align: "center", valign: "middle", margin: 0 });
    s.addText(c.t, { x: x + 0.32, y: y + 1.0, w: cw - 0.6, h: 0.5, fontSize: 15, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
    s.addText(c.d, { x: x + 0.32, y: y + 1.45, w: cw - 0.6, h: 0.55, fontSize: 12, fontFace: F.body, color: C.muted, align: "left", valign: "top", lineSpacingMultiple: 1.2, margin: 0 });
  });
  s.addText(
    [
      { text: "つまり ", options: { color: C.muted } },
      { text: "「指示すると、自分で手を動かして仕事を進めてくれる」", options: { color: C.text, bold: true } },
      { text: " のがエージェント。", options: { color: C.muted } },
    ],
    { x: MX, y: 5.35, w: W - MX * 2, h: 0.6, fontSize: 16, fontFace: F.body, align: "left", valign: "middle", margin: 0 }
  );
  footer(s);
}

// ============================================================
// 6. 代表的なエージェント
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "代表的なエージェント");
  const tools = [
    { t: "Claude Code", v: "Anthropic", d: "高性能で人気。CLIから本格的な開発。基本は有料。", c: C.orange, star: false },
    { t: "Codex CLI", v: "OpenAI", d: "OpenAI のCLIエージェント。ChatGPTの延長で使える。", c: C.blue, star: false },
    { t: "OpenCode", v: "オープンソース", d: "好きなモデルに接続できる。無料モデルでも動く。", c: C.green, star: true },
  ];
  const cw = 3.7, gap = 0.42, y = 2.0, ch = 3.05;
  tools.forEach((it, i) => {
    const x = MX + i * (cw + gap);
    card(s, x, y, cw, ch, it.star ? C.panel2 : C.panel);
    if (it.star) s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: 0.09, fill: { color: C.green }, line: { type: "none" } });
    s.addText(it.t, { x: x + 0.4, y: y + 0.4, w: cw - 0.8, h: 0.55, fontSize: 21, fontFace: F.head, bold: true, color: it.c, align: "left", valign: "middle", margin: 0 });
    s.addText(it.v, { x: x + 0.4, y: y + 1.0, w: cw - 0.8, h: 0.35, fontSize: 12, fontFace: F.code, color: C.muted, align: "left", valign: "middle", margin: 0 });
    s.addText(it.d, { x: x + 0.4, y: y + 1.5, w: cw - 0.8, h: 1.5, fontSize: 14, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.3, margin: 0 });
  });
  card(s, MX, 5.3, W - MX * 2, 1.05, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 5.3, w: 0.09, h: 1.05, fill: { color: C.green }, line: { type: "none" } });
  s.addText(
    [
      { text: "どれも“ターミナルで動くエージェント”で、使う感覚はほぼ同じ。", options: { color: C.text, bold: true } },
      { text: "  今日は誰でも無料で試せる OpenCode を使います。", options: { color: C.sub } },
    ],
    { x: MX + 0.4, y: 5.3, w: W - MX * 2 - 0.7, h: 1.05, fontSize: 15, fontFace: F.body, align: "left", valign: "middle", margin: 0 }
  );
  footer(s);
}

// ============================================================
// 7. なぜターミナル
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "なぜ “ターミナル” で動くの？");
  card(s, MX, 2.1, 6.0, 4.0);
  s.addText("ターミナル = PCに文字で命令する場所", { x: MX + 0.45, y: 2.45, w: 5.2, h: 0.6, fontSize: 17, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "ファイル操作もコマンド実行も、ここから全部できる", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "エージェントの“手”として一番都合がいい", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "ボタンを探すより速く・自動で動かせる", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "黒い画面が苦手でも大丈夫 — 今日はコピペ中心", options: { bullet: { indent: 18 } } },
    ],
    { x: MX + 0.45, y: 3.2, w: 5.2, h: 2.6, fontSize: 14.5, fontFace: F.body, color: C.sub, align: "left", valign: "top", paraSpaceAfter: 12, margin: 0 }
  );
  codeBlock(s, 7.1, 2.1, 5.5, 4.0, [
    { t: "$ ls", c: C.green },
    { t: "index.html  README.md", c: C.sub },
    { t: "", c: C.sub },
    { t: "$ python3 -m http.server", c: C.green },
    { t: "# → localhost:8000 で確認", c: C.muted },
    { t: "", c: C.sub },
    { t: "$ opencode", c: C.green },
    { t: "> ToDoアプリを分割して作って", c: C.blue },
    { t: "  作成中: src/app.js …", c: C.muted },
  ], { title: "こんな世界です", fontSize: 13 });
  footer(s);
}

// ============================================================
// 8. OpenCode とは
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "今日のツール：OpenCode");
  const items = [
    { t: "オープンソース", d: "無料で使える。ターミナルで動くエージェント。", c: C.green },
    { t: "モデルが自由", d: "OpenAI / Anthropic / OpenRouter など好きなモデルに接続。", c: C.blue },
    { t: "なぜ今日これ？", d: "誰でも無料で動かせるから。操作の感覚は他ツールと同じ。", c: C.purple },
  ];
  const y = 2.15, rh = 1.25, gap = 0.18;
  items.forEach((it, i) => {
    const yy = y + i * (rh + gap);
    card(s, MX, yy, 6.7, rh);
    s.addShape(pres.shapes.RECTANGLE, { x: MX, y: yy, w: 0.09, h: rh, fill: { color: it.c }, line: { type: "none" } });
    s.addText(it.t, { x: MX + 0.4, y: yy + 0.16, w: 6, h: 0.5, fontSize: 18, fontFace: F.head, bold: true, color: it.c, align: "left", valign: "middle", margin: 0 });
    s.addText(it.d, { x: MX + 0.4, y: yy + 0.62, w: 6.1, h: 0.5, fontSize: 13.5, fontFace: F.body, color: C.sub, align: "left", valign: "middle", margin: 0 });
  });
  codeBlock(s, 7.8, 2.15, 4.8, 4.27, [
    { t: "$ opencode", c: C.green },
    { t: "", c: C.sub },
    { t: "  OpenCode を起動しました", c: C.muted },
    { t: "  ───────────────────", c: C.muted },
    { t: "", c: C.sub },
    { t: "  > _", c: C.green },
    { t: "", c: C.sub },
    { t: "  ここに指示を書く", c: C.sub },
    { t: "  ───────────────────", c: C.muted },
    { t: "  /connect でモデルに接続", c: C.blue },
  ], { title: "TUI イメージ", fontSize: 12.5 });
  footer(s);
}

// ============================================================
// 9. なぜ OpenRouter
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "なぜ OpenRouter？");
  const items = [
    { t: "1つのキーで多数のモデル", d: "OpenRouter のAPIキー1本で、いろんなモデルを切り替えて使える。" },
    { t: "無料モデルがある", d: "今日はここを使う。料金は input / output ともに $0。" },
    { t: "普段のquotaを使わない", d: "ChatGPT等の課金枠を消費しないので、気兼ねなく試せる。" },
    { t: "Free Models Router", d: "空いている無料モデルへ自動でつないでくれる。" },
  ];
  const cw = 5.8, gap = 0.33, ch = 1.7, y0 = 2.1, gy = 0.25;
  items.forEach((it, i) => {
    const x = MX + (i % 2) * (cw + gap);
    const y = y0 + Math.floor(i / 2) * (ch + gy);
    card(s, x, y, cw, ch);
    s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: y + 0.32, w: 0.45, h: 0.45, fill: { color: C.green }, line: { type: "none" } });
    s.addText(String(i + 1), { x: x + 0.35, y: y + 0.32, w: 0.45, h: 0.45, fontSize: 15, fontFace: F.head, bold: true, color: C.bg, align: "center", valign: "middle", margin: 0 });
    s.addText(it.t, { x: x + 1.0, y: y + 0.28, w: cw - 1.3, h: 0.5, fontSize: 16.5, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
    s.addText(it.d, { x: x + 1.0, y: y + 0.78, w: cw - 1.3, h: 0.8, fontSize: 13, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.25, margin: 0 });
  });
  footer(s);
}

// ============================================================
// 10. 全体図
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "今日やること（全体図）");
  const flow = [
    { n: "1", t: "入れる", d: "OpenCode を\nインストール", c: C.purple },
    { n: "2", t: "つなぐ", d: "AIモデルに\n/connect", c: C.green },
    { n: "3", t: "作る", d: "ToDoアプリを\n複数ファイルで生成", c: C.orange },
  ];
  const cw = 3.4, y = 2.5, ch = 2.8;
  const totalW = cw * 3 + 0.9 * 2;
  const startX = (W - totalW) / 2;
  flow.forEach((f, i) => {
    const x = startX + i * (cw + 0.9);
    card(s, x, y, cw, ch, C.panel2);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: 0.1, fill: { color: f.c }, line: { type: "none" } });
    badge(s, x + (cw - 0.85) / 2, y + 0.5, 0.85, f.n, f.c);
    s.addText(f.t, { x, y: y + 1.5, w: cw, h: 0.5, fontSize: 22, fontFace: F.head, bold: true, color: C.text, align: "center", valign: "middle", margin: 0 });
    s.addText(f.d, { x, y: y + 2.05, w: cw, h: 0.7, fontSize: 14, fontFace: F.body, color: C.sub, align: "center", valign: "top", lineSpacingMultiple: 1.2, margin: 0 });
    if (i < 2) s.addText("→", { x: x + cw + 0.02, y, w: 0.86, h: ch, fontSize: 34, fontFace: F.head, bold: true, color: C.muted, align: "center", valign: "middle", margin: 0 });
  });
  s.addText("この3ステップを、これから順番にやっていきます。", { x: MX, y: 5.8, w: W - MX * 2, h: 0.5, fontSize: 15, fontFace: F.body, color: C.muted, align: "center", valign: "middle", margin: 0 });
  footer(s);
}

// ============================================================
// 11. STEP0 ターミナル
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Setup", C.purple, "STEP 0 ── ターミナルを開く");
  card(s, MX, 2.1, 5.8, 2.0);
  s.addText("macOS", { x: MX + 0.4, y: 2.35, w: 5, h: 0.5, fontSize: 18, fontFace: F.head, bold: true, color: C.purple, align: "left", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "「ターミナル.app」を開く", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "Spotlight で “ターミナル” 検索でもOK", options: { bullet: { indent: 18 } } },
    ],
    { x: MX + 0.4, y: 2.9, w: 5.0, h: 1.0, fontSize: 14.5, fontFace: F.body, color: C.sub, align: "left", valign: "top", paraSpaceAfter: 8, margin: 0 }
  );
  card(s, 6.8, 2.1, 5.8, 2.0);
  s.addText("Windows", { x: 7.2, y: 2.35, w: 5, h: 0.5, fontSize: 18, fontFace: F.head, bold: true, color: C.blue, align: "left", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "WSL の Ubuntu ターミナルを開く", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "PowerShell ではない点に注意", options: { bullet: { indent: 18 }, color: C.orange } },
    ],
    { x: 7.2, y: 2.9, w: 5.0, h: 1.0, fontSize: 14.5, fontFace: F.body, color: C.sub, align: "left", valign: "top", paraSpaceAfter: 8, margin: 0 }
  );
  card(s, MX, 4.35, W - MX * 2, 0.95, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 4.35, w: 0.09, h: 0.95, fill: { color: C.orange }, line: { type: "none" } });
  s.addText(
    [
      { text: "⚠ Windows の人へ：", options: { color: C.orange, bold: true } },
      { text: " この先のコマンドはすべて Ubuntu のターミナル内で実行します。", options: { color: C.sub } },
    ],
    { x: MX + 0.4, y: 4.35, w: W - MX * 2 - 0.7, h: 0.95, fontSize: 15, fontFace: F.body, align: "left", valign: "middle", margin: 0 }
  );
  codeBlock(s, MX, 5.55, 5.5, 0.95, [{ t: "$ pwd   # 今どこにいるか確認", c: C.green }], { title: "動作確認", fontSize: 13 });
  footer(s);
}

// ============================================================
// 12. STEP1 インストール (git 不要)
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Setup", C.purple, "STEP 1 ── OpenCode を入れる");
  codeBlock(s, MX, 2.1, 5.8, 3.6, [
    { t: "# Homebrew を更新", c: C.muted },
    { t: "$ brew update", c: C.green },
    { t: "", c: C.sub },
    { t: "# OpenCode を入れる", c: C.muted },
    { t: "$ brew install \\", c: C.green },
    { t: "    anomalyco/tap/opencode", c: C.green },
    { t: "", c: C.sub },
    { t: "$ opencode --version", c: C.green },
  ], { title: "macOS + Homebrew" });
  codeBlock(s, 6.8, 2.1, 5.8, 3.6, [
    { t: "# 必要なツール", c: C.muted },
    { t: "$ sudo apt update", c: C.green },
    { t: "$ sudo apt install -y \\", c: C.green },
    { t: "    curl ca-certificates", c: C.green },
    { t: "", c: C.sub },
    { t: "# OpenCode を入れる", c: C.muted },
    { t: "$ curl -fsSL \\", c: C.green },
    { t: "    https://opencode.ai/install | bash", c: C.green },
  ], { title: "Windows (WSL Ubuntu)" });
  s.addText("インストール手順だけはOSで違いますが、この先は Mac も WSL も共通です。", { x: MX, y: 5.95, w: W - MX * 2, h: 0.4, fontSize: 13.5, fontFace: F.body, color: C.muted, align: "left", valign: "middle", margin: 0 });
  footer(s);
}

// ============================================================
// 13. STEP2 APIキー
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Connect", C.green, "STEP 2 ── OpenRouter API キーを作る");
  const steps = [
    { t: "サイトを開く", d: "openrouter.ai/keys にアクセス" },
    { t: "サインイン", d: "OpenRouter アカウントでログイン（無料）" },
    { t: "キーを作成", d: "「Create Key」を押す" },
    { t: "控える", d: "sk-or-… で始まるキーをコピーしておく" },
  ];
  const y0 = 2.15, rh = 0.92, gap = 0.12;
  steps.forEach((st, i) => {
    const y = y0 + i * (rh + gap);
    card(s, MX, y, 7.0, rh);
    badge(s, MX + 0.3, y + (rh - 0.56) / 2, 0.56, i + 1, C.green);
    s.addText(st.t, { x: MX + 1.15, y: y + 0.1, w: 5.6, h: 0.4, fontSize: 16, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
    s.addText(st.d, { x: MX + 1.15, y: y + 0.48, w: 5.7, h: 0.36, fontSize: 12.5, fontFace: F.body, color: C.muted, align: "left", valign: "middle", margin: 0 });
  });
  card(s, 8.05, 2.15, 4.55, 4.18, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: 8.05, y: 2.15, w: 0.09, h: 4.18, fill: { color: C.red }, line: { type: "none" } });
  s.addText("⚠ キーの取り扱い", { x: 8.45, y: 2.45, w: 3.9, h: 0.5, fontSize: 17, fontFace: F.head, bold: true, color: C.red, align: "left", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "パスワードと同じ秘密情報", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "ファイルやチャットに貼らない", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "人に見せない", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "OpenCode が安全に保存する", options: { bullet: { indent: 18 } } },
    ],
    { x: 8.45, y: 3.1, w: 3.9, h: 3.0, fontSize: 14, fontFace: F.body, color: C.sub, align: "left", valign: "top", paraSpaceAfter: 12, margin: 0 }
  );
  footer(s);
}

// ============================================================
// 14. STEP3 フォルダを作って起動 (git/clone 廃止)
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Connect", C.green, "STEP 3 ── フォルダを作って起動する");
  s.addText("作業用のフォルダを1つ作り、その中で OpenCode を起動します。", { x: MX, y: 1.95, w: W - MX * 2, h: 0.5, fontSize: 16, fontFace: F.body, color: C.sub, align: "left", valign: "middle", margin: 0 });
  codeBlock(s, MX, 2.65, 6.0, 2.55, [
    { t: "# 作業フォルダを作って入る", c: C.muted },
    { t: "$ mkdir todo-app", c: C.green },
    { t: "$ cd todo-app", c: C.green },
    { t: "", c: C.sub },
    { t: "# OpenCode を起動", c: C.muted },
    { t: "$ opencode", c: C.green },
  ], { title: "フォルダ作成 → 起動", fontSize: 13.5 });
  card(s, 6.9, 2.65, 5.7, 2.55, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: 6.9, y: 2.65, w: 0.09, h: 2.55, fill: { color: C.green }, line: { type: "none" } });
  s.addText("git は使いません", { x: 7.3, y: 2.95, w: 5, h: 0.5, fontSize: 16, fontFace: F.head, bold: true, color: C.green, align: "left", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "フォルダを1つ作るだけ", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "好きな名前でOK（例: todo-app）", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "作ったファイルはこの中にできる", options: { bullet: { indent: 18 } } },
    ],
    { x: 7.3, y: 3.5, w: 5.0, h: 1.6, fontSize: 14, fontFace: F.body, color: C.sub, align: "left", valign: "top", paraSpaceAfter: 10, margin: 0 }
  );
  card(s, MX, 5.45, W - MX * 2, 1.0, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 5.45, w: 0.09, h: 1.0, fill: { color: C.orange }, line: { type: "none" } });
  s.addText(
    [
      { text: "command not found の時：", options: { color: C.orange, bold: true } },
      { text: " ターミナルを一度閉じて、開き直してからもう一度 opencode を実行。", options: { color: C.sub } },
    ],
    { x: MX + 0.4, y: 5.45, w: W - MX * 2 - 0.7, h: 1.0, fontSize: 14.5, fontFace: F.body, align: "left", valign: "middle", margin: 0 }
  );
  footer(s);
}

// ============================================================
// 15. STEP4 /connect
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Connect", C.green, "STEP 4 ── /connect で接続する");
  const steps = [
    { t: "/connect と入力", d: "TUIの入力欄に打って Enter" },
    { t: "OpenRouter を選ぶ", d: "provider 一覧から選択" },
    { t: "API キーを貼る", d: "STEP 2 で控えたキーを貼り付け" },
  ];
  const y0 = 2.15, rh = 1.15, gap = 0.15;
  steps.forEach((st, i) => {
    const y = y0 + i * (rh + gap);
    card(s, MX, y, 6.6, rh);
    badge(s, MX + 0.32, y + (rh - 0.6) / 2, 0.6, i + 1, C.green);
    s.addText(st.t, { x: MX + 1.2, y: y + 0.18, w: 5.2, h: 0.45, fontSize: 17, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
    s.addText(st.d, { x: MX + 1.2, y: y + 0.62, w: 5.2, h: 0.4, fontSize: 13, fontFace: F.body, color: C.muted, align: "left", valign: "middle", margin: 0 });
  });
  codeBlock(s, 7.7, 2.15, 4.9, 2.0, [
    { t: "> /connect", c: C.green },
    { t: "  ? Provider", c: C.muted },
    { t: "  > OpenRouter", c: C.blue },
    { t: "  ? API Key", c: C.muted },
    { t: "  > sk-or-••••••••", c: C.sub },
  ], { title: "入力イメージ", fontSize: 12.5 });
  card(s, 7.7, 4.4, 4.9, 1.9, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: 7.7, y: 4.4, w: 0.09, h: 1.9, fill: { color: C.green }, line: { type: "none" } });
  s.addText("キーは OpenCode 側に保存される", { x: 8.1, y: 4.65, w: 4.3, h: 0.5, fontSize: 14.5, fontFace: F.head, bold: true, color: C.green, align: "left", valign: "middle", margin: 0 });
  s.addText("環境変数を自分で設定する必要はありません。一度つなげば次回からは不要です。", { x: 8.1, y: 5.15, w: 4.3, h: 1.0, fontSize: 13, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.3, margin: 0 });
  footer(s);
}

// ============================================================
// 16. STEP5 Free Models Router
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Connect", C.green, "STEP 5 ── Free Models Router を選ぶ");
  s.addText(
    [
      { text: "モデル選択画面で ", options: { color: C.sub } },
      { text: "Free Models Router", options: { color: C.green, bold: true } },
      { text: "（= openrouter/free）を選びます。", options: { color: C.sub } },
    ],
    { x: MX, y: 1.95, w: W - MX * 2, h: 0.5, fontSize: 16.5, fontFace: F.body, align: "left", valign: "middle", margin: 0 }
  );
  codeBlock(s, MX, 2.65, 6.0, 2.0, [
    { t: "# 見つからなければ検索欄に：", c: C.muted },
    { t: "Free Models Router", c: C.green },
    { t: "# または", c: C.muted },
    { t: "openrouter/free", c: C.green },
  ], { title: "モデルを探す", fontSize: 13 });
  card(s, 6.9, 2.65, 5.7, 2.0, C.panel2);
  s.addText("なぜ Router？", { x: 7.3, y: 2.9, w: 5, h: 0.4, fontSize: 15, fontFace: F.head, bold: true, color: C.green, align: "left", valign: "middle", margin: 0 });
  s.addText("特定の無料モデルは混雑で使えないことがある。Router は空いている無料モデルへ自動でつなぎます。", { x: 7.3, y: 3.35, w: 4.9, h: 1.2, fontSize: 13.5, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.3, margin: 0 });
  card(s, MX, 4.95, W - MX * 2, 1.45, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 4.95, w: 0.09, h: 1.45, fill: { color: C.green }, line: { type: "none" } });
  s.addText("動作確認", { x: MX + 0.4, y: 5.15, w: 2.2, h: 0.5, fontSize: 16, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "Reply with OK only.", options: { color: C.green, fontFace: F.code, bold: true } },
      { text: "  と送って ", options: { color: C.sub } },
      { text: "OK", options: { color: C.green, bold: true, fontFace: F.code } },
      { text: " が返れば、接続成功です 🎉", options: { color: C.sub } },
    ],
    { x: MX + 0.4, y: 5.65, w: W - MX * 2 - 0.7, h: 0.6, fontSize: 15, fontFace: F.body, align: "left", valign: "middle", margin: 0 }
  );
  footer(s);
}

// ============================================================
// 17. 使い方の基本
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Build", C.orange, "つかいかた（基本）");
  const items = [
    { t: "指示を書いて Enter", d: "やってほしいことを日本語で書いて送るだけ。" },
    { t: "様子が表示される", d: "ファイルを作る・編集する過程がそのまま見える。" },
    { t: "確認しながら進む", d: "変更内容を見て、続けて指示を重ねていける。" },
  ];
  const y = 2.15, rh = 1.25, gap = 0.18;
  items.forEach((it, i) => {
    const yy = y + i * (rh + gap);
    card(s, MX, yy, 6.5, rh);
    s.addShape(pres.shapes.RECTANGLE, { x: MX, y: yy, w: 0.09, h: rh, fill: { color: C.orange }, line: { type: "none" } });
    s.addText(it.t, { x: MX + 0.4, y: yy + 0.16, w: 5.9, h: 0.5, fontSize: 17, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
    s.addText(it.d, { x: MX + 0.4, y: yy + 0.64, w: 5.9, h: 0.5, fontSize: 13.5, fontFace: F.body, color: C.sub, align: "left", valign: "middle", margin: 0 });
  });
  codeBlock(s, 7.6, 2.15, 5.0, 4.27, [
    { t: "> ToDoアプリを分割して作って", c: C.blue },
    { t: "", c: C.sub },
    { t: "  ● 作成中", c: C.green },
    { t: "  + index.html", c: C.green },
    { t: "  + styles.css", c: C.green },
    { t: "  + src/storage.js", c: C.green },
    { t: "  + src/todo.js", c: C.green },
    { t: "  + src/app.js", c: C.green },
    { t: "", c: C.sub },
    { t: "  ✓ 5ファイル作成", c: C.green },
  ], { title: "やりとりの例", fontSize: 12.5 });
  footer(s);
}

// ============================================================
// 18. 1ファイルでは出ない本領
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Build", C.orange, "1ファイルでは出ない “本領”");
  s.addText("ここからが、チャットにコピペするのと分かれる道です。", { x: MX, y: 1.95, w: W - MX * 2, h: 0.5, fontSize: 16, fontFace: F.body, color: C.sub, align: "left", valign: "middle", margin: 0 });
  card(s, MX, 2.7, 5.75, 3.5);
  s.addText("チャット + コピペ", { x: MX + 0.4, y: 2.95, w: 5, h: 0.5, fontSize: 17, fontFace: F.head, bold: true, color: C.blue, align: "left", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "コードを1つもらってコピペ", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "ファイルが増えると破綻しがち", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "全体の整合は自分でとる", options: { bullet: { indent: 18 } } },
    ],
    { x: MX + 0.4, y: 3.55, w: 5.0, h: 2.4, fontSize: 15, fontFace: F.body, color: C.sub, align: "left", valign: "top", paraSpaceAfter: 12, margin: 0 }
  );
  s.addText("→", { x: 6.55, y: 2.7, w: 0.9, h: 3.5, fontSize: 40, fontFace: F.head, bold: true, color: C.muted, align: "center", valign: "middle", margin: 0 });
  card(s, 7.45, 2.7, 5.15, 3.5, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: 7.45, y: 2.7, w: 0.09, h: 3.5, fill: { color: C.green }, line: { type: "none" } });
  s.addText("コーディングエージェント", { x: 7.85, y: 2.95, w: 4.5, h: 0.5, fontSize: 17, fontFace: F.head, bold: true, color: C.green, align: "left", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "複数ファイルを“まとめて”作る", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "ファイルをまたいで直す・整理する", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "規模が大きいほど差が出る", options: { bullet: { indent: 18 } } },
    ],
    { x: 7.85, y: 3.55, w: 4.4, h: 2.4, fontSize: 15, fontFace: F.body, color: C.text, align: "left", valign: "top", paraSpaceAfter: 12, margin: 0 }
  );
  footer(s);
}

// ============================================================
// 19. STEP6 作るもの: ToDo を分割して作る
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Build", C.orange, "STEP 6 ── ToDoアプリを “分割して” 作る");
  codeBlock(s, MX, 2.1, 6.2, 4.25, [
    { t: "todo-app/", c: C.muted },
    { t: "  index.html     画面", c: C.sub },
    { t: "  styles.css     見た目", c: C.sub },
    { t: "  src/", c: C.muted },
    { t: "    storage.js   保存（localStorage）", c: C.sub },
    { t: "    todo.js      追加・完了・削除", c: C.sub },
    { t: "    app.js       画面とロジックの入口", c: C.sub },
  ], { title: "ファイル構成（ES Modules）", fontSize: 14 });
  const feats = [
    { t: "タスクを追加", d: "入力して「追加」で登録", c: C.green },
    { t: "完了でチェック", d: "押すと打ち消し線が付く", c: C.blue },
    { t: "いらないものは削除", d: "× ボタンで消える", c: C.purple },
    { t: "閉じても残る", d: "localStorage に保存", c: C.orange },
  ];
  const fx = 7.3, fw = 5.3, fy0 = 2.1, fh = 0.82, fgap = 0.14;
  feats.forEach((f, i) => {
    const fy = fy0 + i * (fh + fgap);
    card(s, fx, fy, fw, fh);
    s.addShape(pres.shapes.RECTANGLE, { x: fx, y: fy, w: 0.09, h: fh, fill: { color: f.c }, line: { type: "none" } });
    s.addText(f.t, { x: fx + 0.4, y: fy + 0.1, w: fw - 0.7, h: 0.4, fontSize: 16, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
    s.addText(f.d, { x: fx + 0.4, y: fy + 0.48, w: fw - 0.7, h: 0.32, fontSize: 12.5, fontFace: F.body, color: C.muted, align: "left", valign: "middle", margin: 0 });
  });
  s.addText("分け方も“どう動くか”も、まとめてエージェントにお任せできます。", { x: fx, y: 6.05, w: fw, h: 0.3, fontSize: 12.5, fontFace: F.body, color: C.green, align: "left", valign: "middle", margin: 0 });
  footer(s);
}

// ============================================================
// 20. 分割して、と頼む (プロンプト)
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Build", C.orange, "“分割して” と頼む");
  s.addText("ファイル構成と役割を伝えるのがコツ。あとはエージェントが一気に作ります。", { x: MX, y: 1.95, w: W - MX * 2, h: 0.5, fontSize: 16, fontFace: F.body, color: C.sub, align: "left", valign: "middle", margin: 0 });
  codeBlock(s, MX, 2.65, W - MX * 2, 2.95, [
    { t: "ToDoアプリを作って。ES Modules で次のように分割して：", c: C.text },
    { t: "  index.html      … 画面", c: C.sub },
    { t: "  styles.css      … 見た目", c: C.sub },
    { t: "  src/storage.js  … localStorage への保存", c: C.sub },
    { t: "  src/todo.js     … 追加・完了・削除のロジック", c: C.sub },
    { t: "  src/app.js      … 画面とロジックをつなぐ入口", c: C.sub },
    { t: "タスクの追加・完了チェック・削除ができて、", c: C.text },
    { t: "リロードしても残るようにして。", c: C.text },
  ], { title: "OpenCode に貼り付ける指示", fontSize: 14 });
  const tips = [
    { t: "ファイル構成を書く", d: "どんなファイルに分けるか" },
    { t: "役割を一言ずつ", d: "各ファイルが何を担当するか" },
    { t: "「ES Modules で」", d: "import / export で分割と伝える" },
  ];
  const cw = 3.7, gap = 0.42, y = 5.85, ch = 0.95;
  tips.forEach((it, i) => {
    const x = MX + i * (cw + gap);
    card(s, x, y, cw, ch);
    s.addText(it.t, { x: x + 0.35, y: y + 0.12, w: cw - 0.7, h: 0.42, fontSize: 15, fontFace: F.head, bold: true, color: C.orange, align: "left", valign: "middle", margin: 0 });
    s.addText(it.d, { x: x + 0.35, y: y + 0.5, w: cw - 0.7, h: 0.35, fontSize: 12, fontFace: F.body, color: C.muted, align: "left", valign: "middle", margin: 0 });
  });
  footer(s);
}

// ============================================================
// 21. ブラウザで確認 (ローカルサーバー)
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Build", C.orange, "ブラウザで動かしてみる");
  s.addText("分割したコードは “ローカルサーバー” で開きます。\n（ダブルクリックでは動きません）", { x: MX, y: 1.8, w: 6.0, h: 0.9, fontSize: 15, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.3, margin: 0 });
  codeBlock(s, MX, 2.85, 5.7, 1.95, [
    { t: "# プロジェクトのフォルダで", c: C.muted },
    { t: "$ python3 -m http.server", c: C.green },
    { t: "", c: C.sub },
    { t: "# ブラウザで開く", c: C.muted },
    { t: "→ http://localhost:8000", c: C.blue },
  ], { title: "ローカルサーバーを起動", fontSize: 13.5 });
  card(s, MX, 4.95, 5.7, 1.45, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 4.95, w: 0.09, h: 1.45, fill: { color: C.green }, line: { type: "none" } });
  s.addText(
    [
      { text: "エージェントに頼んでもOK：", options: { color: C.green, bold: true, breakLine: true } },
      { text: "「このフォルダをローカルサーバーで開いて」と言えば、起動まで任せられます。", options: { color: C.sub } },
    ],
    { x: MX + 0.4, y: 4.95, w: 5.1, h: 1.45, fontSize: 13.5, fontFace: F.body, align: "left", valign: "middle", lineSpacingMultiple: 1.3, margin: 0 }
  );
  // 右: 完成モック
  const mx = 6.85, my = 2.1, mw = 5.75, mh = 4.3;
  card(s, mx, my, mw, mh, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: mx + 0.01, y: my + 0.01, w: mw - 0.02, h: 0.42, fill: { color: C.panel3 }, line: { type: "none" } });
  termDots(s, mx + 0.2, my + 0.16);
  s.addText("My ToDo  ·  localhost:8000", { x: mx + 0.95, y: my + 0.01, w: mw - 1.2, h: 0.42, fontSize: 11, fontFace: F.code, color: C.muted, align: "left", valign: "middle", margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: mx + 0.4, y: my + 0.78, w: mw - 2.1, h: 0.55, rectRadius: 0.05, fill: { color: C.bg }, line: { color: C.border, width: 1 } });
  s.addText("牛乳を買う", { x: mx + 0.6, y: my + 0.78, w: mw - 2.4, h: 0.55, fontSize: 13, fontFace: F.body, color: C.muted, align: "left", valign: "middle", margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: mx + mw - 1.5, y: my + 0.78, w: 1.1, h: 0.55, rectRadius: 0.05, fill: { color: C.green }, line: { type: "none" } });
  s.addText("追加", { x: mx + mw - 1.5, y: my + 0.78, w: 1.1, h: 0.55, fontSize: 14, fontFace: F.head, bold: true, color: C.bg, align: "center", valign: "middle", margin: 0 });
  const tasks = [
    { t: "レポートを書く", done: true },
    { t: "牛乳を買う", done: false },
    { t: "本を返す", done: false },
  ];
  tasks.forEach((tk, i) => {
    const ty = my + 1.58 + i * 0.82;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: mx + 0.4, y: ty, w: mw - 0.8, h: 0.62, rectRadius: 0.04, fill: { color: C.panel }, line: { color: C.border, width: 1 } });
    if (tk.done) {
      s.addShape(pres.shapes.OVAL, { x: mx + 0.6, y: ty + 0.16, w: 0.3, h: 0.3, fill: { color: C.green }, line: { type: "none" } });
      s.addText("✓", { x: mx + 0.6, y: ty + 0.16, w: 0.3, h: 0.3, fontSize: 12, fontFace: F.head, bold: true, color: C.bg, align: "center", valign: "middle", margin: 0 });
    } else {
      s.addShape(pres.shapes.OVAL, { x: mx + 0.6, y: ty + 0.16, w: 0.3, h: 0.3, fill: { color: C.panel }, line: { color: C.muted, width: 1.5 } });
    }
    s.addText(tk.t, { x: mx + 1.05, y: ty, w: mw - 2.2, h: 0.62, fontSize: 14, fontFace: F.body, color: tk.done ? C.muted : C.text, strike: tk.done, align: "left", valign: "middle", margin: 0 });
    s.addText("×", { x: mx + mw - 0.75, y: ty, w: 0.4, h: 0.62, fontSize: 18, fontFace: F.head, color: C.muted, align: "center", valign: "middle", margin: 0 });
  });
  footer(s);
}

// ============================================================
// 21. うまくいかない時
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Build", C.orange, "うまくいかない時のコツ");
  s.addText("無料・軽量モデルでも、頼み方を工夫すると安定します。", { x: MX, y: 1.95, w: W - MX * 2, h: 0.5, fontSize: 16, fontFace: F.body, color: C.sub, align: "left", valign: "middle", margin: 0 });
  const tips = [
    { t: "小さく分けて頼む", d: "一度に全部より、機能ごとに少しずつ。", c: C.green },
    { t: "具体的に書く", d: "何を・どんな見た目か、はっきり伝える。", c: C.blue },
    { t: "エラーは貼って渡す", d: "出たメッセージをそのまま貼り「直して」。", c: C.purple },
    { t: "もう一度送る", d: "Router が別の無料モデルに切り替わることも。", c: C.orange },
  ];
  const cw = 5.8, gap = 0.33, ch = 1.7, y0 = 2.6, gy = 0.25;
  tips.forEach((it, i) => {
    const x = MX + (i % 2) * (cw + gap);
    const y = y0 + Math.floor(i / 2) * (ch + gy);
    card(s, x, y, cw, ch);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.09, h: ch, fill: { color: it.c }, line: { type: "none" } });
    s.addText(it.t, { x: x + 0.4, y: y + 0.28, w: cw - 0.7, h: 0.5, fontSize: 17, fontFace: F.head, bold: true, color: it.c, align: "left", valign: "middle", margin: 0 });
    s.addText(it.d, { x: x + 0.4, y: y + 0.82, w: cw - 0.7, h: 0.75, fontSize: 14, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.25, margin: 0 });
  });
  footer(s);
}

// ============================================================
// 22. 指示ファイル (AGENTS.md / CLAUDE.md)
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Build", C.orange, "エージェントへの指示ファイル");
  s.addText("プロジェクトに“指示ファイル”を置くと、前提やルールを毎回伝えられます。", { x: MX, y: 1.95, w: W - MX * 2, h: 0.5, fontSize: 16.5, fontFace: F.body, color: C.sub, align: "left", valign: "middle", margin: 0 });
  // 対応表
  const rows = [
    [{ text: "ツール", options: { bold: true, color: C.bg, fill: { color: C.orange }, align: "left", valign: "middle" } },
     { text: "指示ファイル", options: { bold: true, color: C.bg, fill: { color: C.orange }, align: "left", valign: "middle" } }],
    [{ text: "OpenCode", options: { color: C.text, fill: { color: C.panel } } }, { text: "AGENTS.md", options: { color: C.green, fill: { color: C.panel } } }],
    [{ text: "Codex CLI", options: { color: C.text, fill: { color: C.panel2 } } }, { text: "AGENTS.md", options: { color: C.green, fill: { color: C.panel2 } } }],
    [{ text: "Claude Code", options: { color: C.text, fill: { color: C.panel } } }, { text: "CLAUDE.md", options: { color: C.green, fill: { color: C.panel } } }],
  ];
  s.addTable(rows, {
    x: MX, y: 2.65, w: 6.4, colW: [3.4, 3.0], rowH: [0.55, 0.7, 0.7, 0.7],
    fontFace: F.body, fontSize: 15, valign: "middle", margin: [0, 0, 0, 8],
    border: { type: "solid", pt: 1, color: C.border },
  });
  s.addText("名前は違っても“前提を1度書いておく”という考え方は共通です。", { x: MX, y: 5.55, w: 6.4, h: 0.7, fontSize: 13, fontFace: F.body, color: C.muted, align: "left", valign: "top", lineSpacingMultiple: 1.3, margin: 0 });
  // 例
  codeBlock(s, 7.4, 2.65, 5.2, 2.4, [
    { t: "# AGENTS.md", c: C.muted },
    { t: "## ルール", c: C.purple },
    { t: "- 返答は日本語で", c: C.sub },
    { t: "- アプリは index.html 1枚で作る", c: C.sub },
    { t: "- 凝った依存は入れない", c: C.sub },
  ], { title: "書き方の例", fontSize: 13 });
  card(s, 7.4, 5.25, 5.2, 1.0, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: 7.4, y: 5.25, w: 0.09, h: 1.0, fill: { color: C.orange }, line: { type: "none" } });
  s.addText("毎回同じ指示を書かずに済み、チームで前提もそろえられる。", { x: 7.8, y: 5.25, w: 4.6, h: 1.0, fontSize: 13.5, fontFace: F.body, color: C.sub, align: "left", valign: "middle", lineSpacingMultiple: 1.3, margin: 0 });
  footer(s);
}

// ============================================================
// 23. レート制限
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Build", C.orange, "無料枠の上限に注意");
  s.addText("未課金アカウントの無料モデルには、OpenRouter の利用上限があります。", { x: MX, y: 1.95, w: W - MX * 2, h: 0.5, fontSize: 16, fontFace: F.body, color: C.sub, align: "left", valign: "middle", margin: 0 });
  const stats = [
    { n: "50", u: "リクエスト / 日", c: C.green },
    { n: "20", u: "リクエスト / 分", c: C.blue },
  ];
  const cw = 5.0, gap = 0.6, y = 2.8, ch = 2.4;
  const startX = (W - (cw * 2 + gap)) / 2;
  stats.forEach((st, i) => {
    const x = startX + i * (cw + gap);
    card(s, x, y, cw, ch, C.panel2);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: 0.1, fill: { color: st.c }, line: { type: "none" } });
    s.addText(st.n, { x, y: y + 0.4, w: cw, h: 1.2, fontSize: 72, fontFace: F.head, bold: true, color: st.c, align: "center", valign: "middle", margin: 0 });
    s.addText(st.u, { x, y: y + 1.65, w: cw, h: 0.5, fontSize: 17, fontFace: F.body, color: C.sub, align: "center", valign: "middle", margin: 0 });
  });
  s.addText("上限に当たったら、少し時間をおいてから再開しましょう。", { x: MX, y: 5.55, w: W - MX * 2, h: 0.5, fontSize: 15, fontFace: F.body, color: C.muted, align: "center", valign: "middle", margin: 0 });
  footer(s);
}

// ============================================================
// 24. 振り返り
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Wrap up", C.green, "今日できたこと");
  const done = [
    "コーディングエージェントが何か理解した",
    "OpenCode を自分のPCにインストールした",
    "OpenRouter の無料モデルに接続した",
    "複数ファイルの ToDo アプリを作らせた",
  ];
  const y0 = 2.25, rh = 0.92, gap = 0.18;
  done.forEach((t, i) => {
    const y = y0 + i * (rh + gap);
    card(s, MX, y, W - MX * 2, rh);
    check(s, MX + 0.35, y + (rh - 0.5) / 2, 0.5);
    s.addText(t, { x: MX + 1.15, y, w: W - MX * 2 - 1.5, h: rh, fontSize: 18, fontFace: F.head, color: C.text, align: "left", valign: "middle", margin: 0 });
  });
  footer(s);
}

// ============================================================
// 25. もっと先へ
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Wrap up", C.green, "もっと先へ");
  s.addText("今日おぼえた “頼み方” と “指示ファイル” は、どのエージェントでもそのまま使えます。", { x: MX, y: 1.9, w: W - MX * 2, h: 0.5, fontSize: 15, fontFace: F.body, color: C.muted, align: "left", valign: "middle", margin: 0 });
  const next = [
    { t: "他のエージェントを試す", d: "Claude Code・Codex CLI など。今日の知識がそのまま活きる。", c: C.blue },
    { t: "高性能モデルで本格開発", d: "有料モデルにすると精度・速度がぐっと上がる。", c: C.orange },
    { t: "Webアプリに挑戦", d: "Node を入れて Vite などで本格的なアプリへ。", c: C.purple },
    { t: "ふだんの作業に使う", d: "調べもの・修正・自動化など、研究や開発の相棒に。", c: C.green },
  ];
  const cw = 5.8, gap = 0.33, ch = 1.65, y0 = 2.6, gy = 0.22;
  next.forEach((it, i) => {
    const x = MX + (i % 2) * (cw + gap);
    const y = y0 + Math.floor(i / 2) * (ch + gy);
    card(s, x, y, cw, ch);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.09, h: ch, fill: { color: it.c }, line: { type: "none" } });
    s.addText(it.t, { x: x + 0.4, y: y + 0.26, w: cw - 0.7, h: 0.5, fontSize: 17, fontFace: F.head, bold: true, color: it.c, align: "left", valign: "middle", margin: 0 });
    s.addText(it.d, { x: x + 0.4, y: y + 0.78, w: cw - 0.7, h: 0.75, fontSize: 14, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.25, margin: 0 });
  });
  footer(s);
}

// ============================================================
// 26. 参考リンク
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Wrap up", C.green, "参考リンク");
  const links = [
    { t: "OpenCode（今日のツール）", u: "opencode.ai/docs", c: C.green },
    { t: "OpenRouter API キー", u: "openrouter.ai/keys", c: C.blue },
    { t: "Claude Code", u: "claude.com/claude-code", c: C.orange },
    { t: "Codex CLI", u: "github.com/openai/codex", c: C.purple },
  ];
  const y0 = 2.2, rh = 0.95, gap = 0.16;
  links.forEach((l, i) => {
    const y = y0 + i * (rh + gap);
    card(s, MX, y, W - MX * 2, rh);
    s.addShape(pres.shapes.RECTANGLE, { x: MX, y, w: 0.09, h: rh, fill: { color: l.c }, line: { type: "none" } });
    s.addText(l.t, { x: MX + 0.4, y, w: 5.2, h: rh, fontSize: 16, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
    s.addText(l.u, { x: 6.0, y, w: W - MX * 2 - 5.6, h: rh, fontSize: 14, fontFace: F.code, color: l.c, align: "left", valign: "middle", margin: 0 });
  });
  footer(s);
}

// ============================================================
// 27. おわり
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  s.addText("$ _", { x: 9.5, y: 0.3, w: 3.5, h: 1, fontSize: 40, fontFace: F.code, color: C.panel3, align: "right", valign: "top", margin: 0 });
  s.addText("THANK YOU", { x: MX, y: 2.3, w: 11.5, h: 0.5, fontSize: 14, fontFace: F.code, bold: true, color: C.green, charSpacing: 4, align: "left", valign: "middle", margin: 0 });
  s.addText("おつかれさまでした", { x: MX, y: 2.85, w: 11.5, h: 1.2, fontSize: 46, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
  s.addText("今日の続きは、あなたのPCの中で。", { x: MX, y: 4.2, w: 11.5, h: 0.6, fontSize: 20, fontFace: F.head, color: C.sub, align: "left", valign: "middle", margin: 0 });
  codeBlock(s, MX, 5.1, 6.5, 1.4, [
    { t: "$ opencode", c: C.green },
    { t: "> 次は何を作ろうか？", c: C.blue },
  ], { title: "Happy hacking", fontSize: 14 });
  s.addText(`コーディングエージェント入門  ·  OpenCode × OpenRouter`, { x: MX, y: 7.02, w: 8, h: 0.3, fontSize: 9, fontFace: F.body, color: C.muted, align: "left", valign: "middle", margin: 0 });
  s.addText(`${TOTAL} / ${TOTAL}`, { x: W - MX - 2, y: 7.02, w: 2, h: 0.3, fontSize: 9, fontFace: F.code, color: C.muted, align: "right", valign: "middle", margin: 0 });
}

pres.writeFile({ fileName: "seminar.pptx" }).then((f) => console.log("created:", f));
