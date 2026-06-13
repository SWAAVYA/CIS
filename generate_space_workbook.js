const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat, TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

const C = {
  navy:'1B3A5C', mid:'2E6DA4', light:'D0E4F4', xlight:'EBF4FC',
  green:'1A6B3C', greenBg:'D6F0E0', amber:'7B4F00', amberBg:'FFF3CD',
  red:'8B1A1A', redBg:'FCE4E4', grey:'555555', greyBg:'F2F2F2', white:'FFFFFF',
  purple:'4B0082', purpleBg:'EDE7F6',
};
const thinB = { style:BorderStyle.SINGLE, size:1, color:'CCCCCC' };
const borders = { top:thinB, bottom:thinB, left:thinB, right:thinB };
const noBorder = { style:BorderStyle.NONE, size:0, color:'FFFFFF' };
const noBorders = { top:noBorder, bottom:noBorder, left:noBorder, right:noBorder };
const sp = (b=0,a=0) => ({ spacing:{ before:b, after:a } });

function norm(text,opts={}) { return new TextRun({ text, size:22, font:'Arial', color:C.grey, ...opts }); }
function mono(text) { return new TextRun({ text, size:20, font:'Courier New', color:C.navy }); }
function pageBreak() { return new Paragraph({ children:[new PageBreak()] }); }

function h1(text) {
  return new Paragraph({ heading:HeadingLevel.HEADING_1, ...sp(320,160),
    children:[new TextRun({ text, bold:true, size:36, font:'Arial', color:C.navy })] });
}
function h2(text) {
  return new Paragraph({ heading:HeadingLevel.HEADING_2, ...sp(240,100),
    children:[new TextRun({ text, bold:true, size:26, font:'Arial', color:C.mid })] });
}
function h3(text) {
  return new Paragraph({ heading:HeadingLevel.HEADING_3, ...sp(180,80),
    children:[new TextRun({ text, bold:true, size:23, font:'Arial', color:C.navy })] });
}
function para(runs) {
  const children = typeof runs === 'string' ? [norm(runs)] : runs;
  return new Paragraph({ ...sp(60,60), children });
}

function hdrCell(text, w, bg=C.navy, fg=C.white) {
  return new TableCell({ borders, width:{ size:w, type:WidthType.DXA },
    shading:{ fill:bg, type:ShadingType.CLEAR },
    margins:{ top:80, bottom:80, left:120, right:120 },
    verticalAlign:VerticalAlign.CENTER,
    children:[new Paragraph({ children:[new TextRun({ text, bold:true, size:20, font:'Arial', color:fg })] })] });
}
function cell(text, w, bg=C.white, opts={}) {
  return new TableCell({ borders, width:{ size:w, type:WidthType.DXA },
    shading:{ fill:bg, type:ShadingType.CLEAR },
    margins:{ top:80, bottom:80, left:120, right:120 },
    children:[new Paragraph({ children:[new TextRun({ text, size:20, font:'Arial', color:C.grey, ...opts })] })] });
}
function mcell(runs, w, bg=C.white) {
  return new TableCell({ borders, width:{ size:w, type:WidthType.DXA },
    shading:{ fill:bg, type:ShadingType.CLEAR },
    margins:{ top:80, bottom:80, left:120, right:120 },
    children:[new Paragraph({ children:runs })] });
}

function statusBadge(status) {
  // RESOLVED-FAILURE / RESOLVED-SURVIVED / OPEN / OPEN-ESCALATED
  const map = {
    'RESOLVED — LOSS':      { bg:C.redBg,    fg:C.red    },
    'RESOLVED — SURVIVED':  { bg:C.greenBg,  fg:C.green  },
    'RESOLVED — DEGRADED':  { bg:C.amberBg,  fg:C.amber  },
    'OPEN':                 { bg:C.purpleBg, fg:C.purple },
    'OPEN — ESCALATED':     { bg:C.redBg,    fg:C.red    },
  };
  const s = map[status] || { bg:C.greyBg, fg:C.grey };
  return new TableCell({ borders, width:{ size:1800, type:WidthType.DXA },
    shading:{ fill:s.bg, type:ShadingType.CLEAR },
    margins:{ top:80, bottom:80, left:120, right:120 },
    verticalAlign:VerticalAlign.CENTER,
    children:[new Paragraph({ children:[new TextRun({ text:status, bold:true, size:19, font:'Arial', color:s.fg })] })] });
}

function infoBox(rows_kv, statusStr) {
  // rows_kv: [[label, value], ...]
  const W = [1800, 5760, 1800];
  const tableRows = rows_kv.map(([k,v], i) => new TableRow({ children:[
    cell(k, W[0], C.greyBg, { bold:true }),
    cell(v, W[1]),
    i === 0 ? statusBadge(statusStr) : cell('', W[2]),
  ]}));
  return new Table({ width:{ size:9360, type:WidthType.DXA }, columnWidths:W, rows:tableRows });
}

function callout(text, type='info') {
  const map = {
    info:     { bg:C.xlight,   border:C.mid,   label:'NOTE' },
    warn:     { bg:C.amberBg,  border:C.amber,  label:'WATCH' },
    ok:       { bg:C.greenBg,  border:C.green,  label:'RESOLUTION' },
    bad:      { bg:C.redBg,    border:C.red,    label:'CRITICAL' },
    open:     { bg:C.purpleBg, border:C.purple, label:'OPEN — NO CONCLUSION' },
  };
  const s = map[type];
  return new Table({ width:{ size:9360, type:WidthType.DXA }, columnWidths:[9360],
    rows:[new TableRow({ children:[new TableCell({
      borders:{ top:{ style:BorderStyle.SINGLE, size:8, color:s.border }, bottom:{ style:BorderStyle.SINGLE, size:1, color:s.border },
                left:{ style:BorderStyle.SINGLE, size:8, color:s.border }, right:{ style:BorderStyle.SINGLE, size:1, color:s.border } },
      shading:{ fill:s.bg, type:ShadingType.CLEAR },
      margins:{ top:100, bottom:100, left:160, right:160 },
      children:[
        new Paragraph({ children:[new TextRun({ text:s.label, bold:true, size:20, font:'Arial', color:s.border })], ...sp(0,40) }),
        new Paragraph({ children:[norm(text)], ...sp(0,0) }),
      ],
    })]})],
  });
}

