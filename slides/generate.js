// コーディングエージェント入門セミナー資料
// OpenCode × OpenRouter ハンズオン
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
const H = 7.5;
const MX = 0.7;

const shadow = () => ({ type: "outer", color: "000000", blur: 10, offset: 3, angle: 90, opacity: 0.35 });

// ---- ヘルパー ----
function bg(slide) {
  slide.background = { color: C.bg };
}

function footer(slide, page) {
  slide.addText(
    [
      { text: "コーディングエージェント入門", options: { color: C.muted } },
      { text: "  ·  OpenCode × OpenRouter", options: { color: C.border } },
    ],
    { x: MX, y: 7.02, w: 8, h: 0.3, fontSize: 9, fontFace: F.body, align: "left", valign: "middle", margin: 0 }
  );
  slide.addText(`${String(page).padStart(2, "0")} / 28`, {
    x: W - MX - 2, y: 7.02, w: 2, h: 0.3, fontSize: 9, fontFace: F.code,
    color: C.muted, align: "right", valign: "middle", margin: 0,
  });
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
  const cols = [C.red, C.yellow, C.green];
  cols.forEach((c, i) => {
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
  // タイトルバー
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

// 角丸カード
function card(slide, x, y, w, h, fill) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: fill || C.panel }, line: { color: C.border, width: 1 }, shadow: shadow(),
  });
}

// 番号バッジ
function badge(slide, x, y, d, num, color) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { type: "none" } });
  slide.addText(String(num), {
    x, y, w: d, h: d, fontSize: d * 22, fontFace: F.head, bold: true,
    color: C.bg, align: "center", valign: "middle", margin: 0,
  });
}

// チェックアイコン(緑丸 + ✓)
function check(slide, x, y, d) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: C.green }, line: { type: "none" } });
  slide.addText("✓", {
    x, y, w: d, h: d, fontSize: d * 26, fontFace: F.head, bold: true,
    color: C.bg, align: "center", valign: "middle", margin: 0,
  });
}

// ============================================================
// Slide 1: タイトル
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  // 背景の薄いプロンプト装飾
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
      { text: "OpenCode", options: { color: C.green, bold: true } },
      { text: " × ", options: { color: C.muted } },
      { text: "OpenRouter", options: { color: C.blue, bold: true } },
      { text: " で “動くAI” を体験する", options: { color: C.sub } },
    ],
    { x: MX, y: 4.15, w: 11.5, h: 0.6, fontSize: 22, fontFace: F.head, align: "left", valign: "middle", margin: 0 }
  );
  // ターミナルカード
  codeBlock(s, MX, 5.2, 6.2, 1.5, [
    { t: "$ opencode", c: C.green },
    { t: "  接続中… OpenRouter / Free Models Router", c: C.muted },
    { t: "  > 今日はこれを動かします", c: C.sub },
  ], { title: "opencode — getting started", fontSize: 12.5 });
  s.addText("情報学科 研究室向け / 所要 約1時間 / 無料でできます", {
    x: 7.4, y: 6.25, w: 5.2, h: 0.4, fontSize: 12, fontFace: F.body, color: C.muted,
    align: "right", valign: "middle", margin: 0,
  });
}

// ============================================================
// Slide 2: 今日のゴール
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "今日のゴール");
  const items = [
    { n: 1, t: "“何か”が分かる", d: "コーディングエージェントとは何か、普段のAIチャットと何が違うのかを理解する。", c: C.blue },
    { n: 2, t: "自分のPCで動かす", d: "OpenCode を実際にインストールし、OpenRouter につないで起動するところまでやる。", c: C.purple },
    { n: 3, t: "“自動化”を体験", d: "チャットにとどまらず、エージェントにファイルを作らせてミニアプリを動かす。", c: C.orange },
  ];
  const cw = 3.7, gap = 0.42, y = 2.1, ch = 4.3;
  items.forEach((it, i) => {
    const x = MX + i * (cw + gap);
    card(s, x, y, cw, ch);
    badge(s, x + 0.4, y + 0.45, 0.75, it.n, it.c);
    s.addText(it.t, {
      x: x + 0.4, y: y + 1.45, w: cw - 0.8, h: 0.6, fontSize: 19, fontFace: F.head, bold: true,
      color: C.text, align: "left", valign: "middle", margin: 0,
    });
    s.addText(it.d, {
      x: x + 0.4, y: y + 2.1, w: cw - 0.8, h: 1.9, fontSize: 14, fontFace: F.body,
      color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.3, margin: 0,
    });
  });
  footer(s, 2);
}

