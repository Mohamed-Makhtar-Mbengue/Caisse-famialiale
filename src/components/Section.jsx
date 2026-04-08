export default function Section({ id, title, children }) {
  return (
    <section id={id} className="min-h-screen pt-28 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-4xl font-bold">{title}</h2>
        <div className="space-y-4">{children}</div>
      </div>
    </section>
  );
}