// Signal table: variable number of rows, each signal gets its own entry
// Columns: #, Signal Text, Domain, Language, Expected, What Happened
function signalTable(signals) {
  // widths: 400, 3300, 1200, 700, 800, 2960 = 9360
  const W = [400, 3300, 1200, 700, 800, 2960];
  const header = new TableRow({ tableHeader:true, children:[
    hdrCell('#', W[0]), hdrCell('Signal', W[1]), hdrCell('Domain', W[2]),
    hdrCell('Lang', W[3]), hdrCell('Expected', W[4]), hdrCell('CIS Behaviour / Notes', W[5]),
  ]});
  const rows = signals.map((s, i) => {
    const expBg = s.exp==='ADMIT' ? C.greenBg : s.exp==='EXPIRE' ? C.redBg : s.exp==='BORDERLINE' ? C.amberBg : C.greyBg;
    const expFg = s.exp==='ADMIT' ? C.green   : s.exp==='EXPIRE' ? C.red   : s.exp==='BORDERLINE' ? C.amber   : C.grey;
    return new TableRow({ children:[
      cell(String(i+1), W[0], i%2===0?C.greyBg:C.white, { bold:true }),
      cell(s.signal,  W[1]),
      cell(s.domain,  W[2], C.xlight),
      cell(s.lang,    W[3], C.greyBg),
      new TableCell({ borders, width:{ size:W[4], type:WidthType.DXA },
        shading:{ fill:expBg, type:ShadingType.CLEAR },
        margins:{ top:80, bottom:80, left:80, right:80 },
        children:[new Paragraph({ children:[new TextRun({ text:s.exp, bold:true, size:19, font:'Arial', color:expFg })] })] }),
      cell(s.notes, W[5]),
    ]});
  });
  return new Table({ width:{ size:9360, type:WidthType.DXA }, columnWidths:W, rows:[header,...rows] });
}

function contradictionTable(rows) {
  const W = [2800,2800,3760];
  const hdr = new TableRow({ tableHeader:true, children:[
    hdrCell('Signal A',W[0]), hdrCell('Signal B',W[1]), hdrCell('Expected CIS Response',W[2]),
  ]});
  const dataRows = rows.map(r => new TableRow({ children:[
    cell(r.a,W[0]), cell(r.b,W[1]), cell(r.expected,W[2],C.amberBg),
  ]}));
  return new Table({ width:{ size:9360, type:WidthType.DXA }, columnWidths:W, rows:[hdr,...dataRows] });
}

function checkTable(items) {
  const W = [600,8760];
  const rows = items.map(item => new TableRow({ children:[
    cell('☐', W[0], C.light, { bold:true }),
    cell(item, W[1]),
  ]}));
  return new Table({ width:{ size:9360, type:WidthType.DXA }, columnWidths:W, rows });
}

