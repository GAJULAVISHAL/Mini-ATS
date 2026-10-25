
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
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand-lockup">
          <div className="brand-mark">M</div>
          <div>
            <h1 className="brand-name">Mini ATS</h1>
            <p className="brand-caption">Hiring, made legible</p>
          </div>
        </div>

        <div className="header-actions">
          {onBack && <button onClick={onBack} className="secondary-button">All roles</button>}
          {!onBack && <button onClick={onRefresh} disabled={loading} className="secondary-button">{loading ? "Syncing..." : "Refresh roles"}</button>}
        </div>
      </div>
    </header>
  );
}
