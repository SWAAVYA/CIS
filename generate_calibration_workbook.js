const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  ExternalHyperlink, TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

// ─── Colours ───────────────────────────────────────────────────────────────
const C = {
  navy:      '1B3A5C',
  mid:       '2E6DA4',
  light:     'D0E4F4',
  xlight:    'EBF4FC',
  green:     '1A6B3C',
  greenBg:   'D6F0E0',
  amber:     '7B4F00',
  amberBg:   'FFF3CD',
  red:       '8B1A1A',
  redBg:     'FCE4E4',
  grey:      '555555',
  greyBg:    'F2F2F2',
  white:     'FFFFFF',
};

// ─── Borders ───────────────────────────────────────────────────────────────
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders    = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const noBorder   = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders  = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

// ─── Helpers ───────────────────────────────────────────────────────────────
const sp = (before = 0, after = 0) => ({ spacing: { before, after } });
const indent = (left, hanging) => ({ indent: { left, hanging } });

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    ...sp(320, 160),
    children: [new TextRun({ text, bold: true, size: 36, color: C.navy, font: 'Arial' })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    ...sp(280, 120),
    children: [new TextRun({ text, bold: true, size: 28, color: C.mid, font: 'Arial' })],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    ...sp(200, 80),
    children: [new TextRun({ text, bold: true, size: 24, color: C.navy, font: 'Arial' })],
  });
}
function para(text, opts = {}) {
  return new Paragraph({
    ...sp(60, 60),
    children: [new TextRun({ text, size: 22, font: 'Arial', color: C.grey, ...opts })],
  });
}
function bold(text) { return new TextRun({ text, bold: true, size: 22, font: 'Arial', color: C.grey }); }
function norm(text) { return new TextRun({ text, size: 22, font: 'Arial', color: C.grey }); }
function mono(text) { return new TextRun({ text, size: 20, font: 'Courier New', color: C.navy }); }

function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }

function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.mid, space: 4 } },
    ...sp(120, 120),
    children: [],
  });
}

function callout(text, type = 'info') {
  // type: info | tip | warn | ok | bad
  const map = {
    info: { bg: C.xlight, border: C.mid,   label: 'ℹ️  NOTE' },
    tip:  { bg: C.greenBg, border: C.green, label: '💡 TIP' },
    warn: { bg: C.amberBg, border: C.amber, label: '⚠️  IMPORTANT' },
    ok:   { bg: C.greenBg, border: C.green, label: '✓  EXPECTED' },
    bad:  { bg: C.redBg,   border: C.red,   label: '✗  WATCH' },
  };
  const s = map[type];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 8, color: s.border },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: s.border },
        left:   { style: BorderStyle.SINGLE, size: 8, color: s.border },
        right:  { style: BorderStyle.SINGLE, size: 1, color: s.border },
      },
      shading: { fill: s.bg, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      children: [
        new Paragraph({ children: [new TextRun({ text: s.label, bold: true, size: 20, font: 'Arial', color: s.border })], ...sp(0,40) }),
        new Paragraph({ children: [norm(text)], ...sp(0,0) }),
      ],
    })]})],
  });
}

function emptyRow(cols) {
  return new TableRow({ children: cols.map(w => new TableCell({
    borders,
    width: { size: w, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [norm(' ')] })],
  })) });
}

// Cell with background
function hdrCell(text, width, bg = C.navy, fg = C.white) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 20, font: 'Arial', color: fg })] })],
  });
}
function dataCell(text, width, bg = C.white, opts = {}) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: 'Arial', color: C.grey, ...opts })] })],
  });
}

// ─── Signal Entry Table ────────────────────────────────────────────────────
// cols: [{ signal, domain, language, expected, dimensions, notes }]
function signalTable(rows) {
  // widths: signal 2900, domain 1000, lang 700, expected 900, dims 1700, notes 2160 = 9360
  const W = [2900, 1000, 700, 900, 1700, 2160];
  const header = new TableRow({
    tableHeader: true,
    children: [
      hdrCell('Signal Text to Enter', W[0]),
      hdrCell('Domain', W[1]),
      hdrCell('Language', W[2]),
      hdrCell('Expected', W[3]),
      hdrCell('SI Dimensions', W[4]),
      hdrCell('Notes / What to Check', W[5]),
    ],
  });

  const dataRows = rows.map(r => {
    const expBg = r.expected === 'ADMIT' ? C.greenBg : r.expected === 'EXPIRE' ? C.redBg : C.amberBg;
    const expFg = r.expected === 'ADMIT' ? C.green   : r.expected === 'EXPIRE' ? C.red   : C.amber;
    return new TableRow({ children: [
      dataCell(r.signal,    W[0]),
      dataCell(r.domain,    W[1]),
      dataCell(r.language,  W[2], C.greyBg),
      new TableCell({
        borders,
        width: { size: W[3], type: WidthType.DXA },
        shading: { fill: expBg, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: r.expected, bold: true, size: 20, font: 'Arial', color: expFg })] })],
      }),
      dataCell(r.dims,      W[4], C.xlight),
      dataCell(r.notes,     W[5]),
    ]});
  });

  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: W, rows: [header, ...dataRows] });
}

// ─── Contradiction Table ───────────────────────────────────────────────────
function contradictionTable(rows) {
  const W = [3000, 3000, 1560, 1800];
  const header = new TableRow({ tableHeader: true, children: [
    hdrCell('Signal A', W[0]), hdrCell('Signal B', W[1]),
    hdrCell('Expected Outcome', W[2]), hdrCell('Your Observation', W[3]),
  ]});
  const dataRows = rows.map(r => new TableRow({ children: [
    dataCell(r.a, W[0]), dataCell(r.b, W[1]),
    dataCell(r.expected, W[2], C.amberBg), dataCell('', W[3]),
  ]}));
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: W, rows: [header, ...dataRows] });
}

// ─── Checklist Table ──────────────────────────────────────────────────────
function checklistTable(rows) {
  const W = [600, 5000, 3760];
  const header = new TableRow({ tableHeader: true, children: [
    hdrCell('', W[0]), hdrCell('What to Check', W[1]), hdrCell('What You See / Notes', W[2]),
  ]});
  const dataRows = rows.map(r => new TableRow({ children: [
    dataCell('☐', W[0], C.light),
    dataCell(r.check, W[1]),
    dataCell('', W[2]),
  ]}));
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: W, rows: [header, ...dataRows] });
}

// ─── UI Page Table ────────────────────────────────────────────────────────
function uiTable(rows) {
  const W = [2000, 4000, 1680, 1680];
  const header = new TableRow({ tableHeader: true, children: [
    hdrCell('Page / Feature', W[0]), hdrCell('Expected Behaviour', W[1]),
    hdrCell('✓ / ✗ / ?', W[2]), hdrCell('Notes', W[3]),
  ]});
  const dataRows = rows.map((r, i) => new TableRow({ children: [
    dataCell(r.page,     W[0], i % 2 === 0 ? C.xlight : C.white),
    dataCell(r.expected, W[1]),
    dataCell('', W[2]),
    dataCell('', W[3]),
  ]}));
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: W, rows: [header, ...dataRows] });
}

