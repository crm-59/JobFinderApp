import { useState, useCallback } from "react";

const SKILL_CATEGORIES = [
  { group: "Software & Development", items: [
    "Software Engineering", "Data Science & AI / Machine Learning",
    "Product Management", "UX/UI Design", "Cybersecurity", "Cloud & DevOps",
  ]},
  { group: "IT & Infrastructure", items: [
    "IT Systems Engineering & Administration",
    "Virtualization Engineering (VMware, Hyper-V, KVM)",
    "Networking (LAN/WAN, TCP/IP, Routing & Switching)",
    "Firewall & Network Security (Palo Alto, Cisco, Fortinet)",
    "Routers & Switches (Cisco, Juniper, Arista)",
    "IT Help Desk & Technical Support",
    "Database Administration (SQL, Oracle, MySQL)",
    "Storage & Backup Engineering",
  ]},
  { group: "Sciences", items: [
    "Physics (Research, Applied, Computational)",
    "Chemistry (Organic, Analytical, Industrial)",
    "Biology & Life Sciences",
    "Materials Science & Engineering",
  ]},
  { group: "Engineering", items: [
    "Mechanical Engineering", "Electrical Engineering",
    "Civil & Structural Engineering", "Chemical Engineering",
    "Aerospace & Defense Engineering",
  ]},
  { group: "Business & Other", items: [
    "Finance & Accounting", "Marketing & Growth", "Healthcare & Biotech",
    "Legal", "Education & Academia", "Supply Chain & Logistics",
    "Human Resources", "Sales", "Research & Development",
  ]},
];

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
  "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
  "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming","Washington D.C.",
];

const EMPLOYMENT_TYPES = ["Any","Full-Time","Part-Time","Contract","Internship"];
const EXPERIENCE_LEVELS = ["Any","Entry Level","Mid Level","Senior","Executive"];

// ── Job board URL builders ─────────────────────────────────────────────────────
function buildJobLinks(query, location, empType, expLevel, salMin) {
  const q = encodeURIComponent(query);
  const l = encodeURIComponent(location || "");

  // LinkedIn experience level codes
  const liExp = { "Entry Level": "2", "Mid Level": "3", "Senior": "4", "Executive": "5" };
  // LinkedIn job type codes
  const liType = { "Full-Time": "F", "Part-Time": "P", "Contract": "C", "Internship": "I" };
  // Indeed experience
  const indeedExp = { "Entry Level": "entry_level", "Mid Level": "mid_level", "Senior": "senior_level" };

  const liParams = new URLSearchParams({ keywords: query, ...(location && { location }) });
  if (liExp[expLevel]) liParams.set("f_E", liExp[expLevel]);
  if (liType[empType]) liParams.set("f_JT", liType[empType]);

  const indeedParams = new URLSearchParams({ q: query, ...(location && { l: location }) });
  if (indeedExp[expLevel]) indeedParams.set("explvl", indeedExp[expLevel]);
  if (salMin) indeedParams.set("salary", salMin);

  const zipParams = new URLSearchParams({ q: query, ...(location && { l: location }) });
  if (empType !== "Any") zipParams.set("employment_type", empType.toUpperCase().replace("-","_"));

  const glassdoorParams = new URLSearchParams({ sc: "0kf:keyword" + query + ";", ...(location && { locT: "C", locId: location }) });

  return [
    {
      name: "LinkedIn Jobs",
      color: "#0a66c2",
      icon: "in",
      url: `https://www.linkedin.com/jobs/search/?${liParams.toString()}`,
      desc: "Largest professional network, great for networking + applying",
    },
    {
      name: "Indeed",
      color: "#003a9b",
      icon: "In",
      url: `https://www.indeed.com/jobs?${indeedParams.toString()}`,
      desc: "Largest job board — aggregates listings from thousands of sources",
    },
    {
      name: "ZipRecruiter",
      color: "#4a154b",
      icon: "Zr",
      url: `https://www.ziprecruiter.com/jobs-search?${zipParams.toString()}`,
      desc: "AI-matched job recommendations sent directly to your inbox",
    },
    {
      name: "Glassdoor",
      color: "#0caa41",
      icon: "Gd",
      url: `https://www.glassdoor.com/Job/jobs.htm?${glassdoorParams.toString()}`,
      desc: "Jobs + salary data + company reviews in one place",
    },
    {
      name: "USAJobs (Federal)",
      color: "#1a4480",
      icon: "US",
      url: `https://www.usajobs.gov/Search/Results?k=${q}&l=${l}`,
      desc: "Official US federal government job listings",
    },
    {
      name: "Dice (Tech)",
      color: "#e84118",
      icon: "Di",
      url: `https://www.dice.com/jobs?q=${q}&location=${l}`,
      desc: "Specialized in technology and IT roles",
    },
  ];
}

