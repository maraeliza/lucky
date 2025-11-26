import React, { useState, useEffect } from "react";
import { Box, Input, List, ListItem, Text } from "@chakra-ui/react";
import { Item } from "@/utils/interfaces";

interface AutocompleteInputProps {
  value: string;
  onChange: (value: number) => void;
  items: Item[];
  placeholder: string;
  errorMessage?: string;
  handleRemove?: () => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  items,
  placeholder,
  handleRemove,
}) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (inputValue === "") {
      setFilteredItems(items.slice(0, 5));
      if (handleRemove) handleRemove();
    } else {
      setFilteredItems(
        items.filter((item) =>
          item?.name?.toLowerCase().includes(inputValue?.toLowerCase()),
        ),
      );
    }
  }, [handleRemove, inputValue, items]);

  const handleItemClick = (item: Item) => {
    onChange(item.id);
    setInputValue(item.name);
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  return (
    <Box width="100%">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
      />

      {isFocused && inputValue && filteredItems.length > 0 && (
        <List
          spacing={2}
          mt={2}
          borderWidth="1px"
          borderRadius="md"
          p={2}
          maxHeight="200px"
          overflowY="auto"
        >
          {filteredItems.map((item) => (
            <ListItem
              key={item.id}
              p={2}
              cursor="pointer"
              _hover={{ backgroundColor: "gray.100" }}
              onClick={() => handleItemClick(item)}
            >
              <Text>{item.name}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AutocompleteInput;
