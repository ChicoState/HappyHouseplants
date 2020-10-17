import React from 'react';
import { Input } from '@ui-kitten/components';

const InputSimpleUsageShowcase = () => {
  const [value, setValue] = React.useState('');
  return (
    <Input
      status="success" // Makes textbox green
      placeholder="Enter An Event For Selected Day"
      value={value}
      onChangeText={(nextValue) => setValue(nextValue)}
    />
  );
};
export default InputSimpleUsageShowcase;
