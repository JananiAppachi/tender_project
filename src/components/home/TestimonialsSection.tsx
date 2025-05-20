import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      position: 'CEO, TechSpace Developers',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      content: 'Dhiya Infrastructure exceeded our expectations with their innovative approach and timely delivery of our office complex project. Their attention to detail and commitment to quality is remarkable.',
      rating: 5
    },
    {
      id: 2,
      name: 'Priya Sharma',
      position: 'Director, Urban Living Developers',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      content: "Working with Dhiya Infrastructure was a great experience. Their team's expertise in residential projects and sustainable building practices helped us create a truly exceptional township.",
      rating: 5
    },
    {
      id: 3,
      name: 'Venkat Rao',
      position: 'Project Head, Chennai Metro',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      content: 'The professionalism and technical expertise of Dhiya Infrastructure made our metro extension project a success. They handled complex challenges effectively and maintained high safety standards.',
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-dark mb-4">Client Testimonials</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear what our clients have to say about their experience working with Dhiya Infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <Star key={index} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-gray-600 text-sm">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;