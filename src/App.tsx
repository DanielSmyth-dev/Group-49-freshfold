import { useEffect, useMemo, useState } from 'react';

type Metric = {
  label: string;
  value: string;
  detail: string;
};

type DocSection = {
  id: string;
  label: string;
  kicker: string;
  title: string;
  summary: string;
  status: string;
  metrics?: Metric[];
  cards?: { title: string; items: string[] }[];
  bullets?: string[];
  insights?: { title: string; text: string }[];
  riskCards?: { title: string; detail: string }[];
  finalNote?: string;
};

type Collaborator = {
  id: string;
  name: string;
  email: string;
  role: string;
  online: boolean;
};

type DocumentStore = {
  sections: Record<string, DocSection>;
  collaborators: Collaborator[];
  updatedAt: string;
};

const initialSections: Record<string, DocSection> = {
  executive: {
    id: 'executive',
    label: 'Executive Summary',
    kicker: 'Executive Summary',
    title: 'FreshFold is a digital-first laundry service designed for the realities of Lagos: traffic, inconsistent power, and the need for dependable everyday trust.',
    summary:
      'The opportunity is to build a service that genuinely simplifies life for busy residents by combining pickup, cleaning, and delivery into a seamless, trackable customer experience. The product should not just sell laundry—it should sell convenience, clarity, and reliability.',
    status: 'Live draft',
    metrics: [
      { label: 'Target market', value: '1.4M+', detail: 'Urban households in Lagos with recurring laundry demand.' },
      { label: 'Market gap', value: 'High', detail: 'Few services are reliable, traceable, and affordable at scale.' },
      { label: 'Retention goal', value: '70%', detail: 'Monthly recurring usage after onboarding and trust-building.' },
      { label: 'Launch window', value: 'Q1', detail: 'Pilot around high-density residential and student clusters.' },
    ],
  },
  problem: {
    id: 'problem',
    label: 'Problem Statement',
    kicker: 'Problem Statement',
    title: 'Urban households need a laundry service they can trust without friction.',
    summary: 'The main pain is not just cleaning; it is reliability, communication, and predictability in a chaotic urban environment.',
    status: 'Needs review',
    cards: [
      {
        title: 'User problem themes',
        items: [
          'Inconsistent service quality and lost items',
          'Poor communication or no pickup confirmation',
          'No transparent pricing or hidden charges',
          'Long waiting windows during power and traffic disruptions',
        ],
      },
      {
        title: 'Market friction',
        items: [
          'Busy professionals lack time for manual laundry tasks',
          'Students and renters need affordable recurring solutions',
          'Families need reliability and pickup timing that fits daily routines',
          'Business owners need dependable, scalable operations rather than ad hoc vendors',
        ],
      },
      {
        title: 'Why now',
        items: [
          'Digital convenience is already normal in food, transport, and home services',
          'Urban middle-class demand is growing across major Nigerian cities',
          'Automation and logistics coordination can reduce operating friction',
          'Trust and quality become differentiators when services are service-led, not just price-led',
        ],
      },
    ],
  },
  market: {
    id: 'market',
    label: 'Market Opportunity',
    kicker: 'Market Opportunity',
    title: 'FreshFold sits in a large, underserved middle-market where customers want convenience and quality, not chaos.',
    summary: 'The opportunity exists where convenience is already expected but trust remains weak.',
    status: 'Researching',
    insights: [
      {
        title: 'Pain point',
        text: 'Residents in Lagos face unreliable pickup timing, poor quality control, weak communication, and inconsistent pricing. Laundry is treated as a chore with low trust, not a service experience.',
      },
      {
        title: 'Opportunity',
        text: 'A digital-first provider can combine fulfilment, digital updates, and transparent pricing to create a premium but still accessible laundry service built for everyday urban life.',
      },
      {
        title: 'Differentiation',
        text: 'FreshFold can win by making the customer experience feel predictable: real-time tracking, clear SLA-based delivery windows, and dependable quality control.',
      },
    ],
  },
  product: {
    id: 'product',
    label: 'Product Strategy',
    kicker: 'Product Strategy',
    title: 'Build a service that feels premium while staying accessible to everyday customers.',
    summary: 'The product should feel trusted, easy-to-understand, and operationally dependable from first order to final delivery.',
    status: 'In planning',
    bullets: [
      'Fast onboarding via WhatsApp, app, or web booking',
      'Clear pricing with add-ons and package options',
      'Live order tracking and rider updates',
      'Quality assurance checkpoints before delivery',
      'Simple subscription for weekly and biweekly laundry plans',
      'Strong customer support with issue resolution within a defined SLA',
    ],
    finalNote:
      'FreshFold should be positioned as a dependable, transparent, and convenient laundry partner for urban households, professionals, and compact families.',
  },
  roadmap: {
    id: 'roadmap',
    label: 'Roadmap',
    kicker: 'Roadmap',
    title: 'A phased launch reduces risk while proving the operating model.',
    summary: 'The roadmap is designed to validate service quality, retention, and economics before broad expansion.',
    status: 'Planned',
    bullets: [
      'Launch in one high-density neighborhood',
      'Offer pickup, wash, dry, fold, and return',
      'Collect customer feedback on price, timing, and quality',
      'Weekly plans for residents and small households',
      'Priority scheduling and loyalty pricing',
      'Repeat-order automation and saved preferences',
      'Expand to multiple zones and hubs',
      'Introduce team-based fulfillment and route optimization',
      'Add analytics dashboards for profit, churn, and rider performance',
    ],
  },
  risk: {
    id: 'risk',
    label: 'Risk & Mitigation',
    kicker: 'Risk & Mitigation',
    title: 'Operational risk is the real challenge; customer experience is the competitive moat.',
    summary: 'Every decision should optimize for reliability and trust, not just speed or discounting.',
    status: 'Mitigation active',
    riskCards: [
      {
        title: 'Service reliability',
        detail: 'Power cuts and traffic unpredictability can delay fulfilment, so routing and contingency planning must be built into operations.',
      },
      {
        title: 'Trust and brand perception',
        detail: 'Customers will only stick with the service if quality is consistent and claims around transparency are proven in practice.',
      },
      {
        title: 'Unit economics',
        detail: 'Pricing must balance affordability with real operational costs, especially for detergent, transport, and labor.',
      },
    ],
  },
};

