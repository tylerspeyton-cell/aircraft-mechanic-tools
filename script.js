/* ============================================================
   Aircraft Mechanic Tools — Shared JavaScript
   ============================================================ */

'use strict';

/* ---- Mobile Navigation ---- */
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('navMobile');
  if (!toggle || !mobileMenu) return;

  toggle.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.textContent = isOpen ? '✕' : '☰';
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', false);
      toggle.textContent = '☰';
    });
  });
})();


/* ---- Active Nav Link ---- */
(function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();


/* ---- Site Navigation Search ---- */
(function initSiteNavSearch() {
  const searchInput = document.getElementById('siteSearch');
  const searchResults = document.getElementById('siteSearchResults');
  const searchWrap = searchInput && searchInput.closest('.nav-search');
  if (!searchInput || !searchResults) return;

  const PAGES = [
    { href: 'index.html', title: 'Home' },
    { href: 'drill-chart.html', title: 'Drill Bit Chart' },
    { href: 'torque-converter.html', title: 'Torque Converter' },
    { href: 'unit-converter.html', title: 'Unit Converter' },
    { href: 'ata-lookup.html', title: 'ATA Code Lookup' },
    { href: 'safety-wire.html', title: 'Safety Wire Guide' },
    { href: 'hardware-reference.html', title: 'Hardware Reference' },
    { href: 'conversions.html', title: 'Quick Reference Cards' },
    { href: 'rivet-reference.html', title: 'Rivet Size Reference' },
    { href: 'wire-gauge.html', title: 'Wire Gauge Reference' },
    { href: 'o-ring-seal-reference.html', title: 'O-Ring / Seal Reference' },
    { href: 'tire-pressure-log.html', title: 'Tire Pressure Log' },
    { href: 'inspection-checklist.html', title: 'Inspection Checklist' },
    { href: 'blog-drill-bit-size-chart.html', title: 'Blog: Drill Bit Size Chart' },
    { href: 'blog-ata-codes.html', title: 'Blog: ATA Codes' },
    { href: 'blog-safety-wire-guide.html', title: 'Blog: Safety Wire Guide' },
    { href: 'blog-torque-conversion.html', title: 'Blog: Torque Conversion' },
    { href: 'contact.html', title: 'Contact' },
    { href: 'privacy.html', title: 'Privacy Policy' },
    { href: 'disclaimer.html', title: 'Disclaimer' },
  ];

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const searchablePages = PAGES.filter(page => page.href !== currentPage);

  function hideResults() {
    searchResults.hidden = true;
    searchResults.innerHTML = '';
  }

  function renderResults(query) {
    const q = query.toLowerCase().trim();
    if (!q) { hideResults(); return; }

    const matches = searchablePages.filter(page =>
      page.title.toLowerCase().includes(q) || page.href.toLowerCase().includes(q)
    ).slice(0, 8);

    if (!matches.length) {
      searchResults.innerHTML = '<div class="nav-search-empty">No pages found</div>';
    } else {
      searchResults.innerHTML = matches.map(page =>
        `<a class="nav-search-result" href="${page.href}">${page.title}</a>`
      ).join('');
    }
    searchResults.hidden = false;
  }

  searchInput.addEventListener('input', function () { renderResults(searchInput.value); });

  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      const first = searchResults.querySelector('.nav-search-result');
      if (first) { event.preventDefault(); window.location.href = first.getAttribute('href'); }
    } else if (event.key === 'Escape') {
      hideResults();
      searchInput.blur();
    }
  });

  document.addEventListener('click', function (event) {
    if (searchWrap && !searchWrap.contains(event.target)) hideResults();
  });
})();


/* ================================================================
   DRILL BIT CHART
   ================================================================ */
