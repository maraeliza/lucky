"use client";

import { Input } from "@chakra-ui/react";
import { forwardRef } from "react";

interface MaskedInputProps {
  mask: (value: string) => string;
  placeholder: string;
  limit?:number
  onChange?: any;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, onChange, placeholder, limit, ...rest }, ref) => {
    return (
      <Input
        {...rest}
        maxLength={limit || 50}
        placeholder={placeholder}
        ref={ref}
        onChange={(e) => {
          const formatted = mask(e.target.value);
          e.target.value = formatted;
          if (onChange) onChange(e);
        }}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";
