document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 2083

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`
  displayData(imageURL)
  // addLike(likeURL)
})

function getData(imageURL) {
  return fetch(imageURL)
  .then(resp => resp.json())
}

function addLike(imageId, likeCount) {
  fetch("https://randopic.herokuapp.com/likes/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({image_id: imageId, like_count: likeCount})
  })
  .then(resp => resp.json)
  .then(json => renderAddLike(json))
}

function displayData(imageURL) {
  const getPromise = getData(imageURL)
  getPromise.then(data => {
    const imgTag = document.getElementById('image')
    imgTag.src = data.url
    imgTag.dataset.id = data.id

    const imgName = document.getElementById('name')
    imgName.innerText = data.name

    const imgLikes = document.getElementById('likes')
    imgLikes.innerHTML = data.like_count

    const likeButton = document.getElementById('like_button')
    likeButton.addEventListener("click", handleAddLike)

    displayComments(data)
  })
}

function displayComments(data) {
  const imgComments = document.getElementById('comments')
  data.comments.forEach(com => {
    const commentLi = document.createElement('li')
    commentId = com.id
    commentLi.dataset.commentId = commentId
    commentLi.innerText = com.content

    const deleteButton = document.createElement('button')
    deleteButton.innerText = "Delete"
    deleteButton.addEventListener("click", handleDeleteComment)

    commentLi.append(deleteButton)
    imgComments.append(commentLi)
  })
}

function handleAddLike(event) {
  let likeCount = event.target.parentElement.querySelector('#likes').innerText

  const imgId = event.target.parentElement.querySelector('#image').dataset.id

  addLike(imgId, likeCount)
}

function renderAddLike(json) {
  // const imgLikes = document.getElementById('likes')
  // imgLikes.innerText += 1
  console.log(json);
}

function handleDeleteComment(event) {
  console.log(event);
}
