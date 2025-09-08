export default function About() {
  return (
    <section
      id="about"
      className="relative py-20 scroll-mt-24 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/AdVestors.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Optional glassmorphic overlay for readability */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* Content stays on top */}
      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <h3 className="mb-6 text-3xl font-bold">Why Advestore?</h3>
        <p className="mx-auto max-w-3xl text-gray-700 font-medium">
          We bridge the gap between businesses that need growth and audiences
          that crave relevance. Our lightweight delivery stack (Fastify back end
          + edge caching) ensures ads load instantly, giving advertisers better
          ROI and keeping the user experience smooth.
        </p>
      </div>
    </section>
  );
}
