
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CPFInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CPFInput({ value, onChange, error }: CPFInputProps) {
  // Format CPF as it's typed
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    
    // Remove all non-digits
    input = input.replace(/\D/g, '');
    
    // Limit to 11 digits
    input = input.slice(0, 11);
    
    // Apply CPF mask: 999.999.999-99
    if (input.length > 0) {
      input = input.replace(/^(\d{3})(\d)/g, '$1.$2');
      input = input.replace(/^(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3');
      input = input.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3-$4');
    }
    
    onChange(input);
  };
  
  // Allow only numbers and control keys
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, navigation keys
    if ([8, 9, 13, 27, 46].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode >= 35 && e.keyCode <= 40) ||
        (e.ctrlKey && [65, 67, 86, 88].indexOf(e.keyCode) !== -1)) {
      return;
    }
    
    // Allow: digits 0-9
    if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="cpf_input">CPF do Responsável</Label>
      <Input
        id="cpf_input"
        type="text"
        placeholder="Digite o CPF no formato 000.000.000-00"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
        maxLength={14}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
