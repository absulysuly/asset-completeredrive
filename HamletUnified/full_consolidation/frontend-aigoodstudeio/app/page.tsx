import Link from 'next/link';

const highlights = [
  {
    title: 'Candidate Directory',
    description: 'Search and explore profiles for over 7,700 Iraqi candidates with multilingual support.'
  },
  {
    title: 'Governorate Insights',
    description: 'Filter candidates by governorate, alliances, and parties with performant queries.'
  },
  {
    title: 'AI-Ready Architecture',
    description: 'Service layers, event emitters, and clean API contracts lay the groundwork for future AI agents.'
  }
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-white/90 p-10 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Hamlet Unified Election Intelligence
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          An operational blueprint for unifying distributed election infrastructure into a secure, multilingual MVP
          that empowers Iraqi voters and campaign teams with trusted data.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="#features"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Explore the roadmap
          </Link>
          <Link
            href="mailto:product@hamletunified.io"
            className="inline-flex items-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
          >
            Schedule a demo
          </Link>
        </div>
      </section>

      <section id="features" className="grid gap-6 md:grid-cols-2">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-3 text-base text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
