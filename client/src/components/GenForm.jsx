import React,{ useState } from "react";
import styled from "styled-components";
import Button from "./button";
import TextInput from "./TextInput";
import { AutoAwesome, CreateRounded } from "@mui/icons-material";
//import CreatePost from './../pages/CreatePost';
import { GenerateImageFromPrompt ,CreatePost} from "../api";
import { useNavigate } from "react-router-dom";

const Form = styled.div`
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 9%;
  justify-content: center;
`;
const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.div`
  font-size: 17px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;
const Actions = styled.div`
  display: flex;
  flex: 1;
  gap: 8px;
`;
const GenForm = ({
  post,
  setPost,
  createPostLoading,
  generateImageLoading,
  setGenerateImageLoading,
  setCreatePostLoading,
}) => {
  const navigate=useNavigate();
  const [error,setError]=useState("");
  const generateImageFun=async()=>{
    setGenerateImageLoading(true);
    await GenerateImageFromPrompt({prompt:post.prompt}).then((res)=>{
      setPost({...post,photo:`data:image/jpge;base64${res.data?.photo}`});
     setGenerateImageLoading(false);
    }).catch((error)=>{
      setError(error?.response?.data?.message);
      setGenerateImageLoading(false);
    });

  };
  const createPostFun=async()=>{
    setCreatePostLoading(true);
    await CreatePost(post).then((res)=>{
     setCreatePostLoading(false);
     navigate("/");
    }).catch((error)=>{
      setError(error?.response?.data?.message);
      setCreatePostLoading(false);
    });
  };
  return (
    <Form>
      <Top>
        <Title>Generate Image with prompt</Title>
        <Desc>Input text to genearte image</Desc>
      </Top>
      <Body>
        <TextInput
          label="Author"
          placeholder="Enter author name..."
          name="name"
          value={post.name}
          handelChange={(e) => setPost({ ...post, name: e.target.value })}
        />
        <TextInput
          label="Image Prompt"
          placeholder="Enter details for the image..."
          row="8"
          textArea
          name="name"
          value={post.prompt}
          handelChange={(e) => setPost({ ...post, prompt: e.target.value })}
        />
        {error && <div style={{color:"red"}}>{error}</div>}
        ** You can post the AI generated image to the commutinity by clicking
        the post button **
      </Body>
      <Actions>
        <Button
          text="Generate Image"
          flex
          leftIcon={<AutoAwesome />}
          isLoading={generateImageLoading}
          isDisabled={post.prompt === ""}
          onClick={()=>generateImageFun()}
        />
        <Button
          text="Post Image"
          flex
          type="secondary"
          leftIcon={<CreateRounded />}
          isLoading={createPostLoading}
          isDisabled={
            post.name === "" || post.prompt === "" || post.photo === ""
          }
          onClick={()=>createPostFun()}
        />
      </Actions>
    </Form>
  );
};

export default GenForm;
