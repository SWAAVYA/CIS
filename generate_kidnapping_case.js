const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  Header, Footer, PageNumber, LevelFormat, PageBreak
} = require('docx');
const fs = require('fs');

// ─── colours ───────────────────────────────────────────────────────────────
const GOLD   = "B8A040";
const DARK   = "1A1A2E";
const MID    = "2E2E4E";
const LIGHT  = "F0EDE6";
const RED    = "C94F4F";
const GREEN  = "4F9E6F";
const BLUE   = "4F7AC9";
const WHITE  = "FFFFFF";
const MUTED  = "888888";

// ─── helpers ────────────────────────────────────────────────────────────────
const border = (colour = "444444") => ({ style: BorderStyle.SINGLE, size: 4, color: colour });
const noBorder = () => ({ style: BorderStyle.NONE, size: 0, color: "FFFFFF" });
const borders = (c) => ({ top: border(c), bottom: border(c), left: border(c), right: border(c) });
const noBorders = () => ({ top: noBorder(), bottom: noBorder(), left: noBorder(), right: noBorder() });

function cell(text, opts = {}) {
  const {
    bold = false, colour = "CCCCCC", fill = MID, colSpan, width = 4680,
    fontSize = 19, italic = false, align = AlignmentType.LEFT, isHeader = false
  } = opts;
  return new TableCell({
    columnSpan: colSpan,
    borders: borders(colour),
    width: { size: width, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold: bold || isHeader, color: isHeader ? GOLD : WHITE, size: fontSize, italics: italic, font: "Arial" })]
    })]
  });
}

function heading(text, level = 1) {
  const sizes = { 1: 36, 2: 28, 3: 24 };
  return new Paragraph({
    spacing: { before: level === 1 ? 400 : 280, after: 160 },
    children: [new TextRun({ text, bold: true, color: GOLD, size: sizes[level] || 24, font: "Arial" })]
  });
}

function body(text, opts = {}) {
  const { colour = "DDDDDD", size = 20, bold = false, before = 60, after = 80 } = opts;
  return new Paragraph({
    spacing: { before, after },
    children: [new TextRun({ text, color: colour, size, bold, font: "Arial" })]
  });
}

function label(text) {
  return new Paragraph({
    spacing: { before: 200, after: 60 },
    children: [new TextRun({ text: text.toUpperCase(), color: GOLD, size: 18, bold: true, font: "Arial" })]
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "333355" } },
    children: []
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function tag(text, colour) {
  return new TextRun({ text: `[${text}]  `, color: colour, size: 18, bold: true, font: "Courier New" });
}

// ─── two-column table row ────────────────────────────────────────────────────
function row2(left, right, opts = {}) {
  const { leftFill = MID, rightFill = "1E1E3E", leftBold = false, highlight = false } = opts;
  return new TableRow({ children: [
    cell(left,  { width: 3600, fill: leftFill,  bold: leftBold }),
    cell(right, { width: 5760, fill: highlight ? "2A1A1A" : rightFill }),
  ]});
}

function headerRow(a, b) {
  return new TableRow({ children: [
    cell(a, { width: 3600, fill: DARK, isHeader: true }),
    cell(b, { width: 5760, fill: DARK, isHeader: true }),
  ]});
}

function table2(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3600, 5760],
    rows
  });
}

// 4-column signal table row
function signalRow(num, domain, period, content, why, fill = MID) {
  return new TableRow({ children: [
    cell(num,     { width: 600,  fill: DARK }),
    cell(domain,  { width: 1800, fill: DARK, colour: GOLD }),
    cell(period,  { width: 600,  fill: DARK, align: AlignmentType.CENTER }),
    cell(content, { width: 4200, fill }),
    cell(why,     { width: 2160, fill: "1A2A1A", colour: GREEN }),
  ]});
}

