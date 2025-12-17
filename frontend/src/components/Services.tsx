import React from "react";

const Services: React.FC = () => {
  return (
    <section className="py-32 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-20 max-w-2xl">
          <h2 className="text-4xl font-serif text-slate-900 mb-6">
            Core Infrastructure
          </h2>
          <p className="text-lg text-slate-600 font-light leading-relaxed">
            We replace opaque legacy systems with transparent, verifiable
            protocols. Designed for enterprise reliability and cryptographic
            truth.
          </p>
        </div>

        {/* Sharp Rectangular Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-slate-200">
          {/* Card 1: End-to-End Orchestration (Span 2) */}
          <div className="group md:col-span-2 relative bg-white border-b border-r border-slate-200 p-10 h-[400px] flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-medium text-slate-900 mb-3">
                End-to-End Orchestration
              </h3>
              <p className="text-slate-500 max-w-md text-sm leading-relaxed">
                A unified protocol connecting manufacturers, logistics
                providers, and healthcare facilities. Real-time synchronization
                across the entire supply chain without central intermediaries.
              </p>
            </div>

            {/* Visual: Connection Map Animation */}
            <div className="absolute right-0 bottom-0 w-full h-1/2 md:w-1/2 md:h-full opacity-50 md:opacity-100 p-8 flex items-center justify-center">
              <div className="relative w-full h-32">
                {/* Nodes */}
                <div className="absolute top-1/2 left-0 w-3 h-3 bg-slate-900 -translate-y-1/2 z-10"></div>
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-medical-500 -translate-x-1/2 -translate-y-1/2 z-10"></div>
                <div className="absolute top-1/2 right-0 w-3 h-3 bg-slate-900 -translate-y-1/2 z-10"></div>

                {/* Lines */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 -translate-y-1/2"></div>

                {/* Moving Packet */}
                <div className="absolute top-1/2 left-0 w-2 h-2 bg-medical-600 -translate-y-1/2 shadow-[0_0_10px_rgba(5,150,105,0.5)] animate-[slideRight_3s_ease-in-out_infinite]"></div>

                {/* Labels */}
                <div className="absolute top-[60%] left-0 text-[10px] text-slate-400 font-mono">
                  ORIGIN
                </div>
                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 text-[10px] text-medical-600 font-mono">
                  VERIFY
                </div>
                <div className="absolute top-[60%] right-0 text-[10px] text-slate-400 font-mono">
                  DEST
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Immutable Audit (Vertical) */}
          <div className="group relative bg-white border-b border-r border-slate-200 p-10 h-[400px] flex flex-col justify-between overflow-hidden hover:bg-slate-50 transition-colors duration-500">
            <div className="relative z-10">
              <h3 className="text-xl font-medium text-slate-900 mb-3">
                Immutable Audit
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Cryptographically verified custody logs. Every handover is
                signed and timestamped on-chain.
              </p>
            </div>

            {/* Visual: Scrolling Hash Log */}
            <div className="w-full bg-slate-50 border border-slate-100 p-4 font-mono text-[10px] text-slate-400 leading-loose overflow-hidden h-32 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 z-10"></div>
              <div className="flex flex-col gap-1 animate-[scrollUp_10s_linear_infinite]">
                <div className="flex justify-between">
                  <span className="text-medical-600">0x4a...9f</span>{" "}
                  <span>Verified</span>
                </div>
                <div className="flex justify-between">
                  <span>0x1b...2c</span> <span>Pending</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medical-600">0x9d...ee</span>{" "}
                  <span>Verified</span>
                </div>
                <div className="flex justify-between">
                  <span>0x7a...11</span> <span>Transit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medical-600">0x3f...88</span>{" "}
                  <span>Verified</span>
                </div>
                <div className="flex justify-between">
                  <span>0x2c...44</span> <span>Check</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Sovereign Network */}
          <div className="group relative bg-slate-900 border-b border-r border-slate-800 p-10 h-[400px] flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-medium text-white mb-3">
                Sovereign Architecture
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Zero single points of failure. The network is governed by smart
                contracts, not corporate silos.
              </p>
            </div>

            {/* Visual: Node Mesh */}
            <div className="relative h-32 w-full flex items-center justify-center">
              <div className="grid grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i % 2 === 0 ? "bg-medical-500" : "bg-slate-700"
                    } animate-pulse`}
                  ></div>
                ))}
              </div>
              {/* SVG Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                <line
                  x1="33%"
                  y1="33%"
                  x2="66%"
                  y2="33%"
                  stroke="white"
                  strokeWidth="1"
                />
                <line
                  x1="33%"
                  y1="33%"
                  x2="33%"
                  y2="66%"
                  stroke="white"
                  strokeWidth="1"
                />
                <line
                  x1="66%"
                  y1="33%"
                  x2="66%"
                  y2="66%"
                  stroke="white"
                  strokeWidth="1"
                />
                <line
                  x1="33%"
                  y1="66%"
                  x2="66%"
                  y2="66%"
                  stroke="white"
                  strokeWidth="1"
                />
                <line
                  x1="33%"
                  y1="33%"
                  x2="66%"
                  y2="66%"
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>

          {/* Card 4: Settlement Layer (Span 2) */}
          <div className="group md:col-span-2 relative bg-white border-b border-r border-slate-200 p-10 h-[400px] flex flex-col justify-between overflow-hidden">
            <div className="flex flex-col md:flex-row gap-10 h-full">
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-2xl font-medium text-slate-900 mb-3">
                  Settlement Layer
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                  Secured by Ethereum. Scaled by Optimism. We leverage Layer 2
                  rollups to ensure low gas fees while maintaining mainnet
                  security guarantees.
                </p>
              </div>

              {/* Visual: Terminal Interface */}
              <div className="w-full md:w-1/2 bg-slate-950 p-4 font-mono text-xs text-green-400 shadow-xl self-center h-48 flex flex-col">
                <div className="flex items-center gap-1.5 mb-4 border-b border-slate-800 pb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-2 opacity-80">
                  <p> init_sequence --secure</p>
                  <p className="text-slate-400"> verifying batch proof...</p>
                  <p className="text-slate-400"> gas_est: 0.0001 ETH</p>
                  <p className="flex items-center gap-2">
                    status:
                    <span className="bg-green-500/20 text-green-400 px-1">
                      CONFIRMED
                    </span>
                  </p>
                  <div className="w-2 h-4 bg-green-500 animate-pulse mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Keyframes for this component */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes slideRight {
            0% { left: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { left: 100%; opacity: 0; }
          }
          @keyframes scrollUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
        `,
          }}
        />
      </div>
    </section>
  );
};

export default Services;
