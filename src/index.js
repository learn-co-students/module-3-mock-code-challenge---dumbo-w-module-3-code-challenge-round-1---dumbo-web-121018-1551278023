let imageId = 2083 //Enter the id from the fetched image here
const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
const likeURL = `https://randopic.herokuapp.com/likes/`
const commentsURL = `https://randopic.herokuapp.com/comments/`

const commentsUl = document.querySelector('#comments')
commentsUl.addEventListener("click", handleDeleteComment)

const likeButton = document.querySelector('#like_button')
likeButton.addEventListener("click", handleAddLike)

const commentForm = document.querySelector('#comment_form')
commentForm.addEventListener("submit", handleAddComment)

document.addEventListener('DOMContentLoaded', () => {
  getAllData()
})

function getAllData() {
  return fetch(imageURL)
    .then(resp => resp.json())
    .then(json => displayData(json))
}

function postNewLike(imgId) {
  fetch(likeURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({image_id: imgId})
  })
}

function postNewComment(imgId, commContent) {
  fetch(commentsURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({image_id: imgId, content: commContent})
  })
  .then(resp => resp.json())
  .then(json => commentsUl.innerHTML += createCommentLi(json))
}

function deleteComment(commentId) {
  fetch(`${commentsURL}/${commentId}`, {
    method: 'DELETE'
  })
  .then(resp => resp.json())
  .then(json => console.log(json))
}

function displayData(json) {
  console.dir(json);
  const img = document.querySelector('#image')
  img.src = json.url
  img.dataset.id = json.id

  const title = document.querySelector('#name')
  title.innerText = json.name

  const likes = document.querySelector('#likes')
  likes.innerText = json.like_count + " likes"

  likeButton.dataset.id = json.id

  json.comments.forEach(comment => commentsUl.innerHTML += createCommentLi(comment))
}

function createCommentLi(comment) {
  return `
    <li>${comment.content}
    <button id="delete" data-comment-id=${comment.id}>Delete</button>
    </li>
  `
}

function handleAddLike(event) {
  const likes = document.querySelector('#likes')
  const currentLikes = likes.innerHTML.split(' likes')[0]
  const newLikes = parseInt(currentLikes) + 1

  likes.innerText = newLikes + " likes"

  const imgId = event.target.parentElement.children[0].dataset.id
  postNewLike(imgId)
}

function handleAddComment(event) {
  event.preventDefault()
  const commContent = event.target.querySelector('input[name="comment"]').value

  postNewComment(imageId, commContent)

  commentForm.reset()
}

function handleDeleteComment(event) {
  const targeted = event.target
  if(targeted.id === "delete"){
    const commId = event.target.dataset.commentId
    deleteComment(commId)
    targeted.parentElement.remove()
  }
}