// ── Suggested search tips based on category ───────────────────────────────────
function getTips(category, expLevel) {
  const isIT = category.includes("Network") || category.includes("Firewall") ||
               category.includes("Virtualization") || category.includes("Router") ||
               category.includes("IT Systems") || category.includes("Help Desk") ||
               category.includes("Storage") || category.includes("Database");
  const isSci = category.includes("Physics") || category.includes("Chemistry") ||
                category.includes("Biology") || category.includes("Materials");
  const isSW = category.includes("Software") || category.includes("Data Science") ||
               category.includes("Cloud") || category.includes("Cybersecurity");
  const isEntry = expLevel === "Entry Level";

  const tips = [];

  if (isEntry) {
    tips.push("🎓 Highlight internships, capstone projects, and academic research in your resume");
    tips.push("📌 Apply to roles titled 'Associate', 'Junior', or 'I' — these are true entry-level");
    tips.push("🤝 Use LinkedIn to connect with alumni from your university who work at target companies");
  }
  if (isIT) {
    tips.push("🏅 Certifications matter greatly in IT — CompTIA A+, Network+, CCNA, or VMware VCP will open doors");
    tips.push("🔍 Search for 'NOC', 'L1/L2 Support', or 'Junior Network Admin' for entry points");
    tips.push("💼 Managed Service Providers (MSPs) are excellent first employers — they expose you to many environments");
  }
  if (isSci) {
    tips.push("🔬 National labs (DOE, NIST, NASA), pharma companies, and universities are top employers");
    tips.push("📄 A strong publication or research poster goes further than GPA in science hiring");
    tips.push("🧪 Look for 'Research Associate' or 'Lab Technician' roles as entry points");
  }
  if (isSW) {
    tips.push("💻 A strong GitHub portfolio can outweigh a degree for software roles");
    tips.push("🚀 Startups and mid-size companies hire more entry-level than large enterprises right now");
    tips.push("🤖 Familiarity with AI/LLM tools is a differentiator even for non-AI roles");
  }
  tips.push("📧 Follow up after applying — a brief, professional message on LinkedIn increases response rates significantly");

  return tips.slice(0, 4);
}

