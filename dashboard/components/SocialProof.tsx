export default function SocialProof() {
  const testimonials = [
    {
      name: 'John D.',
      quote: 'Best training I\'ve ever had. The personalized approach really made a difference in my confidence and technique.',
      tier: 'VIP'
    },
    {
      name: 'Sarah M.',
      quote: 'Professional, knowledgeable instructor who genuinely cares about student success. Highly recommend.',
      tier: 'Pro'
    },
    {
      name: 'Mike T.',
      quote: 'Finally found an instructor who explains the why behind every technique. Exceptional value.',
      tier: 'Starter'
    }
  ];

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          What Students Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  {testimonial.name}
                </h3>
                <span className="text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded">
                  {testimonial.tier}
                </span>
              </div>
              <p className="text-gray-700 italic">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
