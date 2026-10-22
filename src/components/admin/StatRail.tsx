export function StatRail({ stats }: { stats: readonly { label: string; value: number }[] }) {
  return (
    <section aria-label="Totals">
      <div className="rule-masthead" />
      <dl className="grid grid-cols-2 gap-x-[30px] gap-y-[20px] py-[20px] md:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div key={label}>
            <dt className="meta">{label}</dt>
            <dd className="mt-[5px] text-[40px] leading-[48px] font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-ink" />
    </section>
  );
}