window.DrillChart = (function () {

  // Full drill data: [size_label, fraction, decimal_in, metric_mm]
  // Number drills #80–#1, Letter drills A–Z, Fraction drills
  const DATA = [
    // ---- Number drills (smallest to largest) ----
    ['#80', '—',    '0.0135', '0.343'],
    ['#79', '—',    '0.0145', '0.368'],
    ['#78', '—',    '0.0160', '0.406'],
    ['#77', '—',    '0.0180', '0.457'],
    ['#76', '—',    '0.0200', '0.508'],
    ['#75', '—',    '0.0210', '0.533'],
    ['#74', '—',    '0.0225', '0.572'],
    ['#73', '—',    '0.0240', '0.610'],
    ['#72', '—',    '0.0250', '0.635'],
    ['#71', '—',    '0.0260', '0.660'],
    ['#70', '—',    '0.0280', '0.711'],
    ['#69', '—',    '0.0292', '0.742'],
    ['#68', '1/32', '0.0310', '0.787'],
    ['#67', '—',    '0.0320', '0.813'],
    ['#66', '—',    '0.0330', '0.838'],
    ['#65', '—',    '0.0350', '0.889'],
    ['#64', '—',    '0.0360', '0.914'],
    ['#63', '—',    '0.0370', '0.940'],
    ['#62', '—',    '0.0380', '0.965'],
    ['#61', '—',    '0.0390', '0.991'],
    ['#60', '—',    '0.0400', '1.016'],
    ['#59', '—',    '0.0410', '1.041'],
    ['#58', '—',    '0.0420', '1.067'],
    ['#57', '—',    '0.0430', '1.092'],
    ['#56', '3/64', '0.0465', '1.181'],
    ['#55', '—',    '0.0520', '1.321'],
    ['#54', '—',    '0.0550', '1.397'],
    ['#53', '—',    '0.0595', '1.511'],
    ['#52', '1/16', '0.0635', '1.613'],
    ['#51', '—',    '0.0670', '1.702'],
    ['#50', '—',    '0.0700', '1.778'],
    ['#49', '—',    '0.0730', '1.854'],
    ['#48', '5/64', '0.0760', '1.930'],
    ['#47', '—',    '0.0785', '1.994'],
    ['#46', '—',    '0.0810', '2.057'],
    ['#45', '—',    '0.0820', '2.083'],
    ['#44', '—',    '0.0860', '2.184'],
    ['#43', '—',    '0.0890', '2.261'],
    ['#42', '3/32', '0.0935', '2.375'],
    ['#41', '—',    '0.0960', '2.438'],
    ['#40', '—',    '0.0980', '2.489'],
    ['#39', '—',    '0.0995', '2.527'],
    ['#38', '—',    '0.1015', '2.578'],
    ['#37', '—',    '0.1040', '2.642'],
    ['#36', '7/64', '0.1065', '2.705'],
    ['#35', '—',    '0.1100', '2.794'],
    ['#34', '—',    '0.1110', '2.819'],
    ['#33', '—',    '0.1130', '2.870'],
    ['#32', '—',    '0.1160', '2.946'],
    ['#31', '1/8',  '0.1200', '3.048'],
    ['#30', '—',    '0.1285', '3.264'],
    ['#29', '—',    '0.1360', '3.454'],
    ['#28', '9/64', '0.1405', '3.569'],
    ['#27', '—',    '0.1440', '3.658'],
    ['#26', '—',    '0.1470', '3.734'],
    ['#25', '—',    '0.1495', '3.797'],
    ['#24', '—',    '0.1520', '3.861'],
    ['#23', '5/32', '0.1540', '3.912'],
    ['#22', '—',    '0.1570', '3.988'],
    ['#21', '—',    '0.1590', '4.039'],
    ['#20', '—',    '0.1610', '4.089'],
    ['#19', '—',    '0.1660', '4.216'],
    ['#18', '11/64','0.1695', '4.305'],
    ['#17', '—',    '0.1730', '4.394'],
    ['#16', '—',    '0.1770', '4.496'],
    ['#15', '—',    '0.1800', '4.572'],
    ['#14', '—',    '0.1820', '4.623'],
    ['#13', '3/16', '0.1850', '4.699'],
    ['#12', '—',    '0.1890', '4.801'],
    ['#11', '—',    '0.1910', '4.851'],
    ['#10', '—',    '0.1935', '4.915'],
    ['#9',  '—',    '0.1960', '4.978'],
    ['#8',  '13/64','0.1990', '5.055'],
    ['#7',  '—',    '0.2010', '5.105'],
    ['#6',  '—',    '0.2040', '5.182'],
    ['#5',  '—',    '0.2055', '5.220'],
    ['#4',  '—',    '0.2090', '5.309'],
    ['#3',  '7/32', '0.2130', '5.410'],
    ['#2',  '—',    '0.2210', '5.613'],
    ['#1',  '—',    '0.2280', '5.791'],
    // ---- Letter drills A–Z ----
    ['A',  '15/64','0.2340', '5.944'],
    ['B',  '—',    '0.2380', '6.045'],
    ['C',  '—',    '0.2420', '6.147'],
    ['D',  '—',    '0.2460', '6.248'],
    ['E',  '1/4',  '0.2500', '6.350'],
    ['F',  '—',    '0.2570', '6.528'],
    ['G',  '—',    '0.2610', '6.629'],
    ['H',  '17/64','0.2660', '6.756'],
    ['I',  '—',    '0.2720', '6.909'],
    ['J',  '—',    '0.2770', '7.036'],
    ['K',  '9/32', '0.2810', '7.137'],
    ['L',  '—',    '0.2900', '7.366'],
    ['M',  '19/64','0.2950', '7.493'],
    ['N',  '—',    '0.3020', '7.671'],
    ['O',  '5/16', '0.3160', '8.026'],
    ['P',  '—',    '0.3230', '8.204'],
    ['Q',  '21/64','0.3320', '8.433'],
    ['R',  '—',    '0.3390', '8.611'],
    ['S',  '—',    '0.3480', '8.839'],
    ['T',  '23/64','0.3580', '9.093'],
    ['U',  '3/8',  '0.3680', '9.347'],
    ['V',  '—',    '0.3770', '9.576'],
    ['W',  '25/64','0.3860', '9.804'],
    ['X',  '—',    '0.3970', '10.084'],
    ['Y',  '—',    '0.4040', '10.262'],
    ['Z',  '27/64','0.4130', '10.490'],
    // ---- Fraction drills ----
    ['1/64',  '1/64',  '0.0156', '0.397'],
    ['1/32',  '1/32',  '0.0313', '0.794'],
    ['3/64',  '3/64',  '0.0469', '1.191'],
    ['1/16',  '1/16',  '0.0625', '1.588'],
    ['5/64',  '5/64',  '0.0781', '1.984'],
    ['3/32',  '3/32',  '0.0938', '2.381'],
    ['7/64',  '7/64',  '0.1094', '2.778'],
    ['1/8',   '1/8',   '0.1250', '3.175'],
    ['9/64',  '9/64',  '0.1406', '3.572'],
    ['5/32',  '5/32',  '0.1563', '3.969'],
    ['11/64', '11/64', '0.1719', '4.366'],
    ['3/16',  '3/16',  '0.1875', '4.763'],
    ['13/64', '13/64', '0.2031', '5.159'],
    ['7/32',  '7/32',  '0.2188', '5.556'],
    ['15/64', '15/64', '0.2344', '5.953'],
    ['1/4',   '1/4',   '0.2500', '6.350'],
    ['17/64', '17/64', '0.2656', '6.747'],
    ['9/32',  '9/32',  '0.2813', '7.144'],
    ['19/64', '19/64', '0.2969', '7.541'],
    ['5/16',  '5/16',  '0.3125', '7.938'],
    ['21/64', '21/64', '0.3281', '8.334'],
    ['11/32', '11/32', '0.3438', '8.731'],
    ['23/64', '23/64', '0.3594', '9.128'],
    ['3/8',   '3/8',   '0.3750', '9.525'],
    ['25/64', '25/64', '0.3906', '9.922'],
    ['13/32', '13/32', '0.4063', '10.319'],
    ['27/64', '27/64', '0.4219', '10.716'],
    ['7/16',  '7/16',  '0.4375', '11.113'],
    ['29/64', '29/64', '0.4531', '11.509'],
    ['15/32', '15/32', '0.4688', '11.906'],
    ['31/64', '31/64', '0.4844', '12.303'],
    ['1/2',   '1/2',   '0.5000', '12.700'],
    ['33/64', '33/64', '0.5156', '13.097'],
    ['17/32', '17/32', '0.5313', '13.494'],
    ['35/64', '35/64', '0.5469', '13.891'],
    ['9/16',  '9/16',  '0.5625', '14.288'],
    ['37/64', '37/64', '0.5781', '14.684'],
    ['19/32', '19/32', '0.5938', '15.081'],
    ['5/8',   '5/8',   '0.6250', '15.875'],
    ['3/4',   '3/4',   '0.7500', '19.050'],
  ];

  let sortCol = 2; // default sort by decimal
  let sortDir = 1;

  function init() {
    const searchInput = document.getElementById('drillSearch');
    const sortSelect  = document.getElementById('drillSort');
    const tbody       = document.getElementById('drillBody');
    const countEl     = document.getElementById('drillCount');
    if (!tbody) return;

    function render(query, col) {
      const q = (query || '').toLowerCase().trim();
      let rows = DATA.filter(r =>
        r.some(cell => cell.toLowerCase().includes(q))
      );
      rows.sort((a, b) => {
        let av = a[col], bv = b[col];
        // Numeric sort for decimal & metric columns
        if (col === 2 || col === 3) {
          av = parseFloat(av); bv = parseFloat(bv);
          return sortDir * (av - bv);
        }
        return sortDir * av.localeCompare(bv);
      });
      tbody.innerHTML = rows.length
        ? rows.map(r => `<tr>
            <td>${r[0]}</td>
            <td>${r[1]}</td>
            <td>${r[2]}"</td>
            <td>${r[3]} mm</td>
          </tr>`).join('')
        : `<tr><td colspan="4" class="no-results">No results for "${q}"</td></tr>`;
      if (countEl) countEl.textContent = `Showing ${rows.length} of ${DATA.length} sizes`;
    }

    let query = '';
    searchInput && searchInput.addEventListener('input', e => {
      query = e.target.value;
      render(query, sortCol);
    });

    sortSelect && sortSelect.addEventListener('change', e => {
      sortCol = parseInt(e.target.value, 10);
      render(query, sortCol);
    });

    // Column header clicks
    document.querySelectorAll('#drillTable th[data-col]').forEach(th => {
      th.addEventListener('click', () => {
        const col = parseInt(th.dataset.col, 10);
        if (sortCol === col) { sortDir *= -1; } else { sortCol = col; sortDir = 1; }
        document.querySelectorAll('#drillTable th').forEach(h => h.classList.remove('sorted'));
        th.classList.add('sorted');
        th.querySelector('.sort-icon').textContent = sortDir === 1 ? '↑' : '↓';
        if (sortSelect) sortSelect.value = col;
        render(query, sortCol);
      });
    });

    render('', sortCol);
  }

  return { init };
})();


