export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-24 text-center text-white">
      <h1 className="mb-4 text-5xl font-bold text-balance">Welcome to No-Code Editor</h1>
      <p className="mb-8 text-xl text-blue-100 text-balance">
        Click the "Enable Edit Mode" button to inspect elements and explore the component hierarchy
      </p>
      <button className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition-colors shadow-lg">
        Get Started
      </button>
    </section>
  )
}