// ============================================================
// Slide 3: アジェンダ
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "今日の流れ");
  const steps = [
    { t: "知る：エージェントって何？", d: "座学でイメージをつかむ", time: "〜15分", c: C.blue },
    { t: "準備：OpenCode を入れる", d: "Mac / WSL でインストール", time: "〜15分", c: C.purple },
    { t: "つなぐ：OpenRouter に接続", d: "APIキーを作って /connect", time: "〜10分", c: C.green },
    { t: "作る：ミニアプリを生成", d: "1ファイルのWebアプリを作らせる", time: "〜20分", c: C.orange },
  ];
  const y0 = 2.05, rh = 1.08, gap = 0.13;
  steps.forEach((st, i) => {
    const y = y0 + i * (rh + gap);
    card(s, MX, y, W - MX * 2, rh);
    badge(s, MX + 0.35, y + (rh - 0.62) / 2, 0.62, i + 1, st.c);
    s.addText(st.t, {
      x: MX + 1.3, y: y + 0.14, w: 7.5, h: 0.45, fontSize: 18, fontFace: F.head, bold: true,
      color: C.text, align: "left", valign: "middle", margin: 0,
    });
    s.addText(st.d, {
      x: MX + 1.3, y: y + 0.58, w: 7.5, h: 0.38, fontSize: 13, fontFace: F.body,
      color: C.muted, align: "left", valign: "middle", margin: 0,
    });
    s.addText(st.time, {
      x: W - MX - 1.7, y, w: 1.4, h: rh, fontSize: 14, fontFace: F.code, bold: true,
      color: st.c, align: "right", valign: "middle", margin: 0,
    });
  });
  footer(s, 3);
}

// ============================================================
// Slide 4: 導入の問い
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
  // before
  card(s, MX, 2.95, 5.75, 3.4);
  s.addText("ふつうの AI チャット", {
    x: MX + 0.4, y: 3.2, w: 5, h: 0.5, fontSize: 17, fontFace: F.head, bold: true, color: C.blue,
    align: "left", valign: "middle", margin: 0,
  });
  s.addText(
    [
      { text: "質問すると文章を返してくれる", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "コードも“テキストとして”もらえる", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "でも…ファイルに保存するのは自分", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "実行・テスト・修正も全部自分", options: { bullet: { indent: 18 } } },
    ],
    { x: MX + 0.4, y: 3.8, w: 5.0, h: 2.3, fontSize: 15, fontFace: F.body, color: C.sub,
      align: "left", valign: "top", paraSpaceAfter: 10, margin: 0 }
  );
  // 矢印
  s.addText("→", {
    x: 6.55, y: 2.95, w: 0.9, h: 3.4, fontSize: 40, fontFace: F.head, bold: true, color: C.muted,
    align: "center", valign: "middle", margin: 0,
  });
  // after
  card(s, 7.45, 2.95, 5.15, 3.4, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: 7.45, y: 2.95, w: 0.09, h: 3.4, fill: { color: C.green }, line: { type: "none" } });
  s.addText("コーディングエージェント", {
    x: 7.85, y: 3.2, w: 4.5, h: 0.5, fontSize: 17, fontFace: F.head, bold: true, color: C.green,
    align: "left", valign: "middle", margin: 0,
  });
  s.addText("コピペの“その先”を、AIが\nあなたのPCの上で自分でやる。", {
    x: 7.85, y: 3.9, w: 4.4, h: 1.6, fontSize: 18, fontFace: F.head, color: C.text,
    align: "left", valign: "top", lineSpacingMultiple: 1.35, margin: 0,
  });
  footer(s, 4);
}

// ============================================================
// Slide 5: エージェントとは (比較)
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "コーディングエージェントとは？");
  s.addText("ひとことで言うと —— あなたのPCを操作できるAI。", {
    x: MX, y: 1.95, w: W - MX * 2, h: 0.5, fontSize: 19, fontFace: F.head, color: C.sub,
    align: "left", valign: "middle", margin: 0,
  });
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
  footer(s, 5);
}

