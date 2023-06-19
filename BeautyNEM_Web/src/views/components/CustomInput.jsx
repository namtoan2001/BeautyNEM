import React from 'react';
import { Input } from 'reactstrap';

const CustomInput = React.forwardRef((props, ref) => (
  <Input innerRef={ref} {...props} />
));

export default CustomInput;