/* ================================================================
   TORQUE CONVERTER
   ================================================================ */
window.TorqueConverter = (function () {
  // Conversion factors to N·m
  const TO_NM = {
    'in-lb': 0.112985,
    'ft-lb': 1.35582,
    'nm':    1,
    'kg-cm': 0.0980665,
    'kg-m':  9.80665,
  };

  function init() {
    const input    = document.getElementById('torqueInput');
    const unitSel  = document.getElementById('torqueUnit');
    const clearBtn = document.getElementById('torqueClear');
    if (!input) return;

    function convert() {
      const val  = parseFloat(input.value);
      const unit = unitSel ? unitSel.value : 'ft-lb';
      if (isNaN(val) || input.value.trim() === '') {
        document.querySelectorAll('.torque-result').forEach(el => el.textContent = '—');
        return;
      }
      const nm = val * TO_NM[unit];
      const results = {
        'in-lb': nm / TO_NM['in-lb'],
        'ft-lb': nm / TO_NM['ft-lb'],
        'nm':    nm,
        'kg-cm': nm / TO_NM['kg-cm'],
        'kg-m':  nm / TO_NM['kg-m'],
      };
      Object.keys(results).forEach(key => {
        const el = document.getElementById('result-' + key);
        if (el) el.textContent = formatNum(results[key]);
      });
    }

    input.addEventListener('input', convert);
    unitSel && unitSel.addEventListener('change', convert);

    clearBtn && clearBtn.addEventListener('click', () => {
      input.value = '';
      document.querySelectorAll('.torque-result').forEach(el => el.textContent = '—');
    });
  }

  return { init };
})();