// ============================================================
// Slide 6: 代表的なエージェント
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "代表的なエージェント");
  const tools = [
    { t: "Claude Code", v: "Anthropic", d: "高性能。CLIから本格的な開発。基本は有料モデル。", c: C.orange, star: false },
    { t: "Codex CLI", v: "OpenAI", d: "OpenAIのCLIエージェント。ChatGPTの延長で使える。", c: C.blue, star: false },
    { t: "OpenCode", v: "オープンソース", d: "好きなモデルに接続できる。無料モデルでも動く。", c: C.green, star: true },
  ];
  const cw = 3.7, gap = 0.42, y = 2.15, ch = 3.6;
  tools.forEach((it, i) => {
    const x = MX + i * (cw + gap);
    card(s, x, y, cw, ch, it.star ? C.panel2 : C.panel);
    if (it.star) s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: 0.09, fill: { color: C.green }, line: { type: "none" } });
    s.addText(it.t, { x: x + 0.4, y: y + 0.45, w: cw - 0.8, h: 0.55, fontSize: 21, fontFace: F.head, bold: true, color: it.c, align: "left", valign: "middle", margin: 0 });
    s.addText(it.v, { x: x + 0.4, y: y + 1.05, w: cw - 0.8, h: 0.35, fontSize: 12, fontFace: F.code, color: C.muted, align: "left", valign: "middle", margin: 0 });
    s.addText(it.d, { x: x + 0.4, y: y + 1.6, w: cw - 0.8, h: 1.5, fontSize: 14, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.3, margin: 0 });
    if (it.star) s.addText("今日はこれを使います", { x: x + 0.4, y: y + ch - 0.62, w: cw - 0.8, h: 0.4, fontSize: 12.5, fontFace: F.head, bold: true, color: C.green, align: "left", valign: "middle", margin: 0 });
  });
  footer(s, 6);
}

// ============================================================
// Slide 7: なぜターミナル
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "なぜ “ターミナル” で動くの？");
  card(s, MX, 2.1, 6.0, 4.0);
  s.addText("ターミナル = PCに文字で命令する場所", {
    x: MX + 0.45, y: 2.45, w: 5.2, h: 0.6, fontSize: 17, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0,
  });
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
    { t: "$ open index.html", c: C.green },
    { t: "# ブラウザでアプリが起動", c: C.muted },
    { t: "", c: C.sub },
    { t: "$ opencode", c: C.green },
    { t: "> じゃんけんゲームを作って", c: C.blue },
    { t: "  作成中: index.html …", c: C.muted },
  ], { title: "こんな世界です", fontSize: 13 });
  footer(s, 7);
}

// ============================================================
// Slide 8: OpenCode とは
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "OpenCode とは");
  const items = [
    { t: "オープンソース", d: "無料で使える。ターミナルで動くTUIのエージェント。", c: C.green },
    { t: "モデルが自由", d: "OpenAI / Anthropic / OpenRouter など好きなモデルに接続。", c: C.blue },
    { t: "今日の構成", d: "OpenRouter の無料モデルにつないで動かす。", c: C.purple },
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
  footer(s, 8);
}

// ============================================================
// Slide 9: なぜ OpenRouter
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
  footer(s, 9);
}

// ============================================================
// Slide 10: 全体図
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Intro", C.blue, "今日やること（全体図）");
  const flow = [
    { n: "1", t: "入れる", d: "OpenCode を\nインストール", c: C.purple },
    { n: "2", t: "つなぐ", d: "OpenRouter に\n/connect", c: C.green },
    { n: "3", t: "作る", d: "ミニアプリを\n生成して動かす", c: C.orange },
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
  s.addText("この3ステップを、これから順番にやっていきます。", {
    x: MX, y: 5.8, w: W - MX * 2, h: 0.5, fontSize: 15, fontFace: F.body, color: C.muted, align: "center", valign: "middle", margin: 0,
  });
  footer(s, 10);
}

// ============================================================
// Slide 11: STEP0 準備
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
  // 注意バー
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
  footer(s, 11);
}

