import { Delete } from "lucide-react";

interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export function NumericKeypad({ value, onChange, maxLength = 10 }: NumericKeypadProps) {
  const handleNumberClick = (num: string) => {
    if (value.length < maxLength) {
      onChange(value + num);
    }
  };

  const handleDelete = () => {
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    onChange("");
  };

  const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

  return (
    <div className="grid grid-cols-3 gap-3">
      {buttons.map((btn, index) => {
        if (btn === "⌫") {
          return (
            <button
              key={index}
              onClick={handleDelete}
              className="h-14 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl flex items-center justify-center transition-colors"
            >
              <Delete className="w-5 h-5 text-gray-700" />
            </button>
          );
        }

        return (
          <button
            key={index}
            onClick={() => handleNumberClick(btn)}
            className="h-14 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 rounded-xl text-xl font-semibold text-gray-800 transition-colors"
          >
            {btn}
          </button>
        );
      })}
    </div>
  );
}
