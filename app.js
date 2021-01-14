const BASE_URL = 'https://jsonplace-univclone.herokuapp.com'

function fetchUsers() {
  return fetch(`${BASE_URL}/users`)
    .then((resp) => resp.json())
    .catch(function (error) {
      console.log(error)
    })
}

function renderUser(user) {
  return $(` <div class = "user-card">
    <header>
        <h2>${user.name}</h2>
    </header>
    <section class = "company-info">
        <p>
            <b>Contact:</b> ${user.email}
        </p>
        <p>
            <b>Works for:</b> ${user.company.name}
        </p>
        <p>
            <b>Company creed:</b> "${user.company.catchPhrase}, which
            will ${user.company.bs}!"
        </p>
    </section>
    <footer>
        <button class = "load-posts"> POSTS BY ${user.username}</button>
        <button class = "load-albums"> ALBUMS BY ${user.username}</button>
    </footer
</div`).data("user", user)
}

function renderUserList(userList) {
  $("#user-list").empty()

  userList.forEach(function (user) {
    $("#user-list").append(renderUser(user))
  })
}

function fetchUserAlbumList(userId) {
  return fetchData(`${BASE_URL}/users/${userId}/albums?_expand=user&_embed=photos`)
}


function fetchData(url) {
  return fetch(url)
    .then((resp) => resp.json())
    .catch(function (error) {
      console.log(error)
    })
}

function renderAlbum(album) {
  const returnVal = $(`
      <div class="album-card">
        <header>
          <h3>${album.title}, by ${album.user.name}</h3>
        </header>
        <section class="photo-list">
          ${album.photos.map(renderPhoto).join('')}
        </section>
      </div>
    `);

    //append photos to album ??

    return returnVal
}

function renderPhoto(photo) {
  console.log(photo)
   return `<div class="photo-card">
    <a href= ${photo.url} target="_blank">
      <img src= ${photo.thumbnailUrl}>
      <figure>${photo.title}</figure>
    </a>
  </div>`
}

function renderAlbumList(albumList, user) {
  $('#app section.active').removeClass('active');
  $('#album-list').addClass('active').empty();

  albumList.forEach(album => $('#album-list').append(renderAlbum(album)));

  console.log(albumList)
  // why are we returning this? 
  return $(`<div class="album-card">
  <header>
    <h3>${user.name}, by ${user.username} </h3>
  </header>
  <section class="album-list">
  </section>
</div>
`)
}


function fetchUserPosts(userId) {
  return fetchData(`${BASE_URL}/users/${userId}/posts?_expand=user`);
}
fetchUserPosts(1).then(console.log);

function fetchPostComments(postId) {
  return fetchData(`${BASE_URL}/posts/${postId}/comments`);
}


fetchPostComments(1).then(console.log)

function setCommentsOnPost(post) {
  // if we already have comments, don't fetch them again
  if (post.comments) {
    return Promise.reject(null)
  } else {
    // fetch, upgrade the post object, then return it
    return fetchPostComments(post.id)
    .then(function (comments) {
      post.comments = comments
      return post
    });
  }
}

function renderPost(post) {

  console.log(post)
  return $(`<div class="post-card">
  <header>
    <h3>${post.title}</h3>
    <h3>--- ${post.user.username}</h3>
  </header>
  <p>${post.body}</p>
  <footer>
    <div class="comment-list"></div>
    <a href="#" class="toggle-comments">(<span class="verb">show</span> comments)</a>
  </footer>
</div>`).data("post", post)
}

function renderPostList(postList) {
  $("#app section.active").removeClass("active")
  $("#post-list").empty()
  $("#post-list").addClass("active")

  postList.forEach(postList => {
    $("#post-list").append(renderPost(postList))
  })
}

function toggleComments(postCardElement) {
  const footerElement = postCardElement.find('footer');

  if (footerElement.hasClass('comments-open')) {
    footerElement.removeClass('comments-open');
    footerElement.find('.verb').text('show');
  } else {
    footerElement.addClass('comments-open');
    footerElement.find('.verb').text('hide');
  }
}


$('#user-list').on('click', '.user-card .load-posts', function () {
  let user = $(this).closest('.user-card').data('user')
  fetchUserPosts(user.id).then(renderPostList)
  console.log(user);
});

$("#user-list").on("click", ".user-card .load-albums", function () {
  const user = $(this).closest(".user-card").data("user")
  fetchUserAlbumList(user.id).then((albumList) => renderAlbumList(albumList, user))
  console.log(user)
})

$('#post-list').on('click', '.post-card .toggle-comments', function () {
  const postCardElement = $(this).closest('.post-card');
  const post = postCardElement.data('post');

  setCommentsOnPost(post)
    .then(function (post) {
      console.log('building comments for the first time...', post);
      $(".comment-list").empty()
      post.comments.forEach(function(comment) {
        $(".comment-list").prepend(
          $(`
          <h3>${comment.body} --- ${comment.email}</h3>
          `)
        )
      })
      toggleComments(postCardElement)
    })
    .catch(function () {
      console.log('comments previously existed, only toggling...', post);
      toggleComments(postCardElement)
    });
});


function bootstrap() {
  fetchUsers().then(renderUserList)
}

bootstrap()