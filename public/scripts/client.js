/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  const escape = function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createTweetElement = function(tweet) {
    const safeContent = escape(tweet.content.text);
    const $tweet = $(`
      <article class="tweet">
        <header>
          <div class="user-info">
            <img class="avatar" src="${escape(tweet.user.avatars)}" alt="User Avatar">
            <span class="name">${escape(tweet.user.name)}</span>
          </div>
          <span class="handle">${escape(tweet.user.handle)}</span>
        </header>
        <div class="content">
          ${safeContent}
        </div>
        <footer>
          <div class="icons">
          <span class="timestamp">${timeago.format(tweet.created_at)}</span>

            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
          </div>
        </footer>
      </article>
    `);

    return $tweet;
  };

  const renderTweets = function(tweets) {
    const $tweetsContainer = $('#tweets-container');
    $tweetsContainer.empty(); 

    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $tweetsContainer.prepend($tweet); // Prepend the tweet element to the #tweets-container section
    }

    $('.timestamp').timeago();
  };

  const handleFetchError = function(error) {
    console.log('Error:', error);
  };

  const loadTweets = function() {
    fetch('/tweets', { method: 'GET' })
      .then(response => response.json())
      .then(data => renderTweets(data))
      .catch(handleFetchError);
  };

  $('.error-message').hide();

  $('#tweet-form').submit(function(event) {
    event.preventDefault();

    const $form = $(this);
    const tweetContent = $form.find('textarea[name="text"]').val().trim();
    const $errorMessage = $('#error-message');

    if (!tweetContent) {
      $errorMessage.html('Error: Tweet content cannot be empty').slideDown().addClass('show');
      return;
    }

    if (tweetContent.length > 140) {
      $errorMessage.html('Error: Tweet content exceeds the maximum character limit').slideDown().addClass('show');
      return;
    }
  //Ajax Get request to pull tweets form the server
    $.ajax({
      url: '/tweets', 
      type: 'POST', 
      data: $form.serialize(), 
      success: function() {
        loadTweets();
        $form[0].reset();
        $errorMessage.slideUp().removeClass('show');
      },
      error: function() {
        $errorMessage.html('Error: Failed to submit tweet').slideDown().addClass('show');
      }
    });
  });

  loadTweets();
});
