export default function Home() {
  return (
    <div className="section container">
      <h1 className="section-title">Welcome to Sweet Life</h1>
      <p className="section-subtitle">Testing the layout components</p>

      {/* Enough content to test scroll behavior */}
      <div className="space-y-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="card p-8">
            <h2 className="text-xl font-medium mb-2">Section {i}</h2>
            <p>Lorem ipsum content to test scrolling and header shadow behavior.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