const defaultCollaborators: Collaborator[] = [
  { id: '1', name: 'Ayo', email: 'ayo@freshfold.co', role: 'Product lead', online: true },
  { id: '2', name: 'Tola', email: 'tola@freshfold.co', role: 'Operations', online: true },
  { id: '3', name: 'Chioma', email: 'chioma@freshfold.co', role: 'Design', online: false },
];

const emptyDocument: DocumentStore = {
  sections: initialSections,
  collaborators: defaultCollaborators,
  updatedAt: new Date().toISOString(),
};

function App() {
  const [documentState, setDocumentState] = useState<DocumentStore>(emptyDocument);
  const [activeSection, setActiveSection] = useState('executive');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showInvitePanel, setShowInvitePanel] = useState(false);
  const [inviteValue, setInviteValue] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const docEntries = useMemo(() => Object.values(documentState.sections), [documentState.sections]);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await fetch('/api/prd');
        const payload = await response.json();
        if (payload?.sections) {
          setDocumentState(payload as DocumentStore);
          return;
        }
      } catch {
        // fallback to local session state if the API is not available yet
      }

      const saved = localStorage.getItem('freshfold-prd-doc');
      if (saved) {
        setDocumentState(JSON.parse(saved) as DocumentStore);
      }
      setIsLoading(false);
    };

    void loadDocument();
  }, []);

  useEffect(() => {
    localStorage.setItem('freshfold-prd-doc', JSON.stringify(documentState));
  }, [documentState]);

  useEffect(() => {
    if (isLoading) return;

    const timer = window.setTimeout(() => {
      const payload = {
        ...documentState,
        updatedAt: new Date().toISOString(),
      };

      fetch('/api/prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {
        setToast('Saved locally for this browser session');
      });
    }, 500);

    return () => window.clearTimeout(timer);
  }, [documentState, isLoading]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guest = params.get('invite');
    if (guest) {
      setShowInvitePanel(true);
      setInviteValue(guest);
      setToast('Guest access link ready to share');
    }
  }, []);

  useEffect(() => {
    if (documentState.sections && !documentState.sections[activeSection]) {
      setActiveSection('executive');
    }
  }, [documentState.sections, activeSection]);

  const updateSection = <K extends keyof DocSection>(sectionId: string, key: K, value: DocSection[K]) => {
    setDocumentState((current) => ({
      ...current,
      updatedAt: new Date().toISOString(),
      sections: {
        ...current.sections,
        [sectionId]: {
          ...current.sections[sectionId],
          [key]: value,
        },
      },
    }));
  };

  const inviteCollaborator = async () => {
    const email = inviteValue.trim();
    if (!email) {
      setToast('Add an email or name to invite someone');
      return;
    }

    const url = `${window.location.origin}${window.location.pathname}?invite=${encodeURIComponent(email)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // no-op for unsupported clipboard access
    }

    const nextPerson: Collaborator = {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email,
      role: 'Editor',
      online: true,
    };

    setDocumentState((current) => ({
      ...current,
      collaborators: current.collaborators.some((person) => person.email.toLowerCase() === email.toLowerCase())
        ? current.collaborators
        : [nextPerson, ...current.collaborators],
      updatedAt: new Date().toISOString(),
    }));

    setInviteValue('');
    setShowInvitePanel(false);
    setToast(`Invite link copied for ${email}`);
  };

  const handleBulletChange = (sectionId: string, bulletIndex: number, value: string) => {
    setDocumentState((current) => {
      const target = current.sections[sectionId];
      const bullets = [...(target.bullets ?? [])];
      bullets[bulletIndex] = value;
      return {
        ...current,
        updatedAt: new Date().toISOString(),
        sections: {
          ...current.sections,
          [sectionId]: {
            ...target,
            bullets,
          },
        },
      };
    });
  };

  const handleMetricChange = (sectionId: string, metricIndex: number, key: 'label' | 'value' | 'detail', value: string) => {
    setDocumentState((current) => {
      const target = current.sections[sectionId];
      const metrics = [...(target.metrics ?? [])];
      metrics[metricIndex] = {
        ...metrics[metricIndex],
        [key]: value,
      };
      return {
        ...current,
        updatedAt: new Date().toISOString(),
        sections: {
          ...current.sections,
          [sectionId]: {
            ...target,
            metrics,
          },
        },
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">Loading PRD…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white shadow-lg shadow-slate-200">
              FF
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold tracking-tight text-slate-900">FreshFold</div>
              <div className="truncate text-[10px] text-slate-500">Product Research Document</div>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live draft
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-medium text-slate-600">
              Sep 2026 • Lagos NG
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditMode((current) => !current)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                isEditMode ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {isEditMode ? 'View mode' : 'Edit mode'}
            </button>
            <button
              type="button"
              onClick={() => setShowInvitePanel((current) => !current)}
              className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              Invite
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Sections</p>
            <nav className="space-y-1.5">
              {docEntries.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm transition ${
                    activeSection === section.id ? 'bg-blue-50 text-slate-900 ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="truncate">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="space-y-5">
          {showInvitePanel && (
            <div className="rounded-[22px] border border-blue-200 bg-blue-50/70 p-4 shadow-[0_12px_30px_rgba(59,130,246,0.08)] ring-1 ring-blue-100">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">Invite collaborator</p>
                  <p className="mt-1 text-sm text-slate-600">Generate a shareable link for a teammate or stakeholder.</p>
                </div>
                <div className="flex w-full max-w-lg items-center gap-2 md:w-auto">
                  <input
                    value={inviteValue}
                    onChange={(event) => setInviteValue(event.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-blue-400"
                  />
                  <button
                    type="button"
                    onClick={inviteCollaborator}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                  >
                    Share link
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {documentState.collaborators.map((person) => (
                  <div
                    key={person.id}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700"
                  >
                    <span className={`h-2 w-2 rounded-full ${person.online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="font-medium">{person.name}</span>
                    <span className="text-slate-400">{person.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {docEntries.map((section) => (
            <section
              id={section.id}
              key={section.id}
              className={`fade-in rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)] transition-all duration-300 sm:p-7 ${
                activeSection === section.id ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">{section.kicker}</div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                  {section.status}
                </span>
              </div>

              {isEditMode ? (
                <input
                  value={section.title}
                  onChange={(event) => updateSection(section.id, 'title', event.target.value)}
                  className="mb-4 w-full border-b border-slate-200 bg-transparent pb-2 text-2xl font-bold tracking-[-0.04em] text-slate-900 outline-none focus:border-blue-300 sm:text-3xl"
                />
              ) : (
                <h2 className="mb-4 max-w-4xl text-2xl font-bold tracking-[-0.04em] text-slate-900 sm:text-3xl">
                  {section.title}
                </h2>
              )}

              {isEditMode ? (
                <textarea
                  value={section.summary}
                  onChange={(event) => updateSection(section.id, 'summary', event.target.value)}
                  className="mb-5 min-h-[96px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm leading-7 text-slate-600 outline-none transition focus:border-blue-300"
                />
              ) : (
                <p className="mb-5 max-w-4xl text-sm leading-7 text-slate-600 sm:text-[1.02rem]">{section.summary}</p>
              )}

              {section.metrics && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {section.metrics.map((metric, index) => (
                    <article key={`${section.id}-${metric.label}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      {isEditMode ? (
                        <>
                          <input
                            value={metric.label}
                            onChange={(event) => handleMetricChange(section.id, index, 'label', event.target.value)}
                            className="block w-full text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 outline-none"
                          />
                          <input
                            value={metric.value}
                            onChange={(event) => handleMetricChange(section.id, index, 'value', event.target.value)}
                            className="mt-3 block w-full text-3xl font-bold tracking-[-0.06em] text-slate-900 outline-none"
                          />
                          <textarea
                            value={metric.detail}
                            onChange={(event) => handleMetricChange(section.id, index, 'detail', event.target.value)}
                            className="mt-2 block min-h-[64px] w-full resize-none text-sm leading-6 text-slate-600 outline-none"
                          />
                        </>
                      ) : (
                        <>
                          <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{metric.label}</span>
                          <strong className="mt-3 block text-3xl font-bold tracking-[-0.06em] text-slate-900">{metric.value}</strong>
                          <small className="mt-2 block text-sm leading-6 text-slate-600">{metric.detail}</small>
                        </>
                      )}
                    </article>
                  ))}
                </div>
              )}

              {section.cards && (
                <div className="mt-5 grid gap-4 xl:grid-cols-3">
                  {section.cards.map((card) => (
                    <article key={card.title} className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5">
                      <h3 className="mb-3 text-lg font-semibold text-slate-900">{card.title}</h3>
                      <ul className="space-y-2 text-sm leading-6 text-slate-600">
                        {card.items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              )}

              {section.insights && (
                <div className="mt-5 grid gap-4 xl:grid-cols-3">
                  {section.insights.map((insight) => (
                    <article key={insight.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <h3 className="mb-3 text-lg font-semibold text-slate-900">{insight.title}</h3>
                      <p className="text-sm leading-7 text-slate-600">{insight.text}</p>
                    </article>
                  ))}
                </div>
              )}

              {section.bullets && (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <ul className="space-y-2 text-sm leading-6 text-slate-600">
                    {section.bullets.map((item, index) => (
                      <li key={`${section.id}-bullet-${index}`} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                        {isEditMode ? (
                          <input
                            value={item}
                            onChange={(event) => handleBulletChange(section.id, index, event.target.value)}
                            className="w-full bg-transparent text-left outline-none"
                          />
                        ) : (
                          <span>{item}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {section.finalNote && (
                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-sm leading-7 text-slate-700">
                  <span className="font-semibold text-slate-900">Positioning:</span> {section.finalNote}
                </div>
              )}

              {section.riskCards && (
                <div className="mt-5 grid gap-4 xl:grid-cols-3">
                  {section.riskCards.map((risk) => (
                    <article key={risk.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <h3 className="mb-3 text-lg font-semibold text-slate-900">{risk.title}</h3>
                      <p className="text-sm leading-7 text-slate-600">{risk.detail}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))}

          <section className="rounded-[28px] bg-slate-900 p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] sm:p-8">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-300">Recommendation</div>
            <h2 className="mb-4 text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
              Launch a pilot in a single Lagos neighborhood with a premium-but-accessible offering and focus on trust signals.
            </h2>
            <p className="max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">
              The document suggests that FreshFold should not try to win solely on lowest price. It should win by delivering a service that feels predictable, easy to understand, and dependable when life is busy and inconsistent.
            </p>
          </section>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-4 right-4 rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-lg shadow-slate-300">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
