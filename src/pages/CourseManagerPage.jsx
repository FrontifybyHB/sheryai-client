import Navbar from '../components/Navbar';
import AppIcon from '../components/AppIcon';

export default function CourseManagerPage() {
  return (
    <div className="min-h-screen bg-surface-base font-sans">
      <Navbar />
      <main className="flex h-screenNav flex-col items-center justify-center gap-3.5 text-center">
        <AppIcon name="building" size={48} strokeWidth={1.8} className="text-accent" />
        <h1 className="text-[22px] font-bold text-white">Course Manager</h1>
        <p className="text-sm text-muted">Coming soon in Phase 4</p>
      </main>
    </div>
  );
}