// ============================================================
// Slide 12: STEP1 インストール
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Setup", C.purple, "STEP 1 ── OpenCode を入れる");
  codeBlock(s, MX, 2.1, 5.8, 4.2, [
    { t: "# Homebrew を更新", c: C.muted },
    { t: "$ brew update", c: C.green },
    { t: "", c: C.sub },
    { t: "# OpenCode を入れる", c: C.muted },
    { t: "$ brew install \\", c: C.green },
    { t: "    anomalyco/tap/opencode", c: C.green },
    { t: "", c: C.sub },
    { t: "# 確認", c: C.muted },
    { t: "$ opencode --version", c: C.green },
  ], { title: "macOS + Homebrew" });
  codeBlock(s, 6.8, 2.1, 5.8, 4.2, [
    { t: "# 基本ツール", c: C.muted },
    { t: "$ sudo apt update", c: C.green },
    { t: "$ sudo apt install -y \\", c: C.green },
    { t: "    curl git ca-certificates", c: C.green },
    { t: "", c: C.sub },
    { t: "# OpenCode を入れる", c: C.muted },
    { t: "$ curl -fsSL \\", c: C.green },
    { t: "    https://opencode.ai/install | bash", c: C.green },
    { t: "$ opencode --version", c: C.green },
  ], { title: "Windows (WSL Ubuntu)" });
  footer(s, 12);
}

// ============================================================
// Slide 13: STEP2 APIキー
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
  // 注意カード
  card(s, 8.05, 2.15, 4.55, 4.18, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: 8.05, y: 2.15, w: 0.09, h: 4.18, fill: { color: C.red }, line: { type: "none" } });
  s.addText("⚠ キーの取り扱い", { x: 8.45, y: 2.45, w: 3.9, h: 0.5, fontSize: 17, fontFace: F.head, bold: true, color: C.red, align: "left", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "パスワードと同じ秘密情報", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "README や Git に直接書かない", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "人に見せない・貼らない", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "OpenCode が安全に保存する", options: { bullet: { indent: 18 } } },
    ],
    { x: 8.45, y: 3.1, w: 3.9, h: 3.0, fontSize: 14, fontFace: F.body, color: C.sub, align: "left", valign: "top", paraSpaceAfter: 12, margin: 0 }
  );
  footer(s, 13);
}

// ============================================================
// Slide 14: STEP3 リポジトリ取得
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Connect", C.green, "STEP 3 ── リポジトリへ移動する");
  s.addText("作業場所として、このセミナー用リポジトリを取得します。", {
    x: MX, y: 1.95, w: W - MX * 2, h: 0.5, fontSize: 16, fontFace: F.body, color: C.sub, align: "left", valign: "middle", margin: 0,
  });
  codeBlock(s, MX, 2.65, 8.4, 2.2, [
    { t: "$ git clone \\", c: C.green },
    { t: "    https://github.com/OJII3/opencode_openrouter_free_example.git", c: C.green },
    { t: "", c: C.sub },
    { t: "$ cd opencode_openrouter_free_example", c: C.green },
  ], { title: "clone して移動", fontSize: 12.5 });
  card(s, 9.2, 2.65, 3.4, 2.2, C.panel2);
  s.addText("もう開いている人は", { x: 9.55, y: 2.9, w: 2.9, h: 0.4, fontSize: 13, fontFace: F.body, color: C.muted, align: "left", valign: "middle", margin: 0 });
  s.addText("場所の確認だけでOK", { x: 9.55, y: 3.25, w: 2.9, h: 0.4, fontSize: 15, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
  s.addText("$ pwd", { x: 9.55, y: 3.85, w: 2.9, h: 0.5, fontSize: 15, fontFace: F.code, color: C.green, align: "left", valign: "middle", margin: 0 });
  s.addText("git が無いと言われたら、STEP 1 のツール導入コマンドをもう一度確認しましょう。", {
    x: MX, y: 5.3, w: W - MX * 2, h: 0.5, fontSize: 13.5, fontFace: F.body, color: C.muted, align: "left", valign: "middle", margin: 0,
  });
  footer(s, 14);
}

// ============================================================
// Slide 15: STEP4 起動
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Connect", C.green, "STEP 4 ── OpenCode を起動する");
  codeBlock(s, MX, 2.2, 5.6, 1.3, [{ t: "$ opencode", c: C.green }], { title: "起動", fontSize: 16 });
  s.addText("入力するのはこれだけ。TUI（ターミナルの画面）が開きます。", {
    x: MX, y: 3.75, w: 5.8, h: 1.0, fontSize: 15, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.3, margin: 0,
  });
  card(s, MX, 4.9, 5.8, 1.5, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 4.9, w: 0.09, h: 1.5, fill: { color: C.orange }, line: { type: "none" } });
  s.addText(
    [
      { text: "command not found の時：", options: { color: C.orange, bold: true, breakLine: true } },
      { text: "ターミナルを一度閉じて開き直す。", options: { color: C.sub } },
    ],
    { x: MX + 0.4, y: 4.9, w: 5.2, h: 1.5, fontSize: 14, fontFace: F.body, align: "left", valign: "middle", lineSpacingMultiple: 1.25, margin: 0 }
  );
  codeBlock(s, 6.9, 2.2, 5.7, 4.2, [
    { t: "  OpenCode", c: C.muted },
    { t: "  ──────────────────────", c: C.muted },
    { t: "", c: C.sub },
    { t: "  > _", c: C.green },
    { t: "", c: C.sub },
    { t: "  ここに指示を打ち込む", c: C.sub },
    { t: "", c: C.sub },
    { t: "  ──────────────────────", c: C.muted },
    { t: "  次は /connect で接続します", c: C.blue },
  ], { title: "こんな画面が開きます", fontSize: 12.5 });
  footer(s, 15);
}

