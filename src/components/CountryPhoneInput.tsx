import PhoneInput from "react-country-phone-input";
import "react-country-phone-input/lib/style.css";

import { cn } from "@/lib/utils";

interface CountryPhoneInputProps {
  id: string;
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  invalid?: boolean;
  describedById?: string;
}

export function CountryPhoneInput({
  id,
  value = "",
  onChange,
  onBlur,
  disabled,
  invalid,
  describedById,
}: CountryPhoneInputProps) {
  return (
    <PhoneInput
      country="ae"
      value={value}
      onChange={(digits) => onChange(digits ? `+${digits.replace(/^\+/, "")}` : "")}
      onBlur={onBlur}
      disabled={disabled}
      countryCodeEditable={false}
      enableSearch
      containerClass="country-phone-input"
      inputClass={cn("country-phone-input__field", invalid && "country-phone-input__field--invalid")}
      buttonClass="country-phone-input__button"
      dropdownClass="country-phone-input__dropdown"
      inputProps={{
        id,
        name: id,
        autoComplete: "tel",
        "aria-invalid": invalid || undefined,
        "aria-describedby": describedById,
      }}
    />
  );
}
