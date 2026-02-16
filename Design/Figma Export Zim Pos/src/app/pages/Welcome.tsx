import { useNavigate } from "react-router";
import { Store, LogIn, UserPlus, Shield, Zap, TrendingUp } from "lucide-react";

export function Welcome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Offline-First",
      description: "Works without internet",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-grade encryption",
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Track sales & inventory",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8">
        {/* Logo */}
        <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
          <Store className="w-14 h-14 text-white" />
        </div>

        {/* Branding */}
        <h1 className="text-5xl font-bold text-white mb-3">ZimPOS</h1>
        <p className="text-xl text-white/90 text-center mb-2">
          Offline-first POS for
        </p>
        <p className="text-xl text-white/90 text-center mb-8">
          growing businesses
        </p>

        {/* Features */}
        <div className="w-full max-w-md space-y-4 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-sm">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-8 space-y-4">
        {/* Register Button */}
        <button
          onClick={() => navigate("/subscription/register")}
          className="w-full bg-white hover:bg-gray-50 text-emerald-600 py-5 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3"
        >
          <UserPlus className="w-6 h-6" />
          Register Your Business
        </button>

        {/* Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-white/20 backdrop-blur border-2 border-white/30 hover:bg-white/30 text-white py-5 rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <LogIn className="w-6 h-6" />
          Login to Existing Account
        </button>

        {/* Footer Text */}
        <p className="text-center text-white/70 text-sm pt-4">
          Trusted by 10,000+ businesses across Africa
        </p>
      </div>
    </div>
  );
}
