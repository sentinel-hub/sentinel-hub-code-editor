import React from 'react'
import styled from 'styled-components'

const Success = styled.div`


@keyframes stroke {
    100% {
        stroke-dashoffset: 0;
    }
}

@keyframes scale {
    0%, 100% {
        transform: none;
    }

    50% {
        transform: scale3d(1.1, 1.1, 1);
    }
}

@keyframes fill {
    100% {
        box-shadow: inset 0px 0px 0px 30px ${({theme}) => theme.colorPrimary500};;
    }
}
`

const Checkmark = styled.svg`
  margin-left:${({theme}) => theme.spacing02};
  display: block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: block;
    stroke-width: 5;
    stroke: white; 
    stroke-miterlimit: 10;
    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
`

const Circle = styled.circle`
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 5;
    stroke-miterlimit: 10;
    stroke: white;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
`

const Path = styled.path`
   transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
`
export default function SuccessIcon() {
  return (
<Success>
  <Checkmark xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <Circle  cx="26" cy="26" r="25" fill="none" >

    </Circle>
    <Path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8">

    </Path>

  </Checkmark>
</Success>
  )
}
