import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, LayoutDashboard } from 'lucide-react';
import { Head, Link, usePage } from '@inertiajs/react';
const HeroSection = () => {
  const { auth } = usePage().props as any;
  // @ts-ignore
  const route = window.route;
  return (
    <div id="home" className="relative bg-gradient-to-b from-saas-black to-[#1c160c] overflow-hidden min-h-[90vh] flex items-center">
      {/* Orange glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-saas-orange opacity-10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-orange-700 opacity-15 rounded-full blur-[80px]"></div>
      <div className="absolute top-20 right-1/4 w-[250px] h-[250px] bg-orange-400 opacity-10 rounded-full blur-[70px]"></div>

      <div className="section-container relative z-10 text-center">
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <span className="inline-block bg-saas-orange/10 text-saas-orange px-4 py-2 rounded-full text-sm font-medium mb-6 border border-saas-orange/20">
              Introducing Unistore 2.0
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Transform Your Business With Our <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">SaaS Solution</span>
            </h1>

            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Streamline your operations, boost productivity, and enhance customer satisfaction with our cutting-edge SaaS platform. Experience seamless integration and unparalleled support.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {auth.user ? (
                <Link href={route('dashboard.overview')}>
                  <Button className="bg-saas-orange hover:bg-orange-600 text-white font-black uppercase tracking-widest py-6 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-orange-500/20 group">
                    <LayoutDashboard size={20} className="mr-2 group-hover:rotate-12 transition-transform" />
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link href={route('tenancy.stores.create')}>
                  <Button className="bg-saas-orange hover:bg-orange-600 text-white font-black uppercase tracking-widest py-6 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-orange-500/20 group">
                    <Rocket size={20} className="mr-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}

               <Link 
                  href={route('tenancy.stores.create')}

                >
                  <Button className="bg-saas-orange hover:bg-orange-600 text-white font-black uppercase tracking-widest py-6 px-8 rounded-xl transition-all duration-300 shadow-xl shadow-orange-500/20 group">
                    <Rocket size={20} className="mr-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                      New Store 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="flex -space-x-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64"
                  className="w-10 h-10 rounded-full border-2 border-saas-black" alt="User" />
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64"
                  className="w-10 h-10 rounded-full border-2 border-saas-black" alt="User" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64"
                  className="w-10 h-10 rounded-full border-2 border-saas-black" alt="User" />
              </div>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-saas-orange">500+</span> businesses already using our platform
              </p>
            </div>
          </div>

          <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-saas-orange to-orange-700 blur-xl opacity-20 rounded-xl"></div>
              <div className="relative bg-saas-darkGray rounded-xl border border-saas-orange/20 p-2 card-shadow transform transition-all duration-500 hover:scale-[1.01] hover:shadow-orange-500/10 hover:shadow-lg">
                <img src="../images/image.png" alt="Dark Dashboard Preview" className="rounded-lg w-full" />
                <div className="absolute bottom-4 left-4 bg-saas-orange/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm font-medium">
                  Modern Dashboard Interface
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Abstract shapes */}
      <div className="absolute bottom-10 left-10 w-20 h-20 border border-saas-orange/20 rounded-full"></div>
      <div className="absolute top-20 right-10 w-10 h-10 border border-saas-orange/20 rounded-full"></div>
      <div className="absolute top-40 left-20 w-5 h-5 bg-saas-orange/20 rounded-full"></div>
    </div>
  );
};

export default HeroSection;
