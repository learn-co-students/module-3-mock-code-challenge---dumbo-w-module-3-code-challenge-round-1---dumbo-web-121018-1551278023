document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 2083

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  function getData() {
    return fetch(imageURL)
    .then(resp => resp.json())
    .then(data => renderData(data))
  }

  function postLike(imgId, likeCount) {
    fetch(likeURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({image_id: imgId, like_count: likeCount})
    })
  }

  function postComment(imgId, inputVal) {
    fetch(commentsURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        content: inputVal,
        image_id: imgId
      })
    })
  }

  getData()

  function renderData(data) {
    console.dir(data);
    const imgUrl = data.url
    const imgTag = document.getElementById('image')
    imgTag.src = imgUrl
    imgTag.dataset.id = data.id

    const imgName = document.getElementById('name')
    imgName.innerText = data.name

    const imgLikes = document.getElementById('likes')
    imgLikes.innerHTML = data.like_count

    const imgComments = document.getElementById('comments')
    data.comments.forEach(com => {
      const comLi = document.createElement('li')
      comLi.innerHTML = com.content
      imgComments.append(comLi)
    })

    const likeButton = document.getElementById('like_button')
    likeButton.dataset.id = data.id
    likeButton.addEventListener('click', function handleAddLike(event) {
      event.preventDefault()
      const imgId = event.target.dataset.id
      const likeCount = data.like_count += 1

      imgLikes.innerHTML = data.like_count

      postLike(imgId, likeCount)
    })

    const commentForm = document.getElementById('comment_form')
    const commentUl = document.getElementById('comments')

    commentForm.addEventListener('submit', function handleAddComment(event) {
      event.preventDefault()
      const commentLi = document.createElement('li')

      const inputVal = commentForm.elements[0].value
      commentLi.innerHTML = inputVal
      commentUl.append(commentLi)

      postComment(imageId, inputVal)
      commentForm.reset()
    })
  }
})
