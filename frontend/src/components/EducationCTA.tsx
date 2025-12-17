import React from "react";
import WalletButton from "./WalletButton";
import { Youtube, ExternalLink } from "lucide-react";

const EducationCTA: React.FC = ({
  currentAddress,
}: {
  currentAddress?: string;
}) => {
  return (
    <section className="py-24 bg-medical-50 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-40 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-medical-200 opacity-20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl font-serif font-medium text-slate-900 mb-6">
          Ready to modernize your supply chain?
        </h2>
        <p className="text-lg text-slate-600 mb-10 font-light">
          Join the network of trusted pharmaceutical partners today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <WalletButton currentAddress={currentAddress} />
          <button className="px-6 py-2.5 rounded-full font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-400 transition-colors shadow-sm">
            Enquiry
          </button>
        </div>

        {/* New to Web3 Link */}
        <a
          href="https://www.youtube.com/results?search_query=how+to+use+web3+wallet"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm group py-2 px-4 rounded-full hover:bg-white/60 border border-transparent hover:border-slate-100"
        >
          <Youtube className="w-5 h-5" />
          <span className="font-medium">New to Web3? Watch on YouTube</span>
          <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>
    </section>
  );
};

export default EducationCTA;
