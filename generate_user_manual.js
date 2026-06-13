const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  ExternalHyperlink, TabStopType, TabStopPosition,
} = require('docx');
const fs = require('fs');

// ── Palette ──────────────────────────────────────────────────────────────────
const NAVY   = '1B2A4A';
const STEEL  = '2E5C8A';
const TEAL   = '1E7B74';
const AMBER  = 'B05F00';
const RED    = '8B1A1A';
const LGRAY  = 'F4F6F9';
const MGRAY  = 'E2E8F0';
const DGRAY  = '4A5568';
const WHITE  = 'FFFFFF';

// ── Helpers ───────────────────────────────────────────────────────────────────
const border = (color = 'CCCCCC') => ({ style: BorderStyle.SINGLE, size: 1, color });
const borders = (color = 'CCCCCC') => ({ top: border(color), bottom: border(color), left: border(color), right: border(color) });
const noBorders = () => {
  const nb = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  return { top: nb, bottom: nb, left: nb, right: nb };
};

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [new TextRun({ text, bold: true, size: 36, color: NAVY, font: 'Arial' })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, bold: true, size: 26, color: STEEL, font: 'Arial' })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 22, color: DGRAY, font: 'Arial' })],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 100 },
    children: [new TextRun({ text, size: 22, font: 'Arial', color: '1A1A1A', ...opts })],
  });
}

function bold(text) {
  return new TextRun({ text, bold: true, size: 22, font: 'Arial', color: '1A1A1A' });
}

function italic(text) {
  return new TextRun({ text, italics: true, size: 22, font: 'Arial', color: DGRAY });
}

function mixed(...runs) {
  return new Paragraph({ spacing: { before: 80, after: 100 }, children: runs });
}

function bullet(text, indent = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: indent },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: 'Arial', color: '1A1A1A' })],
  });
}

function numberedItem(text) {
  return new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: 'Arial', color: '1A1A1A' })],
  });
}

function rule() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MGRAY } },
    children: [],
  });
}

function spacer(pts = 120) {
  return new Paragraph({ spacing: { before: pts, after: 0 }, children: [] });
}

function callout(label, text, bgColor = LGRAY, labelColor = STEEL) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: { top: border(labelColor), bottom: border(labelColor), left: { style: BorderStyle.SINGLE, size: 12, color: labelColor }, right: border(labelColor) },
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: bgColor, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [new TextRun({ text: label, bold: true, size: 20, font: 'Arial', color: labelColor })],
              }),
              new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [new TextRun({ text, size: 21, font: 'Arial', color: '1A1A1A' })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function twoColTable(rows, colWidths = [3120, 6240]) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: rows.map(([label, value], i) =>
      new TableRow({
        children: [
          new TableCell({
            borders: borders('D0D7E0'),
            width: { size: colWidths[0], type: WidthType.DXA },
            shading: { fill: i % 2 === 0 ? 'EDF2F7' : WHITE, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 140, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 21, font: 'Arial', color: NAVY })] })],
          }),
          new TableCell({
            borders: borders('D0D7E0'),
            width: { size: colWidths[1], type: WidthType.DXA },
            shading: { fill: i % 2 === 0 ? WHITE : 'FAFBFC', type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 140, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: value, size: 21, font: 'Arial', color: '1A1A1A' })] })],
          }),
        ],
      })
    ),
  });
}

function statusBadge(text, color) {
  return new TextRun({ text: ` ${text} `, bold: true, size: 19, font: 'Arial', color: WHITE, highlight: undefined });
}

