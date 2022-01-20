import React from 'react';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import styled from 'styled-components';


const SwitchOuter = styled.div`
display: flex;
align-items: center;
margin-right: ${({ theme }) => theme.spacing02};
margin-right: ${({theme}) => theme.spacing02};

.switch-icon-left { 
    margin-right: ${({ theme }) => theme.spacing01};
  }
  .switch-icon-right {
    margin-left: ${({ theme }) => theme.spacing01};
  }

`



const SwitchWrap = styled.div`
  height: 24px;
  width: 40px;
  position: relative;
  border-radius: 50px;
  cursor: pointer;
  background: ${(props) => props.checked ? "white" : props.theme.colorPrimary500};



input {
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

const SwitchIcon = styled.div`
  color: ${(props) => props.checked ? "white" : props.theme.colorUI500};
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 ${({theme}) => theme.spacing01};

`
const SwitchButton = styled.div`
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
`

export default function Switch({ checked, onChange }) {
  return (
    <SwitchOuter checked={checked}>
      <SwitchIcon>
        <MdOutlineDarkMode />
      </SwitchIcon>
      <SwitchWrap checked={checked}>
        <input onChange={onChange} type="checkbox" />
        <SwitchButton checked={checked}
        ></SwitchButton>
      </SwitchWrap>
      <SwitchIcon>
        <MdOutlineLightMode />
      </SwitchIcon>
    </SwitchOuter>
  );
}
