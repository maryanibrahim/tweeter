$(document).ready(function() {
    $('.new-tweet textarea').on('input', function() {
      var textarea = $(this);
      var counter = textarea.closest('.new-tweet').find('.counter');
      var maxChars = 140;
      var remainingChars = maxChars - this.value.length;
  
      counter.text(remainingChars);
  
      if (remainingChars < 0) {
        counter.addClass('exceeded');
      } else {
        counter.removeClass('exceeded');
      }
    });
  
    console.log('composer-char-counter.js is loaded correctly.');
  });
  