// ─── DOCUMENT ───────────────────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 20, color: "CCCCCC" } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new Header({ children: [
        new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "333355" } },
          children: [
            new TextRun({ text: "CIS PRACTICE CASE  //  ", color: GOLD, bold: true, size: 16, font: "Courier New" }),
            new TextRun({ text: "THE DISAPPEARANCE OF EMMA CARVALHO", color: "888888", size: 16, font: "Courier New" }),
            new TextRun({ text: "  //  INVESTIGATOR WORKBOOK", color: GOLD, bold: true, size: 16, font: "Courier New" }),
          ]
        })
      ]})
    },
    footers: {
      default: new Footer({ children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: "333355" } },
          children: [
            new TextRun({ text: "Page ", color: MUTED, size: 16, font: "Arial" }),
            new TextRun({ children: [PageNumber.CURRENT], color: MUTED, size: 16, font: "Arial" }),
            new TextRun({ text: " of ", color: MUTED, size: 16, font: "Arial" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], color: MUTED, size: 16, font: "Arial" }),
          ]
        })
      ]})
    },
    children: [

      // ═══════════════════════════════════════════════════════════
      // COVER
      // ═══════════════════════════════════════════════════════════
      new Paragraph({
        spacing: { before: 600, after: 60 },
        children: [new TextRun({ text: "CIS PRACTICE CASE", color: GOLD, size: 24, bold: true, font: "Courier New" })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 40 },
        children: [new TextRun({ text: "THE DISAPPEARANCE OF", color: "AAAAAA", size: 52, font: "Arial" })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "EMMA CARVALHO", color: WHITE, size: 72, bold: true, font: "Arial" })]
      }),
      divider(),
      body("A 9-year-old girl does not arrive at school. Her uncle gives an alibi that does not match phone records. Money is moving in unusual patterns. Witnesses saw a car that nobody can explain.", { size: 22, colour: "AAAAAA" }),
      body("This case is written in plain everyday language — no technical jargon, no space engineering. Every signal is the kind of thing a real detective would write in a notebook.", { size: 20, colour: "888888" }),
      new Paragraph({ spacing: { before: 300, after: 100 }, children: [
        new TextRun({ text: "WHAT THIS CASE TESTS  ", color: GOLD, bold: true, size: 20, font: "Arial" }),
      ]}),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({ children: [
            cell("CIS Feature", { width: 4680, fill: DARK, isHeader: true }),
            cell("How It Shows Up In This Case", { width: 4680, fill: DARK, isHeader: true }),
          ]}),
          new TableRow({ children: [
            cell("Weak Signal Preservation (WSP)", { width: 4680, fill: MID }),
            cell("The parked car. Nobody hurt, nothing stolen — just a car. CIS keeps it.", { width: 4680, fill: "1E1E3E" }),
          ]}),
          new TableRow({ children: [
            cell("Contradiction + Quarantine", { width: 4680, fill: MID }),
            cell("Uncle says hardware store. Phone says 3km away. Both signals freeze until resolved.", { width: 4680, fill: "1E1E3E" }),
          ]}),
          new TableRow({ children: [
            cell("RC-2 Falsification", { width: 4680, fill: MID }),
            cell("The hardware store was closed that morning. The alibi is physically impossible.", { width: 4680, fill: "1E1E3E" }),
          ]}),
          new TableRow({ children: [
            cell("Cross-domain connections", { width: 4680, fill: MID }),
            cell("Cash withdrawal + phone anomalies + false location all hit the same time window.", { width: 4680, fill: "1E1E3E" }),
          ]}),
          new TableRow({ children: [
            cell("HCL hypothesis auto-generated", { width: 4680, fill: MID }),
            cell("Financial pressure + secret contacts + false alibi = shared structural cause.", { width: 4680, fill: "1E1E3E" }),
          ]}),
          new TableRow({ children: [
            cell("Evidence on hypothesis", { width: 4680, fill: MID }),
            cell("You add evidence that raises plausibility above 0.70.", { width: 4680, fill: "1E1E3E" }),
          ]}),
        ]
      }),

      pageBreak(),

      // ═══════════════════════════════════════════════════════════
      // BACKGROUND
      // ═══════════════════════════════════════════════════════════
      heading("Background"),
      body("Emma Carvalho, age 9, lives with her mother Ana and her mother's brother Ricardo in a small town. On a Tuesday morning, Emma leaves for school as normal. She never arrives. The school calls Ana at 9:15am."),
      body("Ricardo is a friendly man who has been staying with the family for three months. He says he went out for errands that morning. He seems cooperative with police."),
      body("What follows are the signals collected during the first 72 hours. Your job is to enter them into CIS one by one — and let CIS show you what a human investigator might miss."),

      divider(),

      // ═══════════════════════════════════════════════════════════
      // DOMAINS
      // ═══════════════════════════════════════════════════════════
      heading("Step 1 — Set Up Your Domains"),
      body("Create a new case in CIS, then go to Domains and add these four:"),
      new Paragraph({ spacing: { before: 160, after: 80 }, children: [] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3600, 5760],
        rows: [
          headerRow("Domain Name", "Description to type in CIS"),
          row2("Family Reports",       "What family members say they saw, did, or knew. Subject to recall bias and emotional state."),
          row2("Witness Accounts",     "What neighbours, passersby, and local residents observed independently."),
          row2("Phone & Digital",      "Call logs, cell tower pings, messages, and digital records. Objective — not based on memory."),
          row2("Financial Activity",   "Bank records, ATM withdrawals, transfers. Objective — timestamped and verifiable."),
        ]
      }),

      new Paragraph({ spacing: { before: 200, after: 80 }, children: [
        new TextRun({ text: "Why four domains?  ", color: GOLD, bold: true, size: 20, font: "Arial" }),
        new TextRun({ text: "Two are what people say (Family Reports, Witness Accounts). Two are what systems recorded (Phone & Digital, Financial Activity). The separation matters — if a pattern appears in both human accounts AND objective records, it is structurally harder to explain away.", color: "AAAAAA", size: 20, font: "Arial" }),
      ]}),

      // ═══════════════════════════════════════════════════════════
      // INDEPENDENCE
      // ═══════════════════════════════════════════════════════════
      heading("Step 2 — Declare Domain Independence", 2),
      body("Go to Domains → Independence. Mark these pairs as INDEPENDENT (they cannot influence each other):"),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3600, 5760],
        rows: [
          headerRow("Pair", "Why they are independent"),
          row2("Family Reports ↔ Phone & Digital",   "The family's memory of events cannot alter what the phone network recorded."),
          row2("Witness Accounts ↔ Phone & Digital",  "A neighbour's eyewitness account cannot change cell tower logs."),
          row2("Witness Accounts ↔ Financial Activity","A person walking their dog cannot alter bank transfer records."),
          row2("Family Reports ↔ Financial Activity",  "What the family says cannot change what the bank recorded."),
        ]
      }),

      pageBreak(),

      // ═══════════════════════════════════════════════════════════
      // SIGNALS TABLE
      // ═══════════════════════════════════════════════════════════
      heading("Step 3 — Enter These Signals (in order)"),
      body("Go to Observation Intake. Enter each signal exactly as written. The PERIOD is the time window — Period 1 = morning of disappearance, Period 2 = same day afternoon, Period 3 = days before disappearance."),
      new Paragraph({ spacing: { before: 140, after: 80 }, children: [] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [600, 1800, 600, 4200, 2160],
        rows: [
          // header
          new TableRow({ children: [
            cell("#",       { width: 600,  fill: DARK, isHeader: true, align: AlignmentType.CENTER }),
            cell("Domain",  { width: 1800, fill: DARK, isHeader: true }),
            cell("Period",  { width: 600,  fill: DARK, isHeader: true, align: AlignmentType.CENTER }),
            cell("Exact content to type",  { width: 4200, fill: DARK, isHeader: true }),
            cell("Why — what CIS feature this tests",  { width: 2160, fill: DARK, isHeader: true }),
          ]}),

          // S1
          signalRow("1", "Family Reports", "1",
            "Mother says Emma left for school at 8:15am as usual. She had breakfast, said goodbye, seemed completely normal. Nothing unusual about the morning.",
            "Baseline. Low SI. Tests whether CIS admits weak signals — it should, via WSP."),

          // S2
          signalRow("2", "Witness Accounts", "1",
            "Neighbour Maria Ferreira saw Emma walking toward the bus stop at around 8:20am. A dark blue car was parked near the corner with its engine running. She had never seen that car on this street before.",
            "Weak signal — a car. No crime yet. Tests LP-2: CIS must NOT expire this just because it seems unimportant."),

          // S3
          signalRow("3", "Phone & Digital", "1",
            "Emma's school marked her absent at 9:00am. No record of her entering through the school gate. The gate log shows no card scan for Emma that morning.",
            "Strong signal — she never arrived. High SI (rate + direction). Should be ADMITTED immediately."),

          // S4
          signalRow("4", "Family Reports", "2",
            "Uncle Ricardo says he left the house at 7:45am and was at the hardware store on Rua das Flores from around 8:00am to 10:00am buying supplies for a home repair job. He says he came home at 10:30am.",
            "Sets up the contradiction. Low SI on its own — it is just a statement. Watch what happens when Signal 5 arrives."),

          // S5 — contradiction signal
          signalRow("5", "Phone & Digital", "2",
            "Ricardo's mobile phone connected to cell tower CL-7 at 8:47am. Tower CL-7 is located 3km north of the hardware store on Rua das Flores. The hardware store is served by tower CL-3. Ricardo's phone did not ping CL-3 at any point that morning.",
            "CONTRADICTION with Signal 4. His phone was not where he said he was. Register this as a contradiction after entering it.",
            "2A1A1A"),

          // S6
          signalRow("6", "Financial Activity", "1",
            "Ricardo withdrew 500 euros cash from the ATM on Rua do Comercio at 7:58am — 17 minutes before Emma left for school. This is the largest single cash withdrawal from his account in 90 days.",
            "Same period as Signals 1 and 2. Different domain (Financial vs Family/Witness). Tests cross-domain temporal connection."),

          // S7
          signalRow("7", "Financial Activity", "3",
            "In the 10 days before Emma disappeared, Ricardo's bank account received three separate transfers totalling 2,200 euros. Each transfer came from a different account. None of the accounts match known family or employer contacts.",
            "Direction signal — money accumulating from unknown sources before the event. Tests SI direction dimension."),

          // S8
          signalRow("8", "Phone & Digital", "3",
            "Ricardo made 11 calls to the same number in the 4 days before Emma disappeared. The number is a prepaid SIM — not registered to any name. The number called Ricardo back twice. No other calls to this number appear in his records before this period.",
            "Pattern signal — sudden concentrated contact with anonymous number. Combined with Signal 7 (money) this should trigger HCL hypothesis."),

          // S9
          signalRow("9", "Witness Accounts", "2",
            "The owner of the hardware store on Rua das Flores confirmed the store was closed on the morning of the disappearance for a staff stocktaking day. Ricardo had visited the store the week before and would have seen the closed notice posted on the door.",
            "Resolves the contradiction via RC-2 (falsification). The alibi is physically impossible — the store was closed. Ricardo knew this.",
            "1A2A1A"),

          // S10
          signalRow("10", "Witness Accounts", "2",
            "A woman walking her dog on Estrada do Norte — near cell tower CL-7 — saw a dark blue car parked at the entrance to an old warehouse at around 8:45am. A man matching Ricardo's description was standing outside the car, looking at his phone.",
            "Corroborates Signal 5 (phone tower location) and connects to Signal 2 (same dark blue car, same morning). Raises HCL plausibility."),
        ]
      }),

      pageBreak(),

      // ═══════════════════════════════════════════════════════════
      // CONTRADICTION
      // ═══════════════════════════════════════════════════════════
      heading("Step 4 — Register the Contradiction"),
      body("After entering Signal 5, go to Contradictions → Register Contradiction. Fill in:"),
      new Paragraph({ spacing: { before: 140, after: 80 }, children: [] }),

      table2([
        headerRow("Field", "What to enter"),
        row2("Signal A", "Signal 4 — Ricardo says he was at the hardware store from 8:00am to 10:00am"),
        row2("Signal B", "Signal 5 — Ricardo's phone was at tower CL-7, 3km away, at 8:47am"),
        row2("Description", "Ricardo's stated location (hardware store, tower CL-3 area) is inconsistent with his phone's recorded location (tower CL-7, 3km north) at the same time. One asserts he was at the store; the other places him elsewhere."),
        row2("What happens", "Both signals move to QUARANTINED. Neither can expire. Dashboard shows 1 quarantined pair.", { rightFill: "1A1A2E" }),
      ]),

      new Paragraph({ spacing: { before: 280, after: 100 }, children: [
        new TextRun({ text: "Why quarantine?  ", color: GOLD, bold: true, size: 20, font: "Arial" }),
        new TextRun({ text: "A normal system would just pick the more convenient version and move on. CIS freezes both. You cannot lose either signal until you formally decide which one is valid — and you have to show your reasoning.", color: "AAAAAA", size: 20, font: "Arial" }),
      ]}),

      heading("Step 5 — Resolve the Contradiction (after entering Signal 9)", 2),
      body("Once you enter Signal 9 (store was closed), you have the evidence to resolve. Go to Contradictions → Resolve:"),
      new Paragraph({ spacing: { before: 140, after: 80 }, children: [] }),

      table2([
        headerRow("Field", "What to enter / select"),
        row2("Resolution type", "RC-2: Falsification — Signal 4 predicts Ricardo was at the hardware store. Signal 9 confirms the store was closed. The alibi is physically impossible."),
        row2("Resolution basis", "Hardware store owner confirmed the store was closed for stocktaking on the morning of the disappearance. Ricardo had visited the week before and would have seen the closure notice. His stated location is factually impossible."),
        row2("Accepted signal", "Signal B — the phone tower record (Signal 5). Objective cell tower data overrides a verbal statement that has been directly falsified."),
        row2("What happens", "Signal 4 (false alibi) is invalidated. Signal 5 (phone location) is released from quarantine back to ADMITTED. Quarantine count drops to zero.", { rightFill: "1A2A1A" }),
      ]),

      pageBreak(),

      // ═══════════════════════════════════════════════════════════
      // AUTOMATIC BEHAVIOUR
      // ═══════════════════════════════════════════════════════════
      heading("Step 6 — Check What CIS Did Automatically"),
      body("By the time you have entered all 10 signals, CIS should have done these things without you asking. Verify each one:"),
      new Paragraph({ spacing: { before: 140, after: 80 }, children: [] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3600, 5760],
        rows: [
          headerRow("What to look for", "Where to check and what you should see"),
          row2("Signal 2 still alive (WSP)", "Open Observations → ALL. Signal 2 (the parked car) should still be there, even though it seems minor. Look for the WSP badge. CIS kept it because it scored above SI_min.", { leftBold: true }),
          row2("Signal 2 + Signal 10 connected", "Open Observations → ALL. Both the Signal 2 car and the Signal 10 car sighting should show CONNECTED status — same domain (Witness), same period (2), same observation (dark blue car).", { leftBold: true }),
          row2("Signal 5 + Signal 8 connected", "Phone & Digital domain, different periods but same structural pattern — phone anomalies. Look for CONNECTED on both.", { leftBold: true }),
          row2("Signal 6 + Signal 7 connected", "Financial Activity signals from different periods accumulating in the same direction. Should connect.", { leftBold: true }),
          row2("HCL hypothesis generated", "Go to Hypotheses. Look for an automatically generated hypothesis linking the Financial Activity and Phone & Digital domains. It should say something about a shared structural cause.", { leftBold: true }),
          row2("HCL plausibility rises with evidence", "After you add evidence (Step 7), check the plausibility number. It should climb above 0.50 and eventually above 0.70.", { leftBold: true }),
          row2("LP-3 not firing", "Dashboard LP Flags panel should be empty (or not show LP-3). You declared independence, so cross-domain signals are expected — CIS should not flag them as isolated.", { leftBold: true }),
        ]
      }),

      pageBreak(),

      // ═══════════════════════════════════════════════════════════
      // EVIDENCE
      // ═══════════════════════════════════════════════════════════
      heading("Step 7 — Add Evidence to the HCL Hypothesis"),
      body("Go to Hypotheses. Click on the HCL hypothesis CIS generated. Add the following pieces of evidence one by one:"),
      new Paragraph({ spacing: { before: 140, after: 80 }, children: [] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [600, 2400, 1200, 5160],
        rows: [
          new TableRow({ children: [
            cell("#",    { width: 600,  fill: DARK, isHeader: true }),
            cell("Type", { width: 2400, fill: DARK, isHeader: true }),
            cell("Weight", { width: 1200, fill: DARK, isHeader: true }),
            cell("Evidence content to type", { width: 5160, fill: DARK, isHeader: true }),
          ]}),
          new TableRow({ children: [
            cell("E1", { width: 600,  fill: DARK }),
            cell("SUPPORTING", { width: 2400, fill: MID, colour: GREEN }),
            cell("0.75",       { width: 1200, fill: MID, align: AlignmentType.CENTER }),
            cell("Phone records show 11 calls to an unregistered prepaid number in 4 days. The same pattern — high-frequency contact with unregistered numbers — appears in documented ransom negotiation cases.",
              { width: 5160, fill: "1A2A1A" }),
          ]}),
          new TableRow({ children: [
            cell("E2", { width: 600,  fill: DARK }),
            cell("SUPPORTING", { width: 2400, fill: MID, colour: GREEN }),
            cell("0.80",       { width: 1200, fill: MID, align: AlignmentType.CENTER }),
            cell("Three anonymous transfers totalling 2,200 euros arrived in the 10 days before the disappearance. The timing and structure is consistent with advance payment for a planned action.",
              { width: 5160, fill: "1A2A1A" }),
          ]}),
          new TableRow({ children: [
            cell("E3", { width: 600,  fill: DARK }),
            cell("SUPPORTING", { width: 2400, fill: MID, colour: GREEN }),
            cell("0.85",       { width: 1200, fill: MID, align: AlignmentType.CENTER }),
            cell("Ricardo's phone placed him at Estrada do Norte warehouse at 8:47am. Witness placed a man matching Ricardo's description at the same location at the same time. Two independent sources confirm the same location.",
              { width: 5160, fill: "1A2A1A" }),
          ]}),
          new TableRow({ children: [
            cell("E4", { width: 600,  fill: DARK }),
            cell("SUPPORTING", { width: 2400, fill: MID, colour: GREEN }),
            cell("0.70",       { width: 1200, fill: MID, align: AlignmentType.CENTER }),
            cell("Ricardo gave a false alibi that required him to be at a location that was verifiably closed. This is not a memory error — he had visited the store the week before. The alibi was constructed, not misremembered.",
              { width: 5160, fill: "1A2A1A" }),
          ]}),
        ]
      }),

      new Paragraph({ spacing: { before: 280, after: 100 }, children: [
        new TextRun({ text: "After adding E3 and E4:  ", color: GOLD, bold: true, size: 20, font: "Arial" }),
        new TextRun({ text: "Check the plausibility number on the hypothesis card. It should be above 0.70. This is what CIS calls a hypothesis that warrants formal investigation action — not a conclusion, but a structured claim with enough corroboration to act on.", color: "AAAAAA", size: 20, font: "Arial" }),
      ]}),

      pageBreak(),

      // ═══════════════════════════════════════════════════════════
      // BRIEFING
      // ═══════════════════════════════════════════════════════════
      heading("Step 8 — Generate a Cognitive Briefing"),
      body("Go to Briefing → Generate New. CIS will write a structured summary of the entire investigation so far. Check that the briefing contains:"),
      new Paragraph({ spacing: { before: 140, after: 80 }, children: [] }),

      table2([
        headerRow("What should appear", "What it means"),
        row2("Active signals section", "Signals 2, 3, 5, 6, 7, 8, 9, 10 listed as active — these are the signals that survived."),
        row2("Quarantined section", "May show the resolved contradiction — CIS records that a contradiction existed and was resolved."),
        row2("Active hypotheses", "The HCL hypothesis with plausibility above 0.70 and the supporting evidence you added."),
        row2("Open questions", "Any signals with SI >= 0.5 that are not yet covered by a confirmed hypothesis. Signal 2 (the car) may appear here as an unresolved observation."),
        row2("LP flags", "Should be empty or show only LP-1 for signals that genuinely expired early on. LP-3 should NOT appear because you declared independence."),
      ]),

      new Paragraph({ spacing: { before: 280, after: 100 }, children: [
        new TextRun({ text: "This briefing is what you would hand to a senior investigator.  ", color: GOLD, bold: true, size: 20, font: "Arial" }),
        new TextRun({ text: "It shows the full picture in one document: what was observed, what contradicted what, what hypothesis the evidence points toward, and what remains unexplained.", color: "AAAAAA", size: 20, font: "Arial" }),
      ]}),

      divider(),

      // ═══════════════════════════════════════════════════════════
      // WHAT CIS FOUND
      // ═══════════════════════════════════════════════════════════
      heading("What CIS Found (The Answer)"),
      body("You do not need to read this until you have completed all 8 steps. It is here so you can check your work."),
      new Paragraph({ spacing: { before: 180, after: 80 }, children: [] }),

      table2([
        headerRow("CIS Finding", "Plain English Meaning"),
        row2("HCL hypothesis confirmed above 0.70",
          "The financial transfers, secret phone calls, false alibi, and wrong location all share a structural cause. They are not coincidences in separate parts of Ricardo's life. They point to a single coordinated plan."),
        row2("Signal 2 preserved by WSP",
          "The parked car — which looked like nothing — turns out to be the same car seen at the warehouse. CIS kept this signal when a normal review might have dismissed it as irrelevant."),
        row2("Contradiction resolved RC-2",
          "Ricardo did not simply misremember. The store was closed. The alibi required him to be somewhere he could not have been. CIS forced this to be formally resolved rather than left as 'his word against the record.'"),
        row2("Cross-domain connections formed",
          "The money and the phone calls hit the same time window across independent domains. CIS connected these automatically. A human reviewer working through reports one domain at a time might not have seen the overlap."),
        row2("What CIS cannot say",
          "CIS does not say Ricardo took Emma. It says the structural evidence points to a shared cause with high plausibility. That is for investigators to act on — CIS gives you the structured picture, not the verdict."),
      ]),

      pageBreak(),

      // ═══════════════════════════════════════════════════════════
      // QUICK REFERENCE
      // ═══════════════════════════════════════════════════════════
      heading("Quick Reference: CIS Features You Practised"),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2400, 6960],
        rows: [
          new TableRow({ children: [
            cell("CIS Feature",   { width: 2400, fill: DARK, isHeader: true }),
            cell("What you did and what it meant", { width: 6960, fill: DARK, isHeader: true }),
          ]}),
          new TableRow({ children: [
            cell("Signal Intake", { width: 2400, fill: MID }),
            cell("Entered 10 observations across 4 domains and 3 time periods. Each one was scored automatically.", { width: 6960, fill: "1E1E3E" }),
          ]}),
          new TableRow({ children: [
            cell("WSP", { width: 2400, fill: MID }),
            cell("Signal 2 (parked car) was a weak signal. CIS kept it alive because it crossed the SI_min threshold. It later connected to Signal 10.", { width: 6960, fill: "1E1E3E" }),
          ]}),
          new TableRow({ children: [
            cell("Contradiction + Quarantine", { width: 2400, fill: MID }),
            cell("Signals 4 and 5 contradicted each other. Both were frozen. Neither could expire until you formally decided which was valid.", { width: 6960, fill: "1E1E3E" }),
          ]}),
          new TableRow({ children: [
            cell("RC-2 Falsification", { width: 2400, fill: MID }),
            cell("You resolved the contradiction by falsification — the alibi was physically impossible. You stated your basis explicitly, not just 'I don't believe him.'", { width: 6960, fill: "1E1E3E" }),
          ]}),
          new TableRow({ children: [
            cell("Cross-domain connections", { width: 2400, fill: MID }),
            cell("Signals from Phone & Digital and Financial Activity connected automatically because they shared temporal and structural properties across independent domains.", { width: 6960, fill: "1E1E3E" }),
          ]}),
          new TableRow({ children: [
            cell("SHG / HCL hypothesis", { width: 2400, fill: MID }),
            cell("CIS generated a Hidden Common Link hypothesis automatically when enough connections formed. You did not write the hypothesis — CIS proposed it from the pattern.", { width: 6960, fill: "1E1E3E" }),
          ]}),
          new TableRow({ children: [
            cell("Evidence addition", { width: 2400, fill: MID }),
            cell("You added 4 pieces of supporting evidence to the HCL hypothesis. Each one raised the plausibility score. At 0.70+ the hypothesis is formally actionable.", { width: 6960, fill: "1E1E3E" }),
          ]}),
          new TableRow({ children: [
            cell("Cognitive Briefing", { width: 2400, fill: MID }),
            cell("You generated a structured briefing that assembled everything CIS learned into one readable document for a senior investigator.", { width: 6960, fill: "1E1E3E" }),
          ]}),
          new TableRow({ children: [
            cell("Domain Independence", { width: 2400, fill: MID }),
            cell("You declared that human accounts and objective records are independent. This prevented LP-3 (domain isolation) from firing and allowed cross-domain connections to be treated as structurally significant.", { width: 6960, fill: "1E1E3E" }),
          ]}),
        ]
      }),

    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("C:\\cis\\CIS_Kidnapping_Case.docx", buf);
  console.log("Done: C:\\cis\\CIS_Kidnapping_Case.docx");
});