// ─── Title Page ───────────────────────────────────────────────────────────
function titlePage() {
  return [
    new Paragraph({ ...sp(1440, 0), children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      ...sp(0, 80),
      children: [new TextRun({ text: 'CIS', bold: true, size: 80, font: 'Arial', color: C.navy })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      ...sp(0, 40),
      children: [new TextRun({ text: 'Cognitive Intelligence System', size: 28, font: 'Arial', color: C.mid })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.mid, space: 4 } },
      ...sp(0, 240),
      children: [],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      ...sp(240, 80),
      children: [new TextRun({ text: 'CALIBRATION WORKBOOK', bold: true, size: 52, font: 'Arial', color: C.navy })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      ...sp(0, 160),
      children: [new TextRun({ text: 'Signal Admission · SI Scoring · UI Experience Review', size: 24, font: 'Arial', color: C.grey })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      ...sp(80, 40),
      children: [new TextRun({ text: 'Version 1.0  ·  June 2026', size: 22, font: 'Arial', color: C.grey })],
    }),
    new Paragraph({ ...sp(600, 0), children: [] }),
    new Table({
      width: { size: 9360, type: WidthType.DXA }, columnWidths: [4680, 4680],
      rows: [
        new TableRow({ children: [
          new TableCell({ borders: noBorders, shading: { fill: C.xlight, type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 200, right: 200 },
            children: [new Paragraph({ children: [new TextRun({ text: 'Purpose', bold: true, size: 22, font: 'Arial', color: C.navy })] }),
                       new Paragraph({ children: [norm('Test signal admission across 5 domains. Calibrate SI thresholds. Identify UI gaps.')] })] }),
          new TableCell({ borders: noBorders, shading: { fill: C.xlight, type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 200, right: 200 },
            children: [new Paragraph({ children: [new TextRun({ text: 'Cases', bold: true, size: 22, font: 'Arial', color: C.navy })] }),
                       new Paragraph({ children: [norm('Financial Fraud · Data Leak · Medical · Missing Person · Organized Crime')] })] }),
        ]}),
      ],
    }),
    pageBreak(),
  ];
}

// ─── How to Use Section ───────────────────────────────────────────────────
function howToUse() {
  return [
    h1('How to Use This Workbook'),
    para('This workbook gives you five pre-built investigation cases with signal data already written. For each case you will:'),
    new Paragraph({ ...sp(60, 0), numbering: { reference: 'numbers', level: 0 }, children: [norm('Create a new CIS case with the given domains.')] }),
    new Paragraph({ ...sp(0, 0),  numbering: { reference: 'numbers', level: 0 }, children: [norm('Enter each signal exactly as written (or close to it).')] }),
    new Paragraph({ ...sp(0, 0),  numbering: { reference: 'numbers', level: 0 }, children: [norm('Check whether CIS admits or expires it against the Expected column.')] }),
    new Paragraph({ ...sp(0, 0),  numbering: { reference: 'numbers', level: 0 }, children: [norm('Register contradictions where indicated, then verify the Hypothesis Board.')] }),
    new Paragraph({ ...sp(0, 60), numbering: { reference: 'numbers', level: 0 }, children: [norm('Fill in your observations and any calibration notes at the end of each step.')] }),
    new Paragraph({ ...sp(80, 0), children: [] }),
    callout('The Expected column (ADMIT / EXPIRE / BORDERLINE) shows what CIS should do. If it does something different, note it — that is calibration data.', 'warn'),
    new Paragraph({ ...sp(120, 0), children: [] }),
    h2('Signal Language Key'),
    new Table({
      width: { size: 9360, type: WidthType.DXA }, columnWidths: [1800, 5760, 1800],
      rows: [
        new TableRow({ tableHeader: true, children: [hdrCell('Tag', 1800), hdrCell('Meaning', 5760), hdrCell('Example', 1800)] }),
        new TableRow({ children: [dataCell('Plain', 1800, C.greenBg), dataCell('Everyday spoken language — as a witness or colleague would say it', 5760), dataCell('"she never showed up"', 1800)] }),
        new TableRow({ children: [dataCell('Technical', 1800, C.amberBg), dataCell('Domain-specific terminology — as a specialist would write it', 5760), dataCell('"Hb 9.2 g/dL, -2.3 below nadir"', 1800)] }),
        new TableRow({ children: [dataCell('Mixed', 1800, C.xlight), dataCell('Combination — technical data with plain-language context', 5760), dataCell('"3,640 kg overweight — about 25% above what they declared"', 1800)] }),
      ],
    }),
    new Paragraph({ ...sp(120, 0), children: [] }),
    h2('SI Dimension Quick Reference'),
    new Table({
      width: { size: 9360, type: WidthType.DXA }, columnWidths: [1400, 1200, 4560, 2200],
      rows: [
        new TableRow({ tableHeader: true, children: [hdrCell('Dimension', 1400), hdrCell('Weight', 1200), hdrCell('What it means', 4560), hdrCell('Threshold', 2200)] }),
        new TableRow({ children: [dataCell('Rate', 1400, C.xlight), dataCell('0.20', 1200), dataCell('Level/magnitude/amount is wrong — too high, too low, absent, out of place', 4560), dataCell('Any single dim ≥ 0.35 → ADMIT', 2200, C.greenBg)] }),
        new TableRow({ children: [dataCell('Direction', 1400, C.xlight), dataCell('0.20', 1200), dataCell('Pattern keeps repeating or accumulating in one direction over time', 4560), dataCell('Weighted SI ≥ 0.25 → ADMIT', 2200, C.greenBg)] }),
        new TableRow({ children: [dataCell('Relationship', 1400, C.xlight), dataCell('0.25', 1200), dataCell('Two sources that should agree are contradicting each other', 4560), dataCell('SI < 0.25 AND no dim ≥ 0.35 → EXPIRE', 2200, C.redBg)] }),
        new TableRow({ children: [dataCell('Configuration', 1400, C.xlight), dataCell('0.35', 1200), dataCell('Multiple independent things pointing at the same anomaly simultaneously', 4560), dataCell('', 2200)] }),
      ],
    }),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// CASE 1 — FINANCIAL FRAUD
// ═══════════════════════════════════════════════════════════════════════════
function case1() {
  return [
    h1('Case 1 — The Meridian Account'),
    new Table({
      width: { size: 9360, type: WidthType.DXA }, columnWidths: [2000, 7360],
      rows: [
        new TableRow({ children: [hdrCell('Domain', 2000), hdrCell('Corporate Finance / Internal Audit', 7360, C.light, C.navy)] }),
        new TableRow({ children: [dataCell('Situation', 2000, C.greyBg), dataCell('A mid-size logistics firm. The CFO flagged irregularities in outgoing transfers during a routine quarterly review. Internal audit has been asked to investigate before escalating to external authorities. No conclusions have been reached.', 7360)] }),
        new TableRow({ children: [dataCell('Domains to create', 2000, C.greyBg), dataCell('Finance Transactions · Employee Access · Supplier Registry · Management Reports', 7360)] }),
        new TableRow({ children: [dataCell('Observation period', 2000, C.greyBg), dataCell('Use period 1 for March data, period 2 for April data', 7360)] }),
      ],
    }),
    new Paragraph({ ...sp(160, 0), children: [] }),
    h2('Step 1 — Enter Signals'),
    signalTable([
      {
        signal: 'Three outgoing transfers totalling €47,000 processed to vendor code MRD-991 between 14 March and 2 April — vendor code does not appear in the approved supplier register.',
        domain: 'Finance Transactions', language: 'Mixed',
        expected: 'ADMIT', dims: 'Direction ↑ · Relationship ↑',
        notes: 'Should flag repeated transfers + mismatch with registry. Check if both direction and relationship score.',
      },
      {
        signal: 'Monthly payroll variance for March: +2.3% above forecast, within acceptable tolerance band of ±5%. No anomalous line items identified.',
        domain: 'Management Reports', language: 'Technical',
        expected: 'EXPIRE', dims: 'None — within tolerance',
        notes: 'Should NOT be admitted. Tests whether "within tolerance" correctly suppresses SI.',
      },
      {
        signal: 'Vendor MRD-991 bank account was registered with the payment system 6 days before the first transfer was authorised. No invoice on file.',
        domain: 'Supplier Registry', language: 'Mixed',
        expected: 'ADMIT', dims: 'Rate ↑ · Relationship ↑',
        notes: 'New vendor + no invoice = strong structural incongruence. Should score rate and relationship.',
      },
      {
        signal: 'Finance system login from user account DK-004 at 02:14 on 22 March. No scheduled maintenance window. Normal working hours for this role are 08:00–18:00.',
        domain: 'Employee Access', language: 'Technical',
        expected: 'ADMIT', dims: 'Rate ↑',
        notes: 'After-hours access outside expected window. Should score rate clearly.',
      },
      {
        signal: 'The IP address used to create the MRD-991 vendor record is the same IP address that approved the first transfer to that vendor.',
        domain: 'Employee Access', language: 'Plain',
        expected: 'ADMIT', dims: 'Configuration ↑ · Relationship ↑',
        notes: 'Same actor for creation and approval — segregation of duties violation. Strong configuration signal.',
      },
      {
        signal: 'Annual external audit completed last month — auditors issued a clean opinion with no material findings.',
        domain: 'Management Reports', language: 'Technical',
        expected: 'EXPIRE', dims: 'None',
        notes: 'Should expire — "no material findings" and "clean opinion" are stability markers.',
      },
      {
        signal: 'Employee submitted expense claim for €890 covering three days of business travel — amount is consistent with company policy limits and supported by receipts.',
        domain: 'Finance Transactions', language: 'Plain',
        expected: 'EXPIRE', dims: 'None',
        notes: 'Routine expense within policy. Should be rejected cleanly.',
      },
      {
        signal: 'User DK-004 searched the supplier payment module for the MRD-991 records four separate times in the week after the third transfer — no edits made, records only viewed.',
        domain: 'Employee Access', language: 'Mixed',
        expected: 'ADMIT', dims: 'Direction ↑ · Configuration ↑',
        notes: 'Repeated access to the specific vendor post-transfer suggests awareness. Direction + configuration.',
      },
    ]),
    new Paragraph({ ...sp(160, 0), children: [] }),
    h2('Step 2 — Register Contradiction'),
    para('Go to the Contradiction Ledger and register the following:'),
    contradictionTable([
      {
        a: 'Vendor MRD-991 bank account registered 6 days before first transfer — no invoice on file.',
        b: 'Annual external audit completed — auditors issued a clean opinion with no material findings.',
        expected: 'Both quarantined. Hypothesis generated: audit failure or deliberate concealment (RC-2 Falsification).',
      },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),
    h2('Step 3 — Verify Automated Behaviours'),
    checklistTable([
      { check: 'Open Observations → ALL: signals 1, 3, 4, 5, 8 show ADMITTED or RETAINED. Signals 2, 6, 7 show EXPIRED.' },
      { check: 'Open Observations → ALL: check SI scores. Signals 2, 6, 7 should show SI ≈ 0.00. Signals 1, 3, 5 should show SI > 0.25.' },
      { check: 'Contradiction Ledger: both contradicting signals now show as QUARANTINED.' },
      { check: 'Hypothesis Board: at least one hypothesis generated linking the MRD-991 vendor creation and the transfer approvals.' },
      { check: 'SHG Connections: signals 1, 3, 5, 8 should form cross-domain connections (Finance ↔ Employee Access) if temporal periods match.' },
      { check: 'Cognitive Briefing: summary mentions Finance and Employee Access domains. Shows ADMITTED count ≥ 4.' },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),
    callout('Calibration Note: If signal 8 (repeated searches) does not admit, the direction keywords may not capture "four separate times" or "week after". Note the exact SI score returned.', 'warn'),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// CASE 2 — DATA LEAK
// ═══════════════════════════════════════════════════════════════════════════
function case2() {
  return [
    h1('Case 2 — The Helix Breach'),
    new Table({
      width: { size: 9360, type: WidthType.DXA }, columnWidths: [2000, 7360],
      rows: [
        new TableRow({ children: [hdrCell('Domain', 2000), hdrCell('IT Security / Insider Threat', 7360, C.light, C.navy)] }),
        new TableRow({ children: [dataCell('Situation', 2000, C.greyBg), dataCell('A software company noticed unusual network activity. A DLP (Data Loss Prevention) alert was raised. The company suspects an employee may have exfiltrated proprietary client data before resigning. The employee\'s name is Daniel Ferreira. No formal accusation has been made.', 7360)] }),
        new TableRow({ children: [dataCell('Domains to create', 2000, C.greyBg), dataCell('Network Logs · Physical Access · User Behaviour · HR Records', 7360)] }),
        new TableRow({ children: [dataCell('Observation period', 2000, C.greyBg), dataCell('Period 1 = the 72h window before the alert. Period 2 = the alert night. Period 3 = following week.', 7360)] }),
      ],
    }),
    new Paragraph({ ...sp(160, 0), children: [] }),
    h2('Step 1 — Enter Signals'),
    signalTable([
      {
        signal: 'DLP alert: 847MB compressed archive uploaded to a personal Dropbox account from workstation HX-204 at 23:47 on 4 May. File was named "client_db_backup_FINAL.zip".',
        domain: 'Network Logs', language: 'Technical',
        expected: 'ADMIT', dims: 'Rate ↑ · Relationship ↑',
        notes: 'Large upload, suspicious filename, after hours. Strong rate signal. Should admit clearly.',
      },
      {
        signal: 'Network traffic analysis shows outbound data volume from subnet 192.168.4.0/24 increased by 340% over the 72-hour window prior to the alert. Baseline: 1.2 GB/day. Observed: 4.1 GB/day across three consecutive days.',
        domain: 'Network Logs', language: 'Technical',
        expected: 'ADMIT', dims: 'Rate ↑ · Direction ↑',
        notes: 'Rate deviation + directional accumulation over time. Both dimensions should fire strongly.',
      },
      {
        signal: 'Badge access record: Daniel Ferreira entered the server room at 23:31 on 4 May — 16 minutes before the DLP alert triggered on workstation HX-204.',
        domain: 'Physical Access', language: 'Mixed',
        expected: 'ADMIT', dims: 'Configuration ↑ · Relationship ↑',
        notes: 'Physical location matches digital event window. Strong configuration — two independent systems, same anomaly.',
      },
      {
        signal: 'The security camera covering server room corridor 3B was offline for scheduled maintenance between 22:00 and 00:30 on 4 May — covering exactly the period of the badge access.',
        domain: 'Physical Access', language: 'Mixed',
        expected: 'ADMIT', dims: 'Rate ↑ · Relationship ↑',
        notes: 'Camera outage coincides exactly with suspicious access. Relationship between expected monitoring and its absence.',
      },
      {
        signal: 'Ferreira searched the internal knowledge base for "client database schema", "export stored procedures", and "backup encryption bypass" on 11 separate occasions over the past three weeks.',
        domain: 'User Behaviour', language: 'Mixed',
        expected: 'ADMIT', dims: 'Direction ↑ · Rate ↑',
        notes: '11 searches, accumulating over time, escalating specificity. Direction should score strongly.',
      },
      {
        signal: 'Standard automated vulnerability scan completed on workstation HX-204 four days before the incident — scan returned no critical or high-severity findings.',
        domain: 'Network Logs', language: 'Technical',
        expected: 'EXPIRE', dims: 'None',
        notes: '"No findings" — should suppress SI. Tests that clean scans do not generate false admissions.',
      },
      {
        signal: 'HR file shows Ferreira\'s last quarterly performance review was rated "meets expectations" in all technical competencies. No disciplinary history on record.',
        domain: 'HR Records', language: 'Plain',
        expected: 'EXPIRE', dims: 'None',
        notes: '"Meets expectations", no history — routine baseline, should expire.',
      },
      {
        signal: 'Ferreira submitted his resignation letter at 09:12 on 5 May — the morning after the DLP alert. Notice period: 4 weeks.',
        domain: 'HR Records', language: 'Plain',
        expected: 'ADMIT', dims: 'Configuration ↑ · Relationship ↑',
        notes: 'Resignation the morning after the breach — temporal coincidence is a strong configuration marker.',
      },
    ]),
    new Paragraph({ ...sp(160, 0), children: [] }),
    h2('Step 2 — Register Contradiction'),
    contradictionTable([
      {
        a: 'Security camera on corridor 3B offline for maintenance between 22:00 and 00:30 on 4 May.',
        b: 'DLP alert: 847MB uploaded from workstation HX-204 at 23:47 on 4 May.',
        expected: 'Both quarantined. Hypothesis: deliberate exploitation of monitoring gap (RC-2 / Configuration).',
      },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),
    h2('Step 3 — Verify Automated Behaviours'),
    checklistTable([
      { check: 'Signals 1, 2, 3, 4, 5, 8 admitted. Signals 6, 7 expired.' },
      { check: 'Signal 2 SI score: Rate and Direction should both be high (≥ 0.6). Weighted SI should comfortably exceed 0.25.' },
      { check: 'Signals 3 and 4 (Physical Access) should connect via SHG — same observation period, same domain, corroborating anomaly.' },
      { check: 'Signal 8 (resignation) should connect with signals 1 or 3 via cross-domain (HR ↔ Network / Physical).' },
      { check: 'Hypothesis Board: expects hypothesis linking physical access, network exfiltration, and resignation timing.' },
      { check: 'Cognitive Briefing: mentions Network and Physical Access domains. States number of admitted signals.' },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),
    callout('Calibration Note: Signal 4 (camera offline) tests whether CIS admits signals about the ABSENCE of monitoring rather than a direct anomaly. If it expires, the relationship keywords around "offline" and coincidence may need strengthening.', 'warn'),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// CASE 3 — MEDICAL
// ═══════════════════════════════════════════════════════════════════════════
function case3() {
  return [
    h1('Case 3 — Patient 7-North'),
    new Table({
      width: { size: 9360, type: WidthType.DXA }, columnWidths: [2000, 7360],
      rows: [
        new TableRow({ children: [hdrCell('Domain', 2000), hdrCell('Clinical / Post-Operative Ward', 7360, C.light, C.navy)] }),
        new TableRow({ children: [dataCell('Situation', 2000, C.greyBg), dataCell('A 54-year-old male patient underwent a routine laparoscopic cholecystectomy (gallbladder removal). The procedure was described by the surgeon as uncomplicated. Six hours post-op, the ward team noticed the patient was declining. No official explanation has been agreed.', 7360)] }),
        new TableRow({ children: [dataCell('Domains to create', 2000, C.greyBg), dataCell('Lab Results · Vital Signs · Nursing Observations · Surgical Notes', 7360)] }),
        new TableRow({ children: [dataCell('Observation period', 2000, C.greyBg), dataCell('Period 1 = pre-op baseline. Period 2 = 0–6h post-op. Period 3 = 6–12h post-op.', 7360)] }),
      ],
    }),
    new Paragraph({ ...sp(160, 0), children: [] }),
    h2('Step 1 — Enter Signals'),
    signalTable([
      {
        signal: 'Post-op haemoglobin at 6h: 9.2 g/dL. Pre-operative baseline: 13.8 g/dL. Expected post-op nadir for this procedure: 11.5–12.5 g/dL. Deviation: 2.3 g/dL below the lower bound of expected range.',
        domain: 'Lab Results', language: 'Technical',
        expected: 'ADMIT', dims: 'Rate ↑',
        notes: 'Quantitative deviation with specific expected range and actual measurement. Rate should score clearly.',
      },
      {
        signal: 'Blood pressure readings over the 8-hour post-op window: 128/84 → 119/79 → 104/71 → 92/63. Four consecutive measurements, each lower than the last.',
        domain: 'Vital Signs', language: 'Technical',
        expected: 'ADMIT', dims: 'Direction ↑ · Rate ↑',
        notes: 'Monotonic decline across four periods. Direction should score strongly. Rate also fires — 92 systolic is critical.',
      },
      {
        signal: 'Patient appeared comfortable and oriented during the 14:00 nursing round. No complaints of pain, dizziness, or nausea. Patient was answering questions appropriately.',
        domain: 'Nursing Observations', language: 'Plain',
        expected: 'EXPIRE', dims: 'None',
        notes: '"Comfortable", "no complaints", "answering appropriately" — stability markers. Should expire.',
      },
      {
        signal: 'Night nurse noted the patient seemed "not quite right" — unusually quiet, not making eye contact. During the afternoon he had been chatty and was asking about going home.',
        domain: 'Nursing Observations', language: 'Plain',
        expected: 'ADMIT', dims: 'Rate ↑',
        notes: 'Behavioural change — "not quite right", "unusually quiet" vs prior state. Tests plain-language anomaly detection.',
      },
      {
        signal: 'Surgical drain output volume at 6h post-op: 380 mL. Protocol for this procedure specifies expected drain output of less than 150 mL at this interval. Volume is 2.5x the upper limit.',
        domain: 'Lab Results', language: 'Technical',
        expected: 'ADMIT', dims: 'Rate ↑',
        notes: '2.5x expected volume — very strong rate signal. Should score near 1.0 on rate.',
      },
      {
        signal: 'The surgeon\'s post-operative note states "procedure uncomplicated, haemostasis achieved, estimated blood loss 50 mL." This is inconsistent with the haematology drop of 4.6 g/dL and drain output of 380 mL.',
        domain: 'Surgical Notes', language: 'Mixed',
        expected: 'ADMIT', dims: 'Relationship ↑ · Configuration ↑',
        notes: 'Explicit contradiction between surgeon\'s record and objective clinical data. Relationship and configuration should both fire.',
      },
      {
        signal: "Patient's regular medications — lisinopril 10mg and atorvastatin 20mg — were administered on schedule. No known drug interactions flagged by the pharmacy system.",
        domain: 'Nursing Observations', language: 'Technical',
        expected: 'EXPIRE', dims: 'None',
        notes: '"On schedule", "no interactions" — routine administration. Should expire.',
      },
      {
        signal: 'A second surgeon reviewed the operative notes at the request of the ward consultant. She confirmed that the described technique was standard and that the note does not indicate any complication.',
        domain: 'Surgical Notes', language: 'Plain',
        expected: 'BORDERLINE', dims: 'Relationship ↑ (weak)',
        notes: 'Borderline — "confirmed standard technique" is stabilising, but the review was triggered by concern. May admit weakly or expire. Note outcome.',
      },
    ]),
    new Paragraph({ ...sp(160, 0), children: [] }),
    h2('Step 2 — Register Contradiction'),
    contradictionTable([
      {
        a: 'Surgeon\'s post-op note: "procedure uncomplicated, estimated blood loss 50 mL."',
        b: 'Lab: Hb dropped 4.6 g/dL from baseline. Drain output 380 mL at 6h (2.5x protocol limit).',
        expected: 'Both quarantined. Hypothesis: internal bleeding post-op not identified intra-operatively (RC-2 / Rate-Relationship).',
      },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),
    h2('Step 3 — Verify Automated Behaviours'),
    checklistTable([
      { check: 'Signals 1, 2, 4, 5, 6 admitted. Signals 3, 7 expired. Signal 8 either ADMITTED (weak) or EXPIRED — note which.' },
      { check: 'Signal 2 (BP decline): check that Direction scores ≥ 0.6. Should be the highest-scoring direction signal in the case.' },
      { check: 'Signal 4 (night nurse "not quite right"): test of plain language. If it expires, note the SI score. The phrase "not quite right" and "unusually quiet" should hit rate indicators.' },
      { check: 'Signals 1, 5, 6 should connect via SHG — all Lab Results or Surgical Notes pointing at the same anomaly (haemorrhage). Check Hypothesis Board.' },
      { check: 'Contradiction registered between signal 6 and signal 5 — both now quarantined.' },
      { check: 'Cognitive Briefing: covers Lab Results and Vital Signs. Mentions the contradiction.' },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),
    callout('Calibration Note: Signal 4 is critical. If CIS cannot admit a nurse saying "not quite right" and "unusually quiet", the plain-language rate indicators need expanding. Note the exact SI score.', 'warn'),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// CASE 4 — MISSING PERSON
// ═══════════════════════════════════════════════════════════════════════════
function case4() {
  return [
    h1('Case 4 — Where is Tomás?'),
    new Table({
      width: { size: 9360, type: WidthType.DXA }, columnWidths: [2000, 7360],
      rows: [
        new TableRow({ children: [hdrCell('Domain', 2000), hdrCell('Community / Missing Person', 7360, C.light, C.navy)] }),
        new TableRow({ children: [dataCell('Situation', 2000, C.greyBg), dataCell('Tomás Carvalho, 67, lives alone and has mild cognitive impairment. His neighbours became concerned when they had not seen him for three days. He has no history of wandering. Family has been contacted but they live 200km away.', 7360)] }),
        new TableRow({ children: [dataCell('Domains to create', 2000, C.greyBg), dataCell('Neighbour Reports · Banking & Financial · Telecommunications · Family & Social', 7360)] }),
        new TableRow({ children: [dataCell('Observation period', 2000, C.greyBg), dataCell('Period 1 = last confirmed sighting (Tuesday). Period 2 = Wednesday. Period 3 = Thursday (now).', 7360)] }),
      ],
    }),
    new Paragraph({ ...sp(160, 0), children: [] }),
    h2('Step 1 — Enter Signals'),
    signalTable([
      {
        signal: "The neighbour downstairs says Tomás's dog has been barking continuously for two days. She says Tomás walks the dog every single morning without fail — she has never known him to miss it.",
        domain: 'Neighbour Reports', language: 'Plain',
        expected: 'ADMIT', dims: 'Rate ↑',
        notes: '"Never known him to miss it" — deviation from baseline. "Continuously for two days" — direction accumulation. Should admit.',
      },
      {
        signal: "Tomás's pension payment of €780 was deposited into his account on the 1st as normal. No card transactions have been made since Tuesday 08:40 — three days of no activity.",
        domain: 'Banking & Financial', language: 'Mixed',
        expected: 'ADMIT', dims: 'Direction ↑ · Rate ↑',
        notes: 'Abrupt cessation of financial activity over multiple periods. Direction (accumulating absence) + rate (no activity is out of character).',
      },
      {
        signal: "His living room lights came on automatically at 7pm Tuesday using the timer he set up six months ago. This is normal for him.",
        domain: 'Neighbour Reports', language: 'Plain',
        expected: 'EXPIRE', dims: 'None',
        notes: '"Normal for him", "automatic timer" — expected behaviour. Should expire cleanly.',
      },
      {
        signal: "The pharmacy says Tomás did not collect his weekly medication on Wednesday. The pharmacist says she has dispensed to him every week for three years without a single missed collection.",
        domain: 'Family & Social', language: 'Plain',
        expected: 'ADMIT', dims: 'Rate ↑',
        notes: 'Strong rate signal — "three years without a single missed collection". Absence from a known routine.',
      },
      {
        signal: "A neighbour on the second floor says she noticed an unfamiliar silver car parked outside the building for about three hours on Monday evening. The driver did not appear to get out.",
        domain: 'Neighbour Reports', language: 'Plain',
        expected: 'BORDERLINE', dims: 'Rate ↑ (weak)',
        notes: 'Borderline — unusual car, long stationary period, but no direct connection established yet. May admit weakly. Note outcome.',
      },
      {
        signal: "Tomás's mobile phone last connected to cell tower CL-4, which covers a two-block radius around his home, on Tuesday at 08:52. The phone has not pinged any tower since — 60 hours of silence.",
        domain: 'Telecommunications', language: 'Mixed',
        expected: 'ADMIT', dims: 'Rate ↑ · Direction ↑',
        notes: '"Has not pinged any tower since" + "60 hours" = strong accumulating absence. Rate + direction both should fire.',
      },
      {
        signal: "His daughter says Tomás sometimes forgets to call her for a few days and can be a bit withdrawn. She says she would not necessarily worry until a week had passed.",
        domain: 'Family & Social', language: 'Plain',
        expected: 'EXPIRE', dims: 'None',
        notes: '"Sometimes forgets", "would not worry" — normalising language. Should suppress SI and expire.',
      },
      {
        signal: "Building supervisor checked the exterior of Tomás's flat door — it appears closed and locked. No sign of forced entry visible from the hallway. Neighbours have not heard any loud noises.",
        domain: 'Neighbour Reports', language: 'Plain',
        expected: 'BORDERLINE', dims: 'Rate ↑ (weak)',
        notes: 'No forced entry = absence of evidence. May expire (no anomaly found) or borderline admit (closed door unusual without seeing him). Note outcome.',
      },
    ]),
    new Paragraph({ ...sp(160, 0), children: [] }),
    h2('Step 2 — Register Contradiction'),
    contradictionTable([
      {
        a: "Tomás's phone last pinged cell tower CL-4 at 08:52 Tuesday — 2 blocks from home.",
        b: "Daughter says Tomás sometimes goes quiet for a few days — she would not worry for a week.",
        expected: 'Both quarantined. Hypothesis: family normalisation vs objective absence (RC-1 / Relationship). Tests whether CIS quarantines low-SI signal if contradicted by high-SI signal.',
      },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),
    h2('Step 3 — Verify Automated Behaviours'),
    checklistTable([
      { check: 'Signals 1, 2, 4, 6 admitted. Signals 3, 7 expired. Signals 5, 8 either borderline admitted or expired — note which and why.' },
      { check: 'Signal 6 (phone silence): check that both Rate and Direction score. "60 hours" and "has not pinged any tower since" should both register.' },
      { check: 'Signal 1 (dog barking) and Signal 6 (phone silence): should cross-domain connect — Neighbour Reports ↔ Telecommunications, same temporal window.' },
      { check: 'Signals 2 and 4 connect: Banking + Family & Social, both showing absence-of-expected behaviour, same periods.' },
      { check: 'Contradiction registered between signals 6 and 7. Signal 7 (family normalisation) quarantined despite its own low SI — verify this works.' },
      { check: 'Hypothesis Board: hypothesis generated around structured absence — multiple domains showing the same pattern of non-activity.' },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),
    callout('Calibration Note: Signals 5 and 8 (silver car, closed door) test BORDERLINE handling. The expected outcome is uncertain by design — they represent weak signals. Document what SI score CIS assigns and whether any dim reaches 0.35.', 'warn'),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// CASE 5 — ORGANIZED CRIME / PORT
// ═══════════════════════════════════════════════════════════════════════════
function case5() {
  return [
    h1('Case 5 — The Harborview Shipment'),
    new Table({
      width: { size: 9360, type: WidthType.DXA }, columnWidths: [2000, 7360],
      rows: [
        new TableRow({ children: [hdrCell('Domain', 2000), hdrCell('Customs & Port Security', 7360, C.light, C.navy)] }),
        new TableRow({ children: [dataCell('Situation', 2000, C.greyBg), dataCell('Container HLXU-4471-22 arrived at Harborview Port on a vessel from multiple high-risk transit stops. A routine customs check flagged anomalies. No seizure has been made yet. Risk assessment is underway.', 7360)] }),
        new TableRow({ children: [dataCell('Domains to create', 2000, C.greyBg), dataCell('Customs Records · Vessel History · Physical Inspection · Importer Registry', 7360)] }),
        new TableRow({ children: [dataCell('Observation period', 2000, C.greyBg), dataCell('Period 1 = pre-arrival (transit). Period 2 = arrival/inspection. Period 3 = post-inspection.', 7360)] }),
      ],
    }),
    new Paragraph({ ...sp(160, 0), children: [] }),
    h2('Step 1 — Enter Signals'),
    signalTable([
      {
        signal: 'Container HLXU-4471-22 declared gross weight on manifest: 14,200 kg. Weigh bridge measurement on arrival: 17,840 kg. Discrepancy: 3,640 kg — 25.6% above declared weight.',
        domain: 'Customs Records', language: 'Technical',
        expected: 'ADMIT', dims: 'Rate ↑ · Relationship ↑',
        notes: 'Quantitative discrepancy between declared and measured — classic rate + relationship signal.',
      },
      {
        signal: 'The importer company listed on the manifest was registered as a legal entity 11 days before the shipment booking was made. No prior import or export activity in the trade registry.',
        domain: 'Importer Registry', language: 'Mixed',
        expected: 'ADMIT', dims: 'Rate ↑ · Relationship ↑',
        notes: 'New entity created immediately before use, no history — same pattern as Case 1 vendor. Rate + relationship.',
      },
      {
        signal: 'Shipping manifest declares cargo as "ceramic tiles — mixed sizes." X-ray scan of the container shows a dense, irregular mass concentrated in the lower-left quadrant inconsistent with the dispersed uniform pattern expected from tile pallets.',
        domain: 'Physical Inspection', language: 'Mixed',
        expected: 'ADMIT', dims: 'Relationship ↑ · Configuration ↑',
        notes: 'Physical scan contradicts manifest declaration. Two systems (document + scan) disagree. Relationship + configuration.',
      },
      {
        signal: 'Temperature log for the refrigerated section of the vessel shows stable readings of 4°C throughout the 12-day transit — within food safety parameters for the declared cold chain cargo.',
        domain: 'Vessel History', language: 'Technical',
        expected: 'EXPIRE', dims: 'None',
        notes: '"Stable", "within food safety parameters" — should expire. Tests that normal technical readings do not inflate SI.',
      },
      {
        signal: 'Vessel MV Constellation made port calls at four locations with elevated smuggling risk scores (≥7/10) in the 90 days prior to this shipment — Callao, Cartagena, Dakar, Casablanca.',
        domain: 'Vessel History', language: 'Technical',
        expected: 'ADMIT', dims: 'Direction ↑ · Configuration ↑',
        notes: 'Repeated pattern across four stops — direction accumulation. High-risk geography adds configuration weight.',
      },
      {
        signal: 'The consignee delivery address on the shipping manifest is Unit 14B, Harborview Industrial Estate. Land registry records confirm the unit has been vacant and commercially unoccupied since 2019.',
        domain: 'Importer Registry', language: 'Mixed',
        expected: 'ADMIT', dims: 'Relationship ↑ · Rate ↑',
        notes: 'Declared address does not correspond to an active business — relationship failure between two records.',
      },
      {
        signal: 'The customs officer who performed the initial visual check noted that all four container seals appeared intact with no signs of tampering. Seal numbers matched the manifest.',
        domain: 'Physical Inspection', language: 'Plain',
        expected: 'BORDERLINE', dims: 'Relationship (weak — absence of expected tampering)',
        notes: 'Borderline — matching seals is normal, but seal integrity alone does not confirm contents. Some argue no anomaly; others that intact seals alongside weight discrepancy is a contradiction. Note what CIS does.',
      },
      {
        signal: 'A standard fumigation certificate issued in Callao is attached to the documentation. The document format and issuing authority appear consistent with official Peruvian phytosanitary requirements.',
        domain: 'Customs Records', language: 'Technical',
        expected: 'EXPIRE', dims: 'None',
        notes: '"Consistent with", "appear valid" — stabilising language. Should expire.',
      },
    ]),
    new Paragraph({ ...sp(160, 0), children: [] }),
    h2('Step 2 — Register Contradiction'),
    contradictionTable([
      {
        a: 'Manifest declares cargo as "ceramic tiles" — a uniform, distributed load.',
        b: 'X-ray scan shows dense irregular mass concentrated in one quadrant — inconsistent with tile pattern.',
        expected: 'Both quarantined. Hypothesis: concealed contraband within legitimate cargo declaration (RC-2 Falsification).',
      },
      {
        a: 'Container seals intact — no tampering observed.',
        b: 'Container weight 25.6% above declared — 3,640 kg unaccounted.',
        expected: 'Both quarantined. Hypothesis: pre-sealed loading of undeclared cargo (RC-2 / Configuration).',
      },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),
    h2('Step 3 — Verify Automated Behaviours'),
    checklistTable([
      { check: 'Signals 1, 2, 3, 5, 6 admitted. Signals 4, 8 expired. Signal 7 borderline — note outcome.' },
      { check: 'Signals 1 and 3 should connect via SHG — Customs Records ↔ Physical Inspection, same container, same period.' },
      { check: 'Signals 2 and 6 should connect — both Importer Registry, both showing no legitimate business history.' },
      { check: 'Second contradiction (seals vs weight): tests whether CIS can hold two contradictions simultaneously for the same case.' },
      { check: 'Hypothesis Board: expects two hypotheses — one for cargo concealment, one for undeclared loading.' },
      { check: 'Cognitive Briefing: should cover all four domains. Check that both Customs Records and Physical Inspection appear.' },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),
    callout('Calibration Note: Signal 7 (intact seals) is the most ambiguous signal in the workbook. Its outcome depends on whether CIS reads "intact seals" as stabilising or as a contradiction with the weight anomaly. Note the SI score carefully — this informs whether we need a contradiction registered or if SHG connects it automatically.', 'warn'),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// CALIBRATION REFERENCE
// ═══════════════════════════════════════════════════════════════════════════
function calibrationRef() {
  return [
    h1('Calibration Reference'),
    h2('Signal Outcome Summary'),
    para('After completing all five cases, use this table to record what CIS actually did versus what was expected. Red cells need investigation.'),
    new Paragraph({ ...sp(80, 0), children: [] }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [600, 1200, 2200, 1460, 1460, 2440],
      rows: [
        new TableRow({ tableHeader: true, children: [
          hdrCell('#', 600), hdrCell('Case', 1200), hdrCell('Signal (abbreviated)', 2200),
          hdrCell('Expected', 1460), hdrCell('Actual', 1460), hdrCell('SI Score / Notes', 2440),
        ]}),
        // Case 1
        ...[
          ['1', 'Meridian', '3x transfers to MRD-991', 'ADMIT', '', ''],
          ['2', 'Meridian', 'Payroll +2.3% within tolerance', 'EXPIRE', '', ''],
          ['3', 'Meridian', 'Vendor account created 6 days prior', 'ADMIT', '', ''],
          ['4', 'Meridian', 'Login at 02:14 — outside hours', 'ADMIT', '', ''],
          ['5', 'Meridian', 'Same IP for vendor creation + approval', 'ADMIT', '', ''],
          ['6', 'Meridian', 'Annual audit — clean opinion', 'EXPIRE', '', ''],
          ['7', 'Meridian', 'Expense claim within policy', 'EXPIRE', '', ''],
          ['8', 'Meridian', 'Repeated searches for MRD-991 records', 'ADMIT', '', ''],
          // Case 2
          ['9', 'Helix', 'DLP alert — 847MB upload at 23:47', 'ADMIT', '', ''],
          ['10', 'Helix', 'Network volume +340% over 72h', 'ADMIT', '', ''],
          ['11', 'Helix', 'Badge access 16 min before DLP alert', 'ADMIT', '', ''],
          ['12', 'Helix', 'Camera offline during access window', 'ADMIT', '', ''],
          ['13', 'Helix', '11 searches for export procedures', 'ADMIT', '', ''],
          ['14', 'Helix', 'Vulnerability scan — no findings', 'EXPIRE', '', ''],
          ['15', 'Helix', 'HR file — meets expectations', 'EXPIRE', '', ''],
          ['16', 'Helix', 'Resignation submitted morning after alert', 'ADMIT', '', ''],
          // Case 3
          ['17', '7-North', 'Hb 9.2 g/dL — 2.3 below nadir', 'ADMIT', '', ''],
          ['18', '7-North', 'BP decline across 4 readings', 'ADMIT', '', ''],
          ['19', '7-North', 'Patient comfortable at 14:00 round', 'EXPIRE', '', ''],
          ['20', '7-North', 'Nurse: "not quite right", unusually quiet', 'ADMIT', '', ''],
          ['21', '7-North', 'Drain 380 mL (2.5x protocol limit)', 'ADMIT', '', ''],
          ['22', '7-North', 'Surgeon note contradicts lab findings', 'ADMIT', '', ''],
          ['23', '7-North', 'Medications on schedule, no interactions', 'EXPIRE', '', ''],
          ['24', '7-North', 'Second surgeon confirms standard technique', 'BORDERLINE', '', ''],
          // Case 4
          ['25', 'Tomás', "Dog barking — never misses morning walk", 'ADMIT', '', ''],
          ['26', 'Tomás', 'No card use in 3 days (pension deposited)', 'ADMIT', '', ''],
          ['27', 'Tomás', 'Lights on automatic timer — normal', 'EXPIRE', '', ''],
          ['28', 'Tomás', 'Missed pharmacy — 3 years never missed', 'ADMIT', '', ''],
          ['29', 'Tomás', 'Unfamiliar silver car, 3h stationary', 'BORDERLINE', '', ''],
          ['30', 'Tomás', 'Phone silent 60h — last ping near home', 'ADMIT', '', ''],
          ['31', 'Tomás', 'Daughter: sometimes quiet for days', 'EXPIRE', '', ''],
          ['32', 'Tomás', 'Door locked, no forced entry visible', 'BORDERLINE', '', ''],
          // Case 5
          ['33', 'Harborview', 'Container weight 25.6% above declared', 'ADMIT', '', ''],
          ['34', 'Harborview', 'Importer registered 11 days before booking', 'ADMIT', '', ''],
          ['35', 'Harborview', 'X-ray inconsistent with tile cargo', 'ADMIT', '', ''],
          ['36', 'Harborview', 'Temperature stable at 4°C — within range', 'EXPIRE', '', ''],
          ['37', 'Harborview', '4 high-risk port calls in 90 days', 'ADMIT', '', ''],
          ['38', 'Harborview', 'Consignee address vacant since 2019', 'ADMIT', '', ''],
          ['39', 'Harborview', 'Seals intact — no tampering', 'BORDERLINE', '', ''],
          ['40', 'Harborview', 'Fumigation certificate appears valid', 'EXPIRE', '', ''],
        ].map(([num, cas, sig, exp, act, notes], i) => new TableRow({ children: [
          dataCell(num, 600, i % 2 === 0 ? C.greyBg : C.white),
          dataCell(cas, 1200, i % 2 === 0 ? C.greyBg : C.white),
          dataCell(sig, 2200),
          new TableCell({ borders, width: { size: 1460, type: WidthType.DXA },
            shading: { fill: exp === 'ADMIT' ? C.greenBg : exp === 'EXPIRE' ? C.redBg : C.amberBg, type: ShadingType.CLEAR },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: exp, bold: true, size: 18, font: 'Arial', color: exp === 'ADMIT' ? C.green : exp === 'EXPIRE' ? C.red : C.amber })] })] }),
          dataCell(act, 1460),
          dataCell(notes, 2440),
        ]})),
      ],
    }),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// UI EXPERIENCE REVIEW
// ═══════════════════════════════════════════════════════════════════════════
function uiReview() {
  return [
    h1('UI Experience Review'),
    para('Use this section while working through the cases above, or as a standalone walkthrough after completing them. Mark each item ✓ (works as expected), ✗ (broken or missing), or ? (unclear or incomplete).'),
    new Paragraph({ ...sp(80, 0), children: [] }),

    h2('Dashboard'),
    uiTable([
      { page: 'Case header', expected: 'Shows case name, creation date, and current status.' },
      { page: 'Domain cards', expected: 'All created domains appear as cards. Each shows domain name and signal count.' },
      { page: 'Signal counts', expected: 'Total, admitted, expired, quarantined counts update in real time after each signal is submitted.' },
      { page: 'Navigation', expected: 'All nav items (Observations, Contradiction Ledger, Hypothesis Board, Briefing, Analytics) are accessible from the dashboard.' },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),

    h2('Open Observations'),
    uiTable([
      { page: 'ALL tab', expected: 'Shows every signal regardless of status. Admitted, expired, quarantined, retained all visible.' },
      { page: 'Filtering by status', expected: 'ADMITTED / EXPIRED / QUARANTINED tabs filter correctly. Counts match dashboard.' },
      { page: 'Signal cards', expected: 'Each signal shows: content text (full, not truncated), domain, SI score, lifecycle status, submitted date.' },
      { page: 'SI score visible', expected: 'SI score displayed on each signal card. Expired signals show SI near 0. Admitted show SI ≥ 0.25 or max dim ≥ 0.35.' },
      { page: 'Domain filter', expected: 'Can filter signals by domain. Shows only signals belonging to selected domain.' },
      { page: 'Signal detail', expected: 'Clicking a signal opens detail view with: full content, all SI dimension scores, event timeline, connections list, contradictions list.' },
      { page: 'Event timeline', expected: 'Signal detail shows CANDIDATE → ADMITTED → RETAINED sequence with reasons and timestamps.' },
      { page: 'WSP indicator', expected: 'WSP-protected signals are clearly marked. Cannot be manually expired while protected.' },
      { page: 'Empty state', expected: 'If no signals match the filter, shows a clear empty message (not a blank screen).' },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),

    h2('Contradiction Ledger'),
    uiTable([
      { page: 'Signal picker', expected: 'Full signal text visible in picker — not truncated. Scrollable list of all active signals.' },
      { page: 'Register button', expected: '"+ Register Contradiction" button visible in header. Opens modal.' },
      { page: 'Modal — both pickers', expected: 'Signal A and Signal B pickers show all admitted signals. Can select different signals in each.' },
      { page: 'Modal — description', expected: 'Description field accepts free text. Not required (or clearly marked required if it is).' },
      { page: 'Submit', expected: 'After submitting, both signals show as QUARANTINED in Open Observations.' },
      { page: 'Ledger list', expected: 'Registered contradiction appears in the ledger with Signal A, Signal B, description, and date.' },
      { page: 'Multiple contradictions', expected: 'Can register more than one contradiction per case (tested in Case 5 with two contradictions).' },
      { page: 'No signals state', expected: 'If case has no admitted signals, picker shows a clear message rather than empty dropdown.' },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),

    h2('Hypothesis Board'),
    uiTable([
      { page: 'Auto-generation', expected: 'After signals connect via SHG, at least one hypothesis auto-generates without manual action.' },
      { page: 'Hypothesis content', expected: 'Hypothesis text is meaningful — references the signals and the domain. Not generic placeholder text.' },
      { page: 'RC type shown', expected: 'Each hypothesis shows the RC (Regulatory Class) type: RC-1, RC-2, etc.' },
      { page: 'Connected signals', expected: 'Each hypothesis links to the signals that generated it. Can click to view them.' },
      { page: 'After contradiction', expected: 'After registering a contradiction, a new hypothesis appears referencing the contradiction pair.' },
      { page: 'Empty state', expected: 'If no hypotheses yet, shows clear message explaining that connections generate hypotheses automatically.' },
      { page: 'Manual hypothesis', expected: 'Can manually add a hypothesis from the board if auto-generation has not triggered.' },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),

    h2('Cognitive Briefing'),
    uiTable([
      { page: 'Full width', expected: 'Briefing uses the full page width — no narrow column layout.' },
      { page: 'Domains covered', expected: 'All domains with admitted signals are mentioned in the briefing. No domain silently omitted.' },
      { page: 'Signal counts', expected: 'Briefing shows count of admitted, expired, quarantined signals.' },
      { page: 'Contradiction summary', expected: 'If contradictions exist, briefing mentions them.' },
      { page: 'Hypothesis summary', expected: 'If hypotheses exist, briefing mentions the leading hypothesis.' },
      { page: 'Regenerate', expected: 'Can trigger a fresh briefing after adding more signals. New signals reflected in updated briefing.' },
      { page: 'Empty case', expected: 'Briefing for a case with no admitted signals shows a sensible empty state.' },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),

    h2('Analytics'),
    uiTable([
      { page: 'Full width', expected: 'Analytics uses the full page width.' },
      { page: 'Signal distribution', expected: 'Chart shows breakdown by lifecycle status (admitted, expired, quarantined, retained).' },
      { page: 'Domain breakdown', expected: 'Can see which domains have the most signals and highest average SI score.' },
      { page: 'SI score distribution', expected: 'Histogram or table showing range of SI scores across all signals in the case.' },
      { page: 'Trend over time', expected: 'If signals have timestamps, shows when signals were submitted over time.' },
      { page: 'Cross-case', expected: 'If viewing system-level analytics, shows data across all cases (not just current one).' },
    ]),
    new Paragraph({ ...sp(120, 0), children: [] }),

    h2('Missing Features — Things to Check'),
    callout('These are features or behaviours that may not yet exist in CIS. Use this section to flag gaps observed during the calibration.', 'info'),
    new Paragraph({ ...sp(80, 0), children: [] }),
    new Table({
      width: { size: 9360, type: WidthType.DXA }, columnWidths: [3600, 2880, 2880],
      rows: [
        new TableRow({ tableHeader: true, children: [hdrCell('Feature', 3600), hdrCell('Currently exists?', 2880), hdrCell('Priority / Notes', 2880)] }),
        ...[
          ['Evidence linking: attach a document or image to a signal', '', ''],
          ['Signal editing: correct a typo in signal text after submission', '', ''],
          ['Manual SI override: analyst can adjust SI score with reason', '', ''],
          ['Signal tagging: label signals (e.g. "alibi", "financial", "witness")', '', ''],
          ['Case timeline: chronological view of all signals by observation period', '', ''],
          ['Export: download case summary as PDF or CSV', '', ''],
          ['Case status: mark a case as "active", "resolved", "escalated"', '', ''],
          ['Notification: alert when a new hypothesis auto-generates', '', ''],
          ['Contradiction resolution: mark a contradiction as resolved with explanation', '', ''],
          ['Search: find signals by keyword across a case', '', ''],
          ['Bulk signal import: submit multiple signals at once (e.g. paste from a table)', '', ''],
          ['Observation period selector: UI field for observation period when submitting signal', '', ''],
        ].map(([f, e, p], i) => new TableRow({ children: [
          dataCell(f, 3600, i % 2 === 0 ? C.greyBg : C.white),
          dataCell(e, 2880),
          dataCell(p, 2880),
        ]})),
      ],
    }),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// FINAL NOTES
// ═══════════════════════════════════════════════════════════════════════════
function finalNotes() {
  return [
    h1('Calibration Notes & Next Steps'),
    h2('Patterns to Watch'),
    signalTable([
      { signal: 'Signals describing ABSENCE of expected behaviour — "never showed up", "phone silent for 60h", "no card use"', domain: 'All', language: 'Both', expected: 'ADMIT', dims: 'Rate ↑', notes: 'If these expire, rate keywords for absence/silence need expanding.' },
      { signal: 'Signals with technical numbers but clear deviation — "2.5x protocol limit", "25.6% above declared", "340% increase"', domain: 'All', language: 'Technical', expected: 'ADMIT', dims: 'Rate ↑', notes: 'AI scorer should interpret percentages as deviation magnitude. If it expires, check prompt.' },
      { signal: 'Signals describing ROUTINE — "on schedule", "within tolerance", "no findings", "clean opinion"', domain: 'All', language: 'Both', expected: 'EXPIRE', dims: 'None', notes: 'Critical that these expire — false positives undermine trust in the system.' },
      { signal: 'Signals where TWO SYSTEMS agree on an anomaly — "badge access AND DLP alert", "phone tower AND financial activity"', domain: 'All', language: 'Mixed', expected: 'ADMIT', dims: 'Configuration ↑ · Relationship ↑', notes: 'Configuration scoring depends on the signal text mentioning multiple independent sources.' },
      { signal: 'BORDERLINE signals — weak anomaly, could go either way', domain: 'All', language: 'Both', expected: 'BORDERLINE', dims: 'Depends', notes: 'Document SI score precisely. These calibrate the 0.25 / 0.35 threshold settings.' },
    ]),
    new Paragraph({ ...sp(160, 0), children: [] }),
    h2('Threshold Tuning'),
    new Table({
      width: { size: 9360, type: WidthType.DXA }, columnWidths: [3000, 3000, 3360],
      rows: [
        new TableRow({ tableHeader: true, children: [hdrCell('Symptom', 3000), hdrCell('Likely Cause', 3000), hdrCell('Fix', 3360)] }),
        new TableRow({ children: [dataCell('Too many false expiries — clear anomalies not admitted', 3000), dataCell('SI_MIN_THRESHOLD too high, or AI prompt too conservative', 3000), dataCell('Lower SI_MIN_THRESHOLD from 0.25 → 0.20, or expand HIGH_INDICATORS keywords', 3360)] }),
        new TableRow({ children: [dataCell('Too many false admissions — routine signals admitted', 3000, C.greyBg), dataCell('LOW_INDICATORS too narrow, or HIGH_INDICATORS too broad', 3000, C.greyBg), dataCell('Add more LOW_INDICATOR phrases; tighten HIGH_INDICATORS list', 3360, C.greyBg)] }),
        new TableRow({ children: [dataCell('Borderline signals all expire (below 0.25 weighted)', 3000), dataCell('Single-dimension threshold (0.35) not triggering', 3000), dataCell('Check max-dimension logic in intake.ts and signals.ts is deployed', 3360)] }),
        new TableRow({ children: [dataCell('AI scores always return 0.00', 3000, C.greyBg), dataCell('AI prompt returning invalid JSON or API error', 3000, C.greyBg), dataCell('Check Railway logs for AI errors; system falls back to rule-based', 3360, C.greyBg)] }),
        new TableRow({ children: [dataCell('No SHG connections forming', 3000), dataCell('SHG_CORR_THRESHOLD too high, or temporal mismatch', 3000), dataCell('Lower SHG_CORR_THRESHOLD env var below 0.35, or check observation periods on signals', 3360)] }),
      ],
    }),
    new Paragraph({ ...sp(160, 0), children: [] }),
    h2('Your Notes'),
    ...Array(12).fill(null).map(() => new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC', space: 4 } },
      ...sp(0, 200),
      children: [norm(' ')],
    })),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// BUILD DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  const doc = new Document({
    numbering: {
      config: [
        { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
        { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      ],
    },
    styles: {
      default: { document: { run: { font: 'Arial', size: 22 } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 36, bold: true, font: 'Arial', color: C.navy },
          paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 28, bold: true, font: 'Arial', color: C.mid },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
        { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 24, bold: true, font: 'Arial', color: C.navy },
          paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 } },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.mid, space: 4 } },
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: 'CIS Calibration Workbook', size: 18, font: 'Arial', color: C.mid }),
              new TextRun({ text: '\tVersion 1.0  ·  June 2026', size: 18, font: 'Arial', color: C.grey }),
            ],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.mid, space: 4 } },
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: 'Cognitive Intelligence System — Internal Use', size: 18, font: 'Arial', color: C.grey }),
              new TextRun({ children: ['\t', 'Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES], size: 18, font: 'Arial', color: C.grey }),
            ],
          })],
        }),
      },
      children: [
        ...titlePage(),
        ...howToUse(),
        ...case1(),
        ...case2(),
        ...case3(),
        ...case4(),
        ...case5(),
        ...calibrationRef(),
        ...uiReview(),
        ...finalNotes(),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('C:\\cis\\CIS_Calibration_Workbook.docx', buffer);
  console.log('✓ Created: C:\\cis\\CIS_Calibration_Workbook.docx');
}

main().catch(console.error);
