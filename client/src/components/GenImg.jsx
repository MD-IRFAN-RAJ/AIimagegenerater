import React from "react";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";

const Container = styled.div`
    flex:1;
    min-height: 300px;
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 16px;
  flex-direction: column;
  padding: 16px;
  border: 2px dashed ${({ theme }) => theme.yellow};
  color: ${({ theme }) => theme.arrow + "80"};
  border-radius: 20px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
  background: ${({ theme }) => theme.black + "50"};
`;

const GenImg = ({ src, loading }) => {
  
  return (
    <Container>
      {loading ? (
        <>
          <CircularProgress
            style={{ color: "inherit", width: "24px", height: "24px" }}
          />
          Generating...
        </>
      ) : (
        <>
          {src ?
            <Image src={src} alt="Generated" />
           : 
            <>Write a prompt to generate images!</>
          }
        </>
      )}
    </Container>
  );
};

export default GenImg;
