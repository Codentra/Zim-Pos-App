import { useNavigate } from "react-router";
import {
  Store,
  Package,
  CreditCard,
  DollarSign,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessPhone: "",
    businessAddress: "",
    firstProductName: "",
    firstProductPrice: "",
    firstProductStock: "",
    openingCash: "100.00",
    paymentMethods: {
      cash: true,
      ecocash: false,
      onemoney: false,
      zipit: false,
    },
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 flex flex-col">
      {/* Progress Bar */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80 text-sm font-medium">
            Step {step} of {totalSteps}
          </span>
          <button
            onClick={handleSkip}
            className="text-white/80 text-sm font-medium hover:text-white"
          >
            Skip Setup
          </button>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 flex flex-col">
        {/* Step 1: Business Info */}
        {step === 1 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome to ZimPOS!
              </h1>
              <p className="text-white/80">
                Let's set up your business. This will only take a minute.
              </p>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  placeholder="e.g. Mbare General Store"
                  className="w-full px-4 py-3 bg-white/95 backdrop-blur rounded-xl focus:ring-2 focus:ring-white focus:outline-none text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.businessPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, businessPhone: e.target.value })
                  }
                  placeholder="+263 77 123 4567"
                  className="w-full px-4 py-3 bg-white/95 backdrop-blur rounded-xl focus:ring-2 focus:ring-white focus:outline-none text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.businessAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, businessAddress: e.target.value })
                  }
                  placeholder="e.g. Mbare, Harare"
                  className="w-full px-4 py-3 bg-white/95 backdrop-blur rounded-xl focus:ring-2 focus:ring-white focus:outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: First Product */}
        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Add Your First Product</h1>
              <p className="text-white/80">
                Start with one popular item. You can add more later.
              </p>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstProductName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstProductName: e.target.value })
                  }
                  placeholder="e.g. Coca Cola 500ml"
                  className="w-full px-4 py-3 bg-white/95 backdrop-blur rounded-xl focus:ring-2 focus:ring-white focus:outline-none text-gray-900 placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white font-semibold mb-2">Price *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.firstProductPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, firstProductPrice: e.target.value })
                      }
                      placeholder="1.50"
                      className="w-full pl-8 pr-4 py-3 bg-white/95 backdrop-blur rounded-xl focus:ring-2 focus:ring-white focus:outline-none text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.firstProductStock}
                    onChange={(e) =>
                      setFormData({ ...formData, firstProductStock: e.target.value })
                    }
                    placeholder="50"
                    className="w-full px-4 py-3 bg-white/95 backdrop-blur rounded-xl focus:ring-2 focus:ring-white focus:outline-none text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment Methods */}
        {step === 3 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Payment Methods
              </h1>
              <p className="text-white/80">
                Select which payment methods you accept
              </p>
            </div>

            <div className="flex-1 space-y-3">
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    paymentMethods: {
                      ...formData.paymentMethods,
                      cash: !formData.paymentMethods.cash,
                    },
                  })
                }
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  formData.paymentMethods.cash
                    ? "bg-white border-white"
                    : "bg-white/10 border-white/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        formData.paymentMethods.cash
                          ? "bg-emerald-100"
                          : "bg-white/20"
                      }`}
                    >
                      <DollarSign
                        className={`w-6 h-6 ${
                          formData.paymentMethods.cash
                            ? "text-emerald-600"
                            : "text-white"
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <p
                        className={`font-semibold ${
                          formData.paymentMethods.cash
                            ? "text-gray-900"
                            : "text-white"
                        }`}
                      >
                        Cash
                      </p>
                      <p
                        className={`text-sm ${
                          formData.paymentMethods.cash
                            ? "text-gray-600"
                            : "text-white/70"
                        }`}
                      >
                        Physical currency
                      </p>
                    </div>
                  </div>
                  {formData.paymentMethods.cash && (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  )}
                </div>
              </button>

              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    paymentMethods: {
                      ...formData.paymentMethods,
                      ecocash: !formData.paymentMethods.ecocash,
                    },
                  })
                }
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  formData.paymentMethods.ecocash
                    ? "bg-white border-white"
                    : "bg-white/10 border-white/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        formData.paymentMethods.ecocash
                          ? "bg-emerald-100"
                          : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`text-xl font-bold ${
                          formData.paymentMethods.ecocash
                            ? "text-emerald-600"
                            : "text-white"
                        }`}
                      >
                        E
                      </span>
                    </div>
                    <div className="text-left">
                      <p
                        className={`font-semibold ${
                          formData.paymentMethods.ecocash
                            ? "text-gray-900"
                            : "text-white"
                        }`}
                      >
                        EcoCash
                      </p>
                      <p
                        className={`text-sm ${
                          formData.paymentMethods.ecocash
                            ? "text-gray-600"
                            : "text-white/70"
                        }`}
                      >
                        Mobile money
                      </p>
                    </div>
                  </div>
                  {formData.paymentMethods.ecocash && (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  )}
                </div>
              </button>

              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    paymentMethods: {
                      ...formData.paymentMethods,
                      onemoney: !formData.paymentMethods.onemoney,
                    },
                  })
                }
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  formData.paymentMethods.onemoney
                    ? "bg-white border-white"
                    : "bg-white/10 border-white/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        formData.paymentMethods.onemoney
                          ? "bg-emerald-100"
                          : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`text-xl font-bold ${
                          formData.paymentMethods.onemoney
                            ? "text-emerald-600"
                            : "text-white"
                        }`}
                      >
                        1
                      </span>
                    </div>
                    <div className="text-left">
                      <p
                        className={`font-semibold ${
                          formData.paymentMethods.onemoney
                            ? "text-gray-900"
                            : "text-white"
                        }`}
                      >
                        OneMoney
                      </p>
                      <p
                        className={`text-sm ${
                          formData.paymentMethods.onemoney
                            ? "text-gray-600"
                            : "text-white/70"
                        }`}
                      >
                        Mobile money
                      </p>
                    </div>
                  </div>
                  {formData.paymentMethods.onemoney && (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  )}
                </div>
              </button>

              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    paymentMethods: {
                      ...formData.paymentMethods,
                      zipit: !formData.paymentMethods.zipit,
                    },
                  })
                }
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  formData.paymentMethods.zipit
                    ? "bg-white border-white"
                    : "bg-white/10 border-white/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        formData.paymentMethods.zipit
                          ? "bg-emerald-100"
                          : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`text-xl font-bold ${
                          formData.paymentMethods.zipit
                            ? "text-emerald-600"
                            : "text-white"
                        }`}
                      >
                        Z
                      </span>
                    </div>
                    <div className="text-left">
                      <p
                        className={`font-semibold ${
                          formData.paymentMethods.zipit
                            ? "text-gray-900"
                            : "text-white"
                        }`}
                      >
                        ZIPIT
                      </p>
                      <p
                        className={`text-sm ${
                          formData.paymentMethods.zipit
                            ? "text-gray-600"
                            : "text-white/70"
                        }`}
                      >
                        Bank transfer
                      </p>
                    </div>
                  </div>
                  {formData.paymentMethods.zipit && (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  )}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Cash Drawer */}
        {step === 4 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Opening Cash Balance
              </h1>
              <p className="text-white/80">
                How much cash are you starting with in your drawer?
              </p>
            </div>

            <div className="flex-1">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Opening Cash Amount
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 text-2xl font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.openingCash}
                    onChange={(e) =>
                      setFormData({ ...formData, openingCash: e.target.value })
                    }
                    className="w-full pl-12 pr-6 py-5 bg-white/95 backdrop-blur rounded-xl focus:ring-2 focus:ring-white focus:outline-none text-gray-900 text-3xl font-bold text-center"
                  />
                </div>
                <p className="text-white/70 text-sm mt-2 text-center">
                  This helps track cash accurately throughout the day
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {["50.00", "100.00", "200.00"].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setFormData({ ...formData, openingCash: amount })}
                    className="py-3 px-4 bg-white/20 hover:bg-white/30 rounded-xl text-white font-semibold transition-colors"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-xl p-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <p className="text-white text-sm">
                  You're all set! Click "Start Selling" to complete setup and open your
                  dashboard.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-4 bg-white/20 backdrop-blur hover:bg-white/30 rounded-xl font-semibold text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-4 bg-white hover:bg-white/95 rounded-xl font-semibold text-emerald-600 transition-colors flex items-center justify-center gap-2"
          >
            {step === totalSteps ? "Start Selling" : "Continue"}
            {step < totalSteps && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