// ============================================================
// Slide 16: STEP5 /connect
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Connect", C.green, "STEP 5 ── /connect で接続する");
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
  s.addText("環境変数 OPENROUTER_API_KEY を自分で設定する必要はありません。", {
    x: 8.1, y: 5.15, w: 4.3, h: 1.0, fontSize: 13, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.3, margin: 0,
  });
  footer(s, 16);
}

// ============================================================
// Slide 17: STEP6 Free Models Router
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Connect", C.green, "STEP 6 ── Free Models Router を選ぶ");
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
  s.addText("特定の無料モデルは混雑で使えないことがある。Router は空いている無料モデルへ自動でつなぎます。", {
    x: 7.3, y: 3.35, w: 4.9, h: 1.2, fontSize: 13.5, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.3, margin: 0,
  });
  // 動作確認
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
  footer(s, 17);
}

// ============================================================
// Slide 18: TUI基本操作
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
    { t: "> じゃんけんゲームを作って", c: C.blue },
    { t: "", c: C.sub },
    { t: "  ● 作成中  index.html", c: C.green },
    { t: "  + <!DOCTYPE html>", c: C.green },
    { t: "  + <button>グー</button>", c: C.green },
    { t: "  …", c: C.muted },
    { t: "", c: C.sub },
    { t: "  ✓ できました", c: C.green },
    { t: "> ブラウザで開いてみて！", c: C.blue },
  ], { title: "やりとりの例", fontSize: 12.5 });
  footer(s, 18);
}

// ============================================================
// Slide 19: STEP7 作らせる
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Build", C.orange, "STEP 7 ── ミニアプリを作らせる");
  s.addText(
    [
      { text: "“1つのHTMLファイルで動くアプリ” ", options: { color: C.text, bold: true } },
      { text: "を作ってもらおう。環境構築が要らず、ブラウザで即確認できます。", options: { color: C.sub } },
    ],
    { x: MX, y: 1.95, w: W - MX * 2, h: 0.6, fontSize: 16, fontFace: F.body, align: "left", valign: "middle", margin: 0 }
  );
  const ideas = [
    { t: "じゃんけん", d: "勝敗を判定", c: C.green },
    { t: "ToDoリスト", d: "追加・削除", c: C.blue },
    { t: "ストップウォッチ", d: "計測・リセット", c: C.purple },
    { t: "オセロ", d: "（挑戦）盤面で対戦", c: C.orange },
  ];
  const cw = 2.85, gap = 0.31, y = 2.75, ch = 1.9;
  ideas.forEach((it, i) => {
    const x = MX + i * (cw + gap);
    card(s, x, y, cw, ch);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: 0.09, fill: { color: it.c }, line: { type: "none" } });
    s.addText(it.t, { x: x + 0.3, y: y + 0.45, w: cw - 0.6, h: 0.6, fontSize: 18, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
    s.addText(it.d, { x: x + 0.3, y: y + 1.1, w: cw - 0.6, h: 0.6, fontSize: 13, fontFace: F.body, color: C.muted, align: "left", valign: "top", margin: 0 });
  });
  card(s, MX, 5.0, W - MX * 2, 1.35, C.panel2);
  s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 5.0, w: 0.09, h: 1.35, fill: { color: C.green }, line: { type: "none" } });
  s.addText(
    [
      { text: "ポイント：", options: { color: C.green, bold: true } },
      { text: " index.html だけで完結する形にすると、Node などの環境構築なしで動かせます。", options: { color: C.sub } },
    ],
    { x: MX + 0.4, y: 5.0, w: W - MX * 2 - 0.7, h: 1.35, fontSize: 15, fontFace: F.body, align: "left", valign: "middle", margin: 0 }
  );
  footer(s, 19);
}

