import React from 'react';
import { Package, Plus, MapPin, Search, Filter } from 'lucide-react';

const Orders: React.FC = () => {
  const orders = [
    { 
      id: 'ORD-7782-XJ',
      name: 'Amoxicillin 500mg', 
      composition: 'Amoxicillin Trihydrate • Capsules', 
      status: 'In Transit', 
      date: 'Oct 24, 2023',
      origin: 'Pfizer Global Supply, NY' 
    },
    { 
      id: 'ORD-9921-MC',
      name: 'Lipitor 20mg', 
      composition: 'Atorvastatin Calcium • Tablets', 
      status: 'Delivered', 
      date: 'Oct 12, 2023',
      origin: 'Viatris Inc, Puerto Rico' 
    },
    { 
      id: 'ORD-3321-KL',
      name: 'Metformin 850mg', 
      composition: 'Metformin Hydrochloride • Extended Release', 
      status: 'Processing', 
      date: 'Oct 26, 2023',
      origin: 'Cipla Ltd, Mumbai' 
    },
    { 
      id: 'ORD-1102-PP',
      name: 'Insulin Glargine', 
      composition: 'Recombinant DNA Origin • Injection', 
      status: 'Verified', 
      date: 'Oct 25, 2023',
      origin: 'Sanofi, Frankfurt' 
    },
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
                <h1 className="text-4xl font-serif text-slate-900 mb-3">My Orders</h1>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-md w-fit shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Connected: 0x71C...9A2
                </div>
            </div>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:shadow-xl active:scale-95 group">
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                <span className="font-medium">Create Order</span>
            </button>
        </div>

        {/* Filters / Search Bar (Visual only for tastefulness) */}
        <div className="flex gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search by medicine name or ID..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-medical-500 transition-colors"
                />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors">
                <Filter size={18} />
            </button>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-none border border-slate-200 shadow-sm overflow-hidden">
            {orders.map((order) => (
                <div key={order.id} className="group p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors duration-300">
                    
                    {/* Item Details */}
                    <div className="flex items-start gap-5">
                        <div className="p-4 bg-medical-50 rounded-xl text-medical-600 group-hover:bg-white group-hover:shadow-md transition-all duration-300 border border-transparent group-hover:border-medical-100">
                            <Package size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-medium text-slate-900">{order.name}</h3>
                                <span className="text-xs font-mono text-slate-400 px-2 py-0.5 bg-slate-100 rounded">{order.id}</span>
                            </div>
                            <p className="text-slate-500 text-sm mb-1">{order.composition}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                <span>Origin: {order.origin}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>{order.date}</span>
                            </p>
                        </div>
                    </div>
                    
                    {/* Status & Action */}
                    <div className="flex flex-row md:flex-col lg:flex-row items-center gap-6 md:gap-4 lg:gap-8 self-start md:self-auto w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
                        <div className="text-left md:text-right">
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</div>
                             <div className={`text-sm font-medium flex items-center gap-1.5 md:justify-end
                                ${order.status === 'Delivered' ? 'text-emerald-600' : 
                                  order.status === 'In Transit' ? 'text-blue-600' : 
                                  'text-amber-600'}`}>
                                {order.status === 'In Transit' && <span className="relative flex h-2 w-2 mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>}
                                {order.status}
                             </div>
                        </div>
                        
                        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-medical-600 border border-slate-200 hover:border-medical-200 pl-4 pr-5 py-2.5 rounded-full transition-all bg-transparent hover:bg-white hover:shadow-sm whitespace-nowrap">
                            <MapPin size={16} />
                            Track Journey
                        </button>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="mt-6 text-center">
            <button className="text-sm text-slate-400 hover:text-slate-600 font-medium transition-colors">
                View Archived Orders
            </button>
        </div>

      </div>
    </div>
  );
};

export default Orders;