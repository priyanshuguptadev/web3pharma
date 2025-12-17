import React from "react";
import { Pill, Twitter, Linkedin, Github } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-xl text-slate-900">
                Web3Pharma
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              The standard for decentralized pharmaceutical logistics. Secure,
              transparent, and immutable.
            </p>
          </div>

          {/* Links Container */}
          <div className="flex flex-wrap gap-16">
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li>
                  <a
                    href="/order-medicine"
                    className="hover:text-medical-600 transition-colors"
                  >
                    Order Medicine
                  </a>
                </li>
                <li>
                  <a
                    href="/track-medicine"
                    className="hover:text-medical-600 transition-colors"
                  >
                    Track Shipment
                  </a>
                </li>
                <li>
                  <a
                    href="/control-supply-chain"
                    className="hover:text-medical-600 transition-colors"
                  >
                    Supply Chain
                  </a>
                </li>
                <li>
                  <a
                    href="/register"
                    className="hover:text-medical-600 transition-colors"
                  >
                    Register Partners
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li>
                  <a
                    href="#"
                    className="hover:text-medical-600 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-medical-600 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-medical-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-medical-600 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Social</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <Github size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Web3Pharma Decentralized Ltd. All
            rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Runs on Ethereum</span>
            <span>Secured by Smart Contracts</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
