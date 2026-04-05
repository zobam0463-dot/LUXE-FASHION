import React from 'react';
import { motion } from 'motion/react';
import { Users, Award, Heart, Globe } from 'lucide-react';

const Teams = () => {
  const teamMembers = [
    {
      name: 'Alex Rivera',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Lead Designer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    },
    {
      name: 'Marcus Thorne',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80',
    },
    {
      name: 'Sophia Chen',
      role: 'Marketing Manager',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="pt-32 pb-24">
      {/* Hero Section */}
      <section className="px-6 max-w-7xl mx-auto mb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
        >
          Our People
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tight"
        >
          MEET THE <span className="text-orange-500">TEAM</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed"
        >
          The visionaries and creators behind LuxeFashion, dedicated to bringing you the finest in modern style.
        </motion.p>
      </section>

      {/* Featured Team Image */}
      <section className="px-6 max-w-7xl mx-auto mb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[21/9]"
        >
          <img
            src="https://i.ibb.co/qYFpLzCZ/590836a06768ee82edf8779c43ae68cc.jpg"
            alt="LuxeFashion Team"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-12">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-2">Our Global Headquarters</h2>
              <p className="text-white/80 max-w-lg">Where creativity meets craftsmanship. Our team works tirelessly to curate the best collections for you.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Team Grid */}
      <section className="px-6 max-w-7xl mx-auto mb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-6 relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-orange-500 font-medium text-sm uppercase tracking-widest">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-900 py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { icon: Users, title: 'Collaboration', desc: 'Working together to achieve excellence in every stitch.' },
            { icon: Award, title: 'Quality', desc: 'Never compromising on the premium standards we set.' },
            { icon: Heart, title: 'Passion', desc: 'Driven by a love for fashion and customer satisfaction.' },
            { icon: Globe, title: 'Sustainability', desc: 'Committed to ethical sourcing and global responsibility.' },
          ].map((value, i) => (
            <div key={i} className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-orange-500">
                <value.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">{value.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Teams;
