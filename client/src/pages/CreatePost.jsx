
import React,{ useState } from 'react';
import styled from 'styled-components'
import GenForm from '../components/GenForm'
import GenImg from '../components/GenImg'

const Container = styled.div`
  height: 100%;
  overflow-y: scroll;
  background: ${({ theme }) => theme.bg};
  padding: 30px 30px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  @media (max-width: 768px) {
    padding: 6px 10px;
  }
`;

const Wrapper = styled.div`
  width:100%;
  display: flex;
  justify-content: center;
  max-width: 1200px;
  height:fit-content;
  flex:1;
  gap:8%;
  @media (max-width):768px){
    flex-direction:column;
  }
`;
const CreatePost = () => {
  const [generateImageLoading,setGenerateImageLoading]=useState(false);
  const [createPostLoading,setCreatePostLoading]=useState(false);
  const [post,setPost]=useState({
    name: "",
    prompt: "",
    photo: "",
  });


  return (
    <Container>
      <Wrapper>
        <GenForm
          post={post}
          setPost={setPost}
          createPostLoading={createPostLoading}
          setCreatePostLoading={setCreatePostLoading}
          generateImageLoading={generateImageLoading}
          setGenerateImageLoading={setGenerateImageLoading}
        />
        <GenImg src={post?.photo} loading={generateImageLoading} />
      </Wrapper>
    </Container>
  );
}

export default CreatePost;