// ============================================================
// Slide 20: プロンプト例
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Build", C.orange, "プロンプト例（そのまま使える）");
  codeBlock(s, MX, 2.1, W - MX * 2, 2.0, [
    { t: "index.html だけで動く「じゃんけんゲーム」を作って。", c: C.text },
    { t: "HTML / CSS / JS を1つのファイルにまとめて。", c: C.text },
    { t: "見た目もシンプルに整えて、勝敗が分かるようにして。", c: C.text },
  ], { title: "OpenCode に貼り付ける指示", fontSize: 15 });
  const tips = [
    { t: "何を作るか", d: "アプリの種類をはっきり書く" },
    { t: "どんな形か", d: "「1ファイルで」など制約を伝える" },
    { t: "どう見せるか", d: "見た目・動作の希望を一言そえる" },
  ];
  const cw = 3.7, gap = 0.42, y = 4.5, ch = 1.85;
  tips.forEach((it, i) => {
    const x = MX + i * (cw + gap);
    card(s, x, y, cw, ch);
    s.addText(it.t, { x: x + 0.35, y: y + 0.3, w: cw - 0.7, h: 0.5, fontSize: 16, fontFace: F.head, bold: true, color: C.orange, align: "left", valign: "middle", margin: 0 });
    s.addText(it.d, { x: x + 0.35, y: y + 0.85, w: cw - 0.7, h: 0.8, fontSize: 13.5, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.25, margin: 0 });
  });
  footer(s, 20);
}

// ============================================================
// Slide 21: ブラウザで確認
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Build", C.orange, "ブラウザで動かしてみる");
  s.addText("できた index.html を開けば、もうアプリが動きます。", {
    x: MX, y: 1.95, w: W - MX * 2, h: 0.5, fontSize: 16, fontFace: F.body, color: C.sub, align: "left", valign: "middle", margin: 0,
  });
  card(s, MX, 2.7, 5.8, 1.6);
  s.addText("macOS", { x: MX + 0.4, y: 2.95, w: 5, h: 0.45, fontSize: 16, fontFace: F.head, bold: true, color: C.purple, align: "left", valign: "middle", margin: 0 });
  s.addText("ターミナルで open、またはファイルをダブルクリック。", {
    x: MX + 0.4, y: 3.4, w: 5.0, h: 0.8, fontSize: 13.5, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.25, margin: 0,
  });
  card(s, 6.8, 2.7, 5.8, 1.6);
  s.addText("Windows (WSL)", { x: 7.2, y: 2.95, w: 5, h: 0.45, fontSize: 16, fontFace: F.head, bold: true, color: C.blue, align: "left", valign: "middle", margin: 0 });
  s.addText("explorer.exe . でフォルダを開き、index.html をダブルクリック。", {
    x: 7.2, y: 3.4, w: 5.0, h: 0.8, fontSize: 13.5, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.25, margin: 0,
  });
  codeBlock(s, MX, 4.55, 5.8, 1.0, [{ t: "$ open index.html", c: C.green }], { title: "macOS", fontSize: 14 });
  codeBlock(s, 6.8, 4.55, 5.8, 1.0, [{ t: "$ explorer.exe .", c: C.green }], { title: "WSL", fontSize: 14 });
  s.addText("動いたら成功！ うまくいかない時は次のページへ。", {
    x: MX, y: 5.8, w: W - MX * 2, h: 0.5, fontSize: 15, fontFace: F.head, bold: true, color: C.green, align: "left", valign: "middle", margin: 0,
  });
  footer(s, 21);
}

