import React from 'react';
import { BsLightningCharge } from 'react-icons/bs';
import { MdOutlineDarkMode } from 'react-icons/md';
import styled from 'styled-components';


const SwitchOuter = styled.div`
display: flex;
align-items: center;
margin-right: ${({ theme }) => theme.spacing02};
.switch-icon-left { 
    margin-right: ${({ theme }) => theme.spacing01};
  }
  .switch-icon-right {
    margin-left: ${({ theme }) => theme.spacing01};
  }
.switch-icon { 
  color: ${(props) => props.checked ? "white" : props.theme.colorUI500};
  font-size: 16px;
}
`



const SwitchWrap = styled.div`
  height: 24px;
  width: 40px;
  position: relative;
  border-radius: 50px;
  cursor: pointer;
  background: ${(props) => props.checked ? "white" : props.theme.colorPrimary500};

  .switch-button {
    position: absolute;
    top: 50%;
    height: 18px;
    width: 18px;
    background: ${(props) => props.checked ? props.theme.colorBg500 : "white"};
    pointer-events: none;
    border-radius: 50%;
    cursor: pointer;
    transform: ${(props) => props.checked ? "translate(calc(0% + 2px), -50%)" : "translate(calc(38px - 18px), -50%);"};
    transition: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) transform;;
  }

  .switch-input {
    cursor: pointer;
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    padding: 0;
    margin: 0;
  }


.switch {
  display: flex;
  align-items: center;

  .switch-label {
    margin-left: ${({ theme }) => theme.spacing02};
}
}
`


export default function Switch({ checked, onChange }) {
  return (
    <SwitchOuter checked={checked}>
      <MdOutlineDarkMode className="switch-icon switch-icon-left" />
      <SwitchWrap checked={checked} className="switch-wrap">
        <input onChange={onChange} type="checkbox" className="switch-input" />
        <div
          className={`switch-button`}
        ></div>
      </SwitchWrap>
      <BsLightningCharge className="switch-icon switch-icon-right" />
    </SwitchOuter>
  );
}
