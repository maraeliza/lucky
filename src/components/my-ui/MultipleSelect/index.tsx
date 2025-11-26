import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Checkbox,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

export function MultiSelectFilter<T>({
  options,
  selectedOptions,
  onChange,
  placeholder,
  getLabel,
}: {
  options: T[];
  selectedOptions: T[];
  onChange: (selected: T[]) => void;
  placeholder: string;
  getLabel: (option: T) => string;
}) {
  const toggleOption = (option: T) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter((o) => o !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} maxW="200px">
        {selectedOptions.length > 0
          ? selectedOptions.map(getLabel).join(", ")
          : placeholder}
      </MenuButton>
      <MenuList>
        <VStack align="start" p={2}>
          {options.map((option) => (
            <Checkbox
              key={String(option)}
              isChecked={selectedOptions.includes(option)}
              onChange={() => toggleOption(option)}
            >
              {getLabel(option)}
            </Checkbox>
          ))}
        </VStack>
      </MenuList>
    </Menu>
  );
}
