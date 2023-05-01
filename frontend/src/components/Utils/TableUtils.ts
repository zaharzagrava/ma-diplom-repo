import styled from "styled-components";

export const Table = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;

  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);

  overflow: scroll;
`;

export const TH = styled.th`
  border: 1px solid #ddd;
  text-align: left;
  border-bottom: 2px solid #FFFFFF;

  padding: 12px;
`;

export const TD = styled.td`
  padding: 12px;

  border-bottom: 2px solid #FFFFFF;
`;

export const TR = styled.tr`
  background-color: #f6f8fc;

  height: 10px;
`;