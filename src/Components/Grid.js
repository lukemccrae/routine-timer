import React from 'react';
import styled from 'styled-components';

export const Grid = styled.div`
  margin: 0 5vw 0 5vw;
`;

export const Row = styled.div`
    display: flex;
    height: 100%;
`;

export const Col = styled.div`
    flex: ${(props) => props.size};
    width: 100%;
    // border-left: solid 1px black;
`;

export function Centered({children}) {
    return (
      <Row>
        <Col size={1}></Col>
          <div>{children}</div>
        <Col size={1}></Col>
      </Row>
    )
  }
