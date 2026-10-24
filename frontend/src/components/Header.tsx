
type HeaderProps = {
  onBack?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
};

export default function Header({
  onBack,
  onRefresh,
  loading = false,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mini ATS</h1>
          <p className="mt-1 text-sm text-slate-500">
            Applicant Tracking System
          </p>
        </div>

        {onBack ? (
          <button
            onClick={onBack}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            All Jobs
          </button>
        ) : (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        )}
      </div>
    </header>
  );
}
