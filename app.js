const BASE_URL = 'https://jsonplace-univclone.herokuapp.com'

function fetchUsers(){
    return fetch(`${BASE_URL}/users`)
    .then((resp) => resp.json())
    .catch(function(error) {
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

    userList.forEach(function(user) {
        $("#user-list").append(renderUser(user))
    })
}

function fetchUserAlbumList(userId) {
    return fetch(`${ BASE_URL }/users/${ userId }/albums?_expand=user&_embed=photos`)
        .then(resp => resp.json())
        .catch(console.error)
}

fetchUserAlbumList(1).then(function (albumList) {
    console.log(albumList);
});


function fetchData(url) {
    fetch(url)
    .then((resp) => resp.json())
    .catch(function(error) {
        console.log(error)
})
    }

function renderAlbum(album) {
        album.photos.forEach(album =>
            $('.photo-list').append(
                renderPhoto(album)
            ))
        return $(`
        <div class="album-card">
      <header>
        <h3>${album.title}, by ${album.user.name}</h3>
      </header>
      <section class="photo-list">
      </section>
        </div> `);
    }

function renderPhoto(photo) {
    const photoCard = $(`<div class="photo-card">
    <a href= ${album.photo.id} target="_blank">
      <img src= ${album.photo}>
      <figure>${album.photo.title}</figure>
    </a>
  </div>`)
  return photoCard
}

function renderAlbumList(albumList) {
    $('#app section.active').removeClass('active');
    $('#album-list').addClass('active').empty();
       
    albumList.forEach(album => $('#album-list').append(renderAlbum(album)));
    return $(`<div class="album-card">
  <header>
    <h3>${albumList.name}, by ${albumList.user.username} </h3>
  </header>
  <section class="album-list">
  </section>
</div>
`)
}

function fetchUserPosts(userId) {
    return fetch(`${ BASE_URL }/users/${ userId }/posts?_expand=user`);
  }
  fetchUserPosts(1).then(console.log);
  
  function fetchPostComments(postId) {
    return fetch(`${ BASE_URL }/posts/${ postId }/comments`);
  }


fetchPostComments(1).then(console.log)

  function setCommentsOnPost(post) {
// if we already have comments, don't fetch them again
  if (post.comments) {
    return Promise.reject(null)
  } else {
// fetch, upgrade the post object, then return it
return fetchPostComments(post.id).then(function (comments) {
    return post
  });
}
  }

  function renderPost(post) {
   return  $(`<div class="post-card">
  <header>
    <h3>${post.name}</h3>
    <h3>--- ${post.user}</h3>
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
    console.log(renderPostList());
  });

$("#user-list").on("click", ".user-card .load-albums", function() {
    const user = $(this).closest(".user-card").data("user")
    fetchUserAlbumList(user.id).then(renderAlbumList())
    console.log(user)
})

$('#post-list').on('click', '.post-card .toggle-comments', function () {
    const postCardElement = $(this).closest('.post-card');
    const post = postCardElement.data('post');
  
    setCommentsOnPost(post)
      .then(function (post) {
        console.log('building comments for the first time...', post);
      })
      .catch(function () {
        console.log('comments previously existed, only toggling...', post);
      });
  });


function bootstrap() {
    fetchUsers().then(renderUserList)
}

bootstrap()