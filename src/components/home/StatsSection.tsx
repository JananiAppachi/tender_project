import { Building2, Users, Award, ThumbsUp } from 'lucide-react';

const StatsSection = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="text-4xl font-bold mb-2">100+</div>
            <div className="text-lg">Projects Completed</div>
          </div>

          <div className="text-center">
            <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-lg">Team Members</div>
          </div>

          <div className="text-center">
            <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>
            <div className="text-4xl font-bold mb-2">15+</div>
            <div className="text-lg">Years Experience</div>
          </div>

          <div className="text-center">
            <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-8 h-8" />
            </div>
            <div className="text-4xl font-bold mb-2">95%</div>
            <div className="text-lg">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;