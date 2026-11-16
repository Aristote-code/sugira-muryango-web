/* ==================== one record per row ====================================

   "Every list row opens the same record." There is one household page, one
   visit page, one risk-of-harm page and one referral page, and the row you
   click decides whose they are. Until now only the ID at the top changed, so
   RH-0045 — physical harm, an eleven-year-old in Nyanza — opened onto the
   neglect of a two-year-old in Ngoma.

   So each record is written down here once, and the page is filled from it
   when it opens: the fields, the tabs, the follow-ups, the people who were
   told. The households, visits, cases and referrals point at each other by
   ID, so the household a case names is the household that lists the case.
   ========================================================================= */
(function () {
  'use strict';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function ic(id) { return '<svg aria-hidden="true"><use href="#i-' + id + '"/></svg>'; }
  function rel(go, icon, text, recid) {
    return '<button class="rel" type="button" data-go="' + go + '"' + (recid ? ' data-recid="' + esc(recid) + '"' : '') + '>'
      + ic(icon) + esc(text) + '</button>';
  }
  function chip(cls, text) { return '<span class="chip' + (cls ? ' ' + cls : '') + '"><i></i>' + esc(text) + '</span>'; }
  var IZU = '<abbr data-tip="IZU — the home visitor at village level. A village has two, and the biggest three">IZU</abbr>';
  var CPWO = '<abbr data-tip="CPWO — District NCDA Child Protection and Welfare Officer">CPWO</abbr>';

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function long(d) {
    var m = /^(\d+) (\w{3})/.exec(d);
    if (!m) return d;
    var i = MONTHS.map(function (x) { return x.slice(0, 3); }).indexOf(m[2]);
    return m[1] + ' ' + MONTHS[i] + ' 2026';
  }

  var MT = ['', 'Family Narrative', 'Early Stimulation & Play', 'Building Early Communication Skills',
    'The Importance of Good Hygiene', 'The Importance of Good Nutrition', 'The Importance of Good Health',
    'Managing the Stresses of Parenting', 'Resolving Conflicts in the Home', 'The Important Role Everyone Plays',
    'Positive Discipline', 'Planning for the Future', 'Closing and Celebration'];

  /* The people on each district's cases. */
  var TEAM = {
    Ngoma: { lead: 'C. Uwimana', sw: 'J. Kamanzi', swAt: 'Kibungo', cpwo: 'B. Nkurunziza', icc: 'E. Mutesi', iccAt: 'Kibungo' },
    Nyanza: { lead: 'A. Uwera', sw: 'G. Mutoni', swAt: 'Kigoma', cpwo: 'L. Mukamana', icc: 'R. Habimana', iccAt: 'Busasamana' },
    Kirehe: { lead: 'F. Kayitesi', sw: 'T. Habyarimana', swAt: 'Mahama', cpwo: 'K. Nsengiyumva', icc: 'M. Uwineza', iccAt: 'Mahama' },
    Musanze: { lead: 'S. Ingabire', sw: 'N. Uwamariya', swAt: 'Kinigi', cpwo: 'D. Mugisha', icc: 'J. Tuyishime', iccAt: 'Kinigi' },
    Rubavu: { lead: 'P. Hakizimana', sw: 'O. Bizimungu', swAt: 'Gisenyi', cpwo: 'C. Nyirarukundo', icc: 'Y. Mukarugwiza', iccAt: 'Gisenyi' }
  };

  /* ---- households ----
     mods: the date each module was delivered, welcome first. */
  var H = {
    'I-534-107': { name: 'Mukamana Jeanne', village: 'Kabare', cell: 'Kabare', sector: 'Kibungo', district: 'Ngoma', cohort: 1,
      mods: ['12 Jun', '19 Aug', '2 Sep', '16 Sep', '30 Sep', '14 Oct', '28 Oct'], next: '11 Nov', status: 'Risk of harm',
      nid: '1 1987 8 0054312 0 78', fid: 'F-4311-007', type: 'Single mother-headed household', phone: '+250 78 555 0192',
      izu: 'M. Dusabe', izuCode: 'I-2101-142', enrolled: '12 June 2026', male: false,
      members: [['Mukamana Jeanne', 'Head · caregiver', 39, 'F'], ['Mukamana Alice', 'Child', 2, 'F', 'Jul 2026'], ['Mukamana Eric', 'Child', 5, 'M', 'Oct 2026'], ['Mukamana Diane', 'Child', 8, 'F']] },
    'I-221-142': { name: 'Nshimiyimana Claude', village: 'Rwesero', cell: 'Butansinda', sector: 'Kigoma', district: 'Nyanza', cohort: 2,
      mods: ['22 Jul', '9 Sep', '23 Sep', '7 Oct', '28 Oct', '6 Nov'], next: '20 Nov', status: 'Risk of harm',
      nid: '1 1990 8 0071245 1 12', fid: 'F-2207-142', type: 'Two-parent household', phone: '+250 72 410 3381',
      izu: 'P. Mukamurenzi', izuCode: 'I-1802-055', enrolled: '22 July 2026', male: true,
      members: [['Nshimiyimana Claude', 'Head · caregiver', 41, 'M'], ['Mukeshimana Odette', 'Caregiver', 36, 'F'], ['Nshimiyimana Jean', 'Child', 11, 'M'], ['Nshimiyimana Aline', 'Child', 4, 'F', 'Sep 2026']] },
    'I-531-988': { name: 'Uwase Marie', village: 'Kibimba', cell: 'Ihanika', sector: 'Jarama', district: 'Ngoma', cohort: 1,
      mods: ['10 Jul', '2 Oct', '16 Oct'], missed: [['28 Oct', 3]], next: '11 Nov', status: 'Risk of harm', behind: true,
      nid: '1 1985 8 0032871 0 45', fid: 'F-4402-988', type: 'Single mother-headed household', phone: '+250 78 220 6614',
      izu: 'V. Nyiraneza', izuCode: 'I-2101-117', enrolled: '10 July 2026', male: false,
      members: [['Uwase Marie', 'Head · caregiver', 27, 'F'], ['Uwase Divine', 'Child', 1, 'F', 'Aug 2026'], ['Uwase Kevin', 'Child', 3, 'M', 'Aug 2026']] },
    'I-535-133': { name: 'Habimana Eric', village: 'Munini', cell: 'Kwayi', sector: 'Mahama', district: 'Kirehe', cohort: 1,
      mods: ['15 Jun', '26 Aug', '9 Sep', '23 Sep', '7 Oct', '18 Oct', '4 Nov'], next: '18 Nov', status: 'On track',
      nid: '1 1979 8 0011902 1 33', fid: 'F-3105-133', type: 'Two-parent household', phone: '+250 73 118 0457',
      izu: 'D. Niyonsaba', izuCode: 'I-2101-208', enrolled: '15 June 2026', male: true,
      members: [['Habimana Eric', 'Head · caregiver', 47, 'M'], ['Uwamahoro Claire', 'Caregiver', 40, 'F'], ['Habimana Grace', 'Child', 6, 'F'], ['Habimana Olivier', 'Child', 3, 'M', 'Oct 2026'], ['Habimana Benita', 'Child', 1, 'F', 'Oct 2026']] },
    'I-224-204': { name: 'Ingabire Alice', village: 'Rugarama', cell: 'Kavumu', sector: 'Busasamana', district: 'Nyanza', cohort: 2,
      mods: ['24 Jul', '26 Sep', '10 Oct', '24 Oct', '5 Nov'], next: '19 Nov', status: 'On track',
      nid: '1 1993 7 0088410 0 04', fid: 'F-2210-204', type: 'Two-parent household', phone: '+250 78 903 2217',
      izu: 'A. Nyirahabimana', izuCode: 'I-1903-391', enrolled: '24 July 2026', male: false,
      members: [['Ingabire Alice', 'Head · caregiver', 33, 'F'], ['Ndayishimiye Fabrice', 'Caregiver', 38, 'M'], ['Ingabire Sandrine', 'Child', 9, 'F'], ['Ingabire Elie', 'Child', 2, 'M', 'Oct 2026']] },
    'I-351-871': { name: 'Niyonsenga Paul', village: 'Bugoyi', cell: 'Nengo', sector: 'Gisenyi', district: 'Rubavu', cohort: 2,
      mods: ['19 Sep', '3 Oct'], missed: [['3 Nov', 2]], next: '10 Nov', status: 'Behind', behind: true,
      nid: '1 1988 8 0040013 1 71', fid: 'F-1903-871', type: 'Grandparent-headed household', phone: '+250 79 661 0045',
      izu: 'F. Uwase', izuCode: 'I-2101-260', enrolled: '19 September 2026', male: false,
      members: [['Niyonsenga Paul', 'Head · caregiver', 63, 'M'], ['Niyonsenga Yvette', 'Child', 12, 'F'], ['Niyonsenga David', 'Child', 7, 'M']] },
    'I-413-319': { name: 'Mukandayisenga Rose', village: 'Nyonirima', cell: 'Kaguhu', sector: 'Kinigi', district: 'Musanze', cohort: 1,
      mods: ['5 Jun', '29 Jul', '12 Aug', '26 Aug', '9 Sep', '23 Sep', '7 Oct', '21 Oct', '6 Nov'], next: '20 Nov', status: 'On track',
      nid: '1 1996 7 0002319 0 19', fid: 'F-4113-319', type: 'Two-parent household', phone: '+250 78 440 9126',
      izu: 'B. Uwamahoro', izuCode: 'I-2010-433', enrolled: '5 June 2026', male: true,
      members: [['Mukandayisenga Rose', 'Head · caregiver', 30, 'F'], ['Hakizimana Joseph', 'Caregiver', 34, 'M'], ['Ishimwe Ange', 'Child', 4, 'F', 'Oct 2026']] },
    'I-538-456': { name: 'Bizimana Jean', village: 'Rukoma', cell: 'Gafunzo', sector: 'Sake', district: 'Ngoma', cohort: 2,
      mods: [], next: '12 Nov', status: 'Not started',
      nid: '', fid: 'F-4408-456', type: 'Two-parent household', phone: '+250 72 155 7781',
      izu: 'G. Uwimbabazi', izuCode: 'I-2101-301', enrolled: '20 October 2026', male: true,
      members: [['Bizimana Jean', 'Head · caregiver', 29, 'M'], ['Uwimana Delphine', 'Caregiver', 26, 'F'], ['Bizimana Kelia', 'Child', 1, 'F']] }
  };
  function hh(id) { return H[id]; }
  function done(h) { return Math.max(0, h.mods.length - 1); }
  function team(h) { return TEAM[h.district]; }

  /* ---- risks of harm ---- */
  var C = {
    'RH-0044': { hh: 'I-534-107', type: 'Neglect', who: 'Child under 5', whoLong: 'child under five', by: 'M. Dusabe', raised: '28 Oct', at: 6, status: 'Active',
      child: ['Mukamana Alice', '2 years'], seen: 'Signs of inadequate feeding', ref: 'RF-0112',
      report: 'During the Module 6 visit the home visitor recorded that the youngest child, aged 2, showed signs of inadequate feeding and had not attended the health post for a scheduled growth check. The caregiver reported losing the household health insurance card in August.' },
    'RH-0045': { hh: 'I-221-142', type: 'Physical', who: 'Child 5–17', whoLong: 'child 5 to 17', by: 'P. Mukamurenzi', raised: '6 Nov', at: 5, status: 'Active',
      child: ['Nshimiyimana Jean', '11 years'], seen: 'Bruising on both arms',
      report: 'During the Module 5 visit the home visitor saw bruising on both arms of the older child, aged 11, who said he had been beaten at home. The caregivers said he had fallen.' },
    'RH-0041': { hh: 'I-531-988', type: 'Neglect', who: 'Child under 5', whoLong: 'child under five', by: 'V. Nyiraneza', raised: '29 Oct', at: 0, status: 'Active',
      child: ['Uwase Divine', '1 year'], seen: 'Left alone and unfed', ref: 'RF-0107',
      report: 'After the Module 3 visit was missed, the home visitor called on the family and found the youngest child, aged 1, alone and unfed for most of the day. The mother was working in the fields.' },
    'RH-0038': { hh: 'I-224-204', type: 'Physical', who: 'Child 5–17', whoLong: 'child 5 to 17', by: 'A. Nyirahabimana', raised: '24 Oct', at: 3, status: 'Stabilized',
      child: ['Ingabire Sandrine', '9 years'], seen: 'A burn on the left arm', ref: 'RF-0109',
      report: 'At the Module 3 visit the eldest child, aged 9, had a burn on her left arm. The caregiver said it happened at the cooking fire; the child gave a different account.' },
    'RH-0035': { hh: 'I-535-133', type: 'Neglect', who: 'Child under 5', whoLong: 'child under five', by: 'D. Niyonsaba', raised: '18 Oct', at: 5, status: 'Stabilized',
      child: ['Habimana Benita', '1 year'], seen: 'Two immunisations missed', ref: 'RF-0104',
      report: 'At the Module 5 visit the youngest child, aged 1, had missed two immunisations and the family had lost her vaccination card.' },
    'RH-0029': { hh: 'I-413-319', type: 'Emotional', who: 'Caregiver', whoLong: 'caregiver', by: 'B. Uwamahoro', raised: '23 Sep', at: 5, status: 'Closed',
      child: ['Mukandayisenga Rose', '30 years'], seen: 'Withdrawn, not eating', ref: 'RF-0101', outcome: 'Supported through the sector social worker',
      report: 'At the Module 5 visit the caregiver was withdrawn and said she had not been eating since losing her job. The family had no health insurance.' },
    'RH-0024': { hh: 'I-351-871', type: 'Physical', who: 'Child 5–17', whoLong: 'child 5 to 17', by: 'F. Uwase', raised: '19 Sep', at: 0, status: 'Closed',
      child: ['Niyonsenga David', '7 years'], seen: 'Marks from beating', ref: 'RF-0098', outcome: 'Child safe with his grandfather',
      report: 'At the welcome visit the younger child, aged 7, had marks on his back. He said an uncle who no longer lives with the family had beaten him.' },
    'RH-0019': { hh: 'I-534-107', type: 'Severe malnutrition', who: 'Child under 5', whoLong: 'child under five', by: 'M. Dusabe', raised: '4 Jul', at: 0, status: 'Closed',
      child: ['Mukamana Alice', '1 year'], seen: 'Weight-for-age below −3', outcome: 'Recovered after nutrition support',
      report: 'At a growth check after enrolment the youngest child, then aged 1, was well below the weight for her age. She was given nutrition support at the health centre.' }
  };

  /* ---- referrals ---- */
  var R = {
    'RF-0112': { hh: 'I-534-107', from: 'RH-0044', type: 'Health · growth faltering', title: 'Growth faltering — child under five', to: 'Kabare health centre · Kibungo', by: 'sw', sent: '31 Oct', status: 'Active' },
    'RF-0109': { hh: 'I-224-204', from: 'RH-0038', type: 'Child protection', title: 'Child protection — child 5 to 17', to: 'District CPWO · Nyanza', by: 'sw', sent: '27 Oct', status: 'Active' },
    'RF-0107': { hh: 'I-531-988', from: 'RH-0041', type: 'Child protection', title: 'Child protection — child under five', to: 'District CPWO · Ngoma', by: 'sw', sent: '30 Oct', status: 'Stabilized' },
    'RF-0104': { hh: 'I-535-133', from: 'RH-0035', type: 'Health · immunisation', title: 'Immunisation — child under five', to: 'Mahama health post · Kirehe', by: 'sw', sent: '20 Oct', status: 'Closed', back: 'Both immunisations given on 30 October' },
    'RF-0101': { hh: 'I-413-319', from: 'RH-0029', type: 'Social protection · insurance', title: 'Health insurance — caregiver', to: 'Sector social worker · Kinigi', by: 'izu', sent: '9 Oct', status: 'Closed', back: 'Insurance paid by the sector for 2026' },
    'RF-0098': { hh: 'I-351-871', from: 'RH-0024', type: 'Child protection', title: 'Child protection — child 5 to 17', to: 'District CPWO · Rubavu', by: 'sw', sent: '2 Oct', status: 'Closed', back: 'Uncle barred from the home by the cell committee' },
    'RF-0087': { hh: 'I-534-107', from: '', at: 2, type: 'Social protection · health insurance', title: 'Health insurance — household', to: 'Kibungo sector office', by: 'izu', sent: '2 Sep', status: 'Closed', back: 'Card replaced on 20 September' }
  };

  /* ---- follow-ups: what the partners' screen calls the history ---- */
  var FU = {
    'RH-0044': [['M. Dusabe', '28 Oct 2026', 'Active', 'Flag raised at the Module 6 visit. The youngest child, aged 2, showed signs of inadequate feeding.'],
      ['C. Uwimana', '29 Oct 2026', 'Active', 'Mother contacted by phone. Agreed to a growth check at Kabare health centre.']],
    'RH-0045': [['P. Mukamurenzi', '6 Nov 2026', 'Active', 'Flag raised at the Module 5 visit. Bruising on both arms of the older child.']],
    'RH-0041': [['V. Nyiraneza', '29 Oct 2026', 'Active', 'Raised after the missed Module 3 visit. The child, aged 1, was left alone and unfed.'],
      ['B. Nkurunziza', '31 Oct 2026', 'Active', 'Seen by the district CPWO. Food support arranged; next check on 10 November.']],
    'RH-0038': [['A. Nyirahabimana', '24 Oct 2026', 'Active', 'Flag raised at the Module 3 visit. Burn on the left arm.'],
      ['G. Mutoni', '27 Oct 2026', 'Active', 'Referred to the district CPWO, Nyanza.'],
      ['L. Mukamana', '2 Nov 2026', 'Stabilized', 'Home visit done. Burn treated at Busasamana health centre; caregivers counselled.']],
    'RH-0035': [['D. Niyonsaba', '18 Oct 2026', 'Active', 'Flag raised at the Module 5 visit. Two immunisations missed.'],
      ['T. Habyarimana', '20 Oct 2026', 'Active', 'Referred to Mahama health post.'],
      ['D. Niyonsaba', '1 Nov 2026', 'Stabilized', 'Child immunised on 30 October.']],
    'RH-0029': [['B. Uwamahoro', '23 Sep 2026', 'Active', 'Flag raised at the Module 5 visit.'],
      ['N. Uwamariya', '9 Oct 2026', 'Stabilized', 'Referred for health insurance; caregiver seen at the health centre.'],
      ['N. Uwamariya', '28 Oct 2026', 'Closed', 'Insurance paid. Caregiver back at work.']],
    'RH-0024': [['F. Uwase', '19 Sep 2026', 'Active', 'Flag raised at the welcome visit.'],
      ['O. Bizimungu', '2 Oct 2026', 'Active', 'Referred to the district CPWO, Rubavu.'],
      ['C. Nyirarukundo', '16 Oct 2026', 'Closed', 'Uncle barred from the home by the cell committee. Child safe.']],
    'RH-0019': [['M. Dusabe', '4 Jul 2026', 'Active', 'Weight-for-age below −3 at the growth check.'],
      ['M. Dusabe', '22 Aug 2026', 'Closed', 'Child back within the normal range after nutrition support.']],
    'RF-0112': [['J. Kamanzi', '31 Oct 2026', 'Active', 'Referral sent to Kabare health centre for a growth check.'],
      ['M. Dusabe', '3 Nov 2026', 'Active', 'Mother says the appointment is on 10 November.']],
    'RF-0109': [['G. Mutoni', '27 Oct 2026', 'Active', 'Sent to the district CPWO, Nyanza.']],
    'RF-0107': [['J. Kamanzi', '30 Oct 2026', 'Active', 'Sent to the district CPWO, Ngoma.'],
      ['B. Nkurunziza', '31 Oct 2026', 'Stabilized', 'Family seen; food support in place.']],
    'RF-0104': [['T. Habyarimana', '20 Oct 2026', 'Active', 'Sent to Mahama health post.'],
      ['D. Niyonsaba', '1 Nov 2026', 'Closed', 'Both immunisations given on 30 October.']],
    'RF-0101': [['B. Uwamahoro', '9 Oct 2026', 'Active', 'Sent to the sector social worker for health insurance.'],
      ['N. Uwamariya', '28 Oct 2026', 'Closed', 'Insurance paid by the sector for 2026.']],
    'RF-0098': [['O. Bizimungu', '2 Oct 2026', 'Active', 'Sent to the district CPWO, Rubavu.'],
      ['C. Nyirarukundo', '16 Oct 2026', 'Closed', 'Uncle barred from the home by the cell committee.']],
    'RF-0087': [['M. Dusabe', '2 Sep 2026', 'Active', 'Insurance card expired. Sent to Kibungo sector office.'],
      ['M. Dusabe', '20 Sep 2026', 'Closed', 'Card replaced.']]
  };

  /* ---- visits: those on the Visits list keep their IDs; the rest of a
     household's visits are numbered from its own history. */
  var V = {
    'VIS-8846': { hh: 'I-413-319', mod: 8, date: '6 Nov', time: '09:05 to 09:52', min: 47, form: 'Flash weekly report on every module', ok: true, by: 'B. Uwamahoro' },
    'VIS-8845': { hh: 'I-224-204', mod: 4, date: '5 Nov', time: '10:20 to 11:13', min: 53, ok: true },
    'VIS-8843': { hh: 'I-535-133', mod: 6, date: '4 Nov', time: '15:02 to 15:40', min: 38, ok: true },
    'VIS-8844': { hh: 'I-351-871', mod: 2, date: '3 Nov', ok: false, why: 'Family not at home' },
    'VIS-8841': { hh: 'I-534-107', mod: 6, date: '28 Oct', time: '14:12 to 14:54', min: 42, ok: true, rh: 'RH-0044' },
    'VIS-8840': { hh: 'I-531-988', mod: 3, date: '28 Oct', ok: false, why: 'Caregiver working in the fields' }
  };
  var MIN = [58, 47, 39, 44, 51, 42, 46, 49, 41, 45, 50, 43];
  /* A household's visits, newest first, each with an ID. */
  function visitsOf(id) {
    var h = hh(id);
    if (!h) return [];
    var out = [];
    h.mods.forEach(function (d, i) {
      if (!i) return;
      var known = Object.keys(V).filter(function (k) { return V[k].hh === id && V[k].mod === i && V[k].ok; })[0];
      var vid = known || ('VIS-' + (7000 + Object.keys(H).indexOf(id) * 20 + i));
      if (!V[vid]) V[vid] = { hh: id, mod: i, date: d, min: MIN[(i + id.length) % 12], ok: true };
      out.push(vid);
    });
    (h.missed || []).forEach(function (m) {
      var known = Object.keys(V).filter(function (k) { return V[k].hh === id && V[k].mod === m[1] && !V[k].ok; })[0];
      if (known) out.push(known);
    });
    return out.sort(function (a, b) { return order(V[b].date) - order(V[a].date); });
  }
  function order(d) {
    var m = /^(\d+) (\w{3})/.exec(d || '');
    if (!m) return 0;
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(m[2]) * 40 + +m[1];
  }
  function casesOf(id, kind) {
    var src = kind === 'ref' ? R : C;
    return Object.keys(src).filter(function (k) { return src[k].hh === id; })
      .sort(function (a, b) { return order((src[b].raised || src[b].sent)) - order((src[a].raised || src[a].sent)); });
  }
  function badge(s) {
    return s === 'Closed' || s === 'Completed' || s === 'On track' ? 'ok'
      : s === 'Risk of harm' || s === 'Active' ? 'bad' : 'warn';
  }
  function chipCls(s) { return s === 'Closed' || s === 'Completed' || s === 'On track' ? 'ok' : s === 'Stabilized' || s === 'Not started' ? '' : s === 'Risk of harm' ? 'bad' : 'warn'; }

  /* ---- writing a field by its label ---- */
  function field(sc, label, html) {
    $$('.pg .pgr', sc).forEach(function (row) {
      var k = $('.k > span:last-child', row) || $('.k span', row);
      if (!k || k.textContent.trim().toLowerCase() !== label.toLowerCase()) return;
      var v = $('.v', row);
      var empty = html == null || html === '';
      v.innerHTML = empty ? '&mdash;' : html;
      v.classList.toggle('empty', empty);
      row.classList.toggle('is-empty', empty);
    });
  }
  function panel(sc, id, html) { var p = $('[data-panelid="' + id + '"]', sc); if (p) p.innerHTML = html; return p; }
  function badgeHtml(s) { return '<span class="pg-badge ' + badge(s) + '">' + esc(s) + '</span>'; }
  function tabChip(sc, panelId, n) {
    var t = $('.tab[data-panel="' + panelId + '"]', sc);
    if (!t) return;
    var c = $('.chip', t);
    if (n == null) { if (c) c.remove(); return; }
    if (!c) { c = document.createElement('span'); c.className = 'chip'; c.style.marginLeft = 'var(--space-2)'; t.appendChild(c); }
    c.textContent = String(n);
  }
  function crumbs(key, was, id) {
    var sd = window.SugiraScreens && window.SugiraScreens[key];
    if (sd && sd.crumbs && sd.crumbs.length) sd.crumbs[sd.crumbs.length - 1][0] = id;
    $$('#dwCrumbs *, #crumbs *').forEach(function (n) {
      if (n.children.length === 0 && n.textContent.trim() === was) n.textContent = id;
    });
  }
  function head(sc, key, id, title) {
    var rid = $('.rec-id', sc), was = rid ? rid.textContent : '';
    if (rid) rid.textContent = id;
    var h1 = $('h1', sc);
    if (h1 && title != null) h1.textContent = title;
    crumbs(key, was, id);
  }
  function fu(host) {
    var id = host.getAttribute('data-fu');
    if (window.SugiraFU) {
      if (!window.SugiraFU.data[id]) window.SugiraFU.data[id] = (FU[id] || []).map(function (x) { return x.slice(); });
      window.SugiraFU.mount(host);
    }
  }
  function hold() { if (window.SugiraHold) window.SugiraHold(); }

  /* ---- the household ---- */
  function fillHousehold(id) {
    var h = hh(id), sc = document.getElementById('s-household');
    if (!h || !sc) return;
    var t = team(h), n = done(h);
    head(sc, 'household', id, h.name);
    var st = h.status === 'Behind' ? 'Behind' : h.status;
    field(sc, 'Status', badgeHtml(st));
    field(sc, 'Head of household', rel('household', 'person', h.name, id) + '<span class="conseq">also the caregiver</span>');
    field(sc, 'Village', esc(h.village) + '<span class="conseq">' + esc(h.cell) + ' cell · ' + esc(h.sector) + ' · ' + esc(h.district) + '</span>');
    field(sc, 'Latest module', n ? rel('module', 'programme', 'Module ' + n) + '<span class="conseq plain">' + esc(h.mods[n]) + ' · next due ' + esc(h.next) + '</span>'
      : 'Not started<span class="conseq plain">welcome visit due ' + esc(h.next) + '</span>');
    field(sc, 'National ID', esc(h.nid));
    field(sc, 'Family ID', esc(h.fid));
    field(sc, 'Family type', esc(h.type));
    field(sc, 'Phone', esc(h.phone));
    field(sc, 'IZU at Village', rel('people', 'person', h.izu));
    field(sc, 'Cohort', rel('cohorts', 'visits', 'Cohort ' + h.cohort + ' · 2026'));
    field(sc, 'Supervisor', rel('people', 'person', t.lead));
    field(sc, 'Enrolled', esc(h.enrolled));

    var vis = visitsOf(id);
    var rhs = casesOf(id), rfs = casesOf(id, 'ref');
    var kids = h.members.filter(function (m) { return m[1] === 'Child'; });
    var under5 = kids.filter(function (m) { return m[2] < 5; }).length;
    var notDone = (h.missed || []).length;

    /* overview: the latest three things that happened, the modules, the counts */
    var events = vis.map(function (v) { return { d: V[v].date, v: v }; })
      .concat(rhs.map(function (c) { return { d: C[c].raised, c: c }; }))
      .sort(function (a, b) { return order(b.d) - order(a.d); }).slice(0, 3);
    var tl = events.map(function (e) {
      if (e.c) {
        var c = C[e.c];
        return '<div class="te"><span class="ic warn">' + ic('alert') + '</span><div><h4>Risk of harm raised</h4><p>'
          + esc(c.type) + ' · ' + esc(c.whoLong) + ' · raised by ' + esc(c.by) + '</p><a data-go="case" data-recid="' + e.c + '">Open case ' + e.c + '</a></div>'
          + '<span class="when">' + esc(c.raised) + '</span></div>';
      }
      var v = V[e.v];
      return '<div class="te"><span class="ic' + (v.ok ? ' ok' : '') + '">' + ic(v.ok ? 'check' : 'cross') + '</span><div><h4>Module ' + v.mod + ' — '
        + esc(MT[v.mod]) + '</h4><p>' + (v.ok ? v.min + ' minutes · ' + (h.male ? 'both caregivers present' : 'caregiver present') : 'Not completed · ' + esc(v.why || ''))
        + '</p><a data-go="visit" data-recid="' + e.v + '">Open the visit</a></div><span class="when">' + esc(v.date) + '</span></div>';
    }).join('') || '<p class="empty-line">No visit yet</p>';
    var mods = '<div class="mod' + (h.mods[0] ? ' done' : ' now') + '"><span class="dot">' + (h.mods[0] ? ic('check') : 'W') + '</span><span class="nm">Welcome module</span><span class="wh">' + esc(h.mods[0] || h.next) + '</span></div>';
    for (var i = 1; i <= 12; i++) {
      var isDone = i <= n, isNow = i === n + 1 && h.mods.length;
      mods += '<div class="mod' + (isDone ? ' done' : isNow ? ' now' : '') + '"><span class="dot">' + (isDone ? ic('check') : i) + '</span><span class="nm">'
        + i + ' — ' + esc(MT[i]) + '</span><span class="wh">' + (isDone ? esc(h.mods[i]) : isNow ? esc(h.next) : '—') + '</span></div>';
    }
    panel(sc, 'overview', '<div class="cols c2"><div class="card"><div class="card-h"><h3>Visit history</h3><span class="side"><a data-view="tab:Visits">See all ' + vis.length + '</a></span></div>'
      + '<div class="tl">' + tl + '</div></div>'
      + '<div style="display:grid;gap:var(--space-4);align-content:start"><div class="card"><div class="card-h"><h3>Module progress</h3><span class="side"><span class="chip">Due ' + esc(h.next) + '</span></span></div>'
      + '<div class="mods">' + mods + '</div></div>'
      + '<div class="card"><div class="card-h"><h3>Details</h3></div><div class="kv">'
      + '<div><div class="k">Children</div><div class="v">' + kids.length + '</div></div>'
      + '<div><div class="k">Under 5</div><div class="v">' + under5 + '</div></div>'
      + '<div><div class="k">Modules delivered</div><div class="v">' + n + ' of 12</div></div>'
      + '<div><div class="k">Not completed</div><div class="v">' + notDone + '</div></div>'
      + '<div><div class="k">' + IZU + ' at Village</div><div class="v" style="font-size:14px">' + esc(h.izu) + '</div></div>'
      + '<div><div class="k">Enrolled</div><div class="v" style="font-size:14px">' + esc(h.enrolled) + '</div></div>'
      + '</div></div></div></div>');

    /* every visit, each one opening */
    panel(sc, 'visits', '<div class="card flush plainsurface"><div class="tblwrap"><table class="tbl"><thead><tr><th>Visit</th><th>Date</th><th>Module</th><th data-person>' + IZU + ' at Village</th><th class="num">Minutes</th><th>Outcome</th></tr></thead><tbody>'
      + (vis.map(function (vid) {
        var v = V[vid];
        return '<tr data-go="visit" data-recid="' + vid + '"><td class="nm">' + vid + '</td><td>' + esc(v.date) + '</td><td>' + v.mod + '. ' + esc(MT[v.mod]) + '</td><td>' + esc(v.by || h.izu)
          + '</td><td class="num">' + (v.ok ? v.min : '—') + '</td><td>' + chip(v.ok ? 'ok' : 'warn', v.ok ? 'Completed' : 'Not completed') + '</td></tr>';
      }).join('') || '<tr><td colspan="6" class="mut">No visit yet</td></tr>')
      + '</tbody></table></div><div class="tfoot"><span>' + vis.length + ' visit' + (vis.length === 1 ? '' : 's') + ' · ' + n + ' of 12 modules delivered · next due ' + esc(h.next) + '</span></div></div>');

    /* members, with the last growth check rather than how late it is */
    panel(sc, 'children', '<div class="card flush plainsurface"><div class="tblwrap"><table class="tbl"><thead><tr><th data-person>Name</th><th>In the household</th><th class="num">Age</th><th>Sex</th><th>Last growth check</th><th>Status</th><th class="gap"></th></tr></thead><tbody>'
      + h.members.map(function (m) {
        var inCase = rhs.filter(function (c) { return C[c].status !== 'Closed' && C[c].child[0] === m[0]; })[0];
        return '<tr><td class="nm">' + esc(m[0]) + '</td><td class="mut">' + esc(m[1]) + '</td><td class="num">' + m[2] + '</td><td>' + m[3] + '</td><td class="mut">'
          + (m[2] < 5 ? esc(m[4] || 'None yet') : '<span class="rd">Not applicable</span>') + '</td><td>'
          + (inCase ? chip('bad', 'In case ' + inCase) : chip('ok', 'On track')) + '</td><td class="gap"></td></tr>';
      }).join('') + '</tbody></table></div><div class="tfoot"><span>' + h.members.length + ' in the household</span></div></div>');
    tabChip(sc, 'children', h.members.length);

    /* risks of harm and referrals: a list, and the one picked below it */
    function list(kind, ids) {
      var isRef = kind === 'ref', src = isRef ? R : C;
      if (!ids.length) return '<div class="card"><p class="empty-line">' + (isRef ? 'No referral' : 'No risk of harm') + '</p></div>';
      var cur = ids.filter(function (k) { return src[k].status !== 'Closed'; })[0] || ids[0];
      var rows = ids.map(function (k) {
        var x = src[k];
        return '<tr data-open="' + k + '"' + (k === cur ? ' class="cur"' : '') + '><td class="nm">' + k + '</td><td>' + esc(x.type)
          + '</td><td>' + esc(isRef ? x.to : x.who) + '</td><td class="mut">' + esc(isRef ? x.sent : x.raised) + '</td><td>' + chip(chipCls(x.status), x.status) + '</td></tr>';
      }).join('');
      var cards = ids.map(function (k) {
        var x = src[k];
        var who = isRef ? refBy(x) : [x.by, IZU + ' at Village'];
        return '<div class="cols c2" data-casecard="' + k + '"' + (k === cur ? '' : ' hidden') + '><div class="card"><div class="card-h"><h3>' + k + ' — ' + esc(x.status.toLowerCase())
          + '</h3><span class="side"><button class="btn sec sm" type="button" data-go="' + (isRef ? 'referral' : 'case') + '" data-recid="' + k + '">Open ' + (isRef ? 'referral' : 'case') + '</button></span></div>'
          + '<div class="lr"><span class="t">' + (isRef ? 'Sent' : 'Raised') + '</span><span class="s">' + esc(long(isRef ? x.sent : x.raised).replace(' 2026', ''))
          + (isRef ? (x.from ? ', out of case ' + x.from : ', at the Module ' + x.at + ' visit') : (x.at ? ', at the Module ' + x.at + ' visit' : ', outside a visit')) + '</span></div>'
          + '<div class="lr"><span class="t">Type</span><span class="s">' + esc(x.type) + (isRef ? '' : ' · ' + esc(x.whoLong)) + '</span></div>'
          + (isRef ? '<div class="lr"><span class="t">Referred to</span><span class="s">' + esc(x.to) + '</span></div>' : '')
          + '<div class="lr"><span class="t">' + (isRef ? 'Referred by' : 'Raised by') + '</span><span class="s">' + esc(who[0]) + ' · ' + who[1] + '</span></div>'
          + (!isRef && x.ref ? '<div class="lr"><span class="t">Referral made</span><span class="s">' + esc(R[x.ref].type) + '</span><span class="c">' + rel('referral', 'message', x.ref, x.ref) + '</span></div>' : '')
          + '</div><div data-fu="' + k + '"></div></div>';
      }).join('');
      var open = ids.filter(function (k) { return src[k].status !== 'Closed'; }).length;
      return '<div class="card flush plainsurface"><div class="tblwrap"><table class="tbl" data-caselist><thead><tr><th>' + (isRef ? 'Referral' : 'Case') + '</th><th>Type</th><th>'
        + (isRef ? 'Referred to' : 'Who') + '</th><th>' + (isRef ? 'Sent' : 'Raised') + '</th><th>Status</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
        + '<div class="tfoot"><span>' + ids.length + ' ' + (isRef ? (ids.length === 1 ? 'referral' : 'referrals') : (ids.length === 1 ? 'risk of harm' : 'risks of harm')) + ' · ' + open + ' open</span></div></div>' + cards;
    }
    var pr = panel(sc, 'risk', list('rh', rhs));
    var pf = panel(sc, 'referrals', list('ref', rfs));
    tabChip(sc, 'risk', rhs.length || null);
    tabChip(sc, 'referrals', rfs.length || null);
    [pr, pf].forEach(function (p) { if (p) $$('[data-fu]', p).forEach(fu); });
    hold();
  }

  function refBy(r) {
    var h = hh(r.hh), t = team(h);
    return r.by === 'izu' ? [h.izu, IZU + ' at Village'] : [t.sw, 'Sector social worker · ' + esc(t.swAt)];
  }

  /* ---- the visit ---- */
  function fillVisit(id) {
    var v = V[id], sc = document.getElementById('s-visit');
    if (!v || !sc) return;
    var h = hh(v.hh), izu = v.by || h.izu;
    head(sc, 'visit', id, v.mod + ' — ' + MT[v.mod]);
    field(sc, 'Status', badgeHtml(v.ok ? 'Completed' : 'Not completed'));
    field(sc, 'Household', rel('household', 'households', v.hh, v.hh) + '<span class="conseq">' + esc(h.name) + '</span>');
    field(sc, 'Visited by', rel('people', 'person', izu) + '<span class="conseq">' + IZU + ' at Village</span>');
    field(sc, 'Place', '<span class="lnk-off">' + esc(h.village) + ' village</span><span class="conseq">' + esc(h.sector) + ' · ' + esc(h.district) + '</span>');
    field(sc, 'When', esc(long(v.date)) + (v.time ? ' · ' + esc(v.time) : ''));
    field(sc, 'Minutes', v.ok ? String(v.min) : '');
    var form = v.form || 'Household Module Tracking Form';
    field(sc, 'Form', rel('form', 'reports', form, form));
    field(sc, 'Module', rel('module', 'programme', 'Module ' + v.mod) + '<span class="conseq">' + v.mod + ' of 12</span>');
    field(sc, 'Cohort', rel('cohorts', 'visits', 'Cohort ' + h.cohort + ' · 2026'));
    field(sc, 'Who was there', v.ok ? (h.male ? 'Both caregivers present' : 'Caregiver present <span class="conseq">male caregiver absent</span>') : esc(v.why));
    field(sc, 'Recorded by', rel('people', 'person', izu));
    field(sc, 'Sent in', v.ok ? esc(v.date) + ' ' + (v.time ? v.time.slice(-5) : '') : '');
    var sub = $('[data-panelid="answers"] [data-submission]', sc);
    if (sub && window.SugiraSubmission) sub.innerHTML = window.SugiraSubmission(visitAnswers(id), form);
    tabChip(sc, 'answers', visitAnswers(id).length);
    var all = visitsOf(v.hh), med = all.filter(function (k) { return V[k].ok; }).map(function (k) { return V[k].min; }).sort()[Math.floor(all.length / 2)] || v.min;
    panel(sc, 'happened', '<div class="cols c2"><div class="card"><div class="card-h"><h3>This visit, in order</h3></div><div class="tl">'
      + (v.ok
        ? '<div class="te"><span class="ic ok">' + ic('check') + '</span><div><h4>Form opened</h4><p>' + esc(form) + ' · on the tablet</p></div><span class="when">' + esc(v.time ? v.time.slice(0, 5) : '') + '</span></div>'
          + '<div class="te"><span class="ic ok">' + ic('check') + '</span><div><h4>Form sent</h4><p>All answered · ' + v.min + ' minutes</p></div><span class="when">' + esc(v.time ? v.time.slice(-5) : '') + '</span></div>'
          + '<div class="te"><span class="ic">' + ic('monitor') + '</span><div><h4>Reached this system</h4><p>The tablet synced</p></div><span class="when">' + esc(v.date) + '</span></div>'
        : '<div class="te"><span class="ic">' + ic('cross') + '</span><div><h4>Not completed</h4><p>' + esc(v.why) + '</p></div><span class="when">' + esc(v.date) + '</span></div>')
      + '</div></div><div style="display:grid;gap:var(--space-4);align-content:start"><div class="card"><div class="card-h"><h3>Against this household’s other visits</h3><span class="side">'
      + rel('household', 'households', 'All ' + all.length, v.hh) + '</span></div>'
      + (v.ok ? '<div class="lr" style="margin-top:var(--space-2)"><span class="t">This visit</span><span class="c">' + v.min + '<span class="unit">m</span></span></div>'
        + '<div class="lr"><span class="t">Their median</span><span class="c">' + med + '<span class="unit">m</span></span></div>' : '')
      + '<div class="lr"><span class="t">Modules delivered</span><span class="c">' + done(h) + ' of 12</span></div></div></div></div>');
  }
  function visitAnswers(id) {
    var v = V[id], h = hh(v.hh), c = v.rh && C[v.rh];
    if (!v.ok) {
      return [['Visit date', long(v.date), ''], ['Household ID', v.hh, ''], ['Module', v.mod + ' — ' + MT[v.mod], ''],
        ['Was the module delivered?', 'No', v.why], ['Next visit agreed', long(h.next), '']];
    }
    var kids = h.members.filter(function (m) { return m[1] === 'Child'; });
    var rows = [['Visit date', long(v.date), ''], ['Household ID', v.hh, ''], ['Module', v.mod + ' — ' + MT[v.mod], ''],
      ['Was the module delivered in full?', 'Yes', ''], ['Who took part?', h.male ? 'Both caregivers' : 'Caregiver', h.male ? '' : 'male caregiver absent'],
      ['How many children were present?', String(kids.length), ''], ['Which activities were completed?', c ? '4 of 5' : '5 of 5', ''],
      ['Did the caregiver practise the activity?', 'Yes', ''], ['Are the children sleeping under a net?', 'Yes', ''],
      ['Does the household have safe drinking water?', 'Yes', ''], ['Is there a handwashing station?', 'Yes', '']];
    if (c) {
      rows.push(['Is any child in this household at risk of harm?', 'CASE', v.rh, v.rh]);
      rows.push(['Which child?', c.child[0], c.child[1], v.rh]);
      rows.push(['What was seen?', c.seen, '', v.rh]);
    } else rows.push(['Is any child in this household at risk of harm?', 'No', '']);
    rows.push(['How long did the module take?', v.min + ' minutes', '']);
    rows.push(['Next visit agreed', long(h.next), '']);
    return rows;
  }

  /* ---- the risk of harm ---- */
  function notified(h, raisedBy, when, extra) {
    var t = team(h);
    var rows = [[t.lead, 'Sector lead · ' + h.district], [t.sw, 'Sector social worker · ' + t.swAt], [t.cpwo, 'District ' + CPWO + ' · ' + h.district],
      [raisedBy, IZU + ' at Village · raised it'], [t.icc, IZU + ' Cell Coordinator · ' + t.iccAt]];
    if (extra) rows.unshift(extra);
    return rows.map(function (r) {
      return '<div class="lr"><span class="t">' + esc(r[0]) + '</span><span class="s">' + r[1] + '</span><span class="c">' + chip('ok', when) + '</span></div>';
    }).join('');
  }
  function fillCase(id) {
    var c = C[id], sc = document.getElementById('s-case');
    if (!c || !sc) return;
    var h = hh(c.hh), t = team(h);
    head(sc, 'case', id, c.type + ' — ' + c.whoLong);
    field(sc, 'Status', badgeHtml(c.status));
    $$('[data-hold]', sc).forEach(function (n) { n.setAttribute('data-hold', id); });
    var hv = $$('.pgr', sc).filter(function (r) { return /Household/.test(r.textContent); })[0];
    if (hv) {
      var v = $('.v', hv);
      v.removeAttribute('data-was');
      v.setAttribute('data-hold', id);
      v.innerHTML = rel('household', 'households', c.hh + ' ' + h.name.split(' ')[0], c.hh);
    }
    field(sc, 'Place', esc(h.sector) + ' · ' + esc(h.district));
    field(sc, 'Raised by', rel('people', 'person', c.by) + '<span class="conseq plain">' + IZU + ' at Village</span>');
    field(sc, 'Raised', esc(long(c.raised)));
    field(sc, 'Supervisor', rel('people', 'person', t.lead));
    field(sc, 'IZU', rel('people', 'person', h.izu) + '<span class="conseq">' + esc(h.izuCode) + '</span>');
    field(sc, 'Raised at', c.at ? rel('module', 'programme', 'Module ' + c.at) : 'Outside a visit');
    field(sc, 'Outcome', c.outcome ? esc(c.outcome) : '');
    var visit = Object.keys(V).filter(function (k) { return V[k].rh === id; })[0];
    panel(sc, 'case', '<div class="cols c2"><div class="card"><div class="card-h"><h3>What was reported</h3></div>'
      + '<p class="mhint" data-hold="' + id + '">' + esc(c.report) + '</p>'
      + '<div class="card-h" style="margin-top:var(--space-5)"><h3>Case timeline</h3></div><div class="tl">'
      + '<div class="te"><span class="ic warn">' + ic('alert') + '</span><div><h4>Flag raised' + (c.at ? ' at visit' : '') + '</h4><p>' + (c.at ? 'Module ' + c.at + ' · ' : '') + esc(c.by) + '</p>'
      + (visit ? '<a data-go="visit" data-recid="' + visit + '">Open the visit</a>' : '') + '</div><span class="when">' + esc(c.raised) + '</span></div>'
      + '<div class="te"><span class="ic">' + ic('message') + '</span><div><h4>Supervisor notified</h4><p>' + esc(t.lead) + ' · Sector lead</p></div><span class="when">' + esc(c.raised) + '</span></div>'
      + (c.ref ? '<div class="te"><span class="ic">' + ic('message') + '</span><div><h4>Referral made</h4><p>' + esc(R[c.ref].type) + ' · ' + esc(R[c.ref].to) + '</p><a data-go="referral" data-recid="' + c.ref + '">Open referral ' + c.ref + '</a></div><span class="when">' + esc(R[c.ref].sent) + '</span></div>' : '')
      + '</div></div><div style="display:grid;gap:var(--space-4);align-content:start"><div class="card"><div class="card-h"><h3>Who was notified</h3></div>'
      + notified(h, c.by, c.raised) + '</div>'
      + '<div class="card"><div class="card-h"><h3>Who has the household<button class="ihelp" type="button" aria-expanded="false" aria-label="What this is" data-tip="Everyone who reaches ' + esc(h.district) + ' sees this case. These are the people it is open to by name."><svg aria-hidden="true"><use href="#i-info"/></svg></button></h3></div>'
      + '<div id="rohWho"></div><div class="lr"><span class="t">' + esc(c.by) + '</span><span class="s">' + IZU + ' at Village · raised it</span></div>'
      + '<div class="lr"><span class="t">' + esc(t.lead) + '</span><span class="s">Sector lead · ' + esc(h.district) + '</span></div>'
      + '<div class="lr"><span class="t">' + esc(t.sw) + '</span><span class="s">Sector social worker · ' + esc(t.swAt) + '</span></div></div></div></div>');
    panel(sc, 'actions', '<div class="cols c2e" data-fu="' + id + '"></div>');
    fu($('[data-fu]', sc));
    /* the answers are the risk-of-harm form's, not the visit's */
    var ans = caseAnswers(id);
    var sub = $('[data-panelid="casesub"]', sc);
    if (sub) sub.innerHTML = '<div class="card flush plainsurface">' + (window.SugiraSubmission ? window.SugiraSubmission(ans, 'Risk of Harm Intake Form') : '') + '</div>';
    tabChip(sc, 'casesub', ans.length);
    hold();
  }
  function caseAnswers(id) {
    var c = C[id], h = hh(c.hh);
    return [['Date identified', long(c.raised), ''], ['Household ID', c.hh, '', id], ['Where', h.village + ' · ' + h.sector + ' · ' + h.district, ''],
      ['Type of harm', c.type, ''], ['Who is at risk?', c.who, ''], ['Which person?', c.child[0], c.child[1], id], ['What was seen?', c.seen, '', id],
      ['Is the person in immediate danger?', c.type === 'Physical' ? 'Yes' : 'No', ''], ['What did you do straight away?', c.at ? 'Informed the caregiver and the supervisor' : 'Informed the supervisor', ''],
      ['Is a referral needed?', c.ref ? 'Yes' : 'No', c.ref ? R[c.ref].to : ''], ['Raised by', c.by, IZU.replace(/<[^>]+>/g, '') + ' at Village']];
  }

  /* ---- the referral ---- */
  function fillReferral(id) {
    var r = R[id], sc = document.getElementById('s-referral');
    if (!r || !sc) return;
    var h = hh(r.hh), by = refBy(r), c = r.from && C[r.from];
    head(sc, 'referral', id, r.title);
    field(sc, 'Status', badgeHtml(r.status));
    var hv = $$('.pgr', sc).filter(function (x) { return /Household/.test($('.k', x).textContent); })[0];
    if (hv) {
      var v = $('.v', hv);
      v.removeAttribute('data-was');
      v.setAttribute('data-hold', r.from || id);
      v.innerHTML = rel('household', 'households', r.hh + ' ' + h.name.split(' ')[0], r.hh);
    }
    field(sc, 'Out of', c ? rel('case', 'safeguarding', r.from, r.from) + '<span class="conseq">' + esc(c.type.toLowerCase()) + ', ' + esc(c.whoLong) + '</span>'
      : rel('module', 'programme', 'Module ' + r.at + ' visit'));
    field(sc, 'Place', esc(h.sector) + ' · ' + esc(h.district));
    field(sc, 'Type', esc(r.type));
    field(sc, 'Referred to', esc(r.to).replace('CPWO', CPWO));
    field(sc, 'Referred by', rel('people', 'person', by[0]) + '<span class="conseq plain">' + by[1] + '</span>');
    field(sc, 'Sent', esc(long(r.sent)));
    field(sc, 'What came back', r.back ? esc(r.back) : '');
    var t = team(h);
    panel(sc, 'rfupdates', '<div class="cols c2"><div data-fu="' + id + '"></div><div style="display:grid;gap:var(--space-4);align-content:start"><div class="card"><div class="card-h"><h3>Who was notified</h3></div>'
      + '<div class="lr"><span class="t">' + esc(r.to.split(' · ')[0]).replace('CPWO', CPWO) + '</span><span class="s">received the referral</span><span class="c">' + chip('ok', r.sent) + '</span></div>'
      + '<div class="lr"><span class="t">' + esc(by[0]) + '</span><span class="s">' + by[1] + ' · sent it</span><span class="c">' + chip('ok', r.sent) + '</span></div>'
      + '<div class="lr"><span class="t">' + esc(t.lead) + '</span><span class="s">Sector lead · ' + esc(h.district) + '</span><span class="c">' + chip('ok', r.sent) + '</span></div>'
      + (by[0] !== h.izu ? '<div class="lr"><span class="t">' + esc(h.izu) + '</span><span class="s">' + IZU + ' at Village</span><span class="c">' + chip('ok', r.sent) + '</span></div>' : '')
      + '<div class="lr"><span class="t">' + esc(t.icc) + '</span><span class="s">' + IZU + ' Cell Coordinator · ' + esc(t.iccAt) + '</span><span class="c">' + chip('ok', r.sent) + '</span></div>'
      + '</div></div></div>');
    fu($('[data-fu]', sc));
    /* "Visits behind it": the family's visit history */
    var vis = visitsOf(r.hh);
    var tab = $('.tab[data-panel="rfanswers"]', sc);
    if (tab) tab.innerHTML = 'Visits behind it <span class="chip" style="margin-left:var(--space-2)">' + vis.length + '</span>';
    panel(sc, 'rfanswers', '<div class="card flush plainsurface"><div class="tblwrap"><table class="tbl"><thead><tr><th>Visit</th><th>Date</th><th>Module</th><th data-person>' + IZU + ' at Village</th><th class="num">Minutes</th><th>Outcome</th></tr></thead><tbody>'
      + vis.map(function (vid) {
        var v = V[vid];
        return '<tr data-go="visit" data-recid="' + vid + '"><td class="nm">' + vid + '</td><td>' + esc(v.date) + '</td><td>' + v.mod + '. ' + esc(MT[v.mod]) + '</td><td>' + esc(v.by || h.izu)
          + '</td><td class="num">' + (v.ok ? v.min : '—') + '</td><td>' + chip(v.ok ? 'ok' : 'warn', v.ok ? 'Completed' : 'Not completed') + '</td></tr>';
      }).join('') + '</tbody></table></div><div class="tfoot"><span>' + vis.length + ' visits to ' + esc(r.hh) + '</span></div></div>');
    hold();
  }

  var FILL = { household: fillHousehold, visit: fillVisit, 'case': fillCase, referral: fillReferral };
  var PAT = { household: /\bI-\d{3}-\d{3}\b/, visit: /\bVIS-\d{4}\b/, 'case': /\bRH-\d{4}\b/, referral: /\bRF-\d{4}\b/ };
  var KNOWN = { household: H, visit: V, 'case': C, referral: R };

  /* Which record a click is about: the element's own ID, then its row's. */
  /* A row's text with its cells kept apart, so "I-221-142" and the name in
     the next cell do not run into one word. */
  function words(el) {
    if (el.tagName === 'TR') return Array.prototype.map.call(el.cells, function (c) { return c.textContent; }).join(' ');
    return el.textContent || '';
  }
  function idFor(key, el) {
    var own = el.getAttribute('data-recid');
    if (own && PAT[key].test(own)) return own.match(PAT[key])[0];
    var m = PAT[key].exec(words(el));
    if (m) return m[0];
    var tr = el.closest('tr');
    if (tr) {
      var rid = tr.getAttribute('data-recid');
      if (rid && PAT[key].test(rid)) return rid.match(PAT[key])[0];
      m = PAT[key].exec((tr.getAttribute('data-find') || '') + ' ' + words(tr));
      if (m) return m[0];
    }
    return null;
  }
  var pending = null;
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-go="household"], [data-go="visit"], [data-go="case"], [data-go="referral"]');
    if (!el) return;
    var key = el.getAttribute('data-go');
    var id = idFor(key, el);
    if (!id || !KNOWN[key][id]) return;
    pending = { key: key, id: id };
    setTimeout(function () {
      if (!pending) return;
      var p = pending; pending = null;
      FILL[p.key](p.id);
    }, 0);
  }, true);

  /* The household's own lists: click a row, read its card. */
  document.addEventListener('click', function (e) {
    var tr = e.target.closest('#s-household table[data-caselist] tbody tr[data-open]');
    if (!tr) return;
    var id = tr.getAttribute('data-open');
    var scope = tr.closest('[data-panelid]');
    $$('tbody tr', tr.closest('table')).forEach(function (r) { r.classList.toggle('cur', r === tr); });
    $$('[data-casecard]', scope).forEach(function (c) { c.hidden = c.getAttribute('data-casecard') !== id; });
  });

  /* A follow-up that changes the status changes the case's status: on its
     record, on the household that lists it, and on the list it sits in. */
  document.addEventListener('fu:added', function (e) {
    var id = e.detail.id, s = e.detail.status;
    var rec = C[id] || R[id];
    if (!rec || rec.status === s) return;
    rec.status = s;
    $$('.screen').forEach(function (sc) {
      var rid = $('.rec-id', sc);
      if (rid && rid.textContent.trim() === id) {
        var b = $('.pg .pg-badge', sc);
        if (b) { b.className = 'pg-badge ' + badge(s); b.textContent = s; }
      }
    });
    $$('tr').forEach(function (tr) {
      var first = tr.cells[0] && tr.cells[0].textContent.trim();
      if (first !== id && tr.getAttribute('data-open') !== id && tr.getAttribute('data-recid') !== id) return;
      var c = $('.chip', tr.cells[tr.cells.length - 1]) || $('td:last-child .chip', tr);
      if (c) { c.className = 'chip ' + chipCls(s); c.innerHTML = '<i></i>' + esc(s); }
      if (tr.hasAttribute('data-tags')) {
        var tags = tr.getAttribute('data-tags').split(' ').filter(function (x) { return x !== 'open' && x !== 'closed'; });
        tags.push(s === 'Closed' ? 'closed' : 'open');
        tr.setAttribute('data-tags', tags.join(' ').trim());
      }
    });
  });

  /* ---- a saved report reads these records, cut down by its conditions ---- */
  var PROV = { Ngoma: 'Eastern', Kirehe: 'Eastern', Nyanza: 'Southern', Rubavu: 'Western', Musanze: 'Northern' };
  function latest(id) { var l = FU[id]; return l && l.length ? l[l.length - 1][3] : ''; }
  function value(key, id, f) {
    var t = f.toLowerCase(), x, h;
    if (key === 'households') {
      h = H[id];
      return ({ 'household id': id, caregiver: h.name, 'national id': h.nid, 'family id': h.fid, phone: h.phone, province: PROV[h.district],
        district: h.district, sector: h.sector, cell: h.cell, village: h.village, cohort: 'Cohort ' + h.cohort, 'module reached': String(done(h)),
        'last visit': h.mods.length ? h.mods[h.mods.length - 1] : '—', status: h.behind ? 'Behind' : h.status, enrolled: h.enrolled })[t];
    }
    if (key === 'visits') {
      x = V[id]; h = H[x.hh];
      return ({ 'visit id': id, date: x.date, 'household id': x.hh, caregiver: h.name, province: PROV[h.district], district: h.district,
        sector: h.sector, cell: h.cell, village: h.village, module: String(x.mod), form: x.form || 'Household Module Tracking Form',
        izu: x.by || h.izu, 'recorded by': x.by || h.izu, minutes: x.ok ? String(x.min) : '—', 'who was present': x.ok ? (h.male ? 'Both caregivers' : 'Caregiver') : '—',
        outcome: x.ok ? 'Completed' : 'Not completed' })[t];
    }
    if (key === 'safeguarding') {
      x = C[id]; h = H[x.hh];
      return ({ 'case id': id, 'household id': x.hh, type: x.type, 'who is at risk': x.who, 'raised by': x.by, raised: x.raised,
        province: PROV[h.district], district: h.district, sector: h.sector, status: x.status, 'latest follow-up': latest(id) })[t];
    }
    if (key === 'referrals') {
      x = R[id]; h = H[x.hh];
      return ({ 'referral id': id, 'household id': x.hh, 'out of case': x.from || '—', type: x.type, 'referred to': x.to, 'referred by': refBy(x)[0],
        sent: x.sent, district: h.district, sector: h.sector, status: x.status, 'latest follow-up': latest(id) })[t];
    }
    return '';
  }
  function meets(key, id, cond) {
    return String(cond || '').split(' · ').every(function (c) {
      if (/^grouped by/i.test(c)) return true;
      var m = /^(.+?) is (.+)$/.exec(c), r = /^Raised in (\d{4})$/.exec(c);
      if (r) return true;
      if (!m) return true;
      if (/this month/i.test(m[2])) {
        var d0 = value(key, id, m[1]) || '';
        return /Nov|Oct/.test(d0);
      }
      var v = String(value(key, id, m[1]) == null ? '' : value(key, id, m[1])).toLowerCase();
      if (m[2] === 'empty') return !v || v === '—';
      return m[2].split(' or ').some(function (w) {
        w = w.toLowerCase();
        return /^\d+$/.test(w) ? (v.match(/\d+/) || [''])[0] === w : v === w || v.indexOf(w) > -1;
      });
    });
  }
  function rows(key, fields, cond) {
    var src = { households: H, visits: V, safeguarding: C, referrals: R }[key];
    if (!src) return null;
    if (key === 'visits') Object.keys(H).forEach(visitsOf);
    return Object.keys(src).filter(function (id) { return meets(key, id, cond); }).map(function (id) {
      return fields.map(function (f) { var v = value(key, id, f); return v == null || v === '' ? '—' : v; });
    });
  }

  /* The pages open on these until a row says otherwise. */
  fillHousehold('I-534-107');
  fillVisit('VIS-8841');
  fillCase('RH-0044');
  fillReferral('RF-0112');

  Object.keys(H).forEach(visitsOf);
  window.SugiraRecData = { households: H, visits: V, cases: C, referrals: R, fill: function (key, id) { if (FILL[key]) FILL[key](id); }, visitsOf: visitsOf, rows: rows };
})();