// ─── TITLE PAGE ───────────────────────────────────────────────────────────
function titlePage() {
  return [
    new Paragraph({ ...sp(1200,0), children:[] }),
    new Paragraph({ alignment:AlignmentType.CENTER, ...sp(0,60),
      children:[new TextRun({ text:'CIS', bold:true, size:96, font:'Arial', color:C.navy })] }),
    new Paragraph({ alignment:AlignmentType.CENTER, ...sp(0,40),
      children:[new TextRun({ text:'Cognitive Intelligence System', size:28, font:'Arial', color:C.mid })] }),
    new Paragraph({ alignment:AlignmentType.CENTER,
      border:{ bottom:{ style:BorderStyle.SINGLE, size:6, color:C.mid, space:4 } }, ...sp(0,200), children:[] }),
    new Paragraph({ alignment:AlignmentType.CENTER, ...sp(200,80),
      children:[new TextRun({ text:'SPACE CASES WORKBOOK', bold:true, size:56, font:'Arial', color:C.navy })] }),
    new Paragraph({ alignment:AlignmentType.CENTER, ...sp(0,160),
      children:[new TextRun({ text:'Resolved Failures · Survived Emergencies · Open Investigations', size:24, font:'Arial', color:C.grey })] }),
    new Paragraph({ alignment:AlignmentType.CENTER, ...sp(0,40),
      children:[new TextRun({ text:'June 2026', size:22, font:'Arial', color:C.grey })] }),
    new Paragraph({ ...sp(400,0), children:[] }),
    new Table({ width:{ size:9360, type:WidthType.DXA }, columnWidths:[2340,2340,2340,2340],
      rows:[new TableRow({ children:[
        new TableCell({ borders:noBorders, shading:{ fill:C.redBg, type:ShadingType.CLEAR }, margins:{ top:120,bottom:120,left:160,right:160 },
          children:[new Paragraph({ children:[new TextRun({ text:'2 RESOLVED', bold:true, size:22, font:'Arial', color:C.red })]}),
                    new Paragraph({ children:[norm('Total loss of spacecraft or crew')]})] }),
        new TableCell({ borders:noBorders, shading:{ fill:C.greenBg, type:ShadingType.CLEAR }, margins:{ top:120,bottom:120,left:160,right:160 },
          children:[new Paragraph({ children:[new TextRun({ text:'2 RESOLVED', bold:true, size:22, font:'Arial', color:C.green })]}),
                    new Paragraph({ children:[norm('Mission or crew survived with damage')]})] }),
        new TableCell({ borders:noBorders, shading:{ fill:C.purpleBg, type:ShadingType.CLEAR }, margins:{ top:120,bottom:120,left:160,right:160 },
          children:[new Paragraph({ children:[new TextRun({ text:'1 OPEN', bold:true, size:22, font:'Arial', color:C.purple })]}),
                    new Paragraph({ children:[norm('Investigation active — no conclusion reached')]})] }),
        new TableCell({ borders:noBorders, shading:{ fill:C.amberBg, type:ShadingType.CLEAR }, margins:{ top:120,bottom:120,left:160,right:160 },
          children:[new Paragraph({ children:[new TextRun({ text:'35 SIGNALS', bold:true, size:22, font:'Arial', color:C.amber })]}),
                    new Paragraph({ children:[norm('Across all five cases — varying count per case')]})] }),
      ]})],
    }),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// CASE 1 — CHALLENGER STS-51-L (14 signals)
// ═══════════════════════════════════════════════════════════════════════════
function caseChallenger() {
  return [
    h1('Case 1 — Challenger STS-51-L'),
    infoBox([
      ['Mission',   'STS-51-L, Space Shuttle Challenger — 10th flight of OV-099'],
      ['Date',      '28 January 1986, launch from Kennedy Space Center, LC-39B'],
      ['Domains',   'Thermal Engineering · Flight Dynamics · Pre-Launch Ops · Contractor Comms'],
      ['Periods',   'Period 1 = months before launch. Period 2 = 27 Jan night. Period 3 = launch day 28 Jan.'],
    ], 'RESOLVED — LOSS'),
    new Paragraph({ ...sp(120,0), children:[] }),
    para('The crew of seven were lost 73 seconds after launch when the right solid rocket booster O-ring failed, causing structural collapse and aerodynamic breakup. The investigation identified cold temperature as the proximate cause and institutional suppression of engineering concern as the systemic cause.'),
    new Paragraph({ ...sp(80,0), children:[] }),
    h2('Signals'),
    signalTable([
      {
        signal: 'Historical erosion data across prior STS flights shows O-ring damage was documented on 7 of the previous 24 missions. Erosion severity correlates with colder launch temperatures (r = 0.83 across available data).',
        domain:'Thermal Engineering', lang:'Technical',
        exp:'ADMIT', notes:'Direction + Rate. The pattern across 24 missions is directional accumulation. SI_direction should score well. Correlation value is a rate anomaly.',
      },
      {
        signal: "Morton Thiokol engineer Roger Boisjoly wrote in a memo six months before the launch: \"It is my honest and considered opinion that if we do not take immediate action to dedicate a team to solve the problem... we stand in jeopardy of losing a flight along with all crew and launch pad facilities.\"",
        domain:'Contractor Comms', lang:'Plain',
        exp:'ADMIT', notes:"Plain language — extremely high relationship and rate signal. Tests whether CIS reads a direct expert warning as a structural anomaly. 'jeopardy of losing a flight' should register.",
      },
      {
        signal: 'Overnight temperature at KSC on 27–28 January fell to -7°C (19°F). Field joint O-ring operational specification requires temperatures above 10°C (50°F). All prior Shuttle launches occurred above 11°C.',
        domain:'Pre-Launch Ops', lang:'Technical',
        exp:'ADMIT', notes:'Rate — temperature is 17°C below specification minimum. Strong quantitative deviation. Should score rate near maximum.',
      },
      {
        signal: 'Ice was observed on the launch structure and fixed service structure at 06:00 on 28 January. Ice inspection team documented 32 separate areas of ice accumulation. Launch constraint for ice exists.',
        domain:'Pre-Launch Ops', lang:'Mixed',
        exp:'ADMIT', notes:'Configuration — 32 independent accumulation points, all simultaneously, against a launch constraint. Configuration dimension should fire.',
      },
      {
        signal: 'Rockwell International engineers stated they could not certify the vehicle as safe to launch given the ice conditions. They communicated this concern to NASA management on the morning of 28 January.',
        domain:'Contractor Comms', lang:'Plain',
        exp:'ADMIT', notes:"Relationship — engineers' certification withheld vs launch proceeding. Two parties that must agree (certifier and launcher) are diverging.",
      },
      {
        signal: 'Thiokol management held a teleconference on the night of 27 January. Engineers unanimously recommended a launch hold. Management reversed the recommendation after being asked to "take off their engineering hat and put on their management hat."',
        domain:'Contractor Comms', lang:'Mixed',
        exp:'ADMIT', notes:'Relationship — unanimous technical recommendation directly contradicted by management decision. Should score relationship strongly. Also rate: decision process itself is anomalous.',
      },
      {
        signal: 'STS-51-C (January 1985) flew at 11.6°C and showed the worst O-ring erosion on record at that time. This data was available to all parties during the 27 January teleconference.',
        domain:'Thermal Engineering', lang:'Technical',
        exp:'ADMIT', notes:'Relationship — historical data point directly available during the go/no-go decision but not acted on. Tests whether CIS treats available-but-ignored evidence as a structural signal.',
      },
      {
        signal: 'Shuttle main engine performance nominal across all three engines at T-6.6 seconds. No anomalies detected in pre-ignition sequence. SSME health monitoring showed all parameters within redline limits.',
        domain:'Flight Dynamics', lang:'Technical',
        exp:'EXPIRE', notes:"Within limits — should expire. The problem was not the main engines. Tests that CIS doesn't admit things that are genuinely fine.",
      },
      {
        signal: 'SRB joint pressure readings at T+0.678s showed a pressure drop of 934 psi in the right SRB aft field joint area. This was outside the expected range and inconsistent with the left SRB reading of 1,004 psi at the same interval.',
        domain:'Flight Dynamics', lang:'Technical',
        exp:'ADMIT', notes:'Rate + Relationship — deviation from expected AND inconsistency between left and right SRB. Both dimensions should fire. This is the first telemetry sign of the breach.',
      },
      {
        signal: 'At T+58.788s, a bright flame plume was visible on post-event camera footage emerging from the right SRB lower joint. It was not detected by onboard systems at the time.',
        domain:'Flight Dynamics', lang:'Mixed',
        exp:'ADMIT', notes:'Rate — visible anomaly inconsistent with expected SRB combustion pattern. Tests whether CIS admits post-event reconstructed observations entered retrospectively.',
      },
      {
        signal: 'Flight crew were not informed of the O-ring concerns raised during the 27 January teleconference. Commander Dick Scobee and Pilot Michael Smith had no knowledge of the debate. Standard crew briefings were completed.',
        domain:'Pre-Launch Ops', lang:'Plain',
        exp:'ADMIT', notes:'Relationship — two parties who should share safety-critical information are operating with different information. Information asymmetry as structural incongruence.',
      },
      {
        signal: 'The crew module remained structurally intact through the aerodynamic breakup at T+73s and was recovered from the Atlantic. Crew survival systems were found to have been manually activated. Impact with ocean surface occurred at approximately 333 km/h.',
        domain:'Flight Dynamics', lang:'Technical',
        exp:'BORDERLINE', notes:"Borderline — this describes the outcome, not an anomaly per se. Some rate signal ('333 km/h impact') but it's a consequence, not a leading indicator. Note SI score.",
      },
      {
        signal: 'Previous launch constraint flagging O-ring concerns had been formally waived for STS-51-C. The waiver process was used as precedent to proceed on STS-51-L despite unresolved concerns. Constraint closure was documented as complete.',
        domain:'Contractor Comms', lang:'Technical',
        exp:'ADMIT', notes:'Relationship — documented closure of a constraint that was not actually resolved. Records say one thing; technical state is another.',
      },
      {
        signal: 'Seven crew members: Francis Scobee (CDR), Michael Smith (PLT), Judith Resnik (MS1), Ellison Onizuka (MS2), Ronald McNair (MS3), Gregory Jarvis (PS1), Christa McAuliffe (PS2). All were lost.',
        domain:'Pre-Launch Ops', lang:'Plain',
        exp:'EXPIRE', notes:"Personnel manifest — no anomaly in the signal itself. Should expire. Tests that factual records without structural incongruence don't inflate SI.",
      },
    ]),
    new Paragraph({ ...sp(120,0), children:[] }),
    h2('Contradictions to Register'),
    contradictionTable([
      {
        a:"Thiokol engineers unanimously recommended launch hold on night of 27 Jan. Concerns documented in teleconference minutes.",
        b:"NASA launch director proceeded with 28 Jan launch. Launch constraint waiver documented as complete and approved.",
        expected:"Both quarantined. Hypothesis: institutional override of engineering safety signal (RC-2 Falsification — decision record falsified by waiver).",
      },
      {
        a:"SRB O-ring temperature specification: minimum 10°C. Launch temperature: -7°C.",
        b:"Launch proceeded as normal. No HOLD issued. Launch declared GO by all parties.",
        expected:"Both quarantined. Hypothesis: specification breach admitted and normalised (RC-1 Misclassification — breach treated as acceptable).",
      },
    ]),
    new Paragraph({ ...sp(120,0), children:[] }),
    callout("RESOLUTION: The right SRB aft field joint O-ring failed to seal at T+0.678s due to cold-induced loss of elasticity. Hot gas breached the joint, impinged on the external tank, caused structural failure, and aerodynamic forces destroyed the vehicle at T+73s. Root cause: O-ring temperature sensitivity was known and documented. Management proceeded despite unanimous engineer objection. Rogers Commission (1986) cited both technical failure and organisational culture as causes.", 'ok'),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// CASE 2 — MARS CLIMATE ORBITER (6 signals)
// ═══════════════════════════════════════════════════════════════════════════
function caseMCO() {
  return [
    h1('Case 2 — Mars Climate Orbiter'),
    infoBox([
      ['Mission',   'MCO — NASA Mars Climate Orbiter, launched 11 December 1998'],
      ['Date',      '23 September 1999 — orbital insertion attempt, Mars'],
      ['Domains',   'Navigation · Ground Software · Trajectory Analysis · Mission Ops'],
      ['Periods',   'Period 1 = cruise (Dec 1998–Sep 1999). Period 2 = Mars approach. Period 3 = insertion.'],
    ], 'RESOLVED — LOSS'),
    new Paragraph({ ...sp(120,0), children:[] }),
    para('The spacecraft was lost during Mars Orbit Insertion. Post-event analysis identified that Lockheed Martin ground software was outputting thruster force data in pound-force·seconds (lbf·s) while NASA navigation software expected newton·seconds (N·s). The unit mismatch caused incorrect trajectory corrections throughout the cruise phase.'),
    new Paragraph({ ...sp(80,0), children:[] }),
    h2('Signals'),
    signalTable([
      {
        signal: "Navigation team noted that the spacecraft's trajectory showed cumulative drift inconsistent with the thruster firing model. Over 9 months of cruise, residuals were accumulating in the out-of-plane direction at a rate that was unexplained by known forces.",
        domain:'Navigation', lang:'Technical',
        exp:'ADMIT', notes:'Direction + Rate — accumulating unexplained residuals over 9 months. Direction should score strongly. Tests whether long-timescale accumulation registers.',
      },
      {
        signal: "During cruise, three separate trajectory correction manoeuvres (TCM-5, TCM-8, TCM-12) were performed. All three produced results that were off from predicted by a consistent factor — each correction was too large by approximately 4.45, corresponding exactly to the lbf-to-N conversion factor.",
        domain:'Navigation', lang:'Technical',
        exp:'ADMIT', notes:'Configuration + Relationship — three independent corrections, all off by the same factor. Systematic error across multiple events is a strong configuration signal.',
      },
      {
        signal: "Navigation engineer Robert Mase flagged in an internal report that the trajectory data coming from the Lockheed ground system showed angular momentum values that did not match what was expected. The report was filed but not escalated.",
        domain:'Ground Software', lang:'Mixed',
        exp:'ADMIT', notes:"Relationship — engineer's report identifies mismatch between source data and expectation. Filed but not acted on. Tests whether a noted-but-suppressed anomaly admits.",
      },
      {
        signal: 'Spacecraft telemetry throughout cruise showed all onboard systems operating within nominal parameters. Power, thermal, attitude control, and telecommunications all reporting green.',
        domain:'Mission Ops', lang:'Technical',
        exp:'EXPIRE', notes:"All nominal — should expire. The spacecraft itself was fine. The problem was external. Tests that CIS doesn't admit a healthy spacecraft.",
      },
      {
        signal: "At closest approach on 23 September 1999, the spacecraft entered occultation behind Mars at an altitude of approximately 57 km — well below the planned orbital insertion altitude of 150–170 km and below the atmospheric survivability threshold of 80 km.",
        domain:'Trajectory Analysis', lang:'Technical',
        exp:'ADMIT', notes:'Rate — altitude is 93–113 km below the intended insertion corridor. Extreme quantitative deviation at the moment of loss.',
      },
      {
        signal: "The spacecraft did not re-emerge from behind Mars after the expected occultation period. All contact was lost. Recovery attempts were unsuccessful.",
        domain:'Mission Ops', lang:'Plain',
        exp:'ADMIT', notes:"Rate — absence of expected signal (spacecraft re-emergence). 'Did not re-emerge' is a strong rate signal. Tests plain-language absence detection.",
      },
    ]),
    new Paragraph({ ...sp(120,0), children:[] }),
    h2('Contradictions to Register'),
    contradictionTable([
      {
        a:"Navigation trajectory residuals showed consistent unexplained drift across 9-month cruise. Filed in internal report.",
        b:"Mission was declared on track for orbital insertion. No hold or trajectory review was escalated to management.",
        expected:"Both quarantined. Hypothesis: known navigation anomaly suppressed or normalised before insertion (RC-1 Misclassification).",
      },
    ]),
    new Paragraph({ ...sp(120,0), children:[] }),
    checkTable([
      "Signals 1, 2, 3, 5, 6 admitted. Signal 4 expired.",
      "Signal 2 (consistent factor across 3 TCMs) — configuration dimension should score clearly. If it doesn't, note whether 'consistent factor' or 'three separate' triggered direction instead.",
      "Signal 3 (filed but not escalated) — tests whether CIS captures institutional suppression as a signal. Check relationship score.",
      "SHG: Signals 1, 2, 3 should connect (all Navigation/Ground Software, same accumulation period). Signal 6 connects to 5 (trajectory → loss).",
    ]),
    new Paragraph({ ...sp(120,0), children:[] }),
    callout("RESOLUTION: The unit mismatch (lbf·s vs N·s) caused trajectory corrections to be 4.45x too large throughout cruise. The resulting trajectory brought MCO 57 km above Mars surface — inside the atmosphere — during orbital insertion. The spacecraft was destroyed by aerodynamic heating. Root cause: interface specification not verified between two software systems from different contractors. The mismatch was detectable from cruise data and was noted but not acted on.", 'ok'),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// CASE 3 — APOLLO 13 (8 signals)
// ═══════════════════════════════════════════════════════════════════════════
function caseApollo13() {
  return [
    h1('Case 3 — Apollo 13'),
    infoBox([
      ['Mission',   'Apollo 13 — lunar landing mission, crew: Lovell, Swigert, Haise'],
      ['Date',      '13 April 1970, 55:55 MET (Mission Elapsed Time) — oxygen tank explosion'],
      ['Domains',   'Electrical & Power · Propulsion & Pressure · Life Support · Mission Control'],
      ['Periods',   'Period 1 = pre-event. Period 2 = explosion and immediate aftermath. Period 3 = return transit.'],
    ], 'RESOLVED — SURVIVED'),
    new Paragraph({ ...sp(120,0), children:[] }),
    para('At 55:55 MET, oxygen tank 2 in the Service Module exploded following a short circuit in its internal fan motor wiring. The explosion ruptured the tank and damaged oxygen tank 1, disabling two of the three fuel cells and crippling the Command/Service Module. The crew used the Lunar Module as a lifeboat and returned safely to Earth after 87 hours.'),
    new Paragraph({ ...sp(80,0), children:[] }),
    h2('Signals'),
    signalTable([
      {
        signal: "Oxygen tank 2 had been dropped during ground servicing at the Kennedy Space Center prior to mission, causing internal damage to the Teflon-coated fill line. This was not detected during pre-flight inspections. The tank was installed as flight hardware.",
        domain:'Propulsion & Pressure', lang:'Technical',
        exp:'ADMIT', notes:"Rate + Relationship — known physical event (drop) that should have triggered inspection. Records show installation as flight hardware. Relationship: physical state vs recorded status diverge.",
      },
      {
        signal: "During a cryogenic tank stir at 55:53 MET, Jack Swigert reported a 'pretty large bang' followed by 'a real problem' — the crew immediately observed master alarm lights and anomalous readings on multiple gauges simultaneously.",
        domain:'Mission Control', lang:'Plain',
        exp:'ADMIT', notes:"Configuration — 'large bang', master alarm, multiple gauges simultaneously. Multiple independent indicators firing at once. Tests plain-language crew report as configuration signal.",
      },
      {
        signal: "O2 tank 2 pressure dropped from 865 psi to zero within 130 seconds of the explosion. Tank 1 pressure fell from 900 psi to 296 psi over the following 2 hours 29 minutes before stabilising at depletion.",
        domain:'Propulsion & Pressure', lang:'Technical',
        exp:'ADMIT', notes:'Direction + Rate — both tanks draining. Tank 2 is a rate signal (zero in 130s). Tank 1 is direction (monitonic decline over 2.5h). Both dimensions should score.',
      },
      {
        signal: "Fuel cells 1 and 3 failed sequentially within 3 hours of the explosion as oxygen supply was lost. Fuel cell 2 had failed prior to the explosion for unrelated reasons. All three primary power sources were unavailable.",
        domain:'Electrical & Power', lang:'Technical',
        exp:'ADMIT', notes:'Configuration + Direction — three independent power sources all failed. Sequential failure across a short window. Configuration should score at maximum.',
      },
      {
        signal: "Flight Director Gene Kranz stated to the flight control team: 'Let's everybody keep cool. Let's make sure we don't do anything that's going to compound this problem.' No official emergency declaration had yet been made.",
        domain:'Mission Control', lang:'Plain',
        exp:'BORDERLINE', notes:"Borderline — Kranz's statement signals awareness of a serious problem but is not itself a data anomaly. May admit weakly (relationship: 'don't compound' implies multiple problems) or expire. Note outcome.",
      },
      {
        signal: "Carbon dioxide levels in the Lunar Module began rising as the crew used it as a lifeboat. LM life support was designed for 2 people for 45 hours. Three people required it for 87 hours — a 287% overuse of the designed capacity.",
        domain:'Life Support', lang:'Mixed',
        exp:'ADMIT', notes:"Rate — 287% above designed capacity. Quantitative deviation that is extreme. Should score rate near maximum.",
      },
      {
        signal: "Mission Control and crew designed a carbon dioxide scrubber adapter using Lunar Module square canisters and Command Module round canisters — components that were not designed to be interchangeable. The fix used plastic bags, cardboard, and suit hoses.",
        domain:'Life Support', lang:'Mixed',
        exp:'ADMIT', notes:'Relationship — two systems that must function together (LM and CM scrubbers) are physically incompatible. Classic relationship signal: two things that should be compatible are not.',
      },
      {
        signal: "Command Module computer was powered down to preserve entry battery power. Reactivation procedure had never been tested in this configuration. Guidance and navigation computer was brought back online at 141:30 MET — all systems re-acquired nominal function.",
        domain:'Electrical & Power', lang:'Technical',
        exp:'BORDERLINE', notes:"Borderline — 'never been tested' suggests rate anomaly (untested procedure = deviation from expected protocol). But outcome was nominal. Tests whether an untested-but-successful procedure registers. Note SI score.",
      },
    ]),
    new Paragraph({ ...sp(120,0), children:[] }),
    h2('Contradictions to Register'),
    contradictionTable([
      {
        a:"O2 tank 2 installed as flight hardware — pre-flight inspection records show no findings.",
        b:"Tank 2 had been physically dropped during ground servicing, causing internal damage to Teflon fill line.",
        expected:"Both quarantined. Hypothesis: physical damage not propagated to inspection record (RC-2 Falsification by omission — damage occurred but was not documented as affecting airworthiness).",
      },
    ]),
    new Paragraph({ ...sp(120,0), children:[] }),
    callout("RESOLUTION: Crew returned safely to Earth on 17 April 1970, 142:54 MET. The Lunar Module lifeboat strategy preserved life support. Carbon dioxide was managed by the improvised scrubber adapter. Root cause: Oxygen tank 2 wiring was damaged on the ground, but the damage was concealed by the tank's internal thermostatic switch behaviour during a pre-launch test. The anomaly was noted during pre-launch testing but attributed to a switch, not wiring. It was not corrected.", 'ok'),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// CASE 4 — HUBBLE PRIMARY MIRROR (5 signals)
// ═══════════════════════════════════════════════════════════════════════════
function caseHubble() {
  return [
    h1('Case 4 — Hubble Space Telescope Primary Mirror'),
    infoBox([
      ['Mission',   'Hubble Space Telescope — STS-31, deployed 25 April 1990'],
      ['Date',      'June 1990 — first light images returned. Spherical aberration discovered.'],
      ['Domains',   'Optics & Fabrication · Test & Verification · Contractor QA · Mission Commissioning'],
      ['Periods',   'Period 1 = fabrication (1979–1981). Period 2 = acceptance testing. Period 3 = on-orbit commissioning.'],
    ], 'RESOLVED — DEGRADED'),
    new Paragraph({ ...sp(120,0), children:[] }),
    para('Hubble was launched with a primary mirror ground to the wrong prescription. The mirror was figured to nanometre precision — but to the wrong shape. The error was 2.2 micrometres at the edge, caused by a misassembled null corrector used as the sole testing reference. The mirror passed all acceptance tests because all tests used the same flawed instrument.'),
    new Paragraph({ ...sp(80,0), children:[] }),
    h2('Signals'),
    signalTable([
      {
        signal: "During fabrication, a lens element (the field lens) in the null corrector was positioned 1.3 mm too far from its intended location. This was identified during assembly but the measurement was attributed to a flawed cap rather than a positioning error. No corrective action was taken.",
        domain:'Optics & Fabrication', lang:'Technical',
        exp:'ADMIT', notes:'Relationship — anomaly identified, attributed to the wrong cause, and not corrected. Two interpretations of the same measurement: one was right (positioning error), one was acted on (cap flaw). Classic relationship incongruence.',
      },
      {
        signal: "Independent tests using star patterns at the Perkin-Elmer facility showed spherical aberration. The results were dismissed as likely caused by the test setup rather than the mirror. No further investigation was conducted.",
        domain:'Test & Verification', lang:'Plain',
        exp:'ADMIT', notes:'Relationship — independent test showed aberration; it was attributed to the test equipment rather than the mirror. Two readings disagree and the wrong one was trusted.',
      },
      {
        signal: "The null corrector used to verify the mirror figure was the only instrument trusted for the final acceptance test. NASA acceptance review did not require an independent measurement using a different testing method.",
        domain:'Contractor QA', lang:'Technical',
        exp:'ADMIT', notes:"Rate — single point of verification for a safety-critical measurement. Absence of independent check is a structural anomaly. Tests whether 'only' and 'did not require' trigger rate.",
      },
      {
        signal: "First light images from Hubble on 20 June 1990 showed stars appearing as fuzzy rings rather than sharp points. Mission scientists immediately identified the image quality as far below specification.",
        domain:'Mission Commissioning', lang:'Plain',
        exp:'ADMIT', notes:"Rate — 'far below specification', 'fuzzy rings rather than sharp points'. Qualitative deviation from expected output should register as rate.",
      },
      {
        signal: "Wavefront analysis of first light data determined spherical aberration of 2.2 micrometres RMS at the edge of the mirror — a deviation of 10 times the allowable tolerance for a diffraction-limited telescope.",
        domain:'Optics & Fabrication', lang:'Technical',
        exp:'ADMIT', notes:'Rate — 10x the allowable tolerance is an extreme quantitative deviation. Should score rate near maximum.',
      },
    ]),
    new Paragraph({ ...sp(120,0), children:[] }),
    h2('Contradictions to Register'),
    contradictionTable([
      {
        a:"Star pattern tests during fabrication showed spherical aberration — results on file.",
        b:"Mirror passed all formal acceptance tests. Certificate of conformance issued. Mirror declared flight-ready.",
        expected:"Both quarantined. Hypothesis: acceptance certification contradicts independent test data — institutional suppression of aberration finding (RC-2 Falsification).",
      },
    ]),
    new Paragraph({ ...sp(120,0), children:[] }),
    callout("RESOLUTION: STS-61 servicing mission (December 1993) installed COSTAR — a corrective optics package designed to compensate for the exact figure error. Hubble subsequently achieved its intended optical performance. Root cause: the null corrector was the only trusted measurement reference, and the one independent test that showed aberration was dismissed. A single flawed instrument was used to both fabricate and verify the mirror against itself.", 'ok'),
    pageBreak(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// CASE 5 — ISS SOYUZ MS-10 ANOMALY (OPEN)
// Wait — let me use a real open/recent one
// Actually: Soyuz MS-09 (2018) hull breach — cause disputed, still somewhat open culturally
// ═══════════════════════════════════════════════════════════════════════════
function caseSoyuz() {
  return [
    h1('Case 5 — Soyuz MS-09 Hull Breach'),
    infoBox([
      ['Mission',   'Soyuz MS-09 — docked to ISS MRM-1 (Rassvet) module, Expedition 56/57'],
      ['Date',      '29 August 2018 — breach discovered. Cause formally disputed as of case opening.'],
      ['Domains',   'Structural Integrity · Environmental Control · Crew Reports · Manufacturer Investigation'],
      ['Periods',   'Period 1 = pre-discovery. Period 2 = breach discovered and contained. Period 3 = investigation.'],
    ], 'OPEN'),
    new Paragraph({ ...sp(120,0), children:[] }),
    para('On 29 August 2018, a small hole approximately 2mm in diameter was discovered in the Soyuz MS-09 spacecraft docked to the ISS. The station lost approximately 0.8 mm Hg of pressure overnight before the breach was located and temporarily sealed with epoxy. The cause of the hole has been formally disputed between NASA, Roscosmos, and Energia. Investigation remains contested.'),
    new Paragraph({ ...sp(80,0), children:[] }),
    h2('Signals'),
    signalTable([
      {
        signal: "ISS environmental data showed a gradual pressure decline of 0.8 mm Hg (0.04%) over approximately 12 hours on the night of 29 August 2018. The decline rate was below the automatic alert threshold. Crew noticed the anomaly during a routine morning check.",
        domain:'Environmental Control', lang:'Technical',
        exp:'ADMIT', notes:"Rate + Direction — pressure declining below baseline, accumulating over 12h. Direction should score for the monotonic decline. Rate fires because it is below what is expected (stable).",
      },
      {
        signal: "The hole was located in the habitation section of the Soyuz MS-09 orbital module after a methodical search by crew members using a finger wetted with water and a piece of tea bag. Commander Alexander Gerst located the hole by feel.",
        domain:'Structural Integrity', lang:'Plain',
        exp:'BORDERLINE', notes:"Borderline — describes the discovery method, not the anomaly itself. No structural incongruence in the signal. May expire or borderline admit. Note outcome.",
      },
      {
        signal: "The hole showed characteristics consistent with a drill bit entry point: circular edges, composite material debris pushed inward, drill marks visible around the perimeter. No meteorite impact crater morphology was present.",
        domain:'Structural Integrity', lang:'Technical',
        exp:'ADMIT', notes:'Relationship — hole morphology (drill characteristics) is inconsistent with the expected cause (micrometeorite or manufacturing defect). Two explanations disagree with physical evidence.',
      },
      {
        signal: "Energia (manufacturer) investigators identified a mark near the hole consistent with a human hand holding the spacecraft structure. The suggestion was that the hole was drilled deliberately or by accident during manufacturing, then covered with epoxy that later failed in orbit.",
        domain:'Manufacturer Investigation', lang:'Mixed',
        exp:'ADMIT', notes:'Rate + Relationship — manufacturing explanation contradicts orbital-cause explanations. Multiple competing hypotheses from different investigators. Should score relationship strongly.',
      },
      {
        signal: "Roscosmos head Dmitry Rogozin stated publicly that the hole could have been drilled in space deliberately. He did not provide supporting evidence. NASA administrator Jim Bridenstine stated it was premature to assign blame. Both statements were made within 24 hours of each other.",
        domain:'Manufacturer Investigation', lang:'Plain',
        exp:'ADMIT', notes:'Relationship — two official bodies with authority on the same event are publicly contradicting each other. Tests whether institutional disagreement registers as relationship incongruence.',
      },
      {
        signal: "NASA's technical investigation concluded the breach was most likely caused by a manufacturing error — specifically an accidental drill during vehicle assembly at the Energia facility in Korolev. The conclusion was not officially endorsed by Roscosmos.",
        domain:'Manufacturer Investigation', lang:'Technical',
        exp:'ADMIT', notes:'Relationship — NASA conclusion explicitly not endorsed by Roscosmos. Two investigation bodies, same evidence, different conclusions. Strong relationship signal.',
      },
      {
        signal: "Crew sealed the breach temporarily with epoxy on 30 August. A more permanent patch using Kapton tape and sealant was applied by cosmonauts Prokopyev and Kononenko during an EVA on 15 December 2018. Station pressure returned to nominal following the temporary repair.",
        domain:'Environmental Control', lang:'Mixed',
        exp:'EXPIRE', notes:"Repair and restoration — pressure 'returned to nominal'. Should expire after the repair. Tests that a resolved sub-event doesn't continue to generate SI.",
      },
      {
        signal: "Soyuz MS-09 returned to Earth on 20 December 2018 with the patched hull. Post-landing inspection was conducted by Roscosmos. Results of the post-landing inspection were not made public.",
        domain:'Manufacturer Investigation', lang:'Plain',
        exp:'ADMIT', notes:"Relationship — inspection conducted but results withheld. Expected transparency vs actual opacity. 'Were not made public' as a relationship signal between expected disclosure and actual disclosure.",
      },
    ]),
    new Paragraph({ ...sp(120,0), children:[] }),
    h2('Contradictions to Register'),
    contradictionTable([
      {
        a:"Hole morphology consistent with a drill bit — circular edges, inward debris, no impact crater.",
        b:"Roscosmos suggested hole could have been drilled in space deliberately. No physical evidence presented for this scenario.",
        expected:"Both quarantined. Hypothesis: physical evidence contradicts public institutional statement — possible disinformation or premature public claim (RC-2).",
      },
      {
        a:"NASA concluded manufacturing error at Energia facility — accidental drill during assembly.",
        b:"Roscosmos did not officially endorse NASA conclusion. Post-landing inspection results not made public.",
        expected:"Both quarantined. Hypothesis: two investigation bodies have reached incompatible conclusions — result withheld to avoid accountability (RC-1 Misclassification — cause deliberately left unresolved).",
      },
    ]),
    new Paragraph({ ...sp(120,0), children:[] }),
    checkTable([
      "Signals 1, 3, 4, 5, 6, 8 admitted. Signal 2 borderline or expired. Signal 7 expired.",
      "Signal 5 (Rogozin vs Bridenstine public statements) — institutional contradiction. Check whether 'contradicting each other' in the signal text scores relationship.",
      "Signal 8 ('results not made public') — tests absence of expected disclosure as a relationship signal. If it expires, consider adding 'results were withheld' phrasing.",
      "Two contradictions registered — verifies case 5 can hold multiple contradictions simultaneously.",
      "Hypothesis Board: expects at least two hypotheses — one for physical evidence vs public statement, one for dual investigation conclusions.",
      "Because this case is OPEN: Cognitive Briefing should state no resolution reached, competing hypotheses active.",
    ]),
    new Paragraph({ ...sp(120,0), children:[] }),
    callout("OPEN — NO CONCLUSION: The cause of the Soyuz MS-09 breach has not been publicly agreed upon by all parties. Physical evidence points to a manufacturing drill error. The hypothesis of deliberate in-orbit drilling has not been substantiated. Roscosmos has not formally accepted the manufacturing error conclusion. Post-landing inspection data remains undisclosed. This case remains open for calibration purposes.", 'open'),
    pageBreak(),
  ];
}

// ─── CALIBRATION TABLE ────────────────────────────────────────────────────
function calibTable() {
  return [
    h1('Signal Outcome Reference'),
    para('Fill in Actual and SI Score after running each case through CIS.'),
    new Paragraph({ ...sp(80,0), children:[] }),
    new Table({
      width:{ size:9360, type:WidthType.DXA },
      columnWidths:[400,1000,3200,1160,1160,2440],
      rows:[
        new TableRow({ tableHeader:true, children:[
          hdrCell('#',400), hdrCell('Case',1000), hdrCell('Signal (short)',3200),
          hdrCell('Expected',1160), hdrCell('Actual',1160), hdrCell('SI / Notes',2440),
        ]}),
        ...[
          // Challenger
          ['1','Challenger','O-ring erosion vs temperature correlation across 24 flights','ADMIT','',''],
          ['2','Challenger','Boisjoly memo: "jeopardy of losing a flight"','ADMIT','',''],
          ['3','Challenger','Temperature -7°C vs spec minimum 10°C','ADMIT','',''],
          ['4','Challenger','32 ice accumulation points on launch structure','ADMIT','',''],
          ['5','Challenger','Rockwell could not certify vehicle as safe','ADMIT','',''],
          ['6','Challenger','Engineers unanimous hold — management reversed','ADMIT','',''],
          ['7','Challenger','STS-51-C cold erosion data available at teleconference','ADMIT','',''],
          ['8','Challenger','SSME performance nominal at T-6.6s','EXPIRE','',''],
          ['9','Challenger','Right SRB pressure drop 934 psi at T+0.678s','ADMIT','',''],
          ['10','Challenger','Flame plume visible on camera at T+58s','ADMIT','',''],
          ['11','Challenger','Crew not informed of O-ring debate','ADMIT','',''],
          ['12','Challenger','Crew module intact at breakup — ocean impact 333 km/h','BORDERLINE','',''],
          ['13','Challenger','Launch constraint waiver used as precedent','ADMIT','',''],
          ['14','Challenger','Personnel manifest — seven crew members','EXPIRE','',''],
          // MCO
          ['15','MCO','Unexplained out-of-plane trajectory residuals over 9 months','ADMIT','',''],
          ['16','MCO','3 TCMs all off by factor of 4.45 (lbf to N)','ADMIT','',''],
          ['17','MCO','Mase internal report — not escalated','ADMIT','',''],
          ['18','MCO','Onboard systems all nominal throughout cruise','EXPIRE','',''],
          ['19','MCO','Insertion altitude 57 km (planned 150–170 km)','ADMIT','',''],
          ['20','MCO','Spacecraft did not re-emerge from occultation','ADMIT','',''],
          // Apollo 13
          ['21','Apollo 13','Tank 2 dropped at KSC — installed as flight hardware','ADMIT','',''],
          ['22','Apollo 13','Swigert: "pretty large bang" — master alarms, multiple gauges','ADMIT','',''],
          ['23','Apollo 13','O2 tank 2 → zero in 130s; tank 1 declined 2.5h','ADMIT','',''],
          ['24','Apollo 13','All 3 fuel cells failed within 3 hours','ADMIT','',''],
          ['25','Apollo 13',"Kranz: 'don't compound this problem' — no emergency declared",'BORDERLINE','',''],
          ['26','Apollo 13','LM life support used at 287% of designed capacity','ADMIT','',''],
          ['27','Apollo 13','Square CM canisters incompatible with round LM canisters','ADMIT','',''],
          ['28','Apollo 13','CM computer reactivated — procedure never tested — all nominal','BORDERLINE','',''],
          // Hubble
          ['29','Hubble','Field lens 1.3mm off — attributed to cap, not positioning','ADMIT','',''],
          ['30','Hubble','Star pattern test showed aberration — dismissed as test error','ADMIT','',''],
          ['31','Hubble','Null corrector: only verification method, no independent check','ADMIT','',''],
          ['32','Hubble','First light: stars appear as fuzzy rings','ADMIT','',''],
          ['33','Hubble','Spherical aberration 2.2μm — 10x allowable tolerance','ADMIT','',''],
          // Soyuz
          ['34','Soyuz','Pressure decline 0.8 mm Hg over 12h — below alert threshold','ADMIT','',''],
          ['35','Soyuz','Hole located by crew using wetted finger','BORDERLINE','',''],
          ['36','Soyuz','Hole morphology: drill characteristics, no impact crater','ADMIT','',''],
          ['37','Soyuz','Energia: hand mark near hole — manufacturing drill hypothesis','ADMIT','',''],
          ['38','Soyuz','Rogozin: drilled in space. Bridenstine: premature to assign blame.','ADMIT','',''],
          ['39','Soyuz','NASA: manufacturing error. Roscosmos: did not endorse.','ADMIT','',''],
          ['40','Soyuz','Breach sealed — pressure returned to nominal','EXPIRE','',''],
          ['41','Soyuz','Post-landing inspection conducted — results not made public','ADMIT','',''],
        ].map(([n,c,s,exp,act,notes],i) => new TableRow({ children:[
          cell(n,400,i%2===0?C.greyBg:C.white,{bold:true}),
          cell(c,1000,i%2===0?C.greyBg:C.white),
          cell(s,3200),
          new TableCell({ borders, width:{size:1160,type:WidthType.DXA},
            shading:{fill: exp==='ADMIT'?C.greenBg:exp==='EXPIRE'?C.redBg:C.amberBg, type:ShadingType.CLEAR},
            margins:{top:60,bottom:60,left:80,right:80},
            children:[new Paragraph({children:[new TextRun({text:exp,bold:true,size:18,font:'Arial',
              color:exp==='ADMIT'?C.green:exp==='EXPIRE'?C.red:C.amber})]})] }),
          cell(act,1160),
          cell(notes,2440),
        ]})),
      ],
    }),
  ];
}

// ─── BUILD ─────────────────────────────────────────────────────────────────
async function main() {
  const doc = new Document({
    numbering:{ config:[
      { reference:'numbers', levels:[{ level:0, format:LevelFormat.DECIMAL, text:'%1.', alignment:AlignmentType.LEFT,
          style:{ paragraph:{ indent:{ left:720, hanging:360 } } } }] },
      { reference:'bullets', levels:[{ level:0, format:LevelFormat.BULLET, text:'•', alignment:AlignmentType.LEFT,
          style:{ paragraph:{ indent:{ left:720, hanging:360 } } } }] },
    ]},
    styles:{
      default:{ document:{ run:{ font:'Arial', size:22 } } },
      paragraphStyles:[
        { id:'Heading1', name:'Heading 1', basedOn:'Normal', next:'Normal', quickFormat:true,
          run:{ size:36, bold:true, font:'Arial', color:C.navy },
          paragraph:{ spacing:{ before:320, after:160 }, outlineLevel:0 } },
        { id:'Heading2', name:'Heading 2', basedOn:'Normal', next:'Normal', quickFormat:true,
          run:{ size:26, bold:true, font:'Arial', color:C.mid },
          paragraph:{ spacing:{ before:240, after:100 }, outlineLevel:1 } },
        { id:'Heading3', name:'Heading 3', basedOn:'Normal', next:'Normal', quickFormat:true,
          run:{ size:23, bold:true, font:'Arial', color:C.navy },
          paragraph:{ spacing:{ before:180, after:80 }, outlineLevel:2 } },
      ],
    },
    sections:[{
      properties:{
        page:{
          size:{ width:12240, height:15840 },
          margin:{ top:1080, right:1080, bottom:1080, left:1080 },
        },
      },
      headers:{ default: new Header({ children:[new Paragraph({
        border:{ bottom:{ style:BorderStyle.SINGLE, size:4, color:C.mid, space:4 } },
        tabStops:[{ type:TabStopType.RIGHT, position:TabStopPosition.MAX }],
        children:[
          new TextRun({ text:'CIS — Space Cases Workbook', size:18, font:'Arial', color:C.mid }),
          new TextRun({ text:'\tJune 2026', size:18, font:'Arial', color:C.grey }),
        ],
      })]})} ,
      footers:{ default: new Footer({ children:[new Paragraph({
        border:{ top:{ style:BorderStyle.SINGLE, size:4, color:C.mid, space:4 } },
        tabStops:[{ type:TabStopType.RIGHT, position:TabStopPosition.MAX }],
        children:[
          new TextRun({ text:'Cognitive Intelligence System — Internal Use', size:18, font:'Arial', color:C.grey }),
          new TextRun({ children:['\tPage ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES], size:18, font:'Arial', color:C.grey }),
        ],
      })]})},
      children:[
        ...titlePage(),
        ...caseChallenger(),
        ...caseMCO(),
        ...caseApollo13(),
        ...caseHubble(),
        ...caseSoyuz(),
        ...calibTable(),
      ],
    }],
  });

  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync('C:\\cis\\CIS_Space_Workbook.docx', buf);
  console.log('✓ Created: C:\\cis\\CIS_Space_Workbook.docx');
}
main().catch(console.error);
