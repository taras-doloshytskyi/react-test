import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'

import { useQuery } from '@apollo/client'
import arrayMove from 'array-move'

import postQuery from 'GraphQL/Queries/post.graphql'

import { ROOT } from 'Router/routes'

import {
  Back,
  Column,
  Container,
  PostAuthor,
  PostBody,
  PostComment,
  PostContainer,
  NavButtons,
  NavButton,
} from './styles'

const SortableContainer = sortableContainer(({ children }) => (
  <div>{children}</div>
))

const SortableItem = sortableElement(({ value }) => (
  <PostComment mb={2}>{value}</PostComment>
))

function Post() {
  const [comments, setComments] = useState([])
  const [activePost, setActivePost] = useState(0)
  const history = useHistory()
  const {
    params: { postId },
  } = useRouteMatch()

  const handleClick = () => history.push(ROOT)

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    setComments(arrayMove(comments, newIndex, oldIndex))
  }

  const { data, loading, refetch } = useQuery(postQuery, {
    variables: { id: postId },
  })
  const post = data?.post || {}

  const changePost = newPostid => {
    refetch({
      id: newPostid,
    })
    setActivePost(newPostid)
  }

  useEffect(() => {
    setActivePost(Number(post?.id))
  }, [post?.id])

  useEffect(() => {
    setComments(post.comments?.data || [])
  }, [post])

  return (
    <Container>
      <Column>
        <Back onClick={handleClick}>Back</Back>
      </Column>
      {loading ? (
        'Loading...'
      ) : (
        <>
          <Column>
            <h4>Need to add next/previous links</h4>
            <PostContainer key={post.id}>
              <h3>{post.title}</h3>
              <PostAuthor>by {post.user.name}</PostAuthor>
              <PostBody mt={2}>{post.body}</PostBody>
            </PostContainer>
            <NavButtons>
              <NavButton onClick={() => changePost(activePost - 1)}>
                Prev
              </NavButton>
              <NavButton onClick={() => changePost(activePost + 1)}>
                Next
              </NavButton>
            </NavButtons>
          </Column>

          <Column>
            <h4>Incorrect sorting</h4>
            Comments:
            <SortableContainer onSortEnd={handleSortEnd}>
              {comments.map((comment, index) => (
                <SortableItem
                  index={index}
                  key={comment.id}
                  mb={3}
                  value={comment.body}
                />
              ))}
            </SortableContainer>
          </Column>
        </>
      )}
    </Container>
  )
}

export default Post
