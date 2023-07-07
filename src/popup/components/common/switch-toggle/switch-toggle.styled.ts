import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const ToggleContainer = styled.div<{ theme?: Theme }>`
  display: flex;

  label {
    position: relative;
    display: inline-block;
    width: 42px;
    height: 20px;

    & input {
      opacity: 0;
      width: 0;
      height: 0;

      & + span {
        box-shadow: 0 0 2px ${({ theme }) => theme.palette.common.white};
      }

      &:checked + span:before {
        -webkit-transform: translateX(23px);
        -ms-transform: translateX(23px);
        transform: translateX(23px);
      }
    }
  }
}
`;

export const Slider = styled.span<{ theme?: Theme }>`
  position: absolute;
  cursor: pointer;
  border-radius: 12px;
  border: solid 2px ${({ theme }) => theme.palette.common.white};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-transition: .4s;
  transition: .4s;

  &:before {
    position: absolute;
    content: "";
    top: 1px;
    left: 1px;
    height: 14px;
    width: 14px;
    background-color: ${({ theme }) => theme.palette.common.white};
    border-radius: 50%;
    -webkit-transition: .4s;
    transition: .4s;
`;
export const ToggleLabel = styled.span<{ theme?: Theme }>`
	margin-left: ${({ theme }) => theme.spacing(1)};
	font-size: ${({ theme }) => theme.typography.body1.fontSize};
	color: ${({ theme }) => theme.palette.common.white};
	font-weight: ${({ theme }) => theme.typography.fontWeightBold};
`;