// ============================================================
// Slide 22: うまくいかない時
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Build", C.orange, "うまくいかない時のコツ");
  s.addText("無料・軽量モデルでも、頼み方を工夫すると安定します。", {
    x: MX, y: 1.95, w: W - MX * 2, h: 0.5, fontSize: 16, fontFace: F.body, color: C.sub, align: "left", valign: "middle", margin: 0,
  });
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
  footer(s, 22);
}

// ============================================================
// Slide 23: AGENTS.md
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Build", C.orange, "もう一歩：AGENTS.md");
  s.addText(
    [
      { text: "プロジェクトに ", options: { color: C.sub } },
      { text: "AGENTS.md", options: { color: C.orange, bold: true, fontFace: F.code } },
      { text: " を置くと、エージェントに“前提やルール”を毎回伝えられます。", options: { color: C.sub } },
    ],
    { x: MX, y: 1.95, w: W - MX * 2, h: 0.6, fontSize: 16.5, fontFace: F.body, align: "left", valign: "middle", margin: 0 }
  );
  codeBlock(s, MX, 2.75, 6.4, 3.3, [
    { t: "# AGENTS.md", c: C.muted },
    { t: "", c: C.sub },
    { t: "## ルール", c: C.purple },
    { t: "- 返答は日本語で", c: C.sub },
    { t: "- アプリは index.html 1枚で作る", c: C.sub },
    { t: "- 凝った依存は入れない", c: C.sub },
  ], { title: "AGENTS.md", fontSize: 13.5 });
  card(s, 7.4, 2.75, 5.2, 3.3, C.panel2);
  s.addText("何がうれしい？", { x: 7.8, y: 3.05, w: 4.4, h: 0.5, fontSize: 16, fontFace: F.head, bold: true, color: C.orange, align: "left", valign: "middle", margin: 0 });
  s.addText(
    [
      { text: "毎回同じ指示を書かなくて済む", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "チームで前提をそろえられる", options: { bullet: { indent: 18 }, breakLine: true } },
      { text: "“こう動いてほしい”を一度書くだけ", options: { bullet: { indent: 18 } } },
    ],
    { x: 7.8, y: 3.65, w: 4.4, h: 2.2, fontSize: 14.5, fontFace: F.body, color: C.sub, align: "left", valign: "top", paraSpaceAfter: 12, margin: 0 }
  );
  footer(s, 23);
}

// ============================================================
// Slide 24: レート制限
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Build", C.orange, "無料枠の上限に注意");
  s.addText("未課金アカウントの無料モデルには、OpenRouter の利用上限があります。", {
    x: MX, y: 1.95, w: W - MX * 2, h: 0.5, fontSize: 16, fontFace: F.body, color: C.sub, align: "left", valign: "middle", margin: 0,
  });
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
  s.addText("上限に当たったら、少し時間をおいてから再開しましょう。", {
    x: MX, y: 5.55, w: W - MX * 2, h: 0.5, fontSize: 15, fontFace: F.body, color: C.muted, align: "center", valign: "middle", margin: 0,
  });
  footer(s, 24);
}

// ============================================================
// Slide 25: 振り返り
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Wrap up", C.green, "今日できたこと");
  const done = [
    "コーディングエージェントが何か理解した",
    "OpenCode を自分のPCにインストールした",
    "OpenRouter の無料モデルに接続した",
    "エージェントにミニアプリを作らせた",
  ];
  const y0 = 2.25, rh = 0.92, gap = 0.18;
  done.forEach((t, i) => {
    const y = y0 + i * (rh + gap);
    card(s, MX, y, W - MX * 2, rh);
    check(s, MX + 0.35, y + (rh - 0.5) / 2, 0.5);
    s.addText(t, { x: MX + 1.15, y, w: W - MX * 2 - 1.5, h: rh, fontSize: 18, fontFace: F.head, color: C.text, align: "left", valign: "middle", margin: 0 });
  });
  footer(s, 25);
}

