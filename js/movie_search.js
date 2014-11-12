var rottenTomatoes = {
  apiKey: 'r3mds54zy4fkjfqtkgtqe5c7',
  search: function(searchTerm, cb){
  $.getJSON('http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=' + this.apiKey + '&q=' + searchTerm + '&page_limit=20&callback=?', cb);
  }
};


var Movie = Backbone.Model.extend({
  initialize: function() {
    runtime: "",
    this.setRuntimeHours();
  },
  
  setRuntimeHours: function() {
    var hours = Math.floor((this.toJSON().runtime)/60);
    var minutes = (this.toJSON().runtime)%60;
        
    if (hours == 1)
    {
      hours = hours + " hour";
    }else{
      hours = hours + " hours";
    }
    
    if (minutes == 1)
    {
      minutes = minutes + " minute";
    }else{
      minutes = minutes + " minutes";
    }
        
    var time = hours +" " + minutes;
    
    //If hours and minutes are 0, Rotten Tomatoes doesn't have a runtime
    //Set to empty string to be handled by Handlebars
    if (time == "0 hours 0 minutes")
    {
      time = ""
    }

    this.set('runtime', time);
  }
});

var MovieCollection = Backbone.Collection.extend({
  model: Movie
});

var MovieItemView = Backbone.View.extend({
  template: Handlebars.compile($('#movie-template').html()),
  
  render: function (){
    var html = this.template(this.model.toJSON());
    this.$el.html(html);
  }
});

var MoviesView = Backbone.View.extend({
  render: function () {
    this.collection.each(function(model) {
      var view = new MovieItemView({
        model: model
      });
      
      view.render();
      this.$el.append(view.el);
    }, this);
  }
});

var moviesCollection;
var moviesView;
var movie;

$('.search-form').on('submit', function(e){
  e.preventDefault();
  $('#movie-list').empty();
  var movieSearch = $('#movie').val();
  rottenTomatoes.search(movieSearch, function(response) {
    moviesCollection = new MovieCollection(response.movies);

    moviesView = new MoviesView({
      collection: moviesCollection,
      el: '#movie-list'
    });    
    moviesView.render();
  })
  this.reset();
  
});