// ── Components ─────────────────────────────────────────────────────────────────
function JobBoardCard({ board }) {
  return (
    <a href={board.url} target="_blank" rel="noopener noreferrer"
      className="block bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 hover:border-slate-500 hover:bg-slate-800 transition-all group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0"
          style={{ background: board.color }}>
          {board.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-white font-semibold text-sm group-hover:text-cyan-300 transition-colors">{board.name}</p>
            <span className="text-slate-500 text-xs shrink-0">Open →</span>
          </div>
          <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{board.desc}</p>
        </div>
      </div>
    </a>
  );
}

function LocationPanel({ scope, setScope, city, setCity, region, setRegion, state, setState }) {
  return (
    <div className="col-span-full bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 space-y-3">
      <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Geographic Scope</p>
      <div className="flex flex-wrap gap-2">
        {["City","Region","State","Remote / Nationwide"].map(s => (
          <button key={s} onClick={() => setScope(s)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${scope === s ? "bg-cyan-500 border-cyan-400 text-slate-900" : "bg-slate-800 border-slate-600/50 text-slate-400 hover:border-cyan-700 hover:text-cyan-300"}`}>
            {s}
          </button>
        ))}
      </div>
      {scope === "City" && (
        <div>
          <label className="text-xs text-slate-500 block mb-1">City Name</label>
          <input value={city} onChange={e => setCity(e.target.value)}
            placeholder="e.g. Los Angeles, Austin TX, Chicago..."
            className="w-full md:w-80 bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2.5 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors" />
        </div>
      )}
      {scope === "Region" && (
        <div className="grid md:grid-cols-2 gap-3 max-w-2xl">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Region Description</label>
            <input value={region} onChange={e => setRegion(e.target.value)}
              placeholder="e.g. Southern California, Pacific Northwest..."
              className="w-full bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2.5 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Anchor State (optional)</label>
            <select value={state} onChange={e => setState(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors">
              <option value="">— Any —</option>
              {US_STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      )}
      {scope === "State" && (
        <div className="max-w-xs">
          <label className="text-xs text-slate-500 block mb-1">Select State</label>
          <select value={state} onChange={e => setState(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors">
            <option value="">— Choose State —</option>
            {US_STATES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      )}
      {scope === "Remote / Nationwide" && (
        <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-700/30 rounded-lg px-4 py-2.5 max-w-md">
          <span className="text-cyan-400">🌐</span> Searching all remote &amp; nationwide opportunities.
        </div>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function JobFinder() {
  const [skillCat, setSkillCat] = useState("");
  const [skills, setSkills] = useState("");
  const [scope, setScope] = useState("City");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [state, setState] = useState("");
  const [empType, setEmpType] = useState("Entry Level");
  const [expLevel, setExpLevel] = useState("Entry Level");
  const [salMin, setSalMin] = useState("");
  const [salMax, setSalMax] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const getLocation = useCallback(() => {
    if (scope === "Remote / Nationwide") return "";
    if (scope === "City") return city.trim();
    if (scope === "State") return state;
    if (scope === "Region") return [region.trim(), state].filter(Boolean).join(", ");
    return "";
  }, [scope, city, region, state]);

  const getQuery = useCallback(() => {
    return [skillCat, skills].filter(Boolean).join(" ").trim();
  }, [skillCat, skills]);

  const handleSearch = () => {
    const query = getQuery();
    if (!query) { setError("Please select a category or enter skills."); return; }
    setError("");
    const location = getLocation();
    const boards = buildJobLinks(query, location, empType, expLevel, salMin);
    const tips = getTips(skillCat || skills, expLevel);
    setResults({ query, location, boards, tips });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white" style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/3 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4">
            ◈ Opportunity Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
            Find Your <span className="text-cyan-400">Next Role</span>
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Configure your search and get direct links to live job listings across the top job boards — pre-filtered for your criteria.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-6 mb-6 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Skill Category</label>
              <select value={skillCat} onChange={e => setSkillCat(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors">
                <option value="">— Select Category —</option>
                {SKILL_CATEGORIES.map(g => (
                  <optgroup key={g.group} label={`── ${g.group} ──`}>
                    {g.items.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Keywords */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Keywords / Specific Skills</label>
              <input value={skills} onChange={e => setSkills(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="e.g. Python, VMware, CCNA, React..."
                className="w-full bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2.5 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>

            {/* Salary */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Min Salary (USD/yr)</label>
              <input type="number" value={salMin} onChange={e => setSalMin(e.target.value)} placeholder="e.g. 60000"
                className="w-full bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2.5 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>

            {/* Emp type */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Employment Type</label>
              <div className="flex flex-wrap gap-1.5">
                {EMPLOYMENT_TYPES.map(t => (
                  <button key={t} onClick={() => setEmpType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${empType === t ? "bg-purple-500 border-purple-400 text-white" : "bg-slate-800 border-slate-600/50 text-slate-400 hover:border-purple-600"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Exp level */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Experience Level</label>
              <div className="flex flex-wrap gap-1.5">
                {EXPERIENCE_LEVELS.map(l => (
                  <button key={l} onClick={() => setExpLevel(l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${expLevel === l ? "bg-amber-500 border-amber-400 text-slate-900" : "bg-slate-800 border-slate-600/50 text-slate-400 hover:border-amber-600"}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <LocationPanel scope={scope} setScope={setScope} city={city} setCity={setCity}
              region={region} setRegion={setRegion} state={state} setState={setState} />
          </div>

          {error && <p className="mt-3 text-red-400 text-sm text-center">{error}</p>}

          <div className="mt-6 flex justify-center">
            <button onClick={handleSearch}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black px-12 py-3 rounded-xl text-sm tracking-widest uppercase transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 active:scale-95">
              Generate Job Search Links
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6 animate-pulse-once">
            {/* Summary bar */}
            <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl px-5 py-3 flex flex-wrap items-center gap-3">
              <span className="text-cyan-400 font-bold">🔍</span>
              <span className="text-white font-semibold">"{results.query}"</span>
              {results.location && <><span className="text-slate-500">in</span><span className="text-slate-200">{results.location}</span></>}
              {!results.location && <span className="text-slate-400">· Remote / Nationwide</span>}
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 text-sm">{expLevel} · {empType}</span>
              {salMin && <span className="text-emerald-400 text-sm">· ${Number(salMin).toLocaleString()}+ /yr</span>}
            </div>

            {/* Job board cards */}
            <div>
              <h2 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">
                Open these job boards — pre-filtered to your search
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {results.boards.map(b => <JobBoardCard key={b.name} board={b} />)}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-slate-900/60 border border-amber-700/30 rounded-xl p-5">
              <h2 className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-3">
                💡 Job Search Tips for This Role
              </h2>
              <ul className="space-y-2">
                {results.tips.map((tip, i) => (
                  <li key={i} className="text-slate-300 text-sm leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>

            {/* Table of what to look for */}
            <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl overflow-hidden">
              <div className="bg-slate-800/60 px-5 py-3 border-b border-slate-700/40">
                <h2 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">What to Look For in Each Listing</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/40">
                    {["Field","What Good Looks Like","Red Flags"].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Company", "Named company, real website, LinkedIn page", "No company name, 'confidential', no web presence"],
                    ["Job Title", "Clear, specific title matching your search", "10 roles in one title, vague like 'Ninja' or 'Rockstar'"],
                    ["Salary", "Range disclosed, matches your target", "No salary listed (common but worth noting)"],
                    ["Requirements", "Realistic for the level advertised", "'Entry level' requiring 5+ years experience"],
                    ["Description", "Specific responsibilities, team size, tech stack", "Generic filler text, no real details"],
                    ["Apply Process", "Direct apply or company site", "Asks for personal info before seeing full listing"],
                  ].map(([field, good, bad]) => (
                    <tr key={field} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-slate-200 font-medium whitespace-nowrap">{field}</td>
                      <td className="px-4 py-3 text-emerald-400 text-xs leading-relaxed">{good}</td>
                      <td className="px-4 py-3 text-red-400/80 text-xs leading-relaxed">{bad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!results && (
          <div className="text-center py-20 text-slate-600">
            <div className="text-6xl mb-4">💼</div>
            <p className="text-lg">Configure your search above and click <span className="text-cyan-500 font-semibold">Generate Job Search Links</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