// ============================================================
// Slide 26: もっと先へ
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Wrap up", C.green, "もっと先へ");
  const next = [
    { t: "他のエージェントも試す", d: "Claude Code や Codex CLI を触ってみる。", c: C.blue },
    { t: "高性能モデルで本格開発", d: "有料モデルにすると精度・速度が上がる。", c: C.orange },
    { t: "Webアプリに挑戦", d: "Node を入れて Vite などで本格的なアプリへ。", c: C.purple },
    { t: "Git と組み合わせる", d: "変更履歴を残しながら安全に開発する。", c: C.green },
  ];
  const cw = 5.8, gap = 0.33, ch = 1.7, y0 = 2.15, gy = 0.25;
  next.forEach((it, i) => {
    const x = MX + (i % 2) * (cw + gap);
    const y = y0 + Math.floor(i / 2) * (ch + gy);
    card(s, x, y, cw, ch);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.09, h: ch, fill: { color: it.c }, line: { type: "none" } });
    s.addText(it.t, { x: x + 0.4, y: y + 0.28, w: cw - 0.7, h: 0.5, fontSize: 17, fontFace: F.head, bold: true, color: it.c, align: "left", valign: "middle", margin: 0 });
    s.addText(it.d, { x: x + 0.4, y: y + 0.82, w: cw - 0.7, h: 0.75, fontSize: 14, fontFace: F.body, color: C.sub, align: "left", valign: "top", lineSpacingMultiple: 1.25, margin: 0 });
  });
  footer(s, 26);
}

// ============================================================
// Slide 27: 参考リンク
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  header(s, "Wrap up", C.green, "参考リンク");
  const links = [
    { t: "OpenCode ドキュメント", u: "opencode.ai/docs", c: C.green },
    { t: "OpenRouter API キー", u: "openrouter.ai/keys", c: C.blue },
    { t: "Free Models Router", u: "openrouter.ai/openrouter/free", c: C.purple },
    { t: "このセミナーの README", u: "github.com/OJII3/opencode_openrouter_free_example", c: C.orange },
  ];
  const y0 = 2.2, rh = 0.95, gap = 0.16;
  links.forEach((l, i) => {
    const y = y0 + i * (rh + gap);
    card(s, MX, y, W - MX * 2, rh);
    s.addShape(pres.shapes.RECTANGLE, { x: MX, y, w: 0.09, h: rh, fill: { color: l.c }, line: { type: "none" } });
    s.addText(l.t, { x: MX + 0.4, y, w: 4.8, h: rh, fontSize: 16, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0 });
    s.addText(l.u, { x: 5.6, y, w: W - MX * 2 - 5.2, h: rh, fontSize: 14, fontFace: F.code, color: l.c, align: "left", valign: "middle", margin: 0 });
  });
  footer(s, 27);
}

// ============================================================
// Slide 28: おわり
// ============================================================
{
  const s = pres.addSlide();
  bg(s);
  s.addText("$ _", { x: 9.5, y: 0.3, w: 3.5, h: 1, fontSize: 40, fontFace: F.code, color: C.panel3, align: "right", valign: "top", margin: 0 });
  s.addText("THANK YOU", {
    x: MX, y: 2.3, w: 11.5, h: 0.5, fontSize: 14, fontFace: F.code, bold: true, color: C.green, charSpacing: 4, align: "left", valign: "middle", margin: 0,
  });
  s.addText("おつかれさまでした", {
    x: MX, y: 2.85, w: 11.5, h: 1.2, fontSize: 46, fontFace: F.head, bold: true, color: C.text, align: "left", valign: "middle", margin: 0,
  });
  s.addText("今日の続きは、あなたのPCの中で。", {
    x: MX, y: 4.2, w: 11.5, h: 0.6, fontSize: 20, fontFace: F.head, color: C.sub, align: "left", valign: "middle", margin: 0,
  });
  codeBlock(s, MX, 5.1, 6.5, 1.4, [
    { t: "$ opencode", c: C.green },
    { t: "> 次は何を作ろうか？", c: C.blue },
  ], { title: "Happy hacking", fontSize: 14 });
  footer(s, 28);
}

pres.writeFile({ fileName: "seminar.pptx" }).then((f) => console.log("created:", f));
