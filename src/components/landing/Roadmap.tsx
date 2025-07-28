"use client";

import { useEffect, useRef } from 'react';

const roadmapData = [
  { year: "2024 Q3", title: "Launch Alpha", description: "Initial release with core features for early adopters." },
  { year: "2024 Q4", title: "Beta Release", description: "Public beta with enhanced stability and new integrations." },
  { year: "2025 Q1", title: "Advanced Analytics", description: "Introducing a powerful new analytics dashboard." },
  { year: "2025 Q2", title: "AI-Powered Suggestions", description: "Leveraging AI to provide smart recommendations and automate tasks." },
];

export default function Roadmap() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.5 }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      itemsRef.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  return (
    <section id="roadmap" className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Our Journey Ahead</h2>
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 h-full w-1 bg-gray-700 transform -translate-x-1/2"></div>
          
          <div className="space-y-16">
            {roadmapData.map((item, index) => (
              <div 
                key={index} 
                ref={(el) => { itemsRef.current[index] = el; }}
                className={`roadmap-item flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                
                {/* Content */}
                <div className="w-5/12">
                  <div className={`p-6 rounded-lg shadow-xl bg-gray-800 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    <p className="text-blue-400 font-semibold mb-1">{item.year}</p>
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </div>

                {/* Spacer */}
                <div className="w-2/12 flex justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full z-10"></div>
                </div>

                {/* Empty div for alignment */}
                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
