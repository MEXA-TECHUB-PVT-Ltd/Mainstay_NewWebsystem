import React from 'react';
import { useField } from 'formik';
import Select from 'react-select';

const SelectField = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props.name);

  const handleChange = (selectedOption) => {
    helpers.setValue(selectedOption);
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#EEEEEE', // Set the background color to gray
      borderRadius: '8px',
    }),
    menu: (provided, state) => ({
      ...provided,
      maxHeight: '150px',
      overflow: 'hidden', // Adjust the maxHeight as needed
    }),
  };
  return (
    <div>
      {/* <label htmlFor={props.id || props.name}>{label}</label> */}
      <Select
        styles={customStyles}
        {...field}
        options={props.options} // Pass options directly to react-select
        getOptionLabel={(option) => option.name} // Set the label property for display
        getOptionValue={(option) => option.id}
        {...props}
        isSearchable
        onChange={handleChange}
        onBlur={() => helpers.setTouched(true)}
      />
      {meta.touched && meta.error && (
        <div style={{ color: 'red' }}>{meta.error}</div>
      )}
    </div>
  );
};

export default SelectField;