// ── Title Page ─────────────────────────────────────────────────────────────
function titlePage() {
  return [
    spacer(1800),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [new TextRun({ text: 'CIS', bold: true, size: 120, font: 'Arial', color: NAVY })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [new TextRun({ text: 'Cognitive Intelligence System', bold: false, size: 40, font: 'Arial', color: STEEL })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 600 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: STEEL } },
      children: [],
    }),
    spacer(240),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
      children: [new TextRun({ text: 'Investigator Manual', bold: true, size: 52, font: 'Arial', color: NAVY })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [new TextRun({ text: 'v1.0  —  June 2026', size: 26, font: 'Arial', color: DGRAY })],
    }),
    spacer(2000),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ── Document ──────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 540, hanging: 260 } } } },
          { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 900, hanging: 260 } } } },
        ],
      },
      {
        reference: 'numbers',
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 540, hanging: 260 } } } },
        ],
      },
    ],
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: 'Arial', color: NAVY },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: 'Arial', color: STEEL },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 22, bold: true, font: 'Arial', color: DGRAY },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
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
        children: [
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: STEEL, space: 4 } },
            children: [
              new TextRun({ text: 'CIS — Cognitive Intelligence System', bold: true, size: 18, font: 'Arial', color: STEEL }),
              new TextRun({ text: '\tInvestigator Manual', size: 18, font: 'Arial', color: DGRAY }),
            ],
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: MGRAY, space: 4 } },
            children: [
              new TextRun({ text: 'Restricted — For authorised investigators only', size: 17, font: 'Arial', color: DGRAY }),
              new TextRun({ text: '\tPage ', size: 17, font: 'Arial', color: DGRAY }),
              new TextRun({ children: [PageNumber.CURRENT], size: 17, font: 'Arial', color: DGRAY }),
            ],
          }),
        ],
      }),
    },
    children: [

      // ── TITLE PAGE
      ...titlePage(),

      // ══════════════════════════════════════════════════════════════════════
      // 1. WHAT IS CIS
      // ══════════════════════════════════════════════════════════════════════
      h1('1. What is CIS'),
      body('CIS (Cognitive Intelligence System) is an investigative platform built on a single idea: if two independent information sources reveal the same structural anomaly at the same time, that coincidence is unlikely to be random. It probably has a shared cause.'),
      spacer(80),
      body('CIS does not tell you what happened. It tells you where reality and its governing framework are out of alignment — what the system calls Structural Incongruence (SI). Your job as an investigator is to supply the explanation.'),
      spacer(80),
      body('The platform is built for:'),
      bullet('Investigators handling complex, multi-source cases'),
      bullet('Any domain where information comes from independent channels that should not contradict each other but do'),
      bullet('Situations where the significance of a signal only becomes clear when combined with signals from other areas'),
      spacer(120),

      callout('Core concept', 'A signal is any observation that deviates from what its governing framework would predict. CIS scores every signal for structural incongruence, admits those that pass the threshold, detects contradictions between them, and generates hypotheses when two independent domains show the same pattern simultaneously.', LGRAY, STEEL),
      spacer(200),

      rule(),

      // ══════════════════════════════════════════════════════════════════════
      // 2. KEY CONCEPTS
      // ══════════════════════════════════════════════════════════════════════
      h1('2. Key Concepts'),
      body('Before using CIS, understand these five concepts. Everything in the platform flows from them.'),
      spacer(100),

      h2('2.1 Structural Incongruence (SI)'),
      body('SI is the degree to which an observation contradicts its governing framework. It is not about whether something is unusual. It is about whether it reveals a mismatch between two things that should be consistent.'),
      spacer(80),
      body('SI is measured across four dimensions. The AI evaluates each from 0.0 to 1.0:'),
      spacer(80),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1560, 1560, 6240],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders: borders(STEEL), width: { size: 1560, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: 'Dimension', bold: true, size: 20, font: 'Arial', color: WHITE })] })] }),
              new TableCell({ borders: borders(STEEL), width: { size: 1560, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: 'Weight', bold: true, size: 20, font: 'Arial', color: WHITE })] })] }),
              new TableCell({ borders: borders(STEEL), width: { size: 6240, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: 'What it measures', bold: true, size: 20, font: 'Arial', color: WHITE })] })] }),
            ],
          }),
          ...([
            ['RATE', '20%', 'The magnitude, frequency, or level is anomalous given the governing frame. Something is wrong in quantity or degree.'],
            ['DIRECTION', '20%', 'A persistent one-directional pattern accumulates over time. The trend keeps going the same way across multiple periods.'],
            ['RELATIONSHIP', '25%', 'Two sources that should agree are contradicting each other. What one says and what another shows do not align.'],
            ['CONFIGURATION', '35%', 'Multiple independent indicators are simultaneously pointing to the same anomaly from different directions.'],
          ].map(([dim, wt, desc], i) =>
            new TableRow({
              children: [
                new TableCell({ borders: borders('D0D7E0'), width: { size: 1560, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? 'EDF2F7' : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: dim, bold: true, size: 20, font: 'Arial', color: NAVY })] })] }),
                new TableCell({ borders: borders('D0D7E0'), width: { size: 1560, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? 'EDF2F7' : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: wt, size: 20, font: 'Arial', color: DGRAY })] })] }),
                new TableCell({ borders: borders('D0D7E0'), width: { size: 6240, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? WHITE : 'FAFBFC', type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: desc, size: 20, font: 'Arial', color: '1A1A1A' })] })] }),
              ],
            })
          )),
        ],
      }),
      spacer(120),

      h2('2.2 Domains'),
      body('A domain is an independent information source within your case. Independence matters because CIS looks for the same pattern appearing in genuinely separate streams of information. If two sources are not independent, a shared pattern is expected — it tells you nothing.'),
      spacer(80),
      body('Examples of independent domains: financial records and phone records. Medical data and witness statements. Market data and internal memos. You define what the domains are for your case.'),
      spacer(100),

      h2('2.3 Signals'),
      body('A signal is one observation submitted to CIS. It is evaluated for structural incongruence, scored, and either admitted (retained for investigation) or rejected (expired).'),
      spacer(80),
      body('A signal passes through a lifecycle:'),
      spacer(80),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1680, 7680],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: borders(STEEL), width: { size: 1680, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: 'Status', bold: true, size: 20, font: 'Arial', color: WHITE })] })] }),
            new TableCell({ borders: borders(STEEL), width: { size: 7680, type: WidthType.DXA }, shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: 'Meaning', bold: true, size: 20, font: 'Arial', color: WHITE })] })] }),
          ]}),
          ...[
            ['CANDIDATE', 'Just submitted. Being evaluated.'],
            ['ADMITTED', 'Passed SI threshold. Preserved under WSP.'],
            ['RETAINED', 'Passed significance threshold. Actively tracked.'],
            ['ASSESSED', 'Under active investigative review.'],
            ['RESOLVED', 'Investigation concluded for this signal.'],
            ['ARCHIVED', 'Closed and stored.'],
            ['EXPIRED', 'Rejected (SI too low) or expired through dormancy.'],
          ].map(([s, m], i) =>
            new TableRow({ children: [
              new TableCell({ borders: borders('D0D7E0'), width: { size: 1680, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? 'EDF2F7' : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: s, bold: true, size: 20, font: 'Arial', color: s === 'EXPIRED' ? RED : NAVY })] })] }),
              new TableCell({ borders: borders('D0D7E0'), width: { size: 7680, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? WHITE : 'FAFBFC', type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: m, size: 20, font: 'Arial', color: '1A1A1A' })] })] }),
            ]})
          ),
        ],
      }),
      spacer(120),

      h2('2.4 Contradictions'),
      body('A contradiction is detected when two admitted signals make claims about the same specific variable that cannot both be true simultaneously. CIS detects contradictions automatically after each signal is admitted.'),
      spacer(80),
      body('When a contradiction is detected, both signals are quarantined — they cannot be resolved or expired until the contradiction is addressed. This is a governance mechanism, not a penalty. It forces the investigator to make an explicit decision about which signal is reliable.'),
      spacer(100),

      h2('2.5 Hypotheses'),
      body('A hypothesis is generated automatically when signals from two independent domains show the same structural pattern at the same time. This is the Structural Hypothesis Generator (SHG) at work.'),
      spacer(80),
      body('The SHG does not invent explanations. It identifies pairs of signals whose structural correspondence is too strong to be coincidental (P < 0.15) and generates a candidate explanation. Investigators then evaluate plausibility by adding supporting or contradicting evidence.'),
      spacer(200),

      rule(),

      // ══════════════════════════════════════════════════════════════════════
      // 3. GETTING STARTED
      // ══════════════════════════════════════════════════════════════════════
      h1('3. Getting Started'),

      h2('3.1 Creating a Case'),
      numberedItem('Open CIS and select New Case.'),
      numberedItem('Enter a title and optional description for the investigation.'),
      numberedItem('CIS generates a unique access code (e.g. CIS-MQBS707C-9U4S). Save this. It is the only way to retrieve the case.'),
      spacer(80),
      callout('Access code', 'Write down your case access code immediately. If you lose it, you cannot recover the case. The code is not linked to a user account.', 'FFF8E7', AMBER),
      spacer(120),

      h2('3.2 Retrieving an Existing Case'),
      body('On the CIS home screen, enter your access code in the retrieval field. The case loads with its current state.'),
      spacer(100),

      h2('3.3 Setting Up Domains'),
      body('Before submitting signals, create your domains. Each domain represents one independent information source.'),
      spacer(80),
      numberedItem('Navigate to the Domains tab of your case.'),
      numberedItem('Click Add Domain.'),
      numberedItem('Name the domain clearly (e.g. “Phone Records”, “Financial Transactions”, “Witness Statements”).'),
      numberedItem('Repeat for each independent source.'),
      spacer(80),
      body('Domain independence is assumed by default. If you know two sources are not independent (e.g. both come from the same institution and share data), you can declare them non-independent. CIS will then not generate hypotheses from their signals.'),
      spacer(200),

      rule(),

      // ══════════════════════════════════════════════════════════════════════
      // 4. SUBMITTING SIGNALS
      // ══════════════════════════════════════════════════════════════════════
      h1('4. Submitting Signals'),

      h2('4.1 What to Submit'),
      body('A signal should be a factual observation that deviates from what the context would predict. Write what you observed, not your interpretation of it. CIS will score the structural meaning.'),
      spacer(80),
      callout('Good signal', 'Nokia’s mobile handset market share fell from 38% to 3% in three years despite internal forecasts projecting stability and no major product failures being logged.', LGRAY, TEAL),
      spacer(80),
      callout('Poor signal — too interpretive', 'Nokia failed because management was complacent.', 'FFF8E7', AMBER),
      spacer(80),
      body('Good signals describe what was observed (data, records, behaviour, measurements) and why it is anomalous relative to a baseline or prediction. Poor signals jump to conclusions — those belong in hypotheses, not signals.'),
      spacer(120),

      h2('4.2 The Signal Form'),
      twoColTable([
        ['Signal text', 'The observation itself. Be specific. Include numbers, timeframes, and the deviation from expectation where known.'],
        ['Domain', 'Which information source this observation comes from. Required for SHG to work.'],
        ['Observation period', 'How many periods (quarters, months, cycles) this pattern has persisted. Longer observation periods increase significance. Use 0 or leave blank if this is a single-point observation.'],
        ['SI dimension (optional)', 'If you know which SI dimension is dominant, you can specify it. Otherwise leave blank and CIS will infer it.'],
        ['Deviation direction (optional)', 'Whether the deviation is going up, down, diverging, or converging.'],
      ]),
      spacer(120),

      h2('4.3 The Admission Decision'),
      body('After submission, CIS evaluates the signal in under 5 seconds and returns one of three outcomes:'),
      spacer(80),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 3380, 3780],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: borders(STEEL), shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, width: { size: 2200, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: 'Outcome', bold: true, size: 20, font: 'Arial', color: WHITE })] })] }),
            new TableCell({ borders: borders(STEEL), shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, width: { size: 3380, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: 'Meaning', bold: true, size: 20, font: 'Arial', color: WHITE })] })] }),
            new TableCell({ borders: borders(STEEL), shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, width: { size: 3780, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: 'What to do', bold: true, size: 20, font: 'Arial', color: WHITE })] })] }),
          ]}),
          ...([
            ['ADMITTED / RETAINED', 'SI score passed threshold. Signal is live.', 'Continue. Check for auto-generated contradictions or hypotheses.', 'EDF2F7', TEAL],
            ['ADMITTED (WSP)', 'SI passed but significance below threshold. Signal is preserved for monitoring.', 'Add more signals from the same domain to build corroboration. Revisit after new evidence.', 'FFF8E7', AMBER],
            ['REJECTED (LP-1)', 'SI score too low. Signal does not show structural incongruence.', 'Consider whether you described the deviation clearly. You can resubmit with more specific language.', 'FEF2F2', RED],
          ].map(([out, mean, action, bg, color]) =>
            new TableRow({ children: [
              new TableCell({ borders: borders('D0D7E0'), shading: { fill: bg, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, width: { size: 2200, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: out, bold: true, size: 20, font: 'Arial', color })] })] }),
              new TableCell({ borders: borders('D0D7E0'), shading: { fill: WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, width: { size: 3380, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: mean, size: 20, font: 'Arial', color: '1A1A1A' })] })] }),
              new TableCell({ borders: borders('D0D7E0'), shading: { fill: WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, width: { size: 3780, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: action, size: 20, font: 'Arial', color: '1A1A1A' })] })] }),
            ]})
          )),
        ],
      }),
      spacer(120),

      h2('4.4 Understanding the Scores'),
      body('After admission you will see two key numbers:'),
      spacer(80),
      twoColTable([
        ['SI Score', 'Weighted average across the four dimensions. Ranges 0.0–1.0. Admission threshold is 0.25 (or 0.35 on any single dimension). Scores above 0.70 are strongly anomalous.'],
        ['Significance', 'Composite measure of how relevant this signal is to the investigation. Combines SI score, persistence (observation period), proximity to boundary, rarity, and relevance to active hypotheses. Threshold for RETAINED is 0.55.'],
      ]),
      spacer(80),
      body('These scores update over time. As signals accumulate corroboration and link to hypotheses, their significance rises. Scores are not final at submission.'),
      spacer(200),

      rule(),

      // ══════════════════════════════════════════════════════════════════════
      // 5. WORKING WITH CONTRADICTIONS
      // ══════════════════════════════════════════════════════════════════════
      h1('5. Working with Contradictions'),

      h2('5.1 Auto-Detection'),
      body('Every time a signal is admitted, CIS automatically compares it against every other admitted signal in the case. If two signals describe the same specific variable with incompatible values, a contradiction is recorded and both signals are quarantined.'),
      spacer(80),
      body('You do not need to find or register contradictions manually. CIS does this for you.'),
      spacer(100),

      h2('5.2 What Quarantine Means'),
      body('A quarantined signal cannot be resolved or expired until its contradiction is addressed. It can still be read, referenced, and used as evidence for hypotheses. Quarantine is a governance gate, not a deletion.'),
      spacer(80),
      callout('Attention', 'If your case shows quarantined signals, there are active contradictions requiring your decision. The case dashboard shows the count of open contradictions. Do not ignore these — they block investigation progress.', 'FFF8E7', AMBER),
      spacer(120),

      h2('5.3 Reading a Contradiction'),
      body('In the Contradictions tab you will see each contradiction with:'),
      bullet('The two signals involved (text preview, domain, SI score)'),
      bullet('A description of the specific conflict detected'),
      bullet('Status: ACTIVE or RESOLVED'),
      spacer(80),
      body('Read both signals carefully. The contradiction description tells you what specific claim is in conflict.'),
      spacer(100),

      h2('5.4 Resolving a Contradiction'),
      body('To resolve, select one of three resolution types:'),
      spacer(80),

      twoColTable([
        ['RC-1 — Retained', 'One signal is correct. The other is unreliable (fabricated, misrecorded, or superseded). Select which signal to retain and explain the basis.'],
        ['RC-2 — Recontextualised', 'Both signals are accurate but refer to different time periods, populations, or contexts. The conflict dissolves when scope is clarified.'],
        ['RC-3 — Escalated', 'The contradiction itself is significant and requires escalation or further investigation before it can be resolved.'],
      ]),
      spacer(80),
      body('After resolution, both signals are de-quarantined. The retained signal remains live; the discarded signal (if any) is marked expired.'),
      spacer(200),

      rule(),

      // ══════════════════════════════════════════════════════════════════════
      // 6. HYPOTHESES
      // ══════════════════════════════════════════════════════════════════════
      h1('6. Hypotheses'),

      h2('6.1 How Hypotheses Are Generated'),
      body('The Structural Hypothesis Generator (SHG) monitors for cross-domain signal pairs where the structural correspondence is too strong to be coincidental. When the probability of independent co-occurrence falls below 15%, CIS generates a hypothesis.'),
      spacer(80),
      body('For SHG to fire, you need:'),
      bullet('At least two admitted signals'),
      bullet('From different domains'),
      bullet('With the same mismatch type (e.g. both DIRECTION) or same deviation direction, or occurring in the same observation period'),
      spacer(80),
      body('If all your signals are from the same domain, no hypotheses will be generated. This is by design: cross-domain correspondence is the signal of a shared cause, not within-domain accumulation.'),
      spacer(100),

      h2('6.2 Reading a Hypothesis'),
      body('Each hypothesis shows:'),
      bullet('A title and description of the proposed shared cause'),
      bullet('The two signals that triggered it'),
      bullet('Initial plausibility: 0.50 (neutral — no evidence yet)'),
      bullet('Evidence count: supporting, contradicting, contextual'),
      spacer(80),
      body('Plausibility is not static. It updates as you add evidence.'),
      spacer(100),

      h2('6.3 Adding Evidence'),
      body('To strengthen or weaken a hypothesis, add evidence:'),
      numberedItem('Open the hypothesis.'),
      numberedItem('Click Add Evidence.'),
      numberedItem('Select the signal to use as evidence.'),
      numberedItem('Classify it: SUPPORTING, CONTRADICTING, or CONTEXTUAL.'),
      numberedItem('Set a weight (0.0–1.0) indicating how strongly this evidence bears on the hypothesis.'),
      spacer(80),
      body('CIS updates plausibility using a Bayesian update rule:'),
      bullet('SUPPORTING evidence: plausibility rises toward 1.0'),
      bullet('CONTRADICTING evidence: plausibility falls toward 0.0'),
      bullet('CONTEXTUAL evidence: recorded but does not shift plausibility'),
      spacer(80),
      callout('Resolution triggers', 'When plausibility reaches ≥ 0.85, the hypothesis is flagged for confirmation review. When it falls to ≤ 0.10, it is flagged for falsification review. You must explicitly confirm or falsify — CIS does not close hypotheses automatically.', LGRAY, STEEL),
      spacer(120),

      h2('6.4 Resolving a Hypothesis'),
      twoColTable([
        ['CONFIRMED', 'The hypothesis has sufficient evidence to stand as the working explanation. Signals connected to it are marked resolved.'],
        ['FALSIFIED', 'Evidence has decisively ruled out the hypothesis. It is archived and removed from the active pool.'],
        ['ARCHIVED', 'The hypothesis is set aside without a conclusion (e.g. insufficient evidence, investigation closed).'],
      ]),
      spacer(200),

      rule(),

      // ══════════════════════════════════════════════════════════════════════
      // 7. BRIEFINGS
      // ══════════════════════════════════════════════════════════════════════
      h1('7. Briefings'),

      h2('7.1 Generating a Briefing'),
      body('A briefing is a snapshot of the case at a point in time. It aggregates signal counts, active hypotheses, open contradictions, LP flags, and unresolved high-SI signals.'),
      spacer(80),
      body('To generate: navigate to the Briefings tab and click Generate Briefing. CIS will also produce an AI narrative summary of the investigation state.'),
      spacer(80),
      body('Briefings are timestamped and persisted. You can generate one at any point and compare snapshots over time.'),
      spacer(100),

      h2('7.2 Reading a Briefing'),
      body('The briefing contains:'),
      bullet('Signal pool by status — how many signals are in each lifecycle stage'),
      bullet('Top active signals — highest significance signals currently in play'),
      bullet('Active hypotheses — sorted by plausibility, with evidence counts'),
      bullet('Open contradictions — unresolved, requiring action'),
      bullet('LP flags since last briefing — governance events that need attention'),
      bullet('Open questions — high-SI signals not yet connected to any hypothesis'),
      bullet('AI narrative summary — a 2–3 sentence summary of current investigation state'),
      spacer(200),

      rule(),

      // ══════════════════════════════════════════════════════════════════════
      // 8. LP FLAGS
      // ══════════════════════════════════════════════════════════════════════
      h1('8. LP Flags'),
      body('LP (Logic Preservation) flags are governance events recorded when the system detects a condition that requires investigator attention. They are not errors — they are audit markers.'),
      spacer(80),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1200, 8160],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: borders(STEEL), shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, width: { size: 1200, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: 'Flag', bold: true, size: 20, font: 'Arial', color: WHITE })] })] }),
            new TableCell({ borders: borders(STEEL), shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, width: { size: 8160, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: 'Condition', bold: true, size: 20, font: 'Arial', color: WHITE })] })] }),
          ]}),
          ...[
            ['LP-1', 'Signal rejected: SI score below threshold on all dimensions.'],
            ['LP-2', 'Expiry blocked: signal has WSP protection and has not been observed for the minimum number of periods.'],
            ['LP-3', 'Significance dropped: signal significance fell below retention threshold after a reassessment.'],
            ['LP-4', 'Independence change: a domain pair was declared non-independent after hypotheses were generated from their signals. Those hypotheses are flagged.'],
            ['LP-5', 'Investigator override: scores were manually adjusted. The change is audited.'],
            ['LP-6', 'Dormancy flag: a RETAINED signal has had no activity for 30 days. Its significance has been reduced.'],
            ['LP-7', 'Hypothesis needs review: plausibility reached a confirmation or falsification threshold.'],
          ].map(([f, c], i) =>
            new TableRow({ children: [
              new TableCell({ borders: borders('D0D7E0'), shading: { fill: i % 2 === 0 ? 'EDF2F7' : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, width: { size: 1200, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: f, bold: true, size: 20, font: 'Arial', color: NAVY })] })] }),
              new TableCell({ borders: borders('D0D7E0'), shading: { fill: i % 2 === 0 ? WHITE : 'FAFBFC', type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, width: { size: 8160, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: c, size: 20, font: 'Arial', color: '1A1A1A' })] })] }),
            ]})
          ),
        ],
      }),
      spacer(200),

      rule(),

      // ══════════════════════════════════════════════════════════════════════
      // 9. AUDIT CHAIN
      // ══════════════════════════════════════════════════════════════════════
      h1('9. The Audit Chain'),
      body('Every admission decision in CIS is permanently sealed into a hash-chained audit record. This means:'),
      bullet('The exact signal text, all SI scores, the thresholds in force at the time, and the admission decision are frozen into a tamper-evident record'),
      bullet('Each record is linked to the previous one via SHA-256 hashing. Modifying any past record breaks the chain and is immediately detectable'),
      bullet('Admission decisions can be replayed: given the same signal and the same constraint version, CIS will produce the same outcome'),
      spacer(80),
      body('To inspect the audit chain: navigate to the Audit tab. You can verify chain integrity, view individual seal records, and see the constraint version in force for each decision.'),
      spacer(80),
      callout('Legal and compliance note', 'The audit chain provides cryptographic proof that admission decisions were made consistently and that no records have been altered after the fact. This is designed to support disclosure, regulatory review, and legal proceedings.', LGRAY, NAVY),
      spacer(200),

      rule(),

      // ══════════════════════════════════════════════════════════════════════
      // 10. COMMON WORKFLOWS
      // ══════════════════════════════════════════════════════════════════════
      h1('10. Common Workflows'),

      h2('Starting a New Investigation'),
      numberedItem('Create a case. Save the access code.'),
      numberedItem('Define your domains (minimum 2 for SHG to work).'),
      numberedItem('Begin submitting signals from each domain. Assign each signal to its domain.'),
      numberedItem('After each admission, check the Contradictions tab for auto-detected conflicts.'),
      numberedItem('Once signals from two domains are admitted, check the Hypotheses tab for SHG output.'),
      numberedItem('Add evidence to hypotheses as signals accumulate.'),
      numberedItem('Generate a briefing when you need a structured status snapshot.'),
      spacer(120),

      h2('When a Signal Scores 0.00'),
      body('The AI evaluates structural incongruence, not factual significance. A signal scores low when it does not reveal a mismatch between observation and governing frame. Ask:'),
      bullet('Did I describe what is anomalous specifically? (“went up” is weaker than “rose 34% against a forecast of 2%”)'),
      bullet('Did I include the baseline or prediction it deviates from?'),
      bullet('Is this an interpretation rather than an observation?'),
      spacer(80),
      body('Resubmit with more structural specificity. A poor score is feedback on the signal description, not a verdict on the underlying fact.'),
      spacer(120),

      h2('When No Hypotheses Are Generating'),
      body('SHG requires signals from at least two different domains. Check:'),
      bullet('Have you assigned signals to domains? Unassigned signals cannot be connected.'),
      bullet('Are signals from different domains? SHG only fires across independent domains.'),
      bullet('Have signals from both domains reached ADMITTED or RETAINED? EXPIRED signals are excluded.'),
      spacer(80),
      body('If you have signals across domains but no hypothesis appears within a few minutes, check signal correspondence: the mismatch type or deviation direction may need to align across domains.'),
      spacer(120),

      h2('When Contradictions Block Progress'),
      body('If many signals are quarantined and the case is stalling:'),
      numberedItem('Prioritise resolving contradictions with RC-1 (one signal is wrong). This is the fastest path.'),
      numberedItem('If both signals appear valid (RC-2), add a note clarifying their different scopes.'),
      numberedItem('If the contradiction reveals something important, escalate it as RC-3 and treat it as a finding in itself.'),
      spacer(200),

      rule(),

      // ══════════════════════════════════════════════════════════════════════
      // 11. TIPS
      // ══════════════════════════════════════════════════════════════════════
      h1('11. Tips for Effective Signals'),
      body('The quality of CIS output depends entirely on signal quality. These principles produce better results:'),
      spacer(80),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4500, 4860],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: borders(TEAL), shading: { fill: 'E6F4F1', type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, width: { size: 4500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: 'Do', bold: true, size: 21, font: 'Arial', color: TEAL })] })] }),
            new TableCell({ borders: borders(RED), shading: { fill: 'FEF2F2', type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, width: { size: 4860, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: 'Avoid', bold: true, size: 21, font: 'Arial', color: RED })] })] }),
          ]}),
          ...[
            ['State the deviation and its magnitude', 'Vague language without specifics'],
            ['Include the baseline or expectation it contradicts', 'Conclusions or interpretations as signals'],
            ['Name the time period or observation window', 'Repeating the same observation in different words'],
            ['Reference what the records or sources actually say', 'Signals without a stated deviation from expectation'],
            ['Use multiple signals per domain for corroboration', 'Submitting all signals to the same domain'],
          ].map(([d, a], i) =>
            new TableRow({ children: [
              new TableCell({ borders: borders('D0D7E0'), shading: { fill: i % 2 === 0 ? WHITE : 'F0FAF8', type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, width: { size: 4500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: d, size: 20, font: 'Arial', color: '1A1A1A' })] })] }),
              new TableCell({ borders: borders('D0D7E0'), shading: { fill: i % 2 === 0 ? WHITE : 'FEF9F9', type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 140, right: 100 }, width: { size: 4860, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: a, size: 20, font: 'Arial', color: '1A1A1A' })] })] }),
            ]})
          ),
        ],
      }),
      spacer(200),

      rule(),

      // ══════════════════════════════════════════════════════════════════════
      // 12. QUICK REFERENCE
      // ══════════════════════════════════════════════════════════════════════
      h1('12. Quick Reference'),

      h2('Thresholds'),
      twoColTable([
        ['SI minimum threshold', '0.25 (weighted average) or 0.35 (any single dimension)'],
        ['Significance threshold', '0.55 (to advance from ADMITTED to RETAINED)'],
        ['SHG correspondence threshold', '0.35 (minimum structural match to register a connection)'],
        ['SHG independence threshold', 'P < 0.15 (probability of coincidental co-occurrence)'],
        ['WSP minimum periods', '2 (minimum lifecycle transitions before EXPIRED is permitted)'],
        ['Dormancy period', '30 days of inactivity before significance drop'],
        ['Hypothesis confirmation trigger', 'Plausibility ≥ 0.85 or ≤ 0.10'],
      ]),
      spacer(120),

      h2('SI Score Interpretation'),
      twoColTable([
        ['0.00 – 0.24', 'No structural incongruence detected. Signal rejected (LP-1).'],
        ['0.25 – 0.49', 'Low-to-moderate incongruence. Admitted, preserved for observation.'],
        ['0.50 – 0.69', 'Moderate incongruence. Active signal, likely to generate connections.'],
        ['0.70 – 0.84', 'High incongruence. Strong anomaly requiring investigative attention.'],
        ['0.85 – 1.00', 'Very high incongruence. Critical signal.'],
      ]),
      spacer(120),

      h2('Contradiction Resolution Types'),
      twoColTable([
        ['RC-1', 'One signal retained, one discarded as unreliable.'],
        ['RC-2', 'Both signals valid but refer to different scopes — recontextualised.'],
        ['RC-3', 'Contradiction escalated as a finding requiring further investigation.'],
      ]),
      spacer(120),

      h2('Hypothesis Evidence Weights'),
      twoColTable([
        ['0.10 – 0.29', 'Weak evidence — consistent with hypothesis but not diagnostic.'],
        ['0.30 – 0.59', 'Moderate evidence — meaningfully relevant.'],
        ['0.60 – 0.79', 'Strong evidence — difficult to explain without the hypothesis.'],
        ['0.80 – 1.00', 'Critical evidence — near-conclusive.'],
      ]),
      spacer(200),

      rule(),

      // ══════════════════════════════════════════════════════════════════════
      // BACK MATTER
      // ══════════════════════════════════════════════════════════════════════
      spacer(400),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'CIS — Cognitive Intelligence System', bold: true, size: 28, font: 'Arial', color: NAVY })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 0 },
        children: [new TextRun({ text: 'Investigator Manual v1.0 — June 2026', size: 22, font: 'Arial', color: DGRAY })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 0 },
        children: [new TextRun({ text: 'Restricted — For authorised investigators only', size: 20, font: 'Arial', color: DGRAY, italics: true })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('CIS_User_Manual_v1.docx', buffer);
  console.log('Generated: CIS_User_Manual_v1.docx');
});
