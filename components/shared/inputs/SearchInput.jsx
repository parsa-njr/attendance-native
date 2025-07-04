import { View, TextInput } from "react-native";

const SearchInput = ({ value, onChangeText, placeholder = "جستجو..." }) => {
  return (
    <View className="px-5 pt-8 pb-4 mb-4 bg-white shadow-sm">
      <TextInput
        className="h-12 bg-gray-100 rounded-full px-5 text-base text-gray-800 shadow-inner text-right font-sans mt-6"
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
    </View>
  );
};

export default SearchInput;