/* ================================================================
   UNIT CONVERTER
   ================================================================ */
window.UnitConverter = (function () {
  const CONVERSIONS = {
    // [fromFn, toFn]  — always convert through a base unit
    length: {
      label: 'Length',
      units: ['inches', 'feet', 'yards', 'millimeters', 'centimeters', 'meters'],
      // base: meters
      toBase:   { inches: v => v * 0.0254, feet: v => v * 0.3048, yards: v => v * 0.9144, millimeters: v => v * 0.001, centimeters: v => v * 0.01, meters: v => v },
      fromBase: { inches: v => v / 0.0254, feet: v => v / 0.3048, yards: v => v / 0.9144, millimeters: v => v / 0.001, centimeters: v => v / 0.01, meters: v => v },
    },
    weight: {
      label: 'Weight / Mass',
      units: ['pounds', 'ounces', 'kilograms', 'grams'],
      // base: kg
      toBase:   { pounds: v => v * 0.453592, ounces: v => v * 0.0283495, kilograms: v => v, grams: v => v * 0.001 },
      fromBase: { pounds: v => v / 0.453592, ounces: v => v / 0.0283495, kilograms: v => v, grams: v => v / 0.001 },
    },
    pressure: {
      label: 'Pressure',
      units: ['PSI', 'bar', 'kPa', 'MPa', 'atm'],
      // base: kPa
      toBase:   { PSI: v => v * 6.89476, bar: v => v * 100, kPa: v => v, MPa: v => v * 1000, atm: v => v * 101.325 },
      fromBase: { PSI: v => v / 6.89476, bar: v => v / 100, kPa: v => v, MPa: v => v / 1000, atm: v => v / 101.325 },
    },
    temperature: {
      label: 'Temperature',
      units: ['°F', '°C', 'K'],
      // Special handling below
      toBase:   {},
      fromBase: {},
    },
    volume: {
      label: 'Volume',
      units: ['US gallons', 'liters', 'quarts', 'pints', 'fluid oz', 'mL'],
      // base: liters
      toBase:   { 'US gallons': v => v * 3.78541, liters: v => v, quarts: v => v * 0.946353, pints: v => v * 0.473176, 'fluid oz': v => v * 0.0295735, mL: v => v * 0.001 },
      fromBase: { 'US gallons': v => v / 3.78541, liters: v => v, quarts: v => v / 0.946353, pints: v => v / 0.473176, 'fluid oz': v => v / 0.0295735, mL: v => v / 0.001 },
    },
  };

  function convertTemp(val, from) {
    switch (from) {
      case '°F': return { '°F': val, '°C': (val - 32) * 5/9, K: (val - 32) * 5/9 + 273.15 };
      case '°C': return { '°F': val * 9/5 + 32, '°C': val, K: val + 273.15 };
      case 'K':  return { '°F': (val - 273.15) * 9/5 + 32, '°C': val - 273.15, K: val };
      default:   return {};
    }
  }

  function init() {
    const catSel    = document.getElementById('unitCategory');
    const fromSel   = document.getElementById('unitFrom');
    const toSel     = document.getElementById('unitTo');
    const valueIn   = document.getElementById('unitValue');
    const resultOut = document.getElementById('unitResult');
    const resultEl  = document.getElementById('unitResultFull');
    const clearBtn  = document.getElementById('unitClear');
    if (!catSel) return;

    function populateUnits() {
      const cat = CONVERSIONS[catSel.value];
      [fromSel, toSel].forEach((sel, i) => {
        sel.innerHTML = cat.units.map(u => `<option value="${u}">${u}</option>`).join('');
        if (i === 1 && cat.units.length > 1) sel.value = cat.units[1];
      });
    }

    function doConvert() {
      const val = parseFloat(valueIn.value);
      if (isNaN(val) || valueIn.value.trim() === '') {
        resultOut && (resultOut.textContent = '—');
        resultEl  && (resultEl.innerHTML = '');
        return;
      }
      const catKey = catSel.value;
      const cat    = CONVERSIONS[catKey];
      const from   = fromSel.value;
      const to     = toSel.value;

      let result;
      let allResults = {};

      if (catKey === 'temperature') {
        allResults = convertTemp(val, from);
        result = allResults[to];
      } else {
        const base = cat.toBase[from](val);
        result = cat.fromBase[to](base);
        cat.units.forEach(u => { allResults[u] = cat.fromBase[u](base); });
      }

      if (resultOut) resultOut.textContent = formatNum(result) + ' ' + to;

      if (resultEl) {
        resultEl.innerHTML = Object.keys(allResults)
          .filter(u => u !== from)
          .map(u => `<div class="result-card ${u === to ? 'highlight' : ''}">
            <div class="result-card-label">${u}</div>
            <div class="result-card-value">${formatNum(allResults[u])}</div>
          </div>`).join('');
      }
    }

    catSel.addEventListener('change', () => { populateUnits(); doConvert(); });
    fromSel.addEventListener('change', doConvert);
    toSel.addEventListener('change', doConvert);
    valueIn.addEventListener('input', doConvert);

    clearBtn && clearBtn.addEventListener('click', () => {
      valueIn.value = '';
      resultOut && (resultOut.textContent = '—');
      resultEl  && (resultEl.innerHTML = '');
    });

    populateUnits();
  }

  return { init };
})();


