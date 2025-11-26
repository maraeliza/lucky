import { useState, useEffect } from "react";
import { HStack, Input, Box } from "@chakra-ui/react";

const standardColors: Record<string, string> = {
  red: "#ff0000",
  green: "#008000",
  blue: "#0000ff",
  yellow: "#ffff00",
  orange: "#ffa500",
  purple: "#800080",
  pink: "#ffc0cb",
  black: "#000000",
  white: "#ffffff",
  gray: "#808080",
  brown: "#a52a2a",
  cyan: "#00ffff",
  magenta: "#ff00ff",
};

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ColorInput({ value, onChange, placeholder }: ColorInputProps) {
  const [text, setText] = useState(value);
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    setText(value);
    const hex = parseColor(value);
    if (hex) setColor(hex);
  }, [value]);

  function parseColor(input: string) {
    if (!input) return null;
    input = input.trim().toLowerCase();

    // Se for nome padrão
    if (standardColors[input]) return standardColors[input];

    // Se for hexadecimal válido
    if (/^#([0-9a-f]{6})$/i.test(input)) return input;

    return null;
  }

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setText(val);

    const hex = parseColor(val);
    if (hex) {
      setColor(hex);
      onChange(hex);
    } else {
      // ainda digitando, não altera o valor final
      onChange(val);
    }
  }

  function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setColor(val);
    setText(val);
    onChange(val);
  }

  return (
    <HStack spacing={2}>
      <Input
        value={text}
        onChange={handleTextChange}
        placeholder={placeholder}
      />
      <Box>
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          style={{ width: "40px", height: "40px", border: "none", padding: 0 }}
        />
      </Box>
    </HStack>
  );
}
