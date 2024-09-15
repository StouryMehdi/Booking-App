import React from 'react';
import '../styles/Alert.scss';

const Alert = ({ type, message }) => {
  return <div className={`alert alert-${type}`}>{message}</div>;
};

export default Alert;