/* ================================================================
   ATA LOOKUP
   ================================================================ */
window.ATALookup = (function () {
  const DATA = [
    ['00', 'General',                          'General aircraft information and requirements'],
    ['01', 'Maintenance Policy',               'Maintenance management and control procedures'],
    ['02', 'Weight & Balance',                 'Aircraft weighing, CG calculations, and loading'],
    ['03', 'Minimum Equipment',                'MEL/CDL procedures and minimum equipment lists'],
    ['04', 'Airworthiness Limitations',        'Life limits, inspection thresholds, and intervals'],
    ['05', 'Time Limits / Maintenance Checks', 'Scheduled maintenance intervals, A/B/C/D checks'],
    ['06', 'Dimensions & Areas',               'Aircraft dimensions, zones, and station references'],
    ['07', 'Lifting & Shoring',                'Jack points, shoring requirements, and procedures'],
    ['08', 'Leveling & Weighing',              'Aircraft leveling methods and weighing procedures'],
    ['09', 'Towing & Taxiing',                 'Ground movement procedures and tow bar requirements'],
    ['10', 'Parking / Mooring / Storage',      'Tie-down, mooring, and long-term storage procedures'],
    ['11', 'Placards & Markings',              'Exterior and interior placards, stenciling requirements'],
    ['12', 'Servicing',                        'Routine servicing, fluid replenishment, ground servicing'],
    ['18', 'Vibration & Noise Analysis',       'Vibration monitoring and noise abatement procedures'],
    ['20', 'Standard Practices – Airframe',    'Torque values, standard hardware, and repair practices'],
    ['21', 'Air Conditioning',                 'Pressurization, ventilation, heating, and cooling systems'],
    ['22', 'Auto Flight',                      'Autopilot, autothrottle, and flight management systems'],
    ['23', 'Communications',                   'HF, VHF, UHF radios, interphone, and PA systems'],
    ['24', 'Electrical Power',                 'AC/DC generation, distribution, and bus systems'],
    ['25', 'Equipment / Furnishings',          'Cabin interior, seats, galleys, and cargo systems'],
    ['26', 'Fire Protection',                  'Engine, APU, cargo, and lavatory fire detection/suppression'],
    ['27', 'Flight Controls',                  'Primary and secondary flight control surfaces and actuators'],
    ['28', 'Fuel',                             'Fuel tanks, pumps, valves, quantity, and transfer systems'],
    ['29', 'Hydraulic Power',                  'Hydraulic pumps, reservoirs, actuators, and distribution'],
    ['30', 'Ice & Rain Protection',            'Wing/tail anti-ice, windshield heat, and probes'],
    ['31', 'Indicating / Recording Systems',   'Flight data recorders, cockpit voice recorders, displays'],
    ['32', 'Landing Gear',                     'Main gear, nose gear, brakes, steering, and retraction'],
    ['33', 'Lights',                           'Interior/exterior lighting, emergency lighting'],
    ['34', 'Navigation',                       'IRS, GPS, VOR, ILS, ADF, transponder, weather radar'],
    ['35', 'Oxygen',                           'Crew and passenger oxygen systems and masks'],
    ['36', 'Pneumatic',                        'Bleed air, ducting, valves, and distribution systems'],
    ['37', 'Vacuum',                           'Vacuum systems and associated instruments'],
    ['38', 'Water / Waste',                    'Potable water, lavatory waste, and drain systems'],
    ['45', 'Central Maintenance System',       'Aircraft health monitoring and fault isolation systems'],
    ['46', 'Information Systems',              'Electronic library, EFB, cabin management systems'],
    ['49', 'Airborne Auxiliary Power',         'APU systems, controls, fuel, exhaust, and fire protection'],
    ['51', 'Standard Practices – Structures',  'Structural repairs, composite repair, and damage limits'],
    ['52', 'Doors',                            'Passenger, cargo, emergency exits, and door mechanisms'],
    ['53', 'Fuselage',                         'Fuselage structure, frames, stringers, and skin panels'],
    ['54', 'Nacelles / Pylons',                'Engine nacelle structure and pylon assemblies'],
    ['55', 'Stabilizers',                      'Horizontal and vertical stabilizer structures'],
    ['56', 'Windows',                          'Flight deck and cabin windows, windshield heating'],
    ['57', 'Wings',                            'Wing structure, spars, ribs, skins, and control surfaces'],
    ['61', 'Propellers',                       'Propeller assembly, governors, and pitch change systems'],
    ['62', 'Main Rotor',                       'Helicopter main rotor blades, hub, and controls'],
    ['63', 'Main Rotor Drive',                 'Main gearbox, drive shafts, and transmission systems'],
    ['65', 'Tail Rotor',                       'Helicopter tail rotor blades, hub, and drive systems'],
    ['67', 'Rotors Flight Control',            'Helicopter rotor control systems and actuators'],
    ['71', 'Powerplant',                       'Engine mounts, cowlings, and airframe/engine interface'],
    ['72', 'Engine – Turbine/Turboprop',       'Gas turbine engine: compressor, turbine, combustion section'],
    ['73', 'Engine Fuel & Control',            'Engine fuel system, FADEC, fuel control units'],
    ['74', 'Ignition',                         'Engine ignition exciters, leads, igniters'],
    ['75', 'Air',                              'Engine bleed air, cooling, and anti-surge systems'],
    ['76', 'Engine Controls',                  'Throttle, thrust levers, thrust reversers, and ETOPS'],
    ['77', 'Engine Indicating',                'EGT, N1, N2, EPR, vibration monitoring systems'],
    ['78', 'Exhaust',                          'Engine exhaust nozzle, thrust reverser, and noise suppressors'],
    ['79', 'Oil',                              'Engine oil system, pressure, temperature, and quantity'],
    ['80', 'Starting',                         'Engine starting systems, starters, and start valves'],
    ['82', 'Water Injection',                  'Water/methanol injection for thrust augmentation'],
    ['83', 'Accessory Gearboxes',             'AGB, IGB, TGB, and associated drive pads'],
    ['91', 'Wiring',                           'Aircraft wiring, wire routing, and electrical bonding'],
  ];

  let sortCol = 0;
  let sortDir = 1;

  function init() {
    const searchInput = document.getElementById('ataSearch');
    const tbody       = document.getElementById('ataBody');
    const countEl     = document.getElementById('ataCount');
    if (!tbody) return;

    function render(query) {
      const q = (query || '').toLowerCase().trim();
      let rows = DATA.filter(r => r.some(cell => cell.toLowerCase().includes(q)));
      rows.sort((a, b) => sortDir * a[sortCol].localeCompare(b[sortCol]));
      tbody.innerHTML = rows.length
        ? rows.map(r => `<tr>
            <td><span class="table-badge">${r[0]}</span></td>
            <td class="text">${r[1]}</td>
            <td class="text">${r[2]}</td>
          </tr>`).join('')
        : `<tr><td colspan="3" class="no-results">No ATA chapters match "${q}"</td></tr>`;
      if (countEl) countEl.textContent = `Showing ${rows.length} of ${DATA.length} ATA chapters`;
    }

    let query = '';
    searchInput && searchInput.addEventListener('input', e => {
      query = e.target.value;
      render(query);
    });

    document.querySelectorAll('#ataTable th[data-col]').forEach(th => {
      th.addEventListener('click', () => {
        const col = parseInt(th.dataset.col, 10);
        if (sortCol === col) { sortDir *= -1; } else { sortCol = col; sortDir = 1; }
        document.querySelectorAll('#ataTable th').forEach(h => { h.classList.remove('sorted'); });
        th.classList.add('sorted');
        render(query);
      });
    });

    render('');
  }

  return { init };
})();


/* ================================================================
   HELPER FUNCTIONS
   ================================================================ */
function formatNum(n) {
  if (isNaN(n)) return '—';
  // Show up to 6 significant digits, trim trailing zeros
  const s = parseFloat(n.toPrecision(6));
  return s.toString();
}

/* Auto-init on DOMContentLoaded */
document.addEventListener('DOMContentLoaded', function () {
  DrillChart.init && DrillChart.init();
  TorqueConverter.init && TorqueConverter.init();
  UnitConverter.init && UnitConverter.init();
  ATALookup.init && ATALookup.init();
});
