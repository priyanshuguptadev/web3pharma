import React from "react";
import WalletButton from "./WalletButton";
import { ArrowRight, ShieldCheck, Activity } from "lucide-react";

const Hero: React.FC = ({ currentAddress }: { currentAddress?: string }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden min-h-[90vh] flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Abstract Medical Cross / Decentralized Node */}
        <div className="absolute top-20 right-[-10%] w-96 h-96 bg-medical-50 rounded-full blur-3xl opacity-60 animate-float" />
        <div className="absolute bottom-20 left-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 animate-float-delayed" />

        {/* Floating Icons/Elements - Keeping these minimal */}
        <div className="absolute top-1/4 right-[15%] opacity-10 animate-float hidden lg:block">
          <ShieldCheck size={120} className="text-medical-600" />
        </div>
        <div className="absolute bottom-1/3 left-[10%] opacity-10 animate-float-delayed hidden lg:block">
          <Activity size={100} className="text-blue-600" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(209 213 219) 1px, transparent 0)",
            backgroundSize: "40px 40px",
            opacity: 0.3,
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-6xl lg:text-8xl font-serif font-medium tracking-tight text-slate-900 mb-8 max-w-5xl mx-auto leading-[1.05]">
          Order, track, and partner medicines <br />
          <span className="italic text-slate-400">decentralized.</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          An all-in-one platform for both buyers and partners of medicine.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <WalletButton currentAddress={currentAddress} />
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-slate-600 hover:text-medical-600 transition-colors group">
            Learn more